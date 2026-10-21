'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import ScrollProgress from '@/components/showcase/ScrollProgress';
import GroupNav from '@/components/showcase/GroupNav';
import Lightbox from '@/components/showcase/Lightbox';
import { ShowcaseContext } from './ShowcaseContext';
import type { ShowcaseGroup, ShowcaseItem } from '@/data/showcase';
import { GROUP_META } from '@/data/showcase';

// ─── Dynamic imports — ssr:false MUST be in a Client Component ────────────────
// (Next.js 16 Turbopack: ssr:false is not allowed in Server Components)

const Hero = dynamic(() => import('@/components/showcase/Hero'), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading hero section"
      style={{
        width: '100%',
        height: '100svh',
        minHeight: '500px',
        background: '#0d0d14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.3)',
          borderTopColor: '#6366f1',
        }}
      />
    </div>
  ),
});

const Gallery3D = dynamic(() => import('@/components/showcase/Gallery3D'), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Loading 3D gallery"
      style={{
        width: '100%',
        height: '600px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    />
  ),
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface LightboxState {
  images: string[];
  initialIndex: number;
  caption?: string;
}

interface ShowcasePageClientProps {
  /** Static server-rendered sections (GroupSection, ReportCard grid, etc.) */
  children: React.ReactNode;
  /** All showcase items — passed through for Gallery3D */
  showcaseItems: ShowcaseItem[];
}

// ─── Scroll-spy section IDs ───────────────────────────────────────────────────

const SECTION_IDS: ShowcaseGroup[] = ['admin', 'reports', 'mobile'];

// ─── ShowcasePageClient ───────────────────────────────────────────────────────

/**
 * Client shell for the /showcase page.
 *
 * Responsibilities:
 * 1. Hosts dynamic(ssr:false) imports for Hero and Gallery3D (required by Next.js 16).
 * 2. Provides ShowcaseContext so FeatureCard can open the Lightbox without
 *    prop-drilling through Server Component boundaries.
 * 3. Owns lightbox state (open/closed, images, initial index).
 * 4. Scroll-spy via IntersectionObserver watching #core / #admin / #reports /
 *    #mobile — drives GroupNav's active pill.
 * 5. Renders: ScrollProgress → GroupNav → Hero → {children} → Gallery3D →
 *    AnimatePresence/Lightbox.
 */
export default function ShowcasePageClient({
  children,
  showcaseItems,
}: ShowcasePageClientProps) {
  // ── Lightbox state ────────────────────────────────────────────────────────
  const [lightboxState, setLightboxState] = useState<LightboxState | null>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback(
    (images: string[], initialIndex: number, caption?: string) => {
      if (document.activeElement instanceof HTMLElement) {
        lightboxTriggerRef.current = document.activeElement;
      }
      setLightboxState({ images, initialIndex, caption });
    },
    [],
  );

  const closeLightbox = useCallback(() => {
    setLightboxState(null);
  }, []);

  // ── Active group scroll-spy ────────────────────────────────────────────────
  const [activeGroup, setActiveGroup] = useState<ShowcaseGroup>('admin');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveGroup(id);
          }
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleGroupClick = useCallback((id: ShowcaseGroup) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveGroup(id);
  }, []);

  // ── Context value ─────────────────────────────────────────────────────────
  const contextValue = { openLightbox };

  return (
    <ShowcaseContext.Provider value={contextValue}>
      {/* Fixed scroll progress bar */}
      <ScrollProgress />

      {/* Sticky group navigation */}
      <GroupNav activeGroup={activeGroup} onGroupClick={handleGroupClick} />

      {/* Hero — Three.js, client-only */}
      <Suspense
        fallback={
          <div
            style={{
              width: '100%',
              height: '100svh',
              minHeight: '500px',
              background: '#0d0d14',
            }}
          />
        }
      >
        <Hero />
      </Suspense>

      {/* Static server-rendered sections (GroupSection, ReportCard grid, etc.) */}
      <main
        id="showcase-main"
        style={{ background: 'var(--showcase-bg, #0d0d14)' }}
      >
        {children}

        {/* ── 3D Gallery ──────────────────────────────────────────────────── */}
        <section
          id="gallery-3d"
          aria-labelledby="gallery-3d-heading"
          style={{
            padding: '5rem 1.5rem',
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2
              id="gallery-3d-heading"
              style={{
                margin: 0,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: '#ededed',
                lineHeight: 1.2,
              }}
            >
              Interactive Gallery
            </h2>
            <p
              style={{
                marginTop: '0.875rem',
                fontSize: '1rem',
                color: 'rgba(237, 237, 237, 0.55)',
                maxWidth: '480px',
                margin: '0.875rem auto 0',
                lineHeight: 1.6,
              }}
            >
              Drag to explore · Click any screenshot to focus
            </p>
          </div>

          <Suspense
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '600px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              />
            }
          >
            <Gallery3D items={showcaseItems} />
          </Suspense>
        </section>
      </main>

      {/* Lightbox — AnimatePresence must live in a Client Component */}
      <AnimatePresence>
        {lightboxState && (
          <Lightbox
            key="showcase-lightbox"
            images={lightboxState.images}
            initialIndex={lightboxState.initialIndex}
            caption={lightboxState.caption}
            onClose={closeLightbox}
            triggerRef={lightboxTriggerRef as React.RefObject<HTMLElement | null>}
          />
        )}
      </AnimatePresence>
    </ShowcaseContext.Provider>
  );
}
