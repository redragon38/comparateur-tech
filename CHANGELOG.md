# Changelog - Comparateur-Tech

## [1.3.0] - 2026-07-04

### 🆕 Nouvelles pages comparateur
- ✨ `/comparatifs/claude-vs-gemini` — Claude vs Gemini
- ✨ `/comparatifs/surfshark-vs-cyberghost` — Surfshark vs CyberGhost
- ✨ `/comparatifs/proton-vpn-vs-mullvad` — Proton VPN vs Mullvad
- ✨ `/comparatifs/bitwarden-vs-1password` — Bitwarden vs 1Password
- ✨ `/comparatifs/norton-vs-mcafee` — Norton 360 vs McAfee

### 🔒 Sécurité
- 🚨 `env.local` (clé GROQ_API_KEY) retiré du suivi git — **révoquer et régénérer la clé**, elle reste dans l'historique git
- ⬆️ Next.js 14.2.35 → 15.5.20 : corrige la faille de contournement middleware (GHSA-36qx-fr4f-26g5) et `form-data` (CRLF injection)
- 🛡️ Headers renforcés : HSTS `preload`, `Referrer-Policy: strict-origin-when-cross-origin`, Permissions-Policy étendue (payment, usb, browsing-topics), `Cross-Origin-Opener-Policy`, `X-XSS-Protection: 0`
- 🛡️ `/api/*` : `Cache-Control: no-store` + `X-Robots-Tag: noindex`
- 🛡️ `/api/chat` : contrôle de l'en-tête `Origin` (bloque l'utilisation de l'endpoint par des sites tiers)

### 🔒 Vague 6 : durcissement sécurité maximal
- 🛡️ CSP `script-src` **sans `'unsafe-inline'`** : scripts GA/tracker externalisés dans `public/js/` — une injection XSS ne peut plus exécuter aucun script inline ni charger de script hors liste blanche
- 🐛 XSS potentiel corrigé : `renderMarkdown` (fiches outils) échappe désormais le HTML avant injection dans le DOM
- 🛡️ `/api/chat` : Content-Type application/json obligatoire (415 sinon) + body plafonné à 128 Ko
- 🛡️ Header `X-Permitted-Cross-Domain-Policies: none` + `/.well-known/security.txt` (contact sécurité)
- 🔍 Scan de l'historique git : seul secret trouvé = clé Groq (30+ commits publics) → **rotation obligatoire**

### 🔗 Vague 5 : actifs citables (link building)
- ✨ `/barometre-prix-vpn` — étude : prix promo vs renouvellement de 14 VPN (prix vérifiés le 2026-07-04, sources presse spécialisée + sites officiels), schema Dataset + Article + FAQPage, bloc « Citer cette étude » (CC BY 4.0)
- ✨ `/calculateur-hebergement` — outil gratuit interactif : coût réel d'un hébergement sur 3 ans (renouvellement + domaine) + comparatif du coût réel de 10 hébergeurs, schema WebApplication
- 📊 `lib/barometre-data.js` — données centralisées, ⚠️ prix à re-vérifier sur les sites officiels avant déploiement puis trimestriellement (mettre à jour BAROMETRE_DATE)

### 📝 Vague 4 : enrichissement des 30 pages historiques
- ✍️ Contenu éditorial unique (3 sections + 3 FAQ, ~600 mots) rédigé pour les 30 anciennes pages de décision : 9 comparatifs, 5 pages alternatives, 16 guides
- ✅ Les 47 pages de décision font désormais toutes 950-1150 mots visibles avec schema Article + FAQPage et date de mise à jour

### 📝 Vague 3 : profondeur de contenu
- ✨ DecisionPage supporte désormais `sections` (contenu éditorial H2), `faq` (questions personnalisées fusionnées), date « Mis à jour le » visible et schema Article (datePublished/dateModified)
- ✍️ Contenu éditorial unique rédigé pour les 17 pages récentes : ~450 mots + 3 FAQ par page → les pages passent de ~300 à 1000+ mots visibles

