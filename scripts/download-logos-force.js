#!/usr/bin/env node
/**
 * download-logos-force.js
 * Télécharge / re-télécharge les logos de tous les outils depuis leur URL officielle.
 * Utilise uniquement les modules Node.js natifs (https, fs, path, url).
 */
const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const dataPath  = path.join(__dirname, '..', 'public', 'data', 'tools.json');
const logosDir  = path.join(__dirname, '..', 'public', 'logos');

if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

const tools = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) return reject(new Error(`URL invalide: ${url}`));
    const client = url.startsWith('https') ? https : http;
    const file   = fs.createWriteStream(dest);
    client.get(url, { timeout: 8000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  let ok = 0, skip = 0, fail = 0;

  for (const tool of tools) {
    const logoUrl = tool.logo;
    if (!logoUrl || logoUrl.startsWith('/')) { skip++; continue; }

    const ext  = path.extname(new URL(logoUrl).pathname) || '.png';
    const dest = path.join(logosDir, `${tool.id}${ext}`);

    try {
      await download(logoUrl, dest);
      ok++;
      process.stdout.write(`\r✓ ${ok} logos téléchargés...`);
    } catch (e) {
      fail++;
      // silencieux, logo non critique
    }
  }

  console.log(`\n\nRésultat : ${ok} OK · ${skip} ignorés · ${fail} erreurs`);
}

run().catch(console.error);
