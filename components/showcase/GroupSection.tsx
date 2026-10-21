'use client';

import { motion } from 'framer-motion';
import type { ShowcaseGroup, ShowcaseItem } from '@/data/showcase';
import { GROUP_META } from '@/data/showcase';
import FeatureCard from './FeatureCard';

interface GroupSectionProps {
  group: ShowcaseGroup;
  items: ShowcaseItem[];
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/**
 * A full-width section for one showcase group.
 * - Animated section heading (text reveal via overflow:hidden clip)
 * - Accent underline bar
 * - Short intro paragraph
 * - Responsive grid of FeatureCards with stagger animation
 * - Shows a placeholder when the group has no items
 */
export default function GroupSection({ group, items }: GroupSectionProps) {
  const meta = GROUP_META[group];

  return (
    <section
      id={group}
      aria-labelledby={`heading-${group}`}
      style={{
        padding: '5rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      {/* Section heading */}
      <div style={{ marginBottom: '2.5rem' }}>
        {/* Letter badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: `${meta.accent}22`,
              border: `1px solid ${meta.accent}55`,
              color: meta.accent,
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {meta.letter}
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: meta.accent,
            }}
          >
            {meta.label}
          </span>
        </motion.div>

        {/* Animated heading — overflow:hidden clip effect */}
        <div style={{ overflow: 'hidden' }}>
          <motion.h2
            id={`heading-${group}`}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{
              margin: 0,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: '#ededed',
              lineHeight: 1.2,
            }}
          >
            {meta.label}
          </motion.h2>
        </div>

        {/* Accent underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          viewport={{ once: true }}
          style={{
            transformOrigin: 'left',
            marginTop: '0.75rem',
            height: '3px',
            width: '64px',
            borderRadius: '2px',
            background: meta.accent,
          }}
        />

        {/* Intro text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          viewport={{ once: true }}
          style={{
            marginTop: '1rem',
            fontSize: '1rem',
            color: 'rgba(237, 237, 237, 0.6)',
            lineHeight: 1.7,
            maxWidth: '640px',
          }}
        >
          {meta.intro}
        </motion.p>
      </div>

      {/* Card grid or empty state */}
      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '1rem',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            color: 'rgba(237, 237, 237, 0.35)',
            fontSize: '0.9rem',
          }}
        >
          No screenshots yet — add them to{' '}
          <code
            style={{
              fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.06)',
              padding: '0.1em 0.4em',
              borderRadius: '4px',
            }}
          >
            data/showcase.ts
          </code>{' '}
          and{' '}
          <code
            style={{
              fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.06)',
              padding: '0.1em 0.4em',
              borderRadius: '4px',
            }}
          >
            /public
          </code>
          .
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '1.5rem',
          }}
        >
          {items.map((item, i) => (
            <FeatureCard
              key={item.id}
              item={item}
              accentColor={meta.accent}
              index={i}
            />
          ))}
        </motion.div>
      )}
    </section>
  );
}
