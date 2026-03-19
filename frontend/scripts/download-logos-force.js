#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  logo:force — Téléchargement forcé de tous les logos ║
 * ║  Re-télécharge même si le fichier existe déjà        ║
 * ║  Usage: npm run logo:force                           ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Sources essayées dans l'ordre :
 *   1. Clearbit Logo API (haute qualité, PNG 256px)
 *   2. Google Favicon S2 API (256px)
 *   3. DuckDuckGo Icons API
 *   4. Favicon standard du site (/favicon.ico)
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

// ── Config ──────────────────────────────────────────────
const TOOLS_JSON = path.resolve(__dirname, '../public/data/tools.json');
const OUTPUT_DIR = path.resolve(__dirname, '../public/partners');
const TIMEOUT_MS = 12000;
const DELAY_MS   = 200; // délai entre chaque outil pour éviter le rate-limit

// ── Couleurs terminal ────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
  bold:   '\x1b[1m',
};
const ok    = (s) => `${C.green}✓${C.reset} ${s}`;
const fail  = (s) => `${C.red}✗${C.reset} ${s}`;
const skip  = (s) => `${C.yellow}→${C.reset} ${s}`;
const info  = (s) => `${C.cyan}ℹ${C.reset} ${s}`;

// ── Helpers ──────────────────────────────────────────────
function extractDomain(rawUrl) {
  try {
    const u = new URL(rawUrl);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function getOutputPath(logoPath) {
  // /partners/nordvpn.png  →  <OUTPUT_DIR>/nordvpn.png
  const filename = path.basename(logoPath);
  // Normalise l'extension en .png
  const base = filename.replace(/\.(jpg|jpeg|gif|webp|ico|svg)$/i, '.png');
  return path.join(OUTPUT_DIR, base);
}

function getSources(domain) {
  return [
    `https://logo.clearbit.com/${domain}?size=256`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://${domain}/favicon.ico`,
  ];
}

function fetchBuffer(rawUrl) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(rawUrl);
    const lib    = parsed.protocol === 'https:' ? https : http;

    const req = lib.get(rawUrl, {
      timeout: TIMEOUT_MS,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/*,*/*',
      },
    }, (res) => {
      // Suivre les redirections (max 3)
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const ct = res.headers['content-type'] || '';
      if (!ct.includes('image') && !ct.includes('octet-stream')) {
        res.resume();
        return reject(new Error(`Content-Type non-image: ${ct}`));
      }

      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        // Rejeter les fichiers trop petits (probablement des erreurs)
        if (buf.length < 100) return reject(new Error(`Fichier trop petit (${buf.length}b)`));
        resolve(buf);
      });
      res.on('error', reject);
    });

    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ─────────────────────────────────────────────────
async function main() {
  console.log(`\n${C.bold}${C.cyan}╔══════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║  🖼️  Comparateur-Tech — Logo Force Download  ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚══════════════════════════════════════╝${C.reset}\n`);

  // Lire tools.json
  if (!fs.existsSync(TOOLS_JSON)) {
    console.error(fail(`tools.json introuvable : ${TOOLS_JSON}`));
    process.exit(1);
  }
  const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  console.log(info(`${tools.length} outils trouvés dans tools.json`));

  // Créer le dossier de sortie
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(info(`Dossier de sortie : ${OUTPUT_DIR}\n`));

  const results = { success: [], failed: [] };

  for (let i = 0; i < tools.length; i++) {
    const tool   = tools[i];
    const prefix = `${C.gray}[${String(i + 1).padStart(2, '0')}/${tools.length}]${C.reset}`;

    if (!tool.website && !tool.logo) {
      console.log(`${prefix} ${skip(`${tool.id} — aucun site ni logo, ignoré`)}`);
      continue;
    }

    const domain = tool.website ? extractDomain(tool.website) : null;
    if (!domain && !tool.logo) {
      console.log(`${prefix} ${skip(`${tool.id} — domaine invalide`)}`);
      continue;
    }

    const outPath = tool.logo
      ? getOutputPath(tool.logo)
      : path.join(OUTPUT_DIR, `${tool.id}.png`);

    const sources = domain ? getSources(domain) : [];

    let downloaded = false;

    for (const src of sources) {
      try {
        const buf = await fetchBuffer(src);
        fs.writeFileSync(outPath, buf);
        console.log(`${prefix} ${ok(`${tool.name.padEnd(22)} → ${path.basename(outPath)} ${C.gray}(${src.split('/')[2]})${C.reset}`)}`);
        results.success.push(tool.id);
        downloaded = true;
        break;
      } catch (err) {
        // Silencieux — on essaie la source suivante
      }
    }

    if (!downloaded) {
      console.log(`${prefix} ${fail(`${tool.name} — toutes les sources ont échoué`)}`);
      results.failed.push(tool.id);
    }

    // Petit délai pour éviter le rate-limiting
    if (i < tools.length - 1) await sleep(DELAY_MS);
  }

  // ── Résumé ───────────────────────────────────────────
  console.log(`\n${C.bold}Résumé${C.reset}`);
  console.log(`${C.green}✓ Succès :${C.reset} ${results.success.length} logos`);

  if (results.failed.length > 0) {
    console.log(`${C.red}✗ Échecs :${C.reset}  ${results.failed.length} outils`);
    console.log(`  ${C.gray}${results.failed.join(', ')}${C.reset}`);
    console.log(`\n${C.yellow}Astuce :${C.reset} Placez manuellement les logos manquants dans :`);
    console.log(`  ${C.cyan}${OUTPUT_DIR}${C.reset}`);
  } else {
    console.log(`\n${C.green}${C.bold}Tous les logos téléchargés avec succès ! 🎉${C.reset}`);
  }

  console.log('');
}

main().catch(err => {
  console.error(fail(`Erreur fatale : ${err.message}`));
  process.exit(1);
});
