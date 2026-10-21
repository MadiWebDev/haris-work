'use client';

import { motion } from 'framer-motion';

interface ReportCardProps {
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'pptx';
}

function PdfIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="#10b981" fillOpacity="0.15" />
      <path
        d="M8 6a2 2 0 0 1 2-2h9l7 7v15a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6Z"
        fill="#10b981"
        fillOpacity="0.2"
        stroke="#10b981"
        strokeWidth="1.5"
      />
      <path d="M19 4v7h7" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round" />
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fill="#10b981"
        fontFamily="sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

function PptxIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="#f59e0b" fillOpacity="0.15" />
      <path
        d="M8 6a2 2 0 0 1 2-2h9l7 7v15a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6Z"
        fill="#f59e0b"
        fillOpacity="0.2"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <path d="M19 4v7h7" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontSize="5"
        fontWeight="700"
        fill="#f59e0b"
        fontFamily="sans-serif"
      >
        PPTX
      </text>
    </svg>
  );
}

/**
 * Animated glassmorphism card for a PDF or PPTX document.
 * PDF gets both Open and Download buttons; PPTX gets Download only
 * (PPTX cannot be embedded in-browser).
 */
export default function ReportCard({
  title,
  description,
  fileUrl,
  fileType,
}: ReportCardProps) {
  const accentColor = fileType === 'pdf' ? '#10b981' : '#f59e0b';

  return (
    <motion.article
      className="showcase-glass"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -4 }}
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
      aria-label={`Document: ${title}`}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        {fileType === 'pdf' ? <PdfIcon /> : <PptxIcon />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#ededed',
              lineHeight: 1.4,
            }}
          >
            {title}
          </h3>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: accentColor,
            }}
          >
            {fileType.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: '0.875rem',
          color: 'rgba(237, 237, 237, 0.65)',
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {description}
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
        {fileType === 'pdf' && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title} in a new tab`}
            style={{
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
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <span aria-hidden="true">↗</span>
            Open
          </a>
        )}
        <a
          href={fileUrl}
          download
          aria-label={`Download ${title}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 1rem',
            minHeight: '44px',
            borderRadius: '0.5rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'rgba(237, 237, 237, 0.8)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          <span aria-hidden="true">↓</span>
          Download
        </a>
      </div>
    </motion.article>
  );
}
