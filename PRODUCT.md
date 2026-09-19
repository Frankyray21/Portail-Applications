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
- **Frank lui-même** : point d'entrée quotidien vers ses six applications.

## Product Purpose

Rassembler en une adresse publique les applications de prévention, de formation
et d'outillage construites par Frank, et permettre de les reconnaître puis de
les ouvrir. Le portail ne copie ni les données ni les comptes des applications :
chacune garde son fonctionnement, ses données et son mode hors-ligne.

Chaque application a sa fiche : présentation, contenu réel, captures d'écran
prises dans l'application elle-même, et un bouton pour l'ouvrir. La liste mène
à la fiche ; c'est la fiche qui ouvre l'application.

Réussite : un visiteur comprend ce que fait une application avant de l'ouvrir,
et un habitué atteint la sienne en deux gestes, sur son téléphone.

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

**Décision du 19 septembre 2026 : le format App Store est assumé.** La
version 1.1 le fuyait ; l'utilisateur a demandé l'inverse, explicitement et
après qu'on lui ait rappelé la contradiction. Le portail est donc une boutique :
onglets Aujourd'hui / Applications / Rechercher, fiche par application,
captures d'écran, bouton « Ouvrir ». Ce document enregistre ce choix.

Ce qui reste interdit, et qui ne se négocie pas :

- **La popularité fabriquée.** Aucune note, aucune étoile, aucun avis, aucun
  compteur de téléchargement, aucun classement, aucun badge « nouveau » ou
  « tendance ». Rien de tout cela n'existe : l'afficher serait inventer. Un
  test du catalogue et le validateur d'export le vérifient à chaque
  construction.
- **Le contenu inventé sur une fiche.** Les présentations et les listes
  « ce que ça contient » sont relevées dans les applications elles-mêmes. Les
  captures sont de vraies captures, prises en faisant tourner chaque
  application, jamais des images d'illustration.
- **Le site corporatif SST** : bleu-blanc générique, casques et poignées de
  main, vocabulaire de conformité.
- **La page décorative** : effets et animations qui retardent l'accès aux
  applications.

## Design Principles

1. **Faire connaître, puis ouvrir.** Le parcours compte deux temps : la liste
   fait reconnaître, la fiche fait comprendre, et l'ouverture se fait depuis la
   fiche. Tout élément qui ne sert ni à reconnaître, ni à comprendre, ni à
   ouvrir doit se justifier.
2. **La crédibilité avant l'effet.** Le contenu lié engage la sécurité de
   gens réels. Rien d'inventé sur la page : aucune note, aucun chiffre, aucune
   promesse qui ne soit vérifiable.
3. **Un magasin qui ne ment pas.** Le portail emprunte la forme d'une boutique
   d'applications, mais aucune de ses métriques : ce qu'il affiche est
   vérifiable dans l'application liée, ou n'est pas affiché.
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
