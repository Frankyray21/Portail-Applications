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
] as const;

export type CollectionId = (typeof COLLECTIONS)[number]['id'];
export type IconeId =
  | 'tms'
  | 'bruit'
  | 'rodbot'
  | 'procedures'
  | 'wiki';

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
  /**
   * Vrai quand l'application a son propre logo, repris dans
   * public/logos/<id>.png. Sinon, la plaque colorée sert de repère.
   */
  logo: boolean;
  /**
   * Vrai quand l'application s'installe sur l'écran d'accueil : manifeste
   * lié, `display: standalone`, icônes 192/512/masquable et service worker.
   * Relevé dans l'application publiée, jamais supposé — une application sans
   * tout cela ne s'installe pas, et le portail ne doit pas le promettre.
   * Les cinq ont été vérifiées sur leur branche publiée le 21 septembre 2026.
   */
  installable: boolean;
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
        logo: true,
        installable: true,
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
        logo: true,
        installable: true,
collection: 'prevention',
    url: 'https://frankyray21.github.io/Bruit/',
    depot: 'https://github.com/Frankyray21/Bruit',
    color: 'red',
    tags: ['Audition', 'Calculateurs'],
  },
  {
    id: 'wiki',
    // Espace insécable avant le tiret : il ne doit jamais commencer une ligne.
    title: 'WIKI SST\u00a0— Mines',
    subtitle: 'Les connaissances en SST',
    description:
      'Parcourir les connaissances en santé et sécurité minière selon son rôle et ses besoins.',
    resume:
      'L’encyclopédie santé et sécurité du travail en milieu minier. Des notes de cours réunies en un fonds documentaire consultable, classé par discipline, par thème et par notion.',
    contenu: [
      'Sept disciplines, du psychosocial au recueil législatif',
      'Parcours par discipline, par thème et par notion',
      'Recherche sur l’ensemble du fonds',
      'Graphe des notions liées',
      'Espace encadrement',
    ],
    captures: 3,
        logo: true,
        installable: true,
collection: 'prevention',
    url: 'https://frankyray21.github.io/wiki-sst-mines/',
    depot: 'https://github.com/Frankyray21/wiki-sst-mines',
    color: 'navy',
    tags: ['Références', 'Prévention'],
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
        logo: true,
        installable: true,
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
        logo: true,
        installable: true,
collection: 'forage',
    url: 'https://frankyray21.github.io/Procedures-Forage-MRI/',
    depot: 'https://github.com/Frankyray21/Procedures-Forage-MRI',
    color: 'teal',
    tags: ['Procédures', 'Documents'],
  },
];

// Date de la dernière vérification manuelle des six adresses publiques.
// Elle est affichée sur le site : la mettre à jour en même temps que les URL.
export const VERIFICATION_LIENS = '5 septembre 2026';

export interface SujetWiki {
  id: string;
  titre: string;
  exemples: string;
  articles: number;
  chemin: string;
}

// Les sept disciplines du WIKI SST — Mines, relevées sur son propre portail
// (docs/index.html du dépôt wiki-sst-mines), avec les nombres d'articles que
// le wiki affiche lui-même. Pour les rafraîchir, les y relire : ne jamais
// les estimer, et ne jamais en ajouter une qui n'existe pas dans le wiki.
export const SUJETS_WIKI: readonly SujetWiki[] = [
  {
    id: 'psychosocial',
    titre: 'SST psychosociale',
    exemples: 'RPS, Karasek, Siegrist, détresse, FIFO, reconnaissance',
    articles: 320,
    chemin: 'w/psychosocial/index.html',
  },
  {
    id: 'legislation',
    titre: 'Recueil législatif',
    exemples: 'Lois, règlements, article par article, jurisprudence',
    articles: 3327,
    chemin: 'w/legislation/00-accueil/00-accueil.html',
  },
  {
    id: 'ergonomie',
    titre: 'Ergonomie',
    exemples: 'TMS, manutention, postures, vibrations, confort thermique',
    articles: 66,
    chemin: 'w/ergonomie/index.html',
  },
  {
    id: 'hygiene',
    titre: 'Hygiène industrielle',
    exemples: 'Bruit, poussières, diesel, ventilation, chaleur',
    articles: 72,
    chemin: 'w/hygiene/index.html',
  },
  {
    id: 'securite',
    titre: 'Sécurité industrielle',
    exemples: 'Cadenassage, espaces clos, hauteur, explosifs, machines',
    articles: 66,
    chemin: 'w/securite/index.html',
  },
  {
    id: 'toxicologie',
    titre: 'Toxicologie',
    exemples: 'Solvants, métaux, amiante, silice, voies d’exposition',
    articles: 50,
    chemin: 'w/toxicologie/index.html',
  },
  {
    id: 'droit-travail',
    titre: 'Droit du travail',
    exemples: 'Cadre légal, droits du travailleur, LSST, LATMP, LMRSST',
    articles: 39,
    chemin: 'w/droit-travail/index.html',
  },
];

export function application(id: string): Application | undefined {
  return APPLICATIONS.find((app) => app.id === id);
}

// Chaque sujet mène droit dans le wiki : l'adresse est construite à partir
// de celle de l'application, jamais écrite en double.
export function sujetsWiki(): readonly (SujetWiki & { url: string })[] {
  const wiki = application('wiki');
  if (!wiki) return [];
  return SUJETS_WIKI.map((sujet) => ({
    ...sujet,
    url: new URL(sujet.chemin, wiki.url).toString(),
  }));
}

// Espace insécable tous les trois chiffres, sans dépendre d'ICU au build.
export function nombre(valeur: number): string {
  return valeur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}

export function pagesWiki(): number {
  return SUJETS_WIKI.reduce((total, sujet) => total + sujet.articles, 0);
}

export function applicationsCollection(
  id: CollectionId,
): readonly Application[] {
  return APPLICATIONS.filter((application) => application.collection === id);
}

export function logo(app: Application): string | null {
  return app.logo ? `/logos/${app.id}.png` : null;
}

export function captures(app: Application): readonly string[] {
  return Array.from(
    { length: app.captures },
    (_, index) => `/captures/${app.id}-${index + 1}.jpg`,
  );
}
