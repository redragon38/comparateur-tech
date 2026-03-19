# 📥 Téléchargement Automatique des Logos

Scripts pour télécharger automatiquement les logos de tous les outils depuis leurs sites web.

## 🚀 Utilisation Rapide

### Option 1 : npm script (Recommandé)

```bash
# Installer les dépendances (si ce n'est pas déjà fait)
npm install

# Télécharger les logos
npm run download-logos
```

### Option 2 : Node.js direct

```bash
node scripts/logo-downloader/download-logos.js
```

### Option 3 : Python

```bash
# Installer les dépendances Python
pip install -r scripts/logo-downloader/requirements.txt

# Télécharger les logos
npm run download-logos:python
# ou
python scripts/logo-downloader/download_logos.py
```

### Option 4 : Version Premium (Brandfetch API)

Pour des logos vectoriels SVG de haute qualité :

```bash
# 1. Obtenir une clé API gratuite sur https://brandfetch.com/api
# 2. Créer un fichier .env dans scripts/logo-downloader/
echo "BRANDFETCH_API_KEY=votre_clé_api" > scripts/logo-downloader/.env

# 3. Télécharger
npm run download-logos:premium
```

---

## 📊 Résultat

Les logos sont téléchargés automatiquement dans : `public/partners/`

### Avant
```
public/partners/
└── (vide ou partiellement rempli)
```

### Après
```
public/partners/
├── nordvpn.png        ✅
├── surfshark.png      ✅
├── clickup.png        ✅
├── emergent.png       ✅
└── ... (15-17 logos)
```

---

## 🎯 Fonctionnement

1. **Lit** `public/data/tools.json`
2. **Extrait** le domaine de chaque outil
3. **Télécharge** via 3 APIs gratuites :
   - Clearbit Logo API (meilleure qualité)
   - Google Favicons
   - DuckDuckGo Icons
4. **Sauvegarde** dans `public/partners/`

### Exemple de sortie

```bash
$ npm run download-logos

🚀 Démarrage du téléchargement des logos...

📦 17 outils trouvés

⬇️  NordVPN: Téléchargement...
   → Essai clearbit: https://logo.clearbit.com/nordvpn.com
✅ NordVPN: Logo téléchargé via clearbit

⬇️  Surfshark: Téléchargement...
✅ Surfshark: Logo téléchargé via clearbit

...

==================================================
📊 RÉSUMÉ
==================================================
✅ Logos existants    : 0
⬇️  Logos téléchargés  : 15
❌ Échecs             : 2
📦 Total              : 17
==================================================
```

---

## 🔧 Configuration

### Modifier la taille des logos

Éditez `scripts/logo-downloader/download-logos.js` :

```javascript
const LOGO_SIZE = 512; // Au lieu de 128 ou 256
```

### Modifier le dossier de sortie

```javascript
const OUTPUT_DIR = './public/logos'; // Au lieu de ./public/partners
```

---

## 📋 Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **download-logos.js** | `npm run download-logos` | Script principal (Node.js) |
| **download_logos.py** | `npm run download-logos:python` | Version Python |
| **download-logos-premium.js** | `npm run download-logos:premium` | Version premium (SVG) |

---

## 🐛 Résolution des Problèmes

### Les logos ne se téléchargent pas

```bash
# Vérifier la connexion internet
curl -I https://logo.clearbit.com/google.com

# Vérifier que tools.json existe
ls public/data/tools.json

# Réinstaller les dépendances
npm install
```

### Erreur "Module not found"

```bash
# Installer les dépendances
npm install axios fs-extra dotenv
```

### Certains logos échouent

C'est normal ! Environ 10% des logos peuvent échouer. Vous pouvez :
- Les ajouter manuellement dans `public/partners/`
- Essayer le script premium : `npm run download-logos:premium`
- Télécharger depuis le site officiel

---

## 💡 Conseils

### Après téléchargement

1. **Vérifier** les logos :
   ```bash
   ls -lh public/partners/
   ```

2. **Optimiser** si nécessaire :
   ```bash
   # Avec ImageMagick
   mogrify -resize 256x256 public/partners/*.png
   
   # Avec pngquant (compression)
   pngquant --quality=80-90 public/partners/*.png
   ```

3. **Commit** dans Git :
   ```bash
   git add public/partners/
   git commit -m "feat: add logos for all tools"
   ```

### Ajouter de nouveaux outils

1. Modifier `public/data/tools.json`
2. Re-exécuter : `npm run download-logos`
3. Seuls les nouveaux logos seront téléchargés

---

## 📚 APIs Utilisées

### Gratuites (script standard)
- **Clearbit Logo** : https://clearbit.com/logo
  - Qualité : ⭐⭐⭐⭐⭐
  - Format : PNG
  - Limites : Aucune

- **Google Favicons** : Google S2 Favicons
  - Qualité : ⭐⭐⭐⭐
  - Format : PNG/ICO
  - Limites : Aucune

- **DuckDuckGo Icons** : DuckDuckGo Icon Service
  - Qualité : ⭐⭐⭐
  - Format : ICO
  - Limites : Aucune

### Premium (script premium)
- **Brandfetch** : https://brandfetch.com/api
  - Qualité : ⭐⭐⭐⭐⭐
  - Format : SVG, PNG, WebP
  - Limites : 5000 requêtes/mois (gratuit)

---

## 📝 Structure des Fichiers

```
frontend/
├── scripts/
│   └── logo-downloader/
│       ├── download-logos.js          # Script principal
│       ├── download_logos.py          # Version Python
│       ├── download-logos-premium.js  # Version premium
│       ├── .env.example              # Config API exemple
│       ├── requirements.txt          # Dépendances Python
│       └── README.md                 # Ce fichier
├── public/
│   ├── data/
│   │   └── tools.json                # Liste des outils
│   └── partners/
│       └── *.png                     # Logos téléchargés ici
└── package.json                      # Scripts npm
```

---

## 🎨 Qualité des Logos

### Tailles disponibles
- **128x128 px** : Minimum (léger)
- **256x256 px** : Standard (recommandé)
- **512x512 px** : Haute résolution
- **SVG** : Vectoriel (premium uniquement)

### Formats supportés
- PNG (tous les scripts)
- ICO (fallback)
- SVG (premium uniquement)
- WebP (premium uniquement)

---

## 📈 Taux de Succès

- **Clearbit API** : ~85-90% de succès
- **Google Favicons** : ~95% de succès
- **DuckDuckGo Icons** : ~98% de succès
- **Global** : ~90% de succès total

Environ 15-16 logos sur 17 seront téléchargés automatiquement.

---

## 🆘 Support

Pour plus d'aide :
1. Consultez la documentation des scripts
2. Vérifiez les logs d'erreur dans la console
3. Testez avec un seul outil pour diagnostiquer

---

**Développé pour TheCreamAI** 🚀
