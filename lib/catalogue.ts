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
  /** Présentation de la fiche. Tirée de l'application elle-même. */
  resume: string;
  /** Ce que l'application contient réellement, relevé dans l'application. */
  contenu: readonly string[];
  /** Nombre de captures dans public/captures : <id>-1.jpg .. <id>-N.jpg */
  captures: number;
  collection: CollectionId;
  url: string;
  depot: string;
  color: string;
  tags: readonly string[];
}

// Catalogue explicite des pages publiques. Ne pas y importer automatiquement
// tous les dépôts d'un compte : certains projets peuvent être privés.
// Les résumés et les listes « contenu » sont relevés dans les applications
// elles-mêmes : rien n'y est inventé, et aucune note, aucun avis, aucun
// compteur de téléchargement n'est affiché nulle part.
export const APPLICATIONS: readonly Application[] = [
  {
    id: 'tms',
    title: 'Prévention des TMS',
    subtitle: 'Ergonomie au travail',
    description:
      'Comprendre les risques musculosquelettiques et les bons réflexes au travail en mine souterraine.',
    resume:
      'Ton corps est ton premier outil de travail. Cette base de connaissances explique où les troubles musculosquelettiques frappent, pourquoi le risque se cumule sous terre, et ce qui protège. On peut suivre la formation guidée, ou fouiller librement.',
    contenu: [
      'Formation guidée, ou exploration libre',
      'Les types de TMS et les zones du corps touchées',
      'Les facteurs de risque propres au travail sous terre',
      'Un niveau de risque indicatif à remplir soi-même',
      'Sommeil, hygiène de vie et bons réflexes',
      'Capsules vidéo',
    ],
    captures: 3,
    collection: 'prevention',
    url: 'https://frankyray21.github.io/TMS/',
    depot: 'https://github.com/Frankyray21/TMS',
    color: 'blue',
    tags: ['Ergonomie', 'Formation'],
  },
  {
    id: 'bruit',
    title: 'Bruit',
    subtitle: 'Protection auditive',
    description:
      'Explorer la protection auditive avec une formation interactive et des calculateurs d’exposition au bruit.',
    resume:
      'Le bon réflexe face au bruit : comprendre le risque, choisir sa protection, garder les bons gestes tout au long du quart. Une formation courte, faite pour être suivie sur le terrain.',
    contenu: [
      'Six modules, environ quinze minutes',
      'Quiz de validation',
      'Estimation de l’exposition d’un quart',
      'Outils de choix du protecteur',
      'Suivi de sa progression',
    ],
    captures: 3,
    collection: 'prevention',
    url: 'https://frankyray21.github.io/Bruit/',
    depot: 'https://github.com/Frankyray21/Bruit',
    color: 'red',
    tags: ['Audition', 'Calculateurs'],
  },
  {
    id: 'wiki',
    title: 'WIKI SST — Mines',
    subtitle: 'Les connaissances en SST',
    description:
      'Parcourir les connaissances en santé et sécurité minière selon son rôle et ses besoins.',
    resume:
      'L’encyclopédie santé et sécurité du travail en milieu minier. Des notes de cours réunies en un fonds documentaire consultable, classé par discipline, par thème et par notion.',
    contenu: [
      'Parcours par discipline, thème et notion',
      'Ergonomie, hygiène industrielle, sécurité, psychosocial',
      'Recueil des lois et règlements',
      'Espace encadrement',
      'Graphe des notions liées',
    ],
    captures: 3,
    collection: 'prevention',
    url: 'https://frankyray21.github.io/wiki-sst-mines/',
    depot: 'https://github.com/Frankyray21/wiki-sst-mines',
    color: 'navy',
    tags: ['Références', 'Prévention'],
  },
  {
    id: 'anatomie',
    title: 'Anatomie 3D',
    subtitle: 'Le corps humain, à explorer',
    description:
      'Explorer le corps humain en 3D et afficher séparément les os, muscles, nerfs et vaisseaux.',
    resume:
      'Un atlas anatomique en trois dimensions : tourner le corps, isoler une couche, ouvrir une structure. Les sources et les limites du modèle sont affichées dans l’application.',
    contenu: [
      'Atlas local et écorché 3D',
      'Couches : corps, os, muscles, réseaux',
      'Rotation, parcours guidé, recentrage',
      'Fiche par structure explorée',
      'Sources et limites affichées',
    ],
    captures: 1,
    collection: 'prevention',
    url: 'https://frankyray21.github.io/anatomie-3d-template/',
    depot: 'https://github.com/Frankyray21/anatomie-3d-template',
    color: 'violet',
    tags: ['3D', 'Découverte'],
  },
  {
    id: 'rodbot',
    title: 'RodBot LP',
    subtitle: 'Formation opérateur',
    description:
      'Formation à la manutention robotisée des tiges de forage, avec modules, quiz et simulateurs.',
    resume:
      'La formation à l’exploitation du système robotisé Borterra RodBot LP, fondée sur le manuel de l’opérateur OM 10667. Bilingue, faite pour la tablette, et pensée pour des opérateurs plutôt que pour des ingénieurs.',
    contenu: [
      'Huit étapes de formation',
      'Connaître la machine et travailler en sécurité',
      'Trouver les commandes, utiliser la télécommande',
      'Lire l’écran et les alarmes',
      'Démarrer, déplacer, manipuler les tiges',
      'Entretenir et dépanner',
      'Quiz par module, seuil de réussite de 70 %',
    ],
    captures: 3,
    collection: 'forage',
    url: 'https://frankyray21.github.io/RodBot/',
    depot: 'https://github.com/Frankyray21/RodBot',
    color: 'orange',
    tags: ['Équipement', 'Simulation'],
  },
  {
    id: 'procedures',
    title: 'Procédures de forage',
    subtitle: 'Les procédures MRI',
    description:
      'Consulter les procédures de travail MRI, leurs PDF et les quiz de validation.',
    resume:
      'Les procédures de travail de forage de Machines Roger International, avec leurs PDF officiels. Les fiches sont synchronisées avec la source officielle, et une fiche révisée porte un badge de mise à jour.',
    contenu: [
      'Sécurité du forage',
      'Procédures ITH et CUBEX',
      'Forage au diamant',
      'PDF officiels, consultables hors ligne',
      'Quiz de validation',
      'Badge « Mise à jour » sur les fiches révisées',
    ],
    captures: 2,
    collection: 'forage',
    url: 'https://frankyray21.github.io/Procedures-Forage-MRI/',
    depot: 'https://github.com/Frankyray21/Procedures-Forage-MRI',
    color: 'teal',
    tags: ['Procédures', 'Documents'],
  },
  {
    id: 'camping',
    title: 'Camping en tente',
    subtitle: 'Préparer le prochain départ',
    description:
      'Préparer le camping en famille avec une liste personnalisable, une progression et un export PDF.',
    resume:
      'La liste de camping en tente, l’été, avec les flos. Ce qu’on apporte, ce qui est déjà dans le coffre, et ce qu’on oublie chaque année. Coche, le feu va pogner.',
    contenu: [
      'Liste cochable, classée par catégorie',
      'Progression visible',
      'Articles personnalisables',
      'Export PDF',
    ],
    captures: 3,
    collection: 'quotidien',
    url: 'https://frankyray21.github.io/checklist-camping/',
    depot: 'https://github.com/Frankyray21/checklist-camping',
    color: 'green',
    tags: ['Plein air', 'Organisation'],
  },
  {
    id: 'glucides',
    title: 'GlucideNet',
    subtitle: 'Les repas, en chiffres',
    description:
      'Calculer les glucides nets des repas et gérer ses recettes, favoris et journal alimentaire.',
    resume:
      'Calculer les glucides nets d’un repas, pour le diabète de type 1 et la pompe à insuline. Scanner un produit, composer un repas, retrouver ses recettes, suivre la semaine.',
    contenu: [
      'Scanner un produit',
      'Base d’aliments courants',
      'Favoris et repas en cours',
      'Recettes et calcul par ingrédients',
      'Journal et graphiques des sept derniers jours',
      'Sauvegarde et partage',
    ],
    captures: 2,
    collection: 'quotidien',
    url: 'https://frankyray21.github.io/Calcul-glucide/',
    depot: 'https://github.com/Frankyray21/Calcul-glucide',
    color: 'purple',
    tags: ['Alimentation', 'Calculateur'],
  },
];

// Date de la dernière vérification manuelle des huit adresses publiques.
// Elle est affichée sur le site : la mettre à jour en même temps que les URL.
export const VERIFICATION_LIENS = '5 septembre 2026';

export interface MiseEnAvant {
  id: IconeId;
  raison: string;
}

// Mise en avant de la page « Aujourd'hui ». Chaque entrée dit une chose
// vérifiable dans l'application elle-même : aucune note, aucun classement,
// aucun compteur de téléchargement.
export const A_LA_UNE: readonly MiseEnAvant[] = [
  { id: 'rodbot', raison: 'Huit étapes, du pivot au grappin.' },
  { id: 'bruit', raison: 'Six modules, environ quinze minutes.' },
  { id: 'wiki', raison: 'L’encyclopédie SST du milieu minier.' },
];

export function application(id: string): Application | undefined {
  return APPLICATIONS.find((app) => app.id === id);
}

export function applicationsCollection(
  id: CollectionId,
): readonly Application[] {
  return APPLICATIONS.filter((application) => application.collection === id);
}

export function captures(app: Application): readonly string[] {
  return Array.from(
    { length: app.captures },
    (_, index) => `/captures/${app.id}-${index + 1}.jpg`,
  );
}
