# Rapport de refonte SEO - Comparateur-Tech

Date: 2026-07-19

## Score estime

- Avant: 68 / 100
- Apres: 84 / 100

Ce score est une estimation technique fondee sur le code local: qualite des meta, indexabilite, schemas, maillage, profondeur de contenu et risque de duplication. Il ne remplace pas les donnees Search Console.

## Erreurs critiques corrigees

- Canonicals et sitemap pointaient vers des URLs `/fr` et `/en`, mais `next.config.js` redirigeait ces prefixes vers des URLs sans locale. Les redirections conflictuelles ont ete supprimees.
- Les pages programmatiques `/alternatives/[slug]` et `/comparatif/[slug]` utilisaient des structures trop proches, avec FAQ courte et sections repetitives.
- Les donnees structurees globales Organization / WebSite / SearchAction n'etaient pas ajoutees automatiquement sur toutes les pages via le composant SEO.

## Ameliorations importantes

- Ajout de `lib/premium-seo.js`, une couche deterministe qui genere des variantes stables par slug.
- Alternatives: titres, descriptions, intro, CTA, raisons de changer, raisons de rester, classement, criteres, plan de migration et FAQ de 8 questions.
- Comparatifs: titres, descriptions, intro, sections "quand choisir", tableau detaille, criteres de decision, analyse API/securite/support, verdict et FAQ de 8 questions.
- Ajout de schemas Product, HowTo, ItemList et FAQPage sur les templates programmatiques.
- Ajout automatique Organization et WebSite avec SearchAction via `components/SEO.js`.
- Maillage interne renforce: fiches outils, categories, alternatives, comparatifs proches et pages connexes.

## Donnees structurees ajoutees

- Organization
- WebSite
- SearchAction
- Product
- AggregateRating quand une note existe
- Offer
- BreadcrumbList
- FAQPage
- HowTo
- ItemList

## Pages faibles traitees

- `/alternatives/[slug]`: risque eleve de duplication reduit par un parcours editorial plus specifique.
- `/comparatif/[slug]`: risque eleve de duplication reduit par des variantes de structure, sections et FAQ plus longues.

## Reste a faire

- Migrer les logos/images des fiches outil vers `next/image` avec dimensions stables et fallback sans injection DOM.
- Ajouter une vraie configuration ESLint, car `next lint` ouvre actuellement l'assistant de configuration.
- Enrichir progressivement `tools.json` avec historique, API, integrations, versions, exemples et captures autorisees.
- Ajouter des tests de similarite de contenu en CI pour comparer les H1/H2/FAQ/meta entre pages programmatiques.

## Verification locale

Commandes utiles:

```bash
npm install
npm run build
npm run lint
```

Etat observe dans cette session:

- `npm install`: OK.
- Validation syntaxique Babel/Next des fichiers modifies: OK.
- `npm run lint`: non concluant, car le projet n'a pas encore de configuration ESLint et Next lance un assistant interactif.
- `npm run build`: non concluant dans cette session, la commande depasse 7 minutes sans sortie avant timeout. Le projet semble avoir un build lourd lie au volume SSG; il faudra le relancer hors timeout pour obtenir le resultat final.
