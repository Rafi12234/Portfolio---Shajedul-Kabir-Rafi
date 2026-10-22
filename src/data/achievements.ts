/**
 * CV-sourced recognition plus the three user-provided evidence photographs.
 * All award dates and claims are editable here, separate from animation code.
 */
export type Achievement = {
  id: string;
  number: string;
  level: string;
  award: string;
  displayLines: [string, string];
  subtitle: string;
  issuer: string;
  date: string;
  spotlight: string;
  detail: string;
  context: string;
  photo: string;
  proof: string;
  photoAlt: string;
  photoWidth: number;
  photoHeight: number;
  externalUrl: string;
  note: string;
};

export const achievements: Achievement[] = [
  {
    id: 'best-panel',
    number: '01',
    level: 'EXCELLENCE IN SERVICE',
    award: 'Best Panel Member',
    displayLines: ['BEST PANEL', 'MEMBER.'],
    subtitle: 'Web & App Development Team · Fall 2024 Panel',
    issuer: 'AUST Robotics Club',
    date: 'JAN 2026',
    spotlight: 'An individual recognition for sustained contributions to the AUST Robotics Club digital ecosystem.',
    detail: 'Recognized as Best Panel Member for the Fall 2024 panel of the Web Development Team, reflecting ongoing work on the club’s official website and mobile application.',
    context: 'A recognition of consistent engineering contributions and commitment to the club’s web and mobile platforms.',
    photo: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_1050/v1792672565/best-panel-member.webp',
    proof: 'https://res.cloudinary.com/wujcxa24/image/upload/v1792672611/best-panel-member-proof.png',
    photoAlt: 'Best Panel Member Fall 24 award held in front of Ahsanullah University of Science and Technology',
    photoWidth: 800,
    photoHeight: 1066,
    externalUrl: 'https://www.facebook.com/photo.php?fbid=937959975462651&set=pb.100077459707969.-2207520000&type=3',
    note: 'Award photograph and linked original announcement',
  },
  {
    id: 'hackathon',
    number: '02',
    level: 'COMPETITION / FIRST PLACE',
    award: 'Hackathon Champion',
    displayLines: ['HACKATHON', 'CHAMPION.'],
    subtitle: 'AUST CSE Carnival 7.0 · Team NULL',
    issuer: 'AUST CSE Carnival 7.0',
    date: 'APR 2026',
    spotlight: 'Champions at AUST CSE Carnival 7.0—a team accomplishment recognized on the university stage.',
    detail: 'Secured Champion (1st place) in the AUST CSE Carnival 7.0 Hackathon as part of Team NULL, associated with the GoliTransit urban mobility project documented in the CV.',
    context: 'A collaborative competition win. The trophy and photograph recognize Team NULL rather than a solo entry.',
    photo: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_1050/v1792672565/hackathon-champion.webp',
    proof: 'https://res.cloudinary.com/wujcxa24/image/upload/v1792672637/hackathon-champion-proof.png',
    photoAlt: 'Three members of Team NULL displaying Champion Hackathon trophies in front of an AUST CSE Carnival 7.0 backdrop',
    photoWidth: 1880,
    photoHeight: 1576,
    externalUrl: 'https://www.facebook.com/photo.php?fbid=1024854220106559&set=pb.100077459707969.-2207520000&type=3',
    note: 'Team NULL · Champion announcement photograph',
  },
  {
    id: 'symposium',
    number: '03',
    level: 'RESEARCH / SECOND PLACE',
    award: 'Research Symposium — 1st Runner-Up',
    displayLines: ['RESEARCH', 'RUNNER-UP.'],
    subtitle: 'Research Symposium 1.0 · Team Respire',
    issuer: 'IEOM Society, AUST Student Chapter',
    date: 'MAR 2025',
    spotlight: 'First Runner-Up at Research Symposium 1.0—recognition for a student research proposal presented as part of Team Respire.',
    detail: 'Achieved 1st Runner-Up at Research Symposium 1.0, organized by the IEOM Society AUST Student Chapter. The event photograph identifies the group as Team Respire.',
    context: 'A research-focused team achievement. The exact proposal title is not reproduced until confirmed against the original CV or event record.',
    photo: 'https://res.cloudinary.com/wujcxa24/image/upload/f_auto,q_auto:good,c_limit,w_1050/v1792672566/research-symposium.webp',
    proof: 'https://res.cloudinary.com/wujcxa24/image/upload/v1792672607/research-symposium-proof.png',
    photoAlt: 'Team Respire participants holding certificates and medals beneath a Research Symposium 1.0 1st Runner-Up banner',
    photoWidth: 1080,
    photoHeight: 800,
    externalUrl: 'https://www.facebook.com/photo.php?fbid=692857889972862&set=pb.100077459707969.-2207520000&type=3',
    note: 'Team Respire · Research Symposium 1.0',
  },
];
