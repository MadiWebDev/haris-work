'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A fixed 4px progress bar pinned to the top of the viewport.
 * Respects `prefers-reduced-motion` — shows a static full-width bar instead
 * of an animated one when motion is disabled.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Detect prefers-reduced-motion on the client only
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
  }, []);

  return (
    <motion.div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        zIndex: 9999,
        transformOrigin: '0%',
        scaleX: reducedMotion.current ? 1 : scaleX,
        background:
          'linear-gradient(90deg, var(--color-core, #6366f1), var(--color-reports, #10b981))',
      }}
    />
  );
}
