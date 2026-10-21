// Server Component — NO 'use client'.
// Dynamic imports with ssr:false are in ShowcasePageClient (a Client Component)
// because Next.js 16 Turbopack does not allow ssr:false in Server Components.

import type { Metadata } from 'next';

import { showcaseItems, reportDocs, GROUP_META } from '@/data/showcase';
import type { ShowcaseGroup } from '@/data/showcase';
import GroupSection from '@/components/showcase/GroupSection';
import ReportCard from '@/components/showcase/ReportCard';
import ShowcasePageClient from './ShowcasePageClient';
import FooterCTA from './FooterCTA';

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Project Showcase — HarisPortfolio',
  description:
    'A visual tour of MineConnect features, dashboards, and reports. Explore the full feature set through interactive 3D previews and annotated screenshots.',
  openGraph: {
    title: 'HarisPortfolio Showcase',
    description:
      'Feature gallery with screenshots and reports — built with Next.js, Three.js, and Framer Motion.',
    type: 'website',
  },
};

// ─── Group items by group key ─────────────────────────────────────────────────

const GROUPS: ShowcaseGroup[] = ['admin', 'reports', 'mobile'];

function groupItems(): Record<ShowcaseGroup, typeof showcaseItems> {
  const grouped = Object.fromEntries(
    GROUPS.map((g) => [g, [] as typeof showcaseItems]),
  ) as Record<ShowcaseGroup, typeof showcaseItems>;

  for (const item of showcaseItems) {
    grouped[item.group].push(item);
  }

  return grouped;
}

const groupedItems = groupItems();

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShowcasePage() {
  return (
    /*
     * ShowcasePageClient is 'use client' — it hosts the dynamic(ssr:false)
     * imports for Hero and Gallery3D, owns lightbox + scroll-spy state,
     * provides ShowcaseContext, and renders GroupNav + ScrollProgress.
     *
     * The static sections below are passed as {children} and rendered
     * server-side; FeatureCard communicates back up via ShowcaseContext.
     */
    <ShowcasePageClient showcaseItems={showcaseItems}>
      {/* ── Group A–D sections (server-rendered) ───────────────────────── */}
      {GROUPS.map((group) => (
        <GroupSection
          key={group}
          group={group}
          items={groupedItems[group]}
        />
      ))}

      {/* ── Documents & Reports ──────────────────────────────────────────── */}
      <section
        id="reports-docs"
        aria-labelledby="reports-docs-heading"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
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
                background: `${GROUP_META.reports.accent}22`,
                border: `1px solid ${GROUP_META.reports.accent}55`,
                color: GROUP_META.reports.accent,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {GROUP_META.reports.letter}
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: GROUP_META.reports.accent,
              }}
            >
              Downloads
            </span>
          </div>

          <h2
            id="reports-docs-heading"
            style={{
              margin: 0,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: '#ededed',
              lineHeight: 1.2,
            }}
          >
            Documents &amp; Reports
          </h2>

          <div
            aria-hidden="true"
            style={{
              marginTop: '0.75rem',
              height: '3px',
              width: '64px',
              borderRadius: '2px',
              background: GROUP_META.reports.accent,
            }}
          />

          <p
            style={{
              marginTop: '1rem',
              fontSize: '1rem',
              color: 'rgba(237, 237, 237, 0.6)',
              lineHeight: 1.7,
              maxWidth: '640px',
            }}
          >
            Downloadable documents produced alongside the MineConnect platform.
          </p>
        </div>

        {/* ReportCard grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {reportDocs.map((doc) => (
            <ReportCard
              key={doc.id}
              title={doc.title}
              description={doc.description}
              fileUrl={doc.fileUrl}
              fileType={doc.fileType}
            />
          ))}
        </div>
      </section>

      {/* ── Footer CTA (client component — uses Framer Motion) ───────────── */}
      <FooterCTA />
    </ShowcasePageClient>
  );
}
