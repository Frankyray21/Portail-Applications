# Product

## Register

brand

Le Hub tient les deux registres à parts égales, et c'est une contrainte de
conception, pas une indécision : la page est une **vitrine** pour qui découvre
la collection, et un **lanceur** pour qui revient. Le registre par défaut est
`brand` parce que la page n'a pas d'autre fonction que de présenter : il n'y a
ni compte, ni donnée, ni tâche à accomplir sur le portail lui-même. Mais le
chemin du visiteur qui revient (arriver, reconnaître, ouvrir) relève du
registre `product` et se juge à sa vitesse, pas à son allure.

## Users

Quatre publics, sans hiérarchie stricte (inféré du catalogue et des dépôts
liés — à corriger si ça ne correspond pas) :

- **Travailleurs de terrain** : mineurs, foreurs, opérateurs. Sur téléphone ou
  tablette, parfois sous terre, souvent avec des gants. Certains sont peu à
  l'aise en lecture. Ils arrivent avec un besoin précis (une procédure, un
  module de formation) et veulent l'ouvrir, pas explorer.
- **Collègues et gestionnaires SST** : préventeurs, superviseurs, formateurs.
  Sur ordinateur. Ils partagent le lien, cherchent la bonne ressource à
  transmettre, et jugent la crédibilité de ce qu'ils relaient.
- **Contacts professionnels et public** : employeurs, monde académique, gens
  qui découvrent le travail de Frank. Pour eux la page est une carte de visite.
- **Frank lui-même** : point d'entrée quotidien vers ses huit applications.

## Product Purpose

Rassembler en une adresse publique les applications de prévention, de formation
et d'outillage construites par Frank, et permettre de les reconnaître puis de
les ouvrir. Le portail ne copie ni les données ni les comptes des applications :
chacune garde son fonctionnement, ses données et son mode hors-ligne.

Réussite : un visiteur comprend en quelques secondes ce que contient la
collection et ouvre la bonne application ; un habitué atteint la sienne en un
geste, sur son téléphone, sans hésiter.

## Brand Personality

**Sobre, crédible, de terrain.** La page parle de santé et de sécurité au
travail : elle doit inspirer confiance avant de plaire. Le ton est direct et
personnel — c'est le travail d'une personne, pas le portail d'un service de
communication. Le français est simple, les phrases courtes, les descriptions
factuelles : elles disent ce que fait l'application, sans la vendre ni valider
son contenu médical, réglementaire ou technique.

Sobre ne veut pas dire timide. Une palette engagée, une hiérarchie typographique
franche et une mise en page assumée sont compatibles avec le calme ; le fade
et la moyenne ne le sont pas.

## Anti-references

- **Le clone d'App Store** (anti-référence principale, nommée par l'utilisateur).
  Le mobilier de magasin est à bannir : notes, avis, classements, compteurs de
  téléchargement, badges « nouveau », carrousels promotionnels, tuiles
  identiques à l'infini. La collection est un corpus de travail, pas un rayon.
  À surveiller aussi : la section « À la une », les fiches et les icônes
  arrondies colorées, qui sont aujourd'hui des emprunts directs.
- **Le site corporatif SST** : bleu-blanc générique, casques et poignées de
  main, vocabulaire de conformité.
- **Le gabarit d'admin SaaS** : sidebar + cartes + badges + statistiques, le
  tableau de bord qu'on voit partout.
- **La page décorative** : effets, dégradés et animations qui retardent l'accès
  aux applications.

## Design Principles

1. **Ouvrir, pas parcourir.** La page se juge à la vitesse à laquelle on
   atteint la bonne application. Tout élément qui ne sert ni à reconnaître ni à
   ouvrir doit se justifier.
2. **La crédibilité avant l'effet.** Le contenu lié engage la sécurité de
   gens réels. Rien d'inventé sur la page : aucune note, aucun chiffre, aucune
   promesse qui ne soit vérifiable.
3. **Une collection, pas un magasin.** Le portail montre un travail cohérent
   d'une seule main ; il n'imite pas la boutique d'applications.
4. **Lisible avec des gants.** Grandes cibles, contraste élevé, français
   simple, fonctionnement sans JavaScript : le mobile de terrain est le cas
   normal, pas le cas dégradé.
5. **Un auteur assumé.** « La collection de Frank » est le sujet de la page.
   La voix reste personnelle et directe.

## Accessibility & Inclusion

Cible **WCAG 2.2 AA** (inféré du code existant et des contraintes de terrain —
à confirmer) :

- Contraste AA sur tout le texte, y compris les libellés secondaires gris.
- Cibles tactiles d'au moins 44 px, pensées pour des mains gantées.
- Navigation entièrement au clavier, focus visible, lien d'évitement.
- Les liens sont des `<a>` natifs : le portail reste utilisable si JavaScript
  ne s'exécute pas.
- Français simple et phrases courtes, pour les lecteurs peu à l'aise.
- `prefers-reduced-motion` respecté par toute animation.
