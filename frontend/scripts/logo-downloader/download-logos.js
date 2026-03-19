#!/usr/bin/env node

/**
 * Script de téléchargement automatique des logos
 * Utilise l'API Clearbit Logo pour récupérer des logos de haute qualité
 * 
 * Installation :
 * npm install axios fs-extra
 * 
 * Usage :
 * node download-logos.js
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const TOOLS_JSON = './public/data/tools.json';
const OUTPUT_DIR = './public/partners';
const LOGO_SIZE = 128; // Taille en pixels (options: 128, 256, 512)

// APIs de logos (par ordre de préférence)
const LOGO_APIS = {
  clearbit: (domain) => `https://logo.clearbit.com/${domain}?size=${LOGO_SIZE}`,
  google: (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
  duckduckgo: (domain) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
};

/**
 * Extraire le domaine depuis une URL
 */
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    console.error(`❌ URL invalide: ${url}`);
    return null;
  }
}

/**
 * Télécharger une image depuis une URL
 */
async function downloadImage(url, outputPath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Vérifier que c'est bien une image
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('Pas une image');
    }

    await fs.writeFile(outputPath, response.data);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Télécharger le logo d'un outil
 */
async function downloadToolLogo(tool) {
  const domain = extractDomain(tool.website);
  if (!domain) {
    console.log(`⚠️  ${tool.name}: URL invalide`);
    return false;
  }

  // Extraire le nom du fichier depuis le logo path
  const logoFilename = path.basename(tool.logo);
  const outputPath = path.join(OUTPUT_DIR, logoFilename);

  // Vérifier si le logo existe déjà
  if (await fs.pathExists(outputPath)) {
    console.log(`✓  ${tool.name}: Logo déjà présent`);
    return true;
  }

  console.log(`⬇️  ${tool.name}: Téléchargement...`);

  // Essayer chaque API dans l'ordre
  for (const [apiName, getUrl] of Object.entries(LOGO_APIS)) {
    const logoUrl = getUrl(domain);
    console.log(`   → Essai ${apiName}: ${logoUrl}`);

    const success = await downloadImage(logoUrl, outputPath);
    if (success) {
      console.log(`✅ ${tool.name}: Logo téléchargé via ${apiName}`);
      return true;
    }
  }

  console.log(`❌ ${tool.name}: Échec du téléchargement`);
  return false;
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Démarrage du téléchargement des logos...\n');

  // Vérifier que tools.json existe
  if (!(await fs.pathExists(TOOLS_JSON))) {
    console.error(`❌ Fichier ${TOOLS_JSON} introuvable`);
    process.exit(1);
  }

  // Créer le dossier de sortie
  await fs.ensureDir(OUTPUT_DIR);

  // Charger tools.json
  const tools = await fs.readJson(TOOLS_JSON);
  console.log(`📦 ${tools.length} outils trouvés\n`);

  // Statistiques
  let downloaded = 0;
  let existing = 0;
  let failed = 0;

  // Télécharger chaque logo
  for (const tool of tools) {
    const logoPath = path.join(OUTPUT_DIR, path.basename(tool.logo));
    
    if (await fs.pathExists(logoPath)) {
      existing++;
      console.log(`✓  ${tool.name}: Logo déjà présent`);
    } else {
      const success = await downloadToolLogo(tool);
      if (success) {
        downloaded++;
      } else {
        failed++;
      }
    }

    // Pause pour éviter de spammer les APIs
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(50));
  console.log(`✅ Logos existants    : ${existing}`);
  console.log(`⬇️  Logos téléchargés  : ${downloaded}`);
  console.log(`❌ Échecs             : ${failed}`);
  console.log(`📦 Total              : ${tools.length}`);
  console.log('='.repeat(50));

  if (failed > 0) {
    console.log('\n⚠️  Certains logos n\'ont pas pu être téléchargés.');
    console.log('💡 Vous pouvez les ajouter manuellement dans:', OUTPUT_DIR);
  }
}

// Exécution
main().catch(error => {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
});
