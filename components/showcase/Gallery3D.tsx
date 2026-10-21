'use client';

import { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { ShowcaseItem } from '@/data/showcase';
import { useWebGL } from '@/components/showcase/WebGLFallback';
import WebGLFallback from '@/components/showcase/WebGLFallback';

// ─── Path encoding (same rule as Hero.tsx) ────────────────────────────────────
function encodePath(path: string): string {
  return (
    '/' +
    path
      .replace(/^\//, '')
      .split('/')
      .map(encodeURIComponent)
      .join('/')
  );
}

// ─── Single image plane ───────────────────────────────────────────────────────
interface ImagePlaneProps {
  path: string;
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected: boolean;
  accentColor: string;
  onSelect: () => void;
}

function ImagePlane({
  path,
  position,
  rotation,
  isSelected,
  accentColor,
  onSelect,
}: ImagePlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1.0);
  const targetScaleRef = useRef(1.0);
  const [hovered, setHovered] = useState(false);
  const isVisibleRef = useRef(true);

  // Load texture for this plane
  const texture = useTexture(encodePath(path)) as THREE.Texture;

  useEffect(() => {
    targetScaleRef.current = hovered || isSelected ? 1.15 : 1.0;
  }, [hovered, isSelected]);

  useFrame(() => {
    if (!meshRef.current || !isVisibleRef.current) return;
    // Smooth lerp toward target scale
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScaleRef.current, 0.12);
    meshRef.current.scale.setScalar(scaleRef.current);
  });

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  }, []);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect],
  );

  // Parse accent color to THREE.Color for emissive glow
  const emissiveColor = isSelected ? new THREE.Color(accentColor) : new THREE.Color(0x000000);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 16:9 plane — 3.2 × 1.8 world units */}
      <planeGeometry args={[3.2, 1.8]} />
      <meshStandardMaterial
        map={texture}
        toneMapped={false}
        emissive={emissiveColor}
        emissiveIntensity={isSelected ? 0.25 : 0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── The R3F scene (inside Canvas) ───────────────────────────────────────────
interface GallerySceneProps {
  items: ShowcaseItem[];
  selectedId: string | null;
  onSelect: (item: ShowcaseItem) => void;
  isVisible: React.MutableRefObject<boolean>;
}

function GalleryScene({ items, selectedId, onSelect, isVisible }: GallerySceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const n = items.length;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />

      {/*
       * OrbitControls — no zoom, no pan so vertical page scroll is NOT hijacked.
       * Polar angle constraints keep the camera at horizon level.
       */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />

      {items.map((item, i) => {
        // Curved arc arrangement
        const angle = (i / n) * Math.PI * 1.5 - Math.PI * 0.75;
        const x = Math.sin(angle) * 4;
        const z = Math.cos(angle) * 4;
        const y = 0;
        // Planes face the camera (rotate toward origin)
        const rotY = -angle;

        const imagePath = item.images[0];
        if (!imagePath) return null;

        return (
          <Suspense key={item.id} fallback={null}>
            <ImagePlane
              path={imagePath}
              position={[x, y, z]}
              rotation={[0, rotY, 0]}
              isSelected={selectedId === item.id}
              accentColor="#6366f1"
              onSelect={() => onSelect(item)}
            />
          </Suspense>
        );
      })}
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Gallery3DProps {
  items: ShowcaseItem[];
}

// ─── Gallery3DWrapper (default export) ───────────────────────────────────────
// Parent page imports via next/dynamic ssr:false.
export default function Gallery3DWrapper({ items }: Gallery3DProps) {
  const { webGLAvailable } = useWebGL();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  // Cap at 8 items per spec; on mobile cap at 5
  const [maxItems, setMaxItems] = useState(8);
  useEffect(() => {
    setMaxItems(window.innerWidth < 768 ? 5 : 8);
  }, []);

  const displayItems = items.filter((it) => it.images.length > 0).slice(0, maxItems);

  // Pause rendering when gallery is off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // WebGL unavailable → static fallback
  if (!webGLAvailable) {
    return <WebGLFallback items={items} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '600px' }}
      aria-label="Interactive 3D screenshot gallery"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: false }}
        frameloop="demand"
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <GalleryScene
          items={displayItems}
          selectedId={selectedItem?.id ?? null}
          onSelect={setSelectedItem}
          isVisible={isVisibleRef}
        />
      </Canvas>

      {/* Selected item info overlay — outside Canvas, plain HTML */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key={selectedItem.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '480px',
              width: 'calc(100% - 2rem)',
              padding: '1rem 1.25rem',
              borderRadius: '0.75rem',
              background: 'rgba(13, 13, 20, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
            role="status"
            aria-live="polite"
          >
            <h3
              style={{
                margin: '0 0 0.375rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ededed',
              }}
            >
              {selectedItem.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.8125rem',
                color: 'rgba(237,237,237,0.65)',
                lineHeight: 1.55,
              }}
            >
              {selectedItem.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint when nothing is selected */}
      {!selectedItem && (
        <p
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            width: '100%',
            textAlign: 'center',
            margin: 0,
            fontSize: '0.8125rem',
            color: 'rgba(237,237,237,0.35)',
            pointerEvents: 'none',
          }}
        >
          Drag to rotate · Click a screenshot to learn more
        </p>
      )}
    </div>
  );
}
