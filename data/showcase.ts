// data/showcase.ts — edit this file to add/remove screenshots and reports.
// All image paths match files in /public. Spaces are preserved for next/image.

export type ShowcaseGroup = 'core' | 'admin' | 'reports' | 'mobile';

export type ShowcaseItem = {
  id: string;
  title: string;
  description: string;       // 1-2 lines, plain language
  images: string[];          // paths from /public — spaces preserved for next/image
  reportUrl?: string;        // PDF/PPTX path from /public
  tags: string[];
  group: ShowcaseGroup;
};

export type GroupMeta = {
  label: string;
  letter: string;   // A / B / C / D
  accent: string;   // hex color
  intro: string;
};

export const GROUP_META: Record<ShowcaseGroup, GroupMeta> = {
  core: {
    label: 'Core Features',
    letter: 'A',
    accent: '#6366f1',
    intro:
      'The foundational screens that define the MineConnect experience — from first login to the primary dashboard.',
  },
  admin: {
    label: 'Admin / Management',
    letter: 'B',
    accent: '#06b6d4',
    intro:
      'Administrative tools for managing users, permissions, and operational data across the platform.',
  },
  reports: {
    label: 'Reports & Documents',
    letter: 'C',
    accent: '#10b981',
    intro:
      'Data visualisations, generated reports, and downloadable documents produced by the system.',
  },
  mobile: {
    label: 'Mobile Views',
    letter: 'D',
    accent: '#f59e0b',
    intro:
      'Mobile-optimised screens — reserved for future uploads. Add portrait screenshots here.',
  },
};

/** 1×1 dark pixel (#0d0d14) used as blur placeholder for all dynamic images. */
export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=';

