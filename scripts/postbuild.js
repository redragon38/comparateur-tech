#!/usr/bin/env node
/**
 * postbuild.js — tâches post-build
 * Vérifie et régénère tools-slim.json si nécessaire.
 * Compatible Vercel (le fichier public/ est accessible en écriture au build).
 */
const fs = require('fs');
const path = require('path');

const dataDir  = path.join(__dirname, '..', 'public', 'data');
const fullPath = path.join(dataDir, 'tools.json');
const slimPath = path.join(dataDir, 'tools-slim.json');

const SLIM_FIELDS = [
  'id','slug','name','logo','website','affiliateUrl','link',
  'categories','price','trial','featured','verified','rating',
  'short','highlight','strengthShort','createdAt','updatedAt',
];

function rebuildSlim() {
  try {
    const tools = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const slim   = tools.map(t => Object.fromEntries(
      SLIM_FIELDS.filter(k => k in t).map(k => [k, t[k]])
    ));
    fs.writeFileSync(slimPath, JSON.stringify(slim), 'utf8');
    const ratio = (JSON.stringify(slim).length / JSON.stringify(tools).length * 100).toFixed(1);
    console.log(`✓ tools-slim.json régénéré — ${slim.length} outils, ${ratio}% de la taille originale`);
  } catch (err) {
    console.warn('⚠️  postbuild: impossible de régénérer tools-slim.json:', err.message);
    // Ne pas faire échouer le build si le fichier est déjà présent
    if (fs.existsSync(slimPath)) {
      console.log('✓ tools-slim.json existant conservé.');
    }
  }
}

function slimShapeChanged() {
  try {
    const tools = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const slim = JSON.parse(fs.readFileSync(slimPath, 'utf8'));
    const fullSample = tools.find(Boolean) || {};
    const slimSample = slim.find(Boolean) || {};
    return SLIM_FIELDS.some(k => k in fullSample && !(k in slimSample));
  } catch {
    return true;
  }
}

if (!fs.existsSync(fullPath)) {
  console.warn('⚠️  postbuild: tools.json introuvable, postbuild ignoré.');
} else if (!fs.existsSync(slimPath)) {
  console.log('⚡ tools-slim.json absent, génération...');
  rebuildSlim();
} else {
  try {
    const fullMtime = fs.statSync(fullPath).mtimeMs;
    const slimMtime = fs.statSync(slimPath).mtimeMs;
    if (fullMtime > slimMtime || slimShapeChanged()) {
      console.log('⚡ tools.json modifié, mise à jour de tools-slim.json...');
      rebuildSlim();
    } else {
      console.log('✓ tools-slim.json à jour.');
    }
  } catch (err) {
    console.warn('⚠️  postbuild: erreur stat:', err.message);
  }
}
