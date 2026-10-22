/**
 * Publication-integrity ledger. User-reported conference statuses are distinguished
 * from formal IEEE Xplore / DOI indexing (not independently verified).
 * Update metadata only when documentary evidence becomes available.
 */
export type ResearchLink = { label: string; url: string; note: string };
export type ResearchRecord = {
  id: string;
  title: string;
  shortTitle: string;
  domain: string;
  venue: string;
  year: string;
  status: string;
  statusKind: 'accepted' | 'submitted' | 'proposal' | 'ongoing';
  statusDetail: string;
  abstract: string;
  authors?: string;
  tags: string[];
  cover: string;
  accent: string;
  index: string;
  links: ResearchLink[];
};

export const researchRecords: ResearchRecord[] = [
  {
    id: 'banglafakemmd', index: '01',
    title: 'BanglaFakeMMD: Multimodal Bangla Fake News Detection via Cross-Modal Attention Fusion of XLM-RoBERTa-large and EfficientNet-B4',
    shortTitle: 'BANGLAFAKEMMD', domain: 'MULTIMODAL INTELLIGENCE',
    venue: '5th IEEE International Conference on Signal Processing, Information, Communication and Systems · SPICSCON 2026',
    year: '2026', status: 'ACCEPTED & PRESENTED', statusKind: 'accepted',
    statusDetail: 'Accepted and presented at SPICSCON 2026 (user-reported). Proceedings / DOI / IEEE Xplore listing not independently verified.',
    abstract: 'Multimodal Bangla fake-news detection combining the language understanding of XLM-RoBERTa-large with EfficientNet-B4 visual representations through cross-modal attention fusion.',
    tags: ['Bangla NLP', 'Cross-modal attention', 'XLM-RoBERTa-large', 'EfficientNet-B4'],
    cover: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_740/v1792672548/banglafakemmd.webp', accent: '#dfaa8d',
    links: [{ label: 'OPEN SHARED MANUSCRIPT', url: 'https://drive.google.com/file/d/1kwzyEwQjW0WG4r5shDFAykn5WZqErbsJ/view?usp=drive_link', note: 'Previously shared Google Drive manuscript; not a publisher DOI.' }],
  },
  {
    id: 'visual-inattention', index: '02',
    title: 'Visual Inattention Profiling: Coupling YOLO Object Localization with Real-Time Text-OCR for In-Cabin Driver Monitoring',
    shortTitle: 'VISUAL INATTENTION', domain: 'COMPUTER VISION',
    venue: '2026 IEEE International Conference on Computing · IEEE ICOCO 2026',
    year: '2026', status: 'ACCEPTED FOR PRESENTATION', statusKind: 'accepted',
    statusDetail: 'Accepted for presentation at IEEE ICOCO 2026. No public paper URL / DOI supplied.',
    abstract: 'Investigates in-cabin driver monitoring by coupling YOLO object localization with real-time OCR signals to profile visual inattention and support safety-oriented computer vision research.',
    tags: ['YOLO', 'OCR', 'Driver monitoring', 'Visual attention'],
    cover: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_740/v1792672545/driver-vision.webp', accent: '#edbb92',
    links: [],
  },
  {
    id: 'ca-dac', index: '03',
    title: 'CA-DAC: An AI-Augmented and Constraint-Aware Zero Trust Framework for Regulated Enterprises in Bangladesh',
    shortTitle: 'CA–DAC / ZERO TRUST', domain: 'INTELLIGENT SECURITY',
    venue: '2026 IEEE International Women in Engineering Conference on Electrical and Computer Engineering · WIECON-ECE 2026',
    year: '2026', status: 'ACCEPTED · eCF COMPLETED', statusKind: 'accepted',
    statusDetail: 'Accepted paper; IEEE Electronic Publication Agreement was completed. This does not, by itself, verify proceedings release or IEEE Xplore indexing.',
    abstract: 'Explores an AI-augmented, constraint-aware Zero Trust security framework tailored to the access-control and regulatory requirements of enterprises in Bangladesh.',
    authors: 'Rafiul Awal · Nazmul Huda Setu · Humira Bentay Mahmud · Shajedul Kabir Rafi · Samanta Islam · Syed Mohammed Sazid Ullah',
    tags: ['Zero Trust', 'AI security', 'Enterprise policy', 'Regulated sectors'],
    cover: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_740/v1792672554/zero-trust.webp', accent: '#c99195',
    links: [],
  },
  {
    id: 'wie-submitted', index: '04',
    title: 'Additional IEEE WIECON-ECE Research Manuscript',
    shortTitle: 'FURTHER INQUIRY', domain: 'CONFERENCE SUBMISSION',
    venue: 'IEEE WIECON-ECE 2026 · additional manuscript',
    year: '2026', status: 'SUBMITTED · DECISION UNCONFIRMED', statusKind: 'submitted',
    statusDetail: 'A separate WIECON-ECE submission was previously reported. Its title, current decision and corresponding shared document have not yet been matched.',
    abstract: 'A distinct conference research submission. The title and research abstract are intentionally omitted until its document and current status have been confirmed, rather than presenting invented scholarship.',
    tags: ['Conference submission', 'Peer review', 'Manuscript'],
    cover: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_740/v1792672549/submission.webp', accent: '#c8a5a9',
    links: [],
  },
  {
    id: 'asrg', index: '05',
    title: 'Hybrid Deep Learning Framework for Regional-Level Spatial Prediction of Child Malnutrition in Bangladesh Using Satellite Imagery, Climate Data, and Socioeconomic Indicators',
    shortTitle: 'SPATIAL INTELLIGENCE', domain: 'GEOSPATIAL HEALTH AI',
    venue: 'AUST Student Research Grant · ASRG Second Round',
    year: '2026', status: 'PROPOSAL SUBMITTED', statusKind: 'proposal',
    statusDetail: 'Proposal submitted. Funding approval or grant award has not been established.',
    abstract: 'A proposed hybrid deep learning framework to estimate regional child malnutrition patterns in Bangladesh by integrating satellite imagery, climate variables and socioeconomic indicators.',
    tags: ['Geospatial AI', 'Satellite imagery', 'Deep learning', 'Public health'],
    cover: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_740/v1792672544/geospatial.webp', accent: '#d29d67',
    links: [{ label: 'OPEN SHARED PROPOSAL', url: 'https://drive.google.com/file/d/1jM663W9Iw3b-O7uqKJactpXzvsU24ri4/view?usp=sharing', note: 'Previously shared Drive proposal; public-access permission should be checked.' }],
  },
  {
    id: 'histopathology', index: '06',
    title: 'Breast Cancer Detection and Classification Using Histopathological Images',
    shortTitle: 'CELLULAR PATTERNS', domain: 'MEDICAL IMAGE ANALYSIS',
    venue: 'Ongoing collaborative research · Dibyo Fabian Dofadar',
    year: 'ONGOING', status: 'RESEARCH IN PROGRESS', statusKind: 'ongoing',
    statusDetail: 'Active research, not submitted or published. Research metrics or clinical outcomes are not claimed.',
    abstract: 'Ongoing investigation into deep learning methods for detection and classification of breast cancer from histopathological imagery, focusing on the potential of computer-assisted visual analysis.',
    tags: ['Histopathology', 'Medical imaging', 'Computer vision', 'Deep learning'],
    cover: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_740/v1792672544/histopathology.webp', accent: '#b6a8c6',
    links: [{ label: 'RESEARCH COLLABORATOR', url: 'https://www.linkedin.com/in/fabian-dibyo', note: 'Public professional profile for collaborator Dibyo Fabian Dofadar.' }],
  },
];

/** The two historical WIE Drive links have not been matched to paper titles.
 * Display separately, not as a verified link for either CA-DAC or the remaining submission.
 */
export const unmatchedManuscripts: ResearchLink[] = [
  { label: 'WIE MANUSCRIPT LINK A', url: 'https://drive.google.com/file/d/1CMopLEtAT1DIZlOL0L0zL1Dt_0bXg3gE/view?usp=drive_link', note: 'Paper-to-link mapping not confirmed.' },
  { label: 'WIE MANUSCRIPT LINK B', url: 'https://drive.google.com/file/d/1IyTKJwnaQSrc3obyW2nuOobksH5Yku0G/view?usp=drive_link', note: 'Paper-to-link mapping not confirmed.' },
];