export const showcaseItems: ShowcaseItem[] = [
  // ── Group A — Core Features ──────────────────────────────────────────────
  {
    id: 'core-001',
    title: 'Platform Overview',
    description:
      'The main entry view giving users an at-a-glance summary of active projects and recent activity.',
    images: ['/Screenshot 2026-09-29 111906.png'],
    tags: ['Dashboard', 'Overview', 'Core'],
    group: 'core',
  },
  {
    id: 'core-002',
    title: 'Primary Dashboard',
    description:
      'Real-time metrics and KPI widgets that surface the most important operational data.',
    images: ['/Screenshot 2026-09-29 113813.png'],
    tags: ['Dashboard', 'KPIs', 'Metrics', 'Core'],
    group: 'core',
  },

  // ── Group B — Admin / Management ─────────────────────────────────────────
  {
    id: 'admin-001',
    title: 'User Management',
    description:
      'Create, edit, and deactivate user accounts with role-based access controls.',
    images: ['/Screenshot 2026-10-20 150319.png'],
    tags: ['Admin', 'Users', 'RBAC'],
    group: 'admin',
  },
  {
    id: 'admin-002',
    title: 'Permissions Panel',
    description:
      'Fine-grained permission settings per module, allowing precise control over feature access.',
    images: ['/Screenshot 2026-10-20 150523.png'],
    tags: ['Admin', 'Permissions', 'Security'],
    group: 'admin',
  },
  {
    id: 'admin-003',
    title: 'Operations Manager',
    description:
      'Central hub for scheduling and monitoring ongoing operational tasks and workflows.',
    images: ['/Screenshot 2026-10-20 150549.png'],
    tags: ['Admin', 'Operations', 'Scheduling'],
    group: 'admin',
  },
  {
    id: 'admin-004',
    title: 'Data Entry Forms',
    description:
      'Structured forms for entering and validating new operational records with inline error handling.',
    images: ['/Screenshot 2026-10-20 150607.png'],
    tags: ['Admin', 'Forms', 'Data Entry'],
    group: 'admin',
  },
  {
    id: 'admin-005',
    title: 'Asset Tracker',
    description:
      'Live status board for tracking physical and digital assets across all sites.',
    images: ['/Screenshot 2026-10-20 150647.png'],
    tags: ['Admin', 'Assets', 'Tracking'],
    group: 'admin',
  },
  {
    id: 'admin-006',
    title: 'Audit Log',
    description:
      'Immutable record of all administrative actions with timestamp, user, and affected entity.',
    images: ['/Screenshot 2026-10-20 150727.png'],
    tags: ['Admin', 'Audit', 'Compliance'],
    group: 'admin',
  },
  {
    id: 'admin-007',
    title: 'System Settings',
    description:
      'Global configuration for notifications, integrations, and platform-wide preferences.',
    images: ['/Screenshot 2026-10-20 150856.png'],
    tags: ['Admin', 'Settings', 'Configuration'],
    group: 'admin',
  },

  // ── Group C — Reports & Documents ────────────────────────────────────────
  {
    id: 'reports-001',
    title: 'Production Summary',
    description:
      'Aggregated production figures broken down by period, site, and commodity type.',
    images: ['/Screenshot 2026-10-20 153147.png'],
    tags: ['Reports', 'Production', 'Analytics'],
    group: 'reports',
  },
  {
    id: 'reports-002',
    title: 'Safety Incident Report',
    description:
      'Logged incidents with severity classification, root-cause analysis, and corrective actions.',
    images: ['/Screenshot 2026-10-20 153229.png'],
    tags: ['Reports', 'Safety', 'Compliance'],
    group: 'reports',
  },
  {
    id: 'reports-003',
    title: 'Resource Allocation Chart',
    description:
      'Visual breakdown of how human and equipment resources are distributed across active projects.',
    images: ['/Screenshot 2026-10-20 153238.png'],
    tags: ['Reports', 'Resources', 'Charts'],
    group: 'reports',
  },
  {
    id: 'reports-004',
    title: 'Financial Overview',
    description:
      'High-level cost vs. budget comparison with drill-down capability per cost centre.',
    images: ['/Screenshot 2026-10-20 153349.png'],
    tags: ['Reports', 'Finance', 'Budget'],
    group: 'reports',
  },
  {
    id: 'reports-005',
    title: 'Environmental Metrics',
    description:
      'Key environmental indicators including water usage, emissions, and rehabilitation progress.',
    images: ['/Screenshot 2026-10-20 153358.png'],
    tags: ['Reports', 'Environment', 'ESG'],
    group: 'reports',
  },
  {
    id: 'reports-006',
    title: 'Equipment Utilisation',
    description:
      'Uptime and maintenance schedules for heavy equipment, flagging units nearing service intervals.',
    images: ['/Screenshot 2026-10-20 153419.png'],
    tags: ['Reports', 'Equipment', 'Maintenance'],
    group: 'reports',
  },
  {
    id: 'reports-007',
    title: 'Compliance Dashboard',
    description:
      'Regulatory checklist status across all active permits and licence conditions.',
    images: ['/Screenshot 2026-10-20 153443.png'],
    reportUrl: '/Report.pdf',
    tags: ['Reports', 'Compliance', 'Regulatory'],
    group: 'reports',
  },

  // ── Group D — Mobile Views ────────────────────────────────────────────────
  // No mobile screenshots yet — add ShowcaseItem entries here when available.
];

// ── Document-only items (PDF / PPTX) referenced in the Reports section ──────
export type ReportDoc = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'pptx';
};

export const reportDocs: ReportDoc[] = [
  {
    id: 'doc-001',
    title: 'MineConnect Full Report',
    description:
      'Comprehensive project report covering system architecture, feature set, and deployment outcomes.',
    fileUrl: '/Report.pdf',
    fileType: 'pdf',
  },
  {
    id: 'doc-002',
    title: 'MineConnect Presentation',
    description:
      'Slide deck used for stakeholder presentations, showcasing the full MineConnect feature roadmap.',
    fileUrl: '/MineConnect_Full_RED .pptx',
    fileType: 'pptx',
  },
];
