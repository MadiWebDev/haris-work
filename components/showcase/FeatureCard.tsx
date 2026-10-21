'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { ShowcaseItem } from '@/data/showcase';
import { BLUR_DATA_URL } from '@/data/showcase';
import { useShowcaseContext } from '@/app/showcase/ShowcaseContext';

interface FeatureCardProps {
  item: ShowcaseItem;
  accentColor: string; // hex string; applied via inline style (Tailwind v4 dynamic color rule)
  index: number;
}

const SPRING_CONFIG = { stiffness: 200, damping: 20 };

/**
 * Feature card with:
 * - Browser-chrome device frame mockup
 * - Scroll-triggered reveal (alternating left/right by index)
 * - 3D tilt on mouse-hover (desktop)
 * - Tap scale on mobile
 * - Blur placeholder via next/image
 * - "View Report" button when reportUrl is present
 */
export default function FeatureCard({ item, accentColor, index }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { openLightbox } = useShowcaseContext();

  // 3D tilt motion values
  const rotateX = useMotionValue<number>(0);
  const rotateY = useMotionValue<number>(0);
  const rotateXSpring = useSpring(rotateX, SPRING_CONFIG);
  const rotateYSpring = useSpring(rotateY, SPRING_CONFIG);

  // Subtle glow shadow linked to tilt magnitude
  const glowOpacity = useTransform(
    [rotateXSpring, rotateYSpring],
    ([rx, ry]: number[]) => Math.min(Math.abs(rx) + Math.abs(ry), 10) / 10,
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const y = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    rotateX.set(x * -8);
    rotateY.set(y * 8);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // Alternate slide direction: even index from left, odd from right
  const slideX = index % 2 === 0 ? -40 : 40;

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, x: slideX }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 3) * 0.1, // stagger within row (max 3 cols)
      }}
      viewport={{ once: true, margin: '-80px' }}
      // 3D tilt — desktop
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Tap feedback — mobile
      whileTap={{ scale: 0.97 }}
      aria-label={item.title}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
        perspective: 800,
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
      }}
    >
      {/* Glow overlay linked to tilt */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '1rem',
          pointerEvents: 'none',
          opacity: glowOpacity,
          boxShadow: `0 0 40px 0 ${accentColor}55`,
          zIndex: 2,
        }}
      />

      {/* Browser chrome mockup */}
      <div
        aria-hidden="true"
        style={{
          padding: '0.5rem 0.75rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          flexShrink: 0,
        }}
      >
        {/* Traffic-light dots */}
        {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
          <span
            key={c}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: c,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
        ))}
        {/* Fake URL bar */}
        <span
          style={{
            flex: 1,
            height: '14px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.07)',
            marginLeft: '0.5rem',
          }}
        />
      </div>

      {/* Screenshot — click opens the lightbox */}
      <div
        role="button"
        tabIndex={item.images[0] ? 0 : -1}
        aria-label={`View ${item.title} in lightbox`}
        onClick={() => {
          if (item.images.length > 0) {
            openLightbox(item.images, 0, item.title);
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && item.images.length > 0) {
            e.preventDefault();
            openLightbox(item.images, 0, item.title);
          }
        }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.2)',
          cursor: item.images.length > 0 ? 'zoom-in' : 'default',
        }}
      >
        {item.images[0] && (
          <Image
            src={item.images[0]}
            alt={`${item.title} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            style={{ transition: 'opacity 0.4s ease' }}
          />
        )}

        {/* Additional image count badge */}
        {item.images.length > 1 && (
          <span
            aria-label={`${item.images.length - 1} more screenshot${item.images.length > 2 ? 's' : ''}`}
            style={{
              position: 'absolute',
              bottom: '0.5rem',
              right: '0.5rem',
              background: 'rgba(0,0,0,0.7)',
              color: '#ededed',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.2rem 0.5rem',
              borderRadius: '0.375rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            +{item.images.length - 1}
          </span>
        )}
      </div>

      {/* Card body */}
      <div
        style={{
          padding: '1rem 1.25rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 600,
            color: '#ededed',
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: 'rgba(237, 237, 237, 0.65)',
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {item.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.375rem',
                background: `${accentColor}18`,
                color: accentColor,
                border: `1px solid ${accentColor}33`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* "View Report" button — only when reportUrl exists */}
        {item.reportUrl && (
          <a
            href={item.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open report for ${item.title}`}
            style={{
              marginTop: '0.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1rem',
              minHeight: '44px',
              borderRadius: '0.5rem',
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}55`,
              color: accentColor,
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              alignSelf: 'flex-start',
              transition: 'background 0.2s ease',
            }}
          >
            <span aria-hidden="true">↗</span>
            View Report
          </a>
        )}
      </div>
    </motion.article>
  );
}
