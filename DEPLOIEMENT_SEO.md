# Corrections SEO — Google Search Console
*Comparateur-Tech — Mars 2026*

---

## Résumé des problèmes corrigés

| # | Sévérité | Problème | Fichier corrigé |
|---|----------|----------|-----------------|
| 1 | 🔴 Critique | Pages `/tool/[id]` non indexables (CSR) | `pages/tool/[id].js` |
| 2 | 🔴 Critique | Pas de `sitemap.xml` | `pages/sitemap.xml.js` |
| 3 | 🔴 Critique | Pas de `robots.txt` | `public/robots.txt` |
| 4 | 🟡 Important | Redirections `/en/` et `/fr/` invisibles pour Google | `pages/en/*.js`, `pages/fr/*.js`, `next.config.js` |
| 5 | 🟡 Important | `site.webmanifest` manquant (erreur GSC) | `public/site.webmanifest` |
| 6 | 🟡 Important | `og-image` manquante (défaut SEO.js) | `public/og-image.svg` |
| 7 | 🟢 Bonus | Redirections trailing slash `/outils/` → `/outils` | `next.config.js` |

---

## Déploiement — Fichiers à copier

```
seo-fixes/
├── next.config.js                  → remplace frontend/next.config.js
├── pages/
│   ├── tool/[id].js                → remplace frontend/pages/tool/[id].js  ⭐ PRIORITÉ 1
│   ├── sitemap.xml.js              → nouveau : frontend/pages/sitemap.xml.js
│   ├── en/
│   │   ├── index.js                → remplace frontend/pages/en/index.js
│   │   ├── contact.js              → remplace frontend/pages/en/contact.js
│   │   └── outils.js               → remplace frontend/pages/en/outils.js
│   └── fr/
│       ├── index.js                → remplace frontend/pages/fr/index.js
│       ├── contact.js              → remplace frontend/pages/fr/contact.js
│       └── outils.js               → remplace frontend/pages/fr/outils.js
└── public/
    ├── robots.txt                  → nouveau : frontend/public/robots.txt
    ├── site.webmanifest            → nouveau : frontend/public/site.webmanifest
    └── og-image.svg                → nouveau : frontend/public/og-image.svg
```

---

## Détail des corrections

### 1. `/pages/tool/[id].js` — Conversion CSR → SSG

**Avant :** La page chargeait les données via `useEffect + fetch()` côté client.
Google Googlebot visitait la page et voyait uniquement le spinner de chargement — **0 contenu indexé** sur les 115 pages d'outils.

**Après :** `getStaticPaths` + `getStaticProps` génèrent les 115 pages en HTML statique au moment du `next build`. Google reçoit le contenu complet immédiatement.

**Bonus ajouté :** Données structurées `SoftwareApplication` (Schema.org) sur chaque page outil → permet l'affichage des **étoiles de notation dans les résultats Google** (rich results).

```js
// Ce qui a changé dans le fichier
export async function getStaticPaths() { ... }  // ← NOUVEAU
export async function getStaticProps({ params }) { ... }  // ← NOUVEAU
export default function ToolPage({ tool, alts }) { ... }  // ← props injectées, plus de useEffect
```

---

### 2. `/pages/sitemap.xml.js` — Sitemap dynamique

Génère automatiquement un XML couvrant :
- 17 pages statiques (accueil, blog, catégories, légal…)
- 115 pages d'outils dynamiques
- 6 articles de blog
- 4 catégories `/outils/[category]`

Accessible à : `https://comparateur-tech.com/sitemap.xml`

**À faire après déploiement :** Soumettre l'URL du sitemap dans Google Search Console → Sitemaps.

---

### 3. `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /_next/
Disallow: /api/
Disallow: /en/
Disallow: /fr/
Sitemap: https://comparateur-tech.com/sitemap.xml
```

---

### 4. Pages `/en/` et `/fr/` — Redirections HTTP

**Avant :** `router.replace('/')` s'exécute côté client → Google indexe une page blanche avec une URL en double.

**Après :** `getServerSideProps` retourne un objet `redirect` → Google reçoit un **HTTP 301/302** et ne tente pas d'indexer ces URLs.

Les redirections sont également consolidées dans `next.config.js` via `async redirects()` pour couvrir tous les sous-chemins (`/en/outils`, `/fr/contact`, etc.).

---

### 5. `public/site.webmanifest`

Le fichier était référencé dans `_document.js` :
```html
<link rel="manifest" href="/site.webmanifest" />
```
…mais le fichier n'existait pas, générant une erreur 404 visible dans Google Search Console.

---

### 6. `public/og-image.svg`

La valeur par défaut dans `SEO.js` pointe vers `/og-image.jpg` qui n'existe pas :
```js
ogImage = 'https://comparateur-tech.com/og-image.jpg'
```
Le fichier SVG créé est fonctionnel. Pour la production, **convertir en JPG 1200×630** avec un outil comme Squoosh ou ImageMagick :
```bash
# Avec ImageMagick (si disponible sur le serveur de build)
convert public/og-image.svg -resize 1200x630 public/og-image.jpg
```
Ou mettre à jour le chemin dans `components/SEO.js` :
```js
ogImage = 'https://comparateur-tech.com/og-image.svg'
```

---

## Vérification après déploiement

1. **Sitemap** : Vérifier `https://comparateur-tech.com/sitemap.xml` dans le navigateur
2. **Robots** : Vérifier `https://comparateur-tech.com/robots.txt`
3. **Page outil** : `curl https://comparateur-tech.com/tool/nordvpn` → doit contenir `NordVPN` dans le HTML source
4. **Redirections** : `curl -I https://comparateur-tech.com/en` → doit retourner `301` ou `302`
5. **GSC** : Soumettre le sitemap, demander une re-indexation des pages clés via l'outil d'inspection d'URL

---

## Actions supplémentaires recommandées (hors code)

- **Ajouter une balise `hreflang`** si le site doit réellement servir du contenu en anglais (actuellement les pages `/en/` ne font que rediriger)
- **Créer une `og-image.jpg`** 1200×630 de qualité pour l'aperçu sur les réseaux sociaux
- **Ajouter des données structurées `Article`** dans `/pages/blog/[slug].js` pour les rich results d'articles
- **Vérifier les Core Web Vitals** dans GSC après déploiement — le passage en SSG devrait améliorer le LCP des pages outils
