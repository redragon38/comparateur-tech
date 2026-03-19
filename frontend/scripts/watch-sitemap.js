const fs = require('fs');
const path = require('path');
const generateSitemap = require('./generate-sitemap');

// Chemins à surveiller
const watchPaths = [
  path.join(__dirname, '../public/data/tools.json'),
  path.join(__dirname, '../pages'),
];

console.log('🔍 Surveillance des modifications pour la génération automatique du sitemap...\n');

// Générer le sitemap au démarrage
generateSitemap();

// Fonction pour détecter si un fichier est une page
function isPageFile(filename) {
  return filename.endsWith('.js') && 
         !filename.startsWith('_') && 
         filename !== '404.js';
}

// Surveiller les modifications
watchPaths.forEach(watchPath => {
  if (fs.existsSync(watchPath)) {
    if (fs.statSync(watchPath).isDirectory()) {
      // Surveiller un dossier de manière récursive
      fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
        if (filename && isPageFile(filename)) {
          console.log(`📝 Modification détectée: ${filename}`);
          console.log('⚙️  Régénération du sitemap...');
          generateSitemap();
        }
      });
      console.log(`✅ Surveillance du dossier: ${path.relative(path.join(__dirname, '..'), watchPath)}`);
    } else {
      // Surveiller un fichier spécifique
      fs.watchFile(watchPath, { interval: 1000 }, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          console.log(`📝 Modification détectée: ${path.basename(watchPath)}`);
          console.log('⚙️  Régénération du sitemap...');
          generateSitemap();
        }
      });
      console.log(`✅ Surveillance du fichier: ${path.relative(path.join(__dirname, '..'), watchPath)}`);
    }
  }
});

console.log('\n💡 Le sitemap sera automatiquement régénéré à chaque modification');
console.log('   Appuyez sur Ctrl+C pour arrêter\n');
