# 🗺️ Génération Automatique du Sitemap

Ce projet inclut un système complet de génération automatique du sitemap.xml pour optimiser votre référencement SEO.

## 📋 Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Utilisation](#utilisation)
- [Scripts disponibles](#scripts-disponibles)
- [Configuration](#configuration)
- [Pages incluses](#pages-incluses)

## ✨ Fonctionnalités

Le système de génération de sitemap inclut :

✅ **Génération automatique lors du build**
✅ **Mode watch pour le développement**
✅ **Détection automatique des pages**
✅ **Inclusion des pages dynamiques** (outils, catégories)
✅ **Dates de modification automatiques**
✅ **Priorités SEO optimisées**
✅ **Support des catégories d'outils**

## 🚀 Utilisation

### En développement

**Option 1 : Mode développement normal**
```bash
npm run dev
```
Le sitemap sera généré lors du build de production.

**Option 2 : Mode développement avec surveillance automatique**
```bash
npm run dev:watch
```
Le sitemap sera automatiquement régénéré à chaque modification de :
- Fichiers de pages (pages/*.js)
- Données des outils (public/data/tools.json)

### En production

**Build de production**
```bash
npm run build
```
Le sitemap est automatiquement généré à la fin du build.

**Démarrage du serveur**
```bash
npm start
```

### Génération manuelle

Pour générer le sitemap manuellement à tout moment :
```bash
npm run sitemap
```

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run sitemap` | Génère le sitemap manuellement |
| `npm run watch-sitemap` | Lance la surveillance et régénère automatiquement |
| `npm run dev:watch` | Lance le serveur de dev + surveillance du sitemap |
| `npm run build` | Build de production + génération du sitemap |

## ⚙️ Configuration

### Modifier l'URL de base

Éditez `scripts/generate-sitemap.js` :
```javascript
const baseUrl = 'https://thecreamai.com'; // Votre domaine
```

### Ajouter des pages statiques

Ajoutez vos pages dans le tableau `staticPages` :
```javascript
const staticPages = [
  { url: '', changefreq: 'daily', priority: '1.0' },
  { url: '/outils', changefreq: 'daily', priority: '0.9' },
  { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  { url: '/nouvelle-page', changefreq: 'weekly', priority: '0.8' }, // Nouvelle page
];
```

### Modifier les priorités SEO

Les priorités actuelles :
- Page d'accueil : **1.0** (priorité maximale)
- Liste des outils : **0.9** (très importante)
- Pages d'outils : **0.9** (très importantes)
- Catégories : **0.8** (importantes)
- Contact : **0.7** (normale)

## 📄 Pages incluses

Le sitemap génère automatiquement des URLs pour :

### Pages statiques
- `/` - Page d'accueil
- `/outils` - Liste de tous les outils
- `/contact` - Page de contact

### Pages dynamiques d'outils
- `/tool/[id]` - Page de détail de chaque outil
  - Exemple : `/tool/nordvpn`

### Pages de catégories
- `/outils/[category]` - Page de chaque catégorie
  - Générées automatiquement depuis `tools.json`
  - Exemple : `/outils/vpn`, `/outils/ia`, etc.

## 🔍 Vérification du sitemap

Après génération, le fichier se trouve à :
```
frontend/public/sitemap.xml
```

Une fois déployé, il sera accessible à :
```
https://thecreamai.com/sitemap.xml
```

## 📊 Statistiques

Le script affiche automatiquement :
- ✅ Confirmation de génération
- 📍 Emplacement du fichier
- 📊 Nombre total d'URLs générées

Exemple de sortie :
```
✅ Sitemap généré avec succès !
📍 Emplacement: /path/to/public/sitemap.xml
📊 Nombre d'URLs: 125
```

## 🔧 Dépannage

### Le sitemap n'est pas généré en développement
Utilisez `npm run dev:watch` au lieu de `npm run dev`

### Les nouvelles pages n'apparaissent pas
1. Vérifiez que `tools.json` est bien mis à jour
2. Relancez la génération : `npm run sitemap`
3. En mode watch, le sitemap se met à jour automatiquement

### Erreur de génération
Vérifiez que :
- Le fichier `tools.json` est valide (JSON correct)
- Les pages existent dans le dossier `pages/`
- Les permissions d'écriture sont correctes

## 📝 Soumission aux moteurs de recherche

Une fois déployé, soumettez votre sitemap à :

**Google Search Console**
```
https://search.google.com/search-console
```

**Bing Webmaster Tools**
```
https://www.bing.com/webmasters
```

Ajoutez l'URL de votre sitemap :
```
https://thecreamai.com/sitemap.xml
```

---

**Note** : Le sitemap est automatiquement exclu du build par Next.js et sera servi statiquement depuis `/public/sitemap.xml`
