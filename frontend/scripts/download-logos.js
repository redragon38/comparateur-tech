#!/usr/bin/env node
/**
 * ============================================================
 *  Comparateur-Tech — Logo Downloader
 * ============================================================
 *  Télécharge automatiquement tous les logos des outils
 *  depuis tools.json, en essayant plusieurs sources dans
 *  l'ordre jusqu'à en trouver une valide.
 *
 *  Sources tentées (par priorité) :
 *    1. Clearbit Logo API       (clearbit.com/logo)
 *    2. Google Favicon API      (taille 128px)
 *    3. DuckDuckGo Favicon API
 *    4. Favicon natif du site   (/favicon.ico)
 *
 *  Usage :
 *    node scripts/download-logos.js
 *    node scripts/download-logos.js --force   ← re-télécharge même si le logo existe
 *    node scripts/download-logos.js --id nordvpn  ← un seul outil
 * ============================================================
 */

const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const url    = require('url');

// ── Config ────────────────────────────────────────────────────
const TOOLS_JSON   = path.join(__dirname, '..', 'public', 'data', 'tools.json');
const PARTNERS_DIR = path.join(__dirname, '..', 'public', 'partners');
const TIMEOUT_MS   = 8000;
const CONCURRENCY  = 3; // téléchargements simultanés

// Args
const FORCE   = process.argv.includes('--force');
const ONLY_ID = (() => { const i = process.argv.indexOf('--id'); return i !== -1 ? process.argv[i + 1] : null; })();

// ── Couleurs terminal ─────────────────────────────────────────
const C = {
  reset : '\x1b[0m',
  green : '\x1b[32m',
  red   : '\x1b[31m',
  yellow: '\x1b[33m',
  cyan  : '\x1b[36m',
  gray  : '\x1b[90m',
  bold  : '\x1b[1m',
};
const ok   = (msg) => console.log(`${C.green}  ✓${C.reset} ${msg}`);
const fail = (msg) => console.log(`${C.red}  ✗${C.reset} ${msg}`);
const skip = (msg) => console.log(`${C.yellow}  ⏭${C.reset}  ${msg}`);
const info = (msg) => console.log(`${C.cyan}  →${C.reset} ${msg}`);
const gray = (msg) => console.log(`${C.gray}    ${msg}${C.reset}`);

// ── Helpers ───────────────────────────────────────────────────

