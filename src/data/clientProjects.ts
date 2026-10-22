/**
 * Client Projects — factual fields only.
 * This is intentionally not a dummy-client catalog: only announced work appears.
 * When more clients are ready, append real records and update the section design.
 */
export const featuredClient = {
  id: 'sicko-soul',
  number: '001',
  name: 'SICKO SOUL',
  classification: 'CLIENT PROJECT / INDEPENDENT STREETWEAR',
  domain: 'sickosoul.shop',
  url: 'https://sickosoul.shop/',
  image: '/assets/client-projects/sicko-soul-showcase.webp',
  original: '/assets/client-projects/sicko-soul-original.png',
  tagline: 'A different kind of presence.',
  description: 'A bold digital storefront for a streetwear identity that refuses to blend into the background. The visual language is unapologetically dark, graphic, and expressive.',
  // Only brand/site characteristics visible in the user's screenshot are claimed.
  editorialNotes: [
    { label: 'THE CLIENT', value: 'Independent streetwear label' },
    { label: 'THE MEDIUM', value: 'Web experience' },
    { label: 'THE DIRECTION', value: 'Dark / graphic / editorial' },
  ],
} as const;
