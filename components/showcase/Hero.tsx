'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// ─── Path encoding ────────────────────────────────────────────────────────────
// next/image accepts paths with spaces as-is.
// useTexture (Three.js XHR) needs percent-encoded segments (NOT the slash).
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

// Core screenshots — 16:9 planes
const HERO_IMAGES = [
  '/Screenshot 2026-09-29 111906.png',
  '/Screenshot 2026-09-29 113813.png',
];

// ─── Particles ────────────────────────────────────────────────────────────────
function buildPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  return pos;
}

function Particles({ count }: { count: number }) {
  // Lazily initialise once — store in ref so re-renders don't regenerate
  const positions = useRef<Float32Array>(buildPositions(count));
  const pointsRef = useRef<THREE.Points>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion.current) return;
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#6366f1" sizeAttenuation />
    </points>
  );
}

// ─── Screenshot planes ────────────────────────────────────────────────────────
function ScreenshotPlanes() {
  const encodedPaths = HERO_IMAGES.map(encodePath);
  const textures = useTexture(encodedPaths) as THREE.Texture[];
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion.current) return;
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Slowly orbit the whole group
    groupRef.current.rotation.y = t * 0.15;
  });

  return (
    <group ref={groupRef}>
      {textures.map((texture, i) => {
        // Place planes on a small circle
        const angle = (i / textures.length) * Math.PI * 2;
        const radius = 2.5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - 1;
        // 16:9 plane: width=3.2, height=1.8
        return (
          <Float
            key={i}
            speed={1.5}
            rotationIntensity={0.15}
            floatIntensity={0.3}
          >
            <mesh
              position={[x, 0, z]}
              rotation={[0, -angle, 0]}
            >
              <planeGeometry args={[3.2, 1.8]} />
              <meshStandardMaterial
                map={texture}
                toneMapped={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function HeroScene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Particles count={isMobile ? 150 : 500} />
      {!isMobile && (
        <Suspense fallback={null}>
          <ScreenshotPlanes />
        </Suspense>
      )}
    </>
  );
}

// ─── Loading fallback (inside Canvas via Html) ────────────────────────────────
function LoadingFallback() {
  return (
    <Html center>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.3)',
          borderTopColor: '#6366f1',
          animation: 'spin 1s linear infinite',
        }}
        aria-label="Loading 3D scene"
        role="status"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Html>
  );
}

// ─── Overlay HTML (title + tagline + scroll cue) ─────────────────────────────
function HeroOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ededed 0%, #6366f1 60%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1.15,
        }}
      >
        MineConnect
      </h1>
      <p
        style={{
          marginTop: '1rem',
          fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
          color: 'rgba(237,237,237,0.7)',
          maxWidth: '560px',
          lineHeight: 1.6,
        }}
      >
        A complete operational platform for modern mining — from dashboard to compliance.
      </p>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.375rem',
          opacity: 0.5,
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#ededed', letterSpacing: '0.08em' }}>
          SCROLL
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, #6366f1, transparent)',
          }}
        />
      </div>
    </div>
  );
}

// ─── HeroWrapper (default export) ─────────────────────────────────────────────
// The parent page imports this via next/dynamic with ssr:false.
export default function HeroWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef(false);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    // Detect mobile once on mount (safe — runs client-only)
    isMobileRef.current = window.innerWidth < 768;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Pause rendering when off-screen to save battery
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '500px',
        background: 'var(--showcase-bg, #0d0d14)',
        overflow: 'hidden',
      }}
      aria-label="Animated hero section with 3D screenshot preview"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        frameloop="always"
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <HeroScene isMobile={isMobileRef.current} />
        </Suspense>
      </Canvas>

      <HeroOverlay />
    </div>
  );
}
