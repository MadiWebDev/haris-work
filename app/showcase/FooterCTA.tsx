'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated footer CTA for the /showcase page.
 * Uses Framer Motion — must be a client component.
 */
export default function FooterCTA() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      style={{
        padding: '5rem 1.5rem 4rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2
          style={{
            margin: '0 0 1rem',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: '#ededed',
            lineHeight: 1.25,
          }}
        >
          Like what you see?
        </h2>

        <p
          style={{
            margin: '0 0 2rem',
            fontSize: '1rem',
            color: 'rgba(237, 237, 237, 0.6)',
            lineHeight: 1.7,
          }}
        >
          MineConnect is a full-stack operational platform built for the
          mining industry. Let&apos;s talk about your next project.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.875rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Primary CTA */}
          <motion.a
            href="mailto:m.haris3098@gmail.com"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Get in touch via email"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              minHeight: '48px',
              borderRadius: '0.625rem',
              background: '#6366f1',
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <span aria-hidden="true">✉</span>
            Get in touch
          </motion.a>

          {/* Secondary CTA — back to top */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Scroll back to top of page"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              minHeight: '48px',
              borderRadius: '0.625rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(237,237,237,0.8)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <span aria-hidden="true">↑</span>
            Back to top
          </motion.a>
        </div>

        <p
          style={{
            marginTop: '2.5rem',
            fontSize: '0.8125rem',
            color: 'rgba(237,237,237,0.3)',
          }}
        >
          © {year ?? '—'} HarisPortfolio — Built with Next.js,
          Three.js &amp; Framer Motion
        </p>
      </div>
    </motion.footer>
  );
}
