'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { BLUR_DATA_URL } from '@/data/showcase';

interface LightboxProps {
  /** Flat array of image paths (from /public) for the active item. */
  images: string[];
  /** Zero-based index of the first image to show. */
  initialIndex: number;
  /** Optional caption shown below the image. */
  caption?: string;
  /** Called when the user closes the lightbox. */
  onClose: () => void;
  /**
   * Ref to the element that triggered the lightbox.
   * Focus is restored to this element on close.
   */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

/** Detects prefers-reduced-motion once on the client. */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(
      typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  }, []);
  return reduced;
}

export default function Lightbox({
  images,
  initialIndex,
  caption,
  onClose,
  triggerRef,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = backward
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const prev = () => {
    if (!hasPrev) return;
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
  };

  const next = () => {
    if (!hasNext) return;
    setDirection(1);
    setCurrentIndex((i) => i + 1);
  };

  // ── Focus management ────────────────────────────────────────────────────────
  useEffect(() => {
    overlayRef.current?.focus();
    return () => {
      // Restore focus to the trigger element when lightbox unmounts
      triggerRef?.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // ── Touch swipe ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let startX = 0;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
    }

    function onTouchEnd(e: TouchEvent) {
      const dx = startX - e.changedTouches[0].clientX;
      if (dx > 50) next();
      if (dx < -50) prev();
    }

    const el = overlayRef.current;
    el?.addEventListener('touchstart', onTouchStart, { passive: true });
    el?.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el?.removeEventListener('touchstart', onTouchStart);
      el?.removeEventListener('touchend', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // ── Motion config ────────────────────────────────────────────────────────────
  // Respect prefers-reduced-motion: only fade if motion is reduced
  const imageVariants = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: direction * 60, scale: 0.92 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: direction * -60, scale: 0.92 },
      };

  const currentSrc = images[currentIndex];

  return (
    // Full-screen overlay
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
      }}
      // Click outside image to close
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button — top right */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#ededed',
          fontSize: '1.25rem',
          lineHeight: 1,
          zIndex: 60,
          flexShrink: 0,
        }}
      >
        ×
      </button>

      {/* Image counter — top left */}
      {images.length > 1 && (
        <span
          aria-live="polite"
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            fontSize: '0.8125rem',
            color: 'rgba(237,237,237,0.6)',
            zIndex: 60,
          }}
        >
          {currentIndex + 1} / {images.length}
        </span>
      )}

      {/* Main content area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 'min(90vw, 1200px)',
          padding: '0 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Animated image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '75vh',
            aspectRatio: '16/9',
            overflow: 'hidden',
            borderRadius: '0.75rem',
          }}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentSrc}
              layoutId={`lightbox-img-${currentSrc}`}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={currentSrc}
                alt={caption ? `${caption} — image ${currentIndex + 1}` : `Screenshot ${currentIndex + 1}`}
                fill
                sizes="(max-width: 768px) 95vw, 90vw"
                className="object-contain"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption */}
        {caption && (
          <p
            style={{
              margin: 0,
              fontSize: '0.9375rem',
              color: 'rgba(237,237,237,0.75)',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            {caption}
          </p>
        )}
      </div>

      {/* Prev arrow */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous image"
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ededed',
            fontSize: '1.25rem',
            zIndex: 60,
            flexShrink: 0,
          }}
        >
          ‹
        </button>
      )}

      {/* Next arrow */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next image"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ededed',
            fontSize: '1.25rem',
            zIndex: 60,
            flexShrink: 0,
          }}
        >
          ›
        </button>
      )}
    </motion.div>
  );
}