### 🆕 Vague 2 : 12 pages SEO longue traîne
- ✨ Comparatifs : chatgpt-vs-perplexity, chatgpt-vs-mistral, nordvpn-vs-cyberghost, expressvpn-vs-surfshark, avast-vs-avg, bitdefender-vs-kaspersky, dashlane-vs-1password, hostinger-vs-siteground
- ✨ Guides : meilleure-ia-gratuite, meilleur-vpn-android, meilleur-vpn-iphone, meilleur-antivirus-pas-cher
- 🗺️ Champ `lastmod` par page de décision dans les deux sitemaps (signal de fraîcheur pour Google)
- 🔗 Nouvelles pages maillées depuis /comparatifs, /guides, silos IA/VPN/hébergement/cybersécurité et groupes de liens SEO

### 🔍 SEO
- 🔗 Consolidation des duels : quand une page éditoriale `/comparatifs/<slug>` existe, les pages programmatiques `/comparatif/...` pointent dessus (canonical + liens internes + sitemaps) — plus de contenu dupliqué
- 🔗 Maillage interne : groupes de liens SEO mis à jour vers les pages éditoriales, nouveaux duels ajoutés sur `/comparatifs`
- 🗺️ `lastmod` de `/comparatifs` mis à jour dans les deux sitemaps

### 🐛 Corrections
- 🐛 `pages/comparatifs.js` : `CATEGORY_ALIASES` non défini faisait planter le filtre par catégorie (ReferenceError) — remplacé par `matchesMainCategory`

## [1.2.0] - 2026-02-14

### 🎉 Nouveautés

#### Scripts de Téléchargement de Logos
- ✨ Ajout de 3 scripts automatiques pour télécharger les logos :
  - `download-logos.js` (Node.js) - Script principal
  - `download_logos.py` (Python) - Alternative Python
  - `download-logos-premium.js` (Node.js + API) - Version premium avec SVG

#### Nouvelles Commandes NPM
- ✨ `npm run download-logos` - Télécharger les logos automatiquement
- ✨ `npm run download-logos:python` - Version Python
- ✨ `npm run download-logos:premium` - Version premium (Brandfetch API)

#### Fonctionnalités
- ✅ Lecture automatique depuis `public/data/tools.json`
- ✅ Téléchargement via 3 APIs gratuites (Clearbit, Google, DuckDuckGo)
- ✅ Fallback automatique si une API échoue
- ✅ Ne re-télécharge pas les logos existants
- ✅ Rapport détaillé de progression
- ✅ Support des logos SVG (version premium)

### 📦 Dépendances Ajoutées

```json
{
  "axios": "^1.6.0",      // Pour les requêtes HTTP
  "dotenv": "^16.3.0",    // Pour les variables d'environnement
  "fs-extra": "^11.2.0"   // Pour la manipulation de fichiers
}
```

### 📚 Documentation

- ✨ Ajout de `scripts/logo-downloader/README.md` - Guide complet
- ✨ Ajout de `.env.example` - Configuration API exemple
- ✨ Ajout de `requirements.txt` - Dépendances Python
- ✨ Mise à jour du README principal

### 🔧 Structure des Fichiers

```
frontend/
├── scripts/
│   └── logo-downloader/          # 🆕 Nouveau dossier
│       ├── download-logos.js
│       ├── download_logos.py
│       ├── download-logos-premium.js
│       ├── download-logos.sh
│       ├── .env.example
│       ├── requirements.txt
│       └── README.md
├── download-logos.sh             # ⚠️ Déprécié (legacy)
└── download-logos-legacy.sh      # 🆕 Backup de l'ancien script
```

### 🚀 Migration

Pour passer de l'ancien système au nouveau :

#### Avant (ancien script)
```bash
bash download-logos.sh
```
- ❌ Liste manuelle hardcodée
- ❌ Seulement Clearbit API
- ❌ Pas de fallback
- ❌ Pas de support npm

#### Après (nouveau système)
```bash
npm run download-logos
```
- ✅ Lit depuis tools.json
- ✅ 3 APIs avec fallback
- ✅ Intégré dans npm
- ✅ Meilleur taux de succès

### 📊 Améliorations de Performance

