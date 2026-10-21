/**
 * Experience content is kept separate from presentation and animation.
 * Facts below are drawn from Rafi's CV and supplied project descriptions.
 * Planned Boraq AI features are deliberately not marked as shipped.
 */
export type ExperienceOrganization = {
  id: 'datapulse' | 'boraq' | 'robotics';
  name: string;
  short: string;
  eyebrow: string;
  role: string;
  arrangement: string;
  dates: string;
  location: string;
  introduction: string;
  background: string;
  accent: string;
  projects: { name: string; note: string; label?: string }[];
  progression?: { position: string; period: string }[];
};

export const experienceOrganizations: ExperienceOrganization[] = [
  {
    id: 'datapulse',
    name: 'DataPulse Global',
    short: 'DATAPULSE',
    eyebrow: '01 / PROFESSIONAL EXPERIENCE',
    role: 'Junior Software Engineer',
    arrangement: 'ON-SITE',
    dates: 'JUN 2026 — PRESENT',
    location: 'DHAKA, BANGLADESH',
    introduction: 'Designing and delivering software that turns complex business operations into clear, reliable digital workflows.',
    background: '/assets/experience/datapulse.webp',
    accent: '#F36A35',
    projects: [
      { name: 'Make My Event', note: 'Office Management System' },
      { name: 'Elite Convention Hall', note: 'Booking Management System' },
      { name: 'CV Standardizer', note: 'Document & CV processing workflows' },
    ],
  },
  {
    id: 'boraq',
    name: 'Boraq',
    short: 'BORAQ',
    eyebrow: '02 / STARTUP EXPERIENCE',
    role: 'Full Stack Developer',
    arrangement: 'REMOTE',
    dates: 'JUN 2026 — PRESENT',
    location: 'REMOTE STARTUP TEAM',
    introduction: 'Building collaborative products around smarter meetings, structured data collection, and practical AI-powered workflows.',
    background: '/assets/experience/boraq.webp',
    accent: '#42DED1',
    projects: [
      { name: 'Boraq Gather', note: 'Meeting platform; AI transcription and summaries planned', label: 'IN DEVELOPMENT' },
      { name: 'Boraq Collect', note: 'Dynamic form-building module; AI integration pending', label: 'IN DEVELOPMENT' },
    ],
  },
  {
    id: 'robotics',
    name: 'AUST Robotics Club',
    short: 'AUST ROBOTICS',
    eyebrow: '03 / LEADERSHIP & ENGINEERING',
    role: 'Director, Web & App Development',
    arrangement: 'UNIVERSITY LEADERSHIP',
    dates: 'JUL 2026 — PRESENT',
    location: 'AUST · DHAKA, BANGLADESH',
    introduction: 'From individual contribution to engineering leadership — shaping the club’s digital products, technical direction, and developer community.',
    background: '/assets/experience/robotics.webp',
    accent: '#69E49C',
    projects: [
      { name: 'AUST Robotics Club Website', note: 'Official website', label: 'TOP CONTRIBUTOR' },
      { name: 'Official Mobile Application', note: 'Independently delivered Flutter app', label: 'SOLE DEVELOPER' },
      { name: 'Robomania 2.0', note: 'Competition event website', label: 'TOP CONTRIBUTOR' },
      { name: 'Club Management System', note: 'Internal management platform', label: 'IN DEVELOPMENT' },
    ],
    progression: [
      { position: 'Sub-Executive', period: 'JAN — AUG 2025' },
      { position: 'Senior Sub-Executive', period: 'AUG 2025 — JAN 2026' },
      { position: 'Assistant Director', period: 'JAN — JUL 2026' },
      { position: 'Director', period: 'JUL 2026 — PRESENT' },
    ],
  },
];
