# Changelog - TheCreamAI

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