| Critère | Ancien | Nouveau |
|---------|--------|---------|
| **Sources de données** | Hardcodé | tools.json |
| **APIs utilisées** | 1 | 3 |
| **Taux de succès** | ~70% | ~90% |
| **Formats** | PNG | PNG + SVG (premium) |
| **Intégration** | Bash | npm + Python + Bash |

### 🎯 Utilisation

#### Installation
```bash
# Installer les dépendances
npm install
```

#### Téléchargement Standard
```bash
# Via npm (recommandé)
npm run download-logos

# Via Node.js
node scripts/logo-downloader/download-logos.js

# Via Python
pip install -r scripts/logo-downloader/requirements.txt
python scripts/logo-downloader/download_logos.py

# Via Bash
bash scripts/logo-downloader/download-logos.sh
```

#### Téléchargement Premium (SVG)
```bash
# 1. Obtenir clé API : https://brandfetch.com/api
# 2. Configurer
echo "BRANDFETCH_API_KEY=votre_clé" > scripts/logo-downloader/.env

# 3. Télécharger
npm run download-logos:premium
```

### 🐛 Corrections

- 🐛 Correction : Les logos manquants ne bloquent plus le build
- 🐛 Correction : Meilleure gestion des erreurs réseau
- 🐛 Correction : Support des domaines avec sous-domaines
- 🐛 Correction : Timeout configuré pour éviter les blocages

### 💡 Exemples

#### Télécharger tous les logos
```bash
npm run download-logos
```

#### Résultat attendu
```
🚀 Démarrage du téléchargement des logos...
📦 17 outils trouvés

⬇️  NordVPN: Téléchargement...
✅ NordVPN: Logo téléchargé via clearbit

⬇️  Surfshark: Téléchargement...
✅ Surfshark: Logo téléchargé via clearbit

==================================================
📊 RÉSUMÉ
==================================================
✅ Logos existants    : 4
⬇️  Logos téléchargés  : 13
❌ Échecs             : 0
📦 Total              : 17
==================================================
```

### 🔮 À Venir (v1.3.0)

- [ ] Support des formats WebP
- [ ] Optimisation automatique des images
- [ ] Cache des logos pour éviter les re-téléchargements
- [ ] Interface web pour gérer les logos
- [ ] Téléchargement parallèle pour améliorer la vitesse
- [ ] Support des logos animés (GIF)

### 🆘 Aide

Pour plus d'informations :
- Consultez `scripts/logo-downloader/README.md`
- Vérifiez les logs en cas d'erreur
- Testez avec `npm run download-logos`

### 📝 Notes de Migration

Si vous utilisez l'ancien script `download-logos.sh` :

1. **Aucune action requise** - L'ancien script fonctionne toujours
2. **Recommandé** - Migrer vers `npm run download-logos`
3. **Avantages** :
   - Lecture automatique depuis tools.json
   - Pas besoin de maintenir une liste manuelle
   - Meilleur taux de succès (90% vs 70%)
   - Support de multiples formats et APIs

---

## [1.1.0] - 2026-02-13

### Menu "Outils" Amélioré
- ✅ Chargement dynamique des catégories depuis tools.json
- ✅ 7 catégories au lieu de 2 hardcodées
- ✅ Métadonnées complètes pour chaque catégorie
- ✅ Tous les liens fonctionnent
- ✅ Dropdown amélioré avec fermeture automatique

### Bugs Corrigés
- 🐛 Liens cassés vers les catégories
- 🐛 Catégories manquantes dans le dropdown
- 🐛 Métadonnées incomplètes
- 🐛 Slugs incohérents

---

## [1.0.0] - 2026-01-XX

### Initial Release
- Page d'accueil avec liste d'outils
- Système de filtrage par catégorie
- Pages de détail des outils
- Header et Footer
- Design responsive

---

**Légende**
- ✨ Nouvelle fonctionnalité
- 🐛 Correction de bug
- 🎨 Amélioration UI/UX
- 📚 Documentation
- 🔧 Amélioration technique
- ⚠️ Déprécié
- 🆕 Nouveau
