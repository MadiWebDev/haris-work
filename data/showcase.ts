// data/showcase.ts
export type ShowcaseGroup = 'admin' | 'reports';

export type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  images: string[];
  reportUrl?: string;
  tags: string[];
  group: ShowcaseGroup;
};

export type GroupMeta = {
  label: string;
  letter: string;
  accent: string;
  intro: string;
};

export const GROUP_META: Record<ShowcaseGroup, GroupMeta> = {
  admin: {
    label: 'CO OP Trainings',
    letter: 'A',
    accent: '#06b6d4',
    intro: 'Administrative tools for managing users, permissions, and operational data across the platform.',
  },
  reports: {
    label: 'Reports & Documents',
    letter: 'B',
    accent: '#10b981',
    intro: 'Data visualisations, generated reports, and downloadable documents produced by the system.',
  },
};

export const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=';

export const showcaseItems: ShowcaseItem[] = [
  { id: 'admin-001', title: 'Events Edit', description: 'Create, edit, and deactivate events with role-based access controls.', images: ['/Screenshot 2026-10-20 150319.png'], tags: ['Edit', 'RBAC'], group: 'admin' },
  { id: 'admin-002', title: 'Website Dashboard Edit', description: 'Fine-grained permission settings per module.', images: ['/Screenshot 2026-10-20 150523.png'], tags: ['Admin', 'Permissions', 'Security'], group: 'admin' },
  { id: 'admin-003', title: 'Newsletter Edit', description: 'Create, edit, and deactivate news with role-based access controls.', images: ['/Screenshot 2026-10-20 150549.png'], tags: ['Admin', 'Operations', 'Scheduling'], group: 'admin' },
  { id: 'admin-004', title: 'Adding E-News Article', description: '', images: ['/Screenshot 2026-10-20 150607.png'], tags: ['Admin', 'Forms', 'Data Entry'], group: 'admin' },
  { id: 'admin-005', title: 'Exploring Yapla', description: 'Live status board for member list.', images: ['/Screenshot 2026-10-20 150647.png'], tags: ['Admin', 'Testing', 'Tracking'], group: 'admin' },
  { id: 'admin-006', title: 'Yapla Notified', description: 'Record of all administrative actions with timestamp and affected entity.', images: ['/Screenshot 2026-10-20 150727.png'], tags: ['Admin', 'Notifications', 'Training'], group: 'admin' },
  { id: 'admin-007', title: 'Canva', description: 'Events banner, Logo, and E-News.', images: ['/Screenshot 2026-10-20 150856.png'], tags: ['Admin', 'Design', 'Configuration'], group: 'admin' },
  { id: 'reports-001', title: 'Yapla Login', description: 'Login password given by the company.', images: ['/Screenshot 2026-10-20 153147.png'], tags: ['Reports', 'Access', 'Trainings'], group: 'reports' },
  { id: 'reports-002', title: 'Canva Edits', description: '', images: ['/Screenshot 2026-10-20 153229.png'], tags: ['Reports', 'Design'], group: 'reports' },
  { id: 'reports-003', title: 'Yapla MineConnect', description: '', images: ['/Screenshot 2026-10-20 153349.png'], tags: ['Reports', 'Platform'], group: 'reports' },
  { id: 'reports-004', title: 'Yapla Details', description: '', images: ['/Screenshot 2026-10-20 153419.png'], tags: ['Reports', 'Details'], group: 'reports' },
  { id: 'reports-005', title: 'Yapla Settings', description: '', images: ['/Screenshot 2026-10-20 153443.png'], reportUrl: '/Report.pdf', tags: ['Reports', 'Settings'], group: 'reports' },
];

export type ReportDoc = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'pptx';
};

export const reportDocs: ReportDoc[] = [
  { id: 'doc-001', title: 'MineConnect Full Report', description: 'Comprehensive project report covering system architecture, feature set, and deployment outcomes.', fileUrl: '/Report.pdf', fileType: 'pdf' },
  { id: 'doc-002', title: 'MineConnect Presentation', description: 'Slide deck used for stakeholder presentations.', fileUrl: '/MineConnect_Full_RED.pptx', fileType: 'pptx' },
];
