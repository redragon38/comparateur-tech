export const PARTNERS = [
  {
    id: 'tekno-junk-partenaire',
    slug: 'tekno-junk',
    detailUrl: '/partenaires/tekno-junk',
    name: 'Tekno Junk',
    logo: '/partners/tekno-junk.svg',
    channelUrl: 'https://www.youtube.com/channel/UC0aJNOAdTJa7-BKmGCImWuw',
    videoUrl: 'https://www.youtube.com/watch?v=MUKzFpwnYFQ',
    embedUrl: 'https://www.youtube.com/embed/MUKzFpwnYFQ',
    videoId: 'MUKzFpwnYFQ',
    label: 'Créateur tech partenaire',
    badge: 'Partenaire YouTube',
    status: 'Partenaire vérifié',
    category: 'Créateur tech',
    description: 'Chaîne YouTube tech dédiée à la vulgarisation de l’IA, du PC, des systèmes et de la cybersécurité.',
    longDescription:
      'Tekno Junk est un partenaire média orienté technologie. Sa chaîne YouTube met en avant des contenus accessibles autour de l’intelligence artificielle, du matériel PC, des systèmes, des usages numériques et de la cybersécurité.',
    videoLabel: 'Vidéo mise en avant',
    videoTitle: 'Vidéo Tekno Junk sélectionnée par Comparateur-Tech',
    strengths: ['Vulgarisation tech', 'IA & PC', 'Format vidéo'],
    highlights: [
      'Contenu vidéo pensé pour comprendre rapidement un sujet tech.',
      'Angle pédagogique adapté aux utilisateurs qui veulent aller droit au concret.',
      'Thématiques cohérentes avec les univers Comparateur-Tech : IA, PC, systèmes et sécurité.',
    ],
    topics: ['Intelligence artificielle', 'PC & matériel', 'Systèmes', 'Cybersécurité', 'Culture tech'],
    idealFor: ['Débutants tech', 'Curieux IA', 'Utilisateurs PC', 'Créateurs de contenu'],
    editorialVerdict:
      'Un partenaire pertinent pour compléter les comparatifs écrits avec un format vidéo plus direct, utile pour découvrir un sujet ou approfondir un outil avant de passer à l’action.',
    quickFacts: [
      { label: 'Type', value: 'Chaîne YouTube' },
      { label: 'Format', value: 'Vidéo tech' },
      { label: 'Statut', value: 'Partenaire' },
      { label: 'Accès', value: 'Gratuit sur YouTube' },
    ],
  },
];

export function getPartnerBySlug(slug) {
  return PARTNERS.find((partner) => partner.slug === slug) || null;
}
