# 🚀 TheCreAmAI - Plateforme d'Innovation IA

[![Version](https://img.shields.io/badge/version-1.2.0-purple)](https://github.com/thecreamai)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-Proprietary-red)](LICENSE)

> Plateforme de découverte d'outils IA pour créateurs et entrepreneurs. Découvrez, comparez et choisissez les meilleurs outils pour booster votre activité.

## 📦 Installation Rapide

```bash
cd frontend

# 1. Installer les dépendances
npm install

# 2. Télécharger les logos automatiquement (nouveau !)
npm run download-logos

# 3. Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

**📖 Guide complet :** Consultez [QUICKSTART.md](QUICKSTART.md) pour plus de détails.

## ✅ Fonctionnalités

### Navigation
- ✅ **Page d'accueil** : Catalogue de tous les outils IA
- ✅ **Pages dédiées** : Chaque outil a sa propre page avec détails complets
- ✅ **Recherche et filtres** : Trouvez rapidement l'outil qu'il vous faut

### Interactions
1. **Clic sur une carte d'outil** → Vous redirige vers la page dédiée de l'outil
2. **Bouton "Voir le site"** → Ouvre le site officiel de l'outil dans un nouvel onglet

### Pages d'outil
Chaque outil dispose d'une page complète avec :
- Logo et informations principales
- Description détaillée
- Note et avis
- Catégories et tags
- Fonctionnalités (si disponibles)
- Informations complémentaires (éditeur, date de sortie, etc.)
- Boutons pour visiter le site officiel

## 🎯 Modifications Appliquées

1. ✅ **Nom de marque** : TheCreAmAI
2. ✅ **Navigation** : Clic sur carte → Page dédiée de l'outil
3. ✅ **Bouton "Voir le site"** : Redirection vers le site externe
4. ✅ **Suppression des prix** : Plus d'affichage de tarifs
5. ✅ **CSS corrigé** : Tailwind fonctionne parfaitement

## ✨ Nouveautés v1.2.0 (Février 2026)

### 🎨 Téléchargement Automatique des Logos
- ✨ **3 scripts** de téléchargement : Node.js, Python, Bash
- ✨ **3 APIs gratuites** : Clearbit, Google, DuckDuckGo
- ✨ **Fallback automatique** : Si une API échoue, essaie la suivante
- ✨ **Taux de succès** : ~90% (15-17 logos sur 17)
- ✨ **Support SVG** : Version premium avec Brandfetch API

**Commandes :**
```bash
npm run download-logos           # Standard (PNG)
npm run download-logos:premium   # Premium (SVG)
npm run download-logos:python    # Version Python
```

### 📊 Menu "Outils" Dynamique
- ✨ **7 catégories** chargées depuis `tools.json` (vs 2 hardcodées)
- ✨ **Métadonnées complètes** : icônes, couleurs, descriptions
- ✨ **Tous les liens fonctionnent** : génération automatique des slugs
- ✨ **Dropdown amélioré** : fermeture automatique, scroll si besoin

### 📦 Nouvelles Dépendances
- **axios** : Requêtes HTTP pour télécharger les logos
- **fs-extra** : Manipulation de fichiers avancée
- **dotenv** : Configuration via variables d'environnement

**Voir [CHANGELOG.md](CHANGELOG.md) pour tous les détails.**

## 🗂️ Structure des URLs

- **Page d'accueil** : `/`
- **Page d'un outil** : `/tool/[id]`
  - Exemple : `/tool/chatgpt`
  - Exemple : `/tool/midjourney`

## 📋 Format des Données

Assurez-vous que vos outils dans `public/data/tools.json` contiennent :

```json
{
  "id": "chatgpt",
  "name": "ChatGPT",
  "link": "https://chat.openai.com",
  "short": "Assistant IA conversationnel",
  "description": "Description complète de l'outil...",
  "logo": "/logos/chatgpt.png",
  "categories": ["IA Générative", "Chat"],
  "tags": ["nlp", "conversation", "ai"],
  "rating": {
    "value": 4.8,
    "count": 1250
  },
  "verified": true,
  "features": [
    "Conversations naturelles",
    "Génération de code",
    "Traduction instantanée"
  ],
  "publisher": "OpenAI",
  "language": "Multilingue"
}
```

## 🎨 Styles et Design

- **Framework CSS** : Tailwind CSS
- **Palette** : Violet/Pourpre (#9333ea, #6b46c1)
- **Effets** : Glassmorphism, gradients, animations

### Classes Personnalisées

```css
.gradient-purple    /* Dégradé violet pour boutons */
.gradient-card      /* Carte avec effet glassmorphism */
.glow-purple        /* Effet de lueur violette */
.text-shadow        /* Ombre portée sur texte */
```

## 🔧 Scripts Disponibles

### Développement
```bash
npm run dev                # Démarrer le serveur de développement
npm run dev:watch          # Dev + watch sitemap
npm run build              # Build pour production
npm start                  # Démarrer en production
npm run lint               # Linting du code
```

### Logos (Nouveau !) 🆕
```bash
npm run download-logos             # Télécharger les logos (Node.js)
npm run download-logos:python      # Télécharger les logos (Python)
npm run download-logos:premium     # Télécharger les logos premium (SVG)
```

**📚 Documentation :** `scripts/logo-downloader/README.md`

### Sitemap
```bash
npm run sitemap                    # Générer le sitemap
npm run sitemap:validate           # Valider le sitemap
npm run watch-sitemap              # Watch sitemap changes
```

## 🌐 Technologies

### Framework & UI
- **Next.js 14** - Framework React avec routing et SSG
- **React 18** - Bibliothèque UI
- **Tailwind CSS 3** - Framework CSS utilitaire
- **Lucide React** - Bibliothèque d'icônes

### Outils & Utilitaires 🆕
- **Axios** - Client HTTP pour téléchargement de logos
- **fs-extra** - Manipulation avancée de fichiers
- **dotenv** - Configuration via variables d'environnement

### APIs Tierces (Logos)
- **Clearbit Logo API** - Logos haute qualité
- **Google Favicons** - Favicons Google
- **DuckDuckGo Icons** - Service d'icônes
- **Brandfetch API** - Logos vectoriels premium (optionnel)

## 📱 Responsive Design

Le site est entièrement responsive :
- 📱 Mobile (< 768px)
- 📱 Tablette (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🐛 Dépannage

### Le CSS ne s'affiche pas

```bash
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Les pages d'outils ne fonctionnent pas

Vérifiez que :
1. Le fichier `/public/data/tools.json` existe
2. Chaque outil a un champ `id` unique
3. Le serveur Next.js est bien lancé avec `npm run dev`

### Port 3000 déjà utilisé

```bash
npm run dev -- -p 3001
# Ouvrir http://localhost:3001
```

## 📚 Documentation

### Guides Principaux
- **[QUICKSTART.md](QUICKSTART.md)** - Guide de démarrage rapide (3 minutes)
- **[CHANGELOG.md](CHANGELOG.md)** - Historique des versions
- **[frontend/INSTALLATION.md](frontend/INSTALLATION.md)** - Installation détaillée
- **[frontend/SITEMAP.md](frontend/SITEMAP.md)** - Plan du site

### Guides Spécifiques
- **[scripts/logo-downloader/README.md](frontend/scripts/logo-downloader/README.md)** - Guide complet des scripts de téléchargement de logos

### Documentation Externe
- Next.js : https://nextjs.org/docs
- Tailwind CSS : https://tailwindcss.com/docs
- React : https://react.dev

## 📄 Licence

© 2026 TheCreAmAI. Tous droits réservés.

---

**Projet prêt à l'emploi ! 🎉**

N'oubliez pas de lancer `npm install` avant la première utilisation.
