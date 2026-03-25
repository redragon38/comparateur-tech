# Optimisations Mobile — Thecreamai v6

## ✅ Fichiers modifiés

### `styles/globals.css`
- Font-size inputs ≥ 16px → **évite le zoom automatique iOS**
- `touch-action: manipulation` → supprime le délai de 300ms sur les taps
- `overscroll-behavior-y: none` → évite le rebond iOS indésirable
- `-webkit-font-smoothing: antialiased` → meilleur rendu police
- `.scroll-x-mobile` : scroll horizontal sans scrollbar (filtres, cartes)
- `.safe-bottom / .safe-top` : support encoches Dynamic Island
- Media query `@media (max-width: 768px)` : réduction blobs, désactivation hover translate
- `::selection { background: transparent }` → pas de highlight bleu natif

### `tailwind.config.js`
- Breakpoint `xs: 480px` → espacement entre sm (640px) et mobile
- Safe area spacings pour iPhone avec encoche
- `deviceSizes` optimisées pour résolutions mobiles courantes

### `next.config.js`
- `deviceSizes` adapté aux tailles mobiles réelles (390, 640, 750…)
- `minimumCacheTTL: 30 jours` pour les images
- Headers Cache-Control pour assets statiques (1 an immutable)
- Cache SWR pour JSON data
- `experimental.scrollRestoration: true`

### `pages/_app.js`
- Ajout `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`

### `pages/_document.js`
- `meta theme-color` → barre de statut violette iOS/Android
- `apple-mobile-web-app-capable` + `status-bar-style`
- `format-detection: telephone=no` → pas de liens tel: auto-détectés
- Font Space Grotesk uniquement en 400/500/600/700 (sans 300 inutile)

### `components/Header.js`
- **Menu mobile redesigné** : slide-in avec overlay, scroll-lock body
- CTA "Explorer les outils" en bas du menu mobile
- Bouton hamburger 44×44px (zone tactile recommandée)
- Topbar plus compacte sur mobile (texte raccourci)
- Logo optimisé avec `width/height` explicites

### `components/HeroSection.js`
- Titre adaptatif : `text-4xl` → `sm:text-5xl` → `md:text-7xl`
- Blobs réduits sur mobile (`w-[400px]` au lieu de `700px`)
- CTAs pleine largeur sur mobile
- Stats avec padding réduit sur mobile

### `components/Footer.js`
- Grille `grid-cols-2` sur mobile (au lieu de 1)
- Section légal masquée sur mobile (moins critique)
- Zones tactiles min-h sur les liens de bas de page

### `components/ToolCard.js`
- Logo légèrement plus petit sur mobile
- Badges plus compacts
- Boutons d'action avec `min-h-[44px]`
- `loading="lazy"` sur les images

### `components/ToolModal.js`
- **Bottom sheet sur mobile** (glisse depuis le bas) au lieu d'une popup centrée
- Handle draggable visuel
- Footer sticky avec CTA
- Tailles de texte et paddings adaptés mobile

### `pages/index.js`
- Grille comparatif : **2 colonnes sur mobile** (était 1)
- Filtres catégories en **scroll horizontal** sur mobile
- Paddings `py-12 sm:py-20` au lieu de `py-20` fixe
- CTAs empilés sur mobile, côte à côte sur sm+

### `pages/outils/index.js`
- Barre de recherche avec icône Search
- Filtres en scroll horizontal sur mobile (noms abrégés)
- Grille outils **2 colonnes** sur mobile
- Hero plus compact

### `pages/contact.js`
- Inputs `text-base` (font-size 16px, évite zoom iOS)
- Cards infos en scroll horizontal sur mobile
- Champs empilés sur mobile, côte à côte sur sm+
- Textarea `resize-none` (évite les problèmes UX mobile)

### `public/site.webmanifest`
- `shortcuts` PWA (raccourcis sur l'écran d'accueil Android)
- `background_color` corrigé (`#f8f7ff`)
- Description optimisée

## 📐 Règles mobiles appliquées

| Règle | Valeur |
|-------|--------|
| Zone tactile min | 44×44px |
| Font-size inputs | ≥ 16px |
| Breakpoints | xs(480) sm(640) md(768) lg(1024) |
| Grilles mobiles | 2 colonnes (cartes) |
| Padding horizontal | px-4 mobile / px-6 desktop |
| Padding vertical | py-12 mobile / py-20 desktop |
| Modal mobile | Bottom sheet |
| Menu mobile | Overlay plein écran avec scroll-lock |
