export const COLLECTIONS = [
  {
    id: 'prevention',
    title: 'Prévention & découverte',
    description: 'Comprendre les risques. Développer les bons réflexes.',
    label: 'Prévention',
  },
  {
    id: 'forage',
    title: 'Forage & procédures',
    description: 'Les formations opérateur et les procédures de travail MRI.',
    label: 'Forage & procédures',
  },
  {
    id: 'quotidien',
    title: 'La vie pratique',
    description: 'Des outils utiles, aussi en dehors du travail.',
    label: 'Vie pratique',
  },
] as const;

export type CollectionId = (typeof COLLECTIONS)[number]['id'];
export type IconeId =
  | 'tms'
  | 'bruit'
  | 'rodbot'
  | 'procedures'
  | 'wiki'
  | 'anatomie'
  | 'camping'
  | 'glucides';
export interface Application {
  id: IconeId;
  title: string;
  subtitle: string;
  description: string;
  collection: CollectionId;
  url: string;
  color: string;
  tags: readonly string[];
}

// Catalogue explicite des pages publiques. Ne pas y importer automatiquement
// tous les dépôts d'un compte : certains projets peuvent être privés.
export const APPLICATIONS: readonly Application[] = [
  {
    id: 'tms',
    title: 'Prévention des TMS',
    subtitle: 'Ergonomie au travail',
    description:
      'Comprendre les risques musculosquelettiques et les bons réflexes au travail en mine souterraine.',
    collection: 'prevention',
    url: 'https://frankyray21.github.io/TMS/',
    color: 'blue',
    tags: ['Ergonomie', 'Formation'],
  },
  {
    id: 'bruit',
    title: 'Bruit',
    subtitle: 'Protection auditive',
    description:
      'Explorer la protection auditive avec une formation interactive et des calculateurs d’exposition au bruit.',
    collection: 'prevention',
    url: 'https://frankyray21.github.io/Bruit/',
    color: 'red',
    tags: ['Audition', 'Calculateurs'],
  },
  {
    id: 'wiki',
    title: 'WIKI SST — Mines',
    subtitle: 'Les connaissances en SST',
    description:
      'Parcourir les connaissances en santé et sécurité minière selon son rôle et ses besoins.',
    collection: 'prevention',
    url: 'https://frankyray21.github.io/wiki-sst-mines/',
    color: 'navy',
    tags: ['Références', 'Prévention'],
  },
  {
    id: 'anatomie',
    title: 'Anatomie 3D',
    subtitle: 'Le corps humain, à explorer',
    description:
      'Explorer le corps humain en 3D et afficher séparément les os, muscles, nerfs et vaisseaux.',
    collection: 'prevention',
    url: 'https://frankyray21.github.io/anatomie-3d-template/',
    color: 'violet',
    tags: ['3D', 'Découverte'],
  },
  {
    id: 'rodbot',
    title: 'RodBot LP',
    subtitle: 'Formation opérateur',
    description:
      'Formation à la manutention robotisée des tiges de forage, avec modules, quiz et simulateurs.',
    collection: 'forage',
    url: 'https://frankyray21.github.io/RodBot/',
    color: 'orange',
    tags: ['Équipement', 'Simulation'],
  },
  {
    id: 'procedures',
    title: 'Procédures de forage',
    subtitle: 'Les procédures MRI',
    description:
      'Consulter les procédures de travail MRI, leurs PDF et les quiz de validation.',
    collection: 'forage',
    url: 'https://frankyray21.github.io/Procedures-Forage-MRI/',
    color: 'teal',
    tags: ['Procédures', 'Documents'],
  },
  {
    id: 'camping',
    title: 'Camping en tente',
    subtitle: 'Préparer le prochain départ',
    description:
      'Préparer le camping en famille avec une liste personnalisable, une progression et un export PDF.',
    collection: 'quotidien',
    url: 'https://frankyray21.github.io/checklist-camping/',
    color: 'green',
    tags: ['Plein air', 'Organisation'],
  },
  {
    id: 'glucides',
    title: 'GlucideNet',
    subtitle: 'Les repas, en chiffres',
    description:
      'Calculer les glucides nets des repas et gérer ses recettes, favoris et journal alimentaire.',
    collection: 'quotidien',
    url: 'https://frankyray21.github.io/Calcul-glucide/',
    color: 'purple',
    tags: ['Alimentation', 'Calculateur'],
  },
];

export const SELECTION: readonly IconeId[] = ['tms', 'rodbot', 'bruit'];
export function applicationsCollection(
  id: CollectionId,
): readonly Application[] {
  return APPLICATIONS.filter((application) => application.collection === id);
}
