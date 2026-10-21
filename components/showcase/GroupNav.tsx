'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GROUP_META } from '@/data/showcase';
import type { ShowcaseGroup } from '@/data/showcase';

interface GroupNavProps {
  activeGroup: ShowcaseGroup;
  onGroupClick: (id: ShowcaseGroup) => void;
}

const GROUPS: ShowcaseGroup[] = ['admin', 'reports'];

/**
 * Sticky in-page navigation for the 4 showcase groups.
 * An animated pill slides under the active group label (layoutId shared transition).
 * Accent color is applied via inline style to satisfy Tailwind v4's dynamic color rule.
 */
export default function GroupNav({ activeGroup, onGroupClick }: GroupNavProps) {
  return (
    <nav
      aria-label="Showcase group navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        padding: '0.75rem 1rem',
        background: 'rgba(13, 13, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <ul
        role="list"
        style={{
          display: 'flex',
          gap: '0.5rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {GROUPS.map((group) => {
          const meta = GROUP_META[group];
          const isActive = group === activeGroup;

          return (
            <li key={group} style={{ position: 'relative' }}>
              <button
                onClick={() => onGroupClick(group)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Jump to ${meta.label} section`}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  minHeight: '44px',
                  minWidth: '44px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? meta.accent : 'rgba(237, 237, 237, 0.6)',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                  zIndex: 1,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: isActive ? meta.accent : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#0d0d14' : 'rgba(237,237,237,0.6)',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {meta.letter}
                </span>
                <span className="hidden sm:inline">{meta.label}</span>
              </button>

              {/* Animated active indicator pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="group-indicator"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '9999px',
                      background: `${meta.accent}18`,
                      border: `1px solid ${meta.accent}40`,
                      zIndex: 0,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
