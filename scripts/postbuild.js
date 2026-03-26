#!/usr/bin/env node
/**
 * postbuild.js — tâches post-build
 * Actuellement : vérification que tools-slim.json est présent et à jour.
 */
const fs = require('fs');
const path = require('path');

const dataDir  = path.join(__dirname, '..', 'public', 'data');
const fullPath = path.join(dataDir, 'tools.json');
const slimPath = path.join(dataDir, 'tools-slim.json');

const SLIM_FIELDS = [
  'id','slug','name','logo','website','affiliateUrl','link',
  'categories','price','trial','featured','verified','rating',
  'short','highlight','strengthShort',
];

function rebuildSlim() {
  const tools = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const slim   = tools.map(t => Object.fromEntries(
    SLIM_FIELDS.filter(k => k in t).map(k => [k, t[k]])
  ));
  fs.writeFileSync(slimPath, JSON.stringify(slim), 'utf8');
  const ratio = (JSON.stringify(slim).length / JSON.stringify(tools).length * 100).toFixed(1);
  console.log(`✓ tools-slim.json régénéré — ${slim.length} outils, ${ratio}% de la taille originale`);
}

if (!fs.existsSync(slimPath)) {
  console.log('⚡ tools-slim.json absent, génération...');
  rebuildSlim();
} else {
  const fullMtime = fs.statSync(fullPath).mtimeMs;
  const slimMtime = fs.statSync(slimPath).mtimeMs;
  if (fullMtime > slimMtime) {
    console.log('⚡ tools.json modifié, mise à jour de tools-slim.json...');
    rebuildSlim();
  } else {
    console.log('✓ tools-slim.json à jour.');
  }
}
