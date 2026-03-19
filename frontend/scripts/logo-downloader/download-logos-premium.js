#!/usr/bin/env node

/**
 * Script de téléchargement des logos via Brandfetch API (Premium)
 * 
 * Brandfetch offre des logos de haute qualité en format vectoriel
 * API Key gratuite : https://brandfetch.com/api
 * 
 * Installation :
 * npm install axios dotenv
 * 
 * Configuration :
 * Créer un fichier .env avec :
 * BRANDFETCH_API_KEY=votre_clé_api
 * 
 * Usage :
 * node download-logos-premium.js
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const TOOLS_JSON = './public/data/tools.json';
const OUTPUT_DIR = './public/partners';
const API_KEY = process.env.BRANDFETCH_API_KEY;

// Vérifier la clé API
if (!API_KEY) {
  console.error('❌ BRANDFETCH_API_KEY non définie dans .env');
  console.log('\n📝 Pour obtenir une clé API gratuite:');
  console.log('   1. Visitez https://brandfetch.com/api');
  console.log('   2. Créez un compte gratuit');
  console.log('   3. Copiez votre API Key');
  console.log('   4. Créez un fichier .env avec:');
  console.log('      BRANDFETCH_API_KEY=votre_clé_api');
  process.exit(1);
}

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
 * Récupérer les logos via Brandfetch API
 */
async function fetchLogosFromBrandfetch(domain) {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://api.brandfetch.io/v2/brands/${domain}`,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      timeout: 10000,
    });

    // Extraire les logos disponibles
    const logos = response.data.logos || [];
    
    // Trier par qualité (préférence: SVG > PNG > autres)
    const sortedLogos = logos.sort((a, b) => {
      const scoreA = a.formats.find(f => f.format === 'svg') ? 3 : 
                     a.formats.find(f => f.format === 'png') ? 2 : 1;
      const scoreB = b.formats.find(f => f.format === 'svg') ? 3 : 
                     b.formats.find(f => f.format === 'png') ? 2 : 1;
      return scoreB - scoreA;
    });

    return sortedLogos;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Marque non trouvée
    }
    throw error;
  }
}

/**
 * Télécharger une image
 */
async function downloadImage(url, outputPath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 15000,
    });

    await fs.writeFile(outputPath, response.data);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Télécharger le logo d'un outil via Brandfetch
 */
async function downloadToolLogo(tool) {
  const domain = extractDomain(tool.website);
  if (!domain) {
    console.log(`⚠️  ${tool.name}: URL invalide`);
    return false;
  }

  const logoFilename = path.basename(tool.logo);
  const outputPath = path.join(OUTPUT_DIR, logoFilename);

  // Vérifier si le logo existe déjà
  if (await fs.pathExists(outputPath)) {
    console.log(`✓  ${tool.name}: Logo déjà présent`);
    return true;
  }

  console.log(`⬇️  ${tool.name}: Recherche via Brandfetch...`);

  try {
    // Récupérer les logos via Brandfetch
    const logos = await fetchLogosFromBrandfetch(domain);
    
    if (!logos || logos.length === 0) {
      console.log(`❌ ${tool.name}: Aucun logo trouvé sur Brandfetch`);
      return false;
    }

    // Choisir le meilleur logo
    const bestLogo = logos[0];
    
    // Essayer SVG d'abord, puis PNG
    const svgFormat = bestLogo.formats.find(f => f.format === 'svg');
    const pngFormat = bestLogo.formats.find(f => f.format === 'png' && f.width >= 256);
    
    const logoUrl = svgFormat?.src || pngFormat?.src || bestLogo.formats[0]?.src;
    
    if (!logoUrl) {
      console.log(`❌ ${tool.name}: URL de logo invalide`);
      return false;
    }

    console.log(`   → Téléchargement: ${logoUrl}`);
    
    // Télécharger le logo
    const success = await downloadImage(logoUrl, outputPath);
    
    if (success) {
      const format = svgFormat ? 'SVG' : pngFormat ? 'PNG' : 'autre';
      console.log(`✅ ${tool.name}: Logo téléchargé (${format})`);
      return true;
    } else {
      console.log(`❌ ${tool.name}: Échec du téléchargement`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ ${tool.name}: Erreur - ${error.message}`);
    return false;
  }
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Téléchargement des logos via Brandfetch API (Premium)\n');

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

    // Pause pour respecter les limites de l'API
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.log('💡 Essayez le script standard (download-logos.js) pour les logos manquants.');
  }
}

// Exécution
main().catch(error => {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
});
