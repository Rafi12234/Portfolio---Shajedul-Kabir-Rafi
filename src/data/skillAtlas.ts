/** Public portfolio skill taxonomy; CV-sourced unless explicitly marked project-evidenced. */
export type SkillGroup = {
  id: string;
  short: string;
  title: string;
  subtitle: string;
  note: string;
  skills: string[];
  kind: 'cv';
};
export const skillGroups: SkillGroup[] = [
  { id: 'languages', short: 'LANGUAGES', title: 'Programming Languages', subtitle: 'The foundation of every build.', note: 'General-purpose and systems languages listed in my CV.', skills: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'PHP', 'Dart'], kind: 'cv' },
  { id: 'frontend', short: 'FRONTEND', title: 'Frontend Engineering', subtitle: 'Form, function, and precision.', note: 'Interfaces, responsive layouts and web product development.', skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Responsive Design'], kind: 'cv' },
  { id: 'backend', short: 'BACKEND', title: 'Backend & APIs', subtitle: 'The logic behind the experience.', note: 'Service implementation, authentication and application APIs.', skills: ['Laravel (PHP)', 'Node.js', 'REST API Design', 'JWT Authentication'], kind: 'cv' },
  { id: 'mobile', short: 'MOBILE', title: 'Mobile Development', subtitle: 'Built to move with people.', note: 'Cross-platform application development for Android and iOS.', skills: ['Flutter', 'Dart', 'Cross-platform Android & iOS'], kind: 'cv' },
  { id: 'intelligence', short: 'AI / ML', title: 'Applied AI & ML', subtitle: 'Learning from data and context.', note: 'Practical ML tools and foundational neural-network knowledge.', skills: ['scikit-learn', 'XGBoost', 'Pandas', 'NumPy', 'CNNs — foundational', 'RNNs — foundational', 'OSM-based Geospatial ML'], kind: 'cv' },
  { id: 'devops', short: 'DEVOPS', title: 'Development Operations', subtitle: 'From local build to reliable delivery.', note: 'Source control, containers and automated delivery workflows.', skills: ['Docker', 'CI/CD Pipelines', 'Git', 'GitHub Actions'], kind: 'cv' },
  { id: 'databases', short: 'DATA', title: 'Databases', subtitle: 'Structure makes everything possible.', note: 'Relational data modeling and database-backed applications.', skills: ['MySQL', 'Microsoft SQL Server'], kind: 'cv' },
  { id: 'design', short: 'DESIGN', title: 'Design & Prototyping', subtitle: 'Clarity before complexity.', note: 'Design-to-development thinking across interfaces and systems.', skills: ['Figma', 'Wireframing', 'UI/UX Prototyping', 'Design Systems'], kind: 'cv' },
  { id: 'collaboration', short: 'PEOPLE', title: 'Collaboration & Leadership', subtitle: 'Building well, together.', note: 'Working practices developed in engineering teams and leadership roles.', skills: ['Team Leadership', 'Project Coordination', 'Analytical Thinking', 'Adaptability', 'Critical Thinking'], kind: 'cv' },
];

/** These appear in project documentation, not as unqualified personal mastery claims. */
export const projectLevelTools = [
  'FastAPI', 'Leaflet', 'OSMnx', 'NetworkX', 'Firebase',
  'Express', 'PostgreSQL / Neon', 'GSAP', 'Lenis',
  'Prisma', 'OGL', 'ASP.NET Core / C#', 'ML.NET', 'OpenCLIP / LanceDB',
] as const;