/** Extrait le domaine racine d'une URL */
function rootDomain(rawUrl) {
  try {
    const { hostname } = new url.URL(rawUrl);
    // Supprime www. et sous-domaines pour Clearbit
    const parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch {
    return null;
  }
}

/** Télécharge une URL vers un fichier local, retourne true si succès */
function download(srcUrl, destPath) {
  return new Promise((resolve) => {
    const proto = srcUrl.startsWith('https') ? https : http;

    const req = proto.get(srcUrl, { timeout: TIMEOUT_MS, headers: { 'User-Agent': 'Mozilla/5.0 Comparateur-Tech-LogoBot/1.0' } }, (res) => {
      // Suit les redirections (max 3)
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return download(res.headers.location, destPath).then(resolve);
      }

      if (res.statusCode !== 200) return resolve(false);

      const contentType = res.headers['content-type'] || '';
      // Rejette les réponses HTML (page d'erreur déguisée en 200)
      if (contentType.includes('text/html')) return resolve(false);
      // Accepte image/* et application/octet-stream
      if (!contentType.includes('image') && !contentType.includes('octet-stream')) return resolve(false);

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        // Rejette les fichiers trop petits (< 100 octets = probablement vide/erreur)
        if (buf.length < 100) return resolve(false);
        // Vérifie la signature PNG/SVG/ICO/WEBP
        const sig = buf.slice(0, 8).toString('hex');
        const str = buf.slice(0, 5).toString('utf8');
        const isImage = sig.startsWith('89504e47') // PNG
          || str.startsWith('<svg')                 // SVG
          || str.startsWith('<?xml')                // SVG avec déclaration
          || sig.startsWith('ffd8ff')               // JPEG
          || sig.startsWith('47494638')             // GIF
          || buf.slice(0,4).toString('hex') === '00000100' // ICO
          || sig.startsWith('52494646')             // WEBP
          || buf.slice(0,4).toString() === 'RIFF';  // WEBP alt
        if (!isImage) return resolve(false);

        fs.writeFileSync(destPath, buf);
        resolve(true);
      });
      res.on('error', () => resolve(false));
    });

    req.on('error',   () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

/** Construit la liste des URLs candidates pour un outil */
function buildSources(tool) {
  const domain = rootDomain(tool.website || tool.affiliateUrl || '');
  if (!domain) return [];

  return [
    // 1. Clearbit — meilleure qualité
    `https://logo.clearbit.com/${domain}?size=128`,
    // 2. Google Favicon haute résolution
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    // 3. DuckDuckGo
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    // 4. Favicon natif
    `https://${domain}/favicon.ico`,
    `https://www.${domain}/favicon.ico`,
    // 5. Favicon à la racine du site affiliate si différent
    ...(tool.affiliateUrl && rootDomain(tool.affiliateUrl) !== domain
      ? [`https://logo.clearbit.com/${rootDomain(tool.affiliateUrl)}?size=128`]
      : []),
  ];
}

/** Détermine l'extension réelle du fichier téléchargé */
function detectExtension(filePath) {
  const buf = fs.readFileSync(filePath).slice(0, 8);
  const sig = buf.toString('hex');
  const str = buf.toString('utf8');
  if (sig.startsWith('89504e47'))     return '.png';
  if (str.startsWith('<svg') || str.startsWith('<?xml')) return '.svg';
  if (sig.startsWith('ffd8ff'))       return '.jpg';
  if (sig.startsWith('47494638'))     return '.gif';
  if (sig.startsWith('52494646') || buf.slice(0,4).toString() === 'RIFF') return '.webp';
  if (buf.slice(0,4).toString('hex') === '00000100') return '.ico';
  return '.png'; // fallback
}

// ── Main ──────────────────────────────────────────────────────

async function processOne(tool) {
  const name    = tool.id;
  const logoRef = tool.logo || '';  // ex: "/partners/nordvpn.png"
  const ext     = path.extname(logoRef) || '.png';
  const base    = path.basename(logoRef, ext); // ex: "nordvpn"
  const destFile = path.join(PARTNERS_DIR, `${base}${ext}`);

  // Skip si déjà présent et pas --force
  if (!FORCE && fs.existsSync(destFile)) {
    skip(`${name} — logo déjà présent (${path.basename(destFile)})`);
    return { id: name, status: 'skipped' };
  }

  const sources = buildSources(tool);
  if (!sources.length) {
    fail(`${name} — aucune URL de site disponible`);
    return { id: name, status: 'error', reason: 'no website' };
  }

  info(`${name} — recherche en cours...`);

  // Fichier temporaire
  const tmpFile = path.join(PARTNERS_DIR, `_tmp_${base}`);

  for (const src of sources) {
    gray(`essai: ${src}`);
    const success = await download(src, tmpFile);
    if (success) {
      // Détecte l'extension réelle et renomme
      const realExt    = detectExtension(tmpFile);
      const finalFile  = path.join(PARTNERS_DIR, `${base}${realExt}`);
      fs.renameSync(tmpFile, finalFile);

      // Met à jour tools.json si l'extension a changé
      if (realExt !== ext) {
        tool.logo = `/partners/${base}${realExt}`;
      }

      ok(`${name} — sauvegardé: ${path.basename(finalFile)}`);
      return { id: name, status: 'ok', file: path.basename(finalFile) };
    }
  }

  // Toutes les sources ont échoué
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  fail(`${name} — aucune source valide trouvée`);
  return { id: name, status: 'error', reason: 'all sources failed' };
}

/** Exécute `n` tâches en parallèle (pool) */
async function runPool(tasks, concurrency) {
  const results = [];
  const queue   = [...tasks];

  async function worker() {
    while (queue.length) {
      const task = queue.shift();
      results.push(await task());
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  console.log(`\n${C.bold}${C.cyan}══════════════════════════════════════════${C.reset}`);
  console.log(`${C.bold}  Comparateur-Tech — Logo Downloader${C.reset}`);
  console.log(`${C.cyan}══════════════════════════════════════════${C.reset}\n`);

  // Charge tools.json
  if (!fs.existsSync(TOOLS_JSON)) {
    console.error(`${C.red}Erreur: ${TOOLS_JSON} introuvable.${C.reset}`);
    process.exit(1);
  }
  const tools = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));

  // Crée le dossier partners si absent
  if (!fs.existsSync(PARTNERS_DIR)) fs.mkdirSync(PARTNERS_DIR, { recursive: true });

  // Filtre par --id si demandé
  const targets = ONLY_ID ? tools.filter(t => t.id === ONLY_ID) : tools;

  if (!targets.length) {
    console.log(`${C.yellow}Aucun outil trouvé${ONLY_ID ? ` avec id="${ONLY_ID}"` : ''}.${C.reset}`);
    process.exit(0);
  }

  console.log(`${C.gray}${targets.length} outil(s) à traiter · concurrence: ${CONCURRENCY} · force: ${FORCE}${C.reset}\n`);

  // Lance le pool
  const tasks   = targets.map(tool => () => processOne(tool));
  const results = await runPool(tasks, CONCURRENCY);

  // Mise à jour de tools.json si certaines extensions ont changé
  const changed = results.filter(r => r.status === 'ok');
  if (changed.length) {
    fs.writeFileSync(TOOLS_JSON, JSON.stringify(tools, null, 2), 'utf8');
  }

  // Résumé
  const ok_n    = results.filter(r => r.status === 'ok').length;
  const skip_n  = results.filter(r => r.status === 'skipped').length;
  const err_n   = results.filter(r => r.status === 'error').length;

  console.log(`\n${C.bold}${C.cyan}══════════════════════════════════════════${C.reset}`);
  console.log(`  ${C.green}✓ Téléchargés : ${ok_n}${C.reset}`);
  if (skip_n) console.log(`  ${C.yellow}⏭ Ignorés     : ${skip_n}${C.reset}`);
  if (err_n)  console.log(`  ${C.red}✗ Échecs      : ${err_n}${C.reset}`);
  console.log(`${C.cyan}══════════════════════════════════════════${C.reset}\n`);

  if (err_n) {
    console.log(`${C.yellow}Astuce: réessayez avec --force pour retenter les logos manquants.${C.reset}\n`);
  }
}

main().catch((err) => {
  console.error(`${C.red}Erreur fatale:${C.reset}`, err);
  process.exit(1);
});
