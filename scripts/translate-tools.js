#!/usr/bin/env node
/**
 * translate-tools.js — remplit les champs anglais (en.*) manquants de public/data/tools.json
 * via un LLM (API compatible OpenAI, par défaut OpenRouter).
 *
 * Les traductions sont écrites en clés plates "en.<champ>" pour coller au format existant
 * (ex: tool["en.short"]), utilisées ensuite par la couche i18n du site (fallback FR si absent).
 *
 * Usage :
 *   OPENROUTER_API_KEY=xxx node scripts/translate-tools.js [options]
 *
 * Options :
 *   --limit N        ne traite que N outils (défaut: tous ceux à traduire)
 *   --ids a,b,c      ne traite que ces IDs
 *   --only-rich      seulement les outils au contenu FR riche (description longue + verdict)
 *   --force          retraduit même si en.short existe déjà
 *   --model NAME     modèle LLM (défaut: env TRANSLATE_MODEL ou 'openai/gpt-4o-mini')
 *   --dry-run        n'appelle pas l'API, montre juste ce qui serait traduit
 *   --save-every N   sauvegarde tools.json tous les N outils (défaut: 10) — résumable
 *
 * Reprise : le script saute les outils qui ont déjà en.short (sauf --force), donc on peut
 * l'interrompre (Ctrl+C) et le relancer, il continue où il s'était arrêté.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'public', 'data', 'tools.json');
const BACKUP_DIR = path.join(ROOT, 'data-backups');

// ── Options CLI ────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const getFlag = (name) => argv.includes(`--${name}`);
const getOpt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : def;
};
const LIMIT = parseInt(getOpt('limit', '0'), 10) || 0;
const ONLY_IDS = (getOpt('ids', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
const ONLY_RICH = getFlag('only-rich');
const FORCE = getFlag('force');
const DRY_RUN = getFlag('dry-run');
const SAVE_EVERY = parseInt(getOpt('save-every', '10'), 10) || 10;
// Charge .env.local / .env (un script node n'hérite pas des variables de Next).
function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  }
}
loadEnv();

const MODEL = getOpt('model', process.env.TRANSLATE_MODEL || 'openai/gpt-4o-mini');
const API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '';
const API_URL = process.env.TRANSLATE_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

// Champs texte à traduire (chaînes)
const STRING_FIELDS = ['short', 'highlight', 'description', 'verdict'];
// Champs listes de chaînes
const ARRAY_FIELDS = ['strengths', 'strengthShort', 'limitations', 'limitationsShort', 'idealFor', 'notFor', 'tags'];
// article = objet de sections (chaînes) ; faq = liste {q,a} ; readMore = liste {href,title,desc}
const ALL_FIELDS = [...STRING_FIELDS, ...ARRAY_FIELDS, 'article', 'faq', 'readMore', 'categories'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function needsTranslation(tool) {
  if (FORCE) return true;
  return !tool['en.short'];
}

function isRich(tool) {
  return tool.description && String(tool.description).length > 100 && tool.verdict;
}

// Construit l'objet source FR à envoyer (uniquement les champs présents)
function buildSource(tool) {
  const src = {};
  for (const f of STRING_FIELDS) if (tool[f]) src[f] = tool[f];
  for (const f of ARRAY_FIELDS) if (Array.isArray(tool[f]) && tool[f].length) src[f] = tool[f];
  if (tool.article && typeof tool.article === 'object') src.article = tool.article;
  if (Array.isArray(tool.faq) && tool.faq.length) src.faq = tool.faq.map((x) => ({ q: x.q, a: x.a }));
  if (Array.isArray(tool.readMore) && tool.readMore.length) src.readMore = tool.readMore.map((x) => ({ title: x.title, desc: x.desc }));
  if (Array.isArray(tool.categories) && tool.categories.length) src.categories = tool.categories;
  return src;
}

function buildPrompt(tool, src) {
  return [
    {
      role: 'system',
      content:
        'You are a professional French-to-English translator specialized in SEO copywriting for a tech comparison website. ' +
        'Translate every value to natural, fluent, SEO-friendly English. ' +
        'RULES: (1) Preserve the __double underscore__ bold markers exactly where they appear. ' +
        '(2) Keep brand and product names unchanged (NordVPN, ChatGPT, etc.). ' +
        '(3) Keep the SAME JSON structure and keys as the input. ' +
        '(4) For arrays, translate each item and keep the same length/order. ' +
        '(5) For "faq", translate q and a. For "readMore", translate title and desc. ' +
        '(6) Return ONLY a valid JSON object, no markdown, no code fences, no comments.',
    },
    {
      role: 'user',
      content:
        `Tool name: ${tool.name}\nPrimary category: ${(tool.categories || [])[0] || ''}\n\n` +
        `Translate this JSON to English and return the same structure:\n\n${JSON.stringify(src, null, 1)}`,
    },
  ];
}

function parseJsonLoose(text) {
  let t = String(text || '').trim();
  t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first !== -1 && last !== -1) t = t.slice(first, last + 1);
  return JSON.parse(t);
}

async function callLLM(messages) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'HTTP-Referer': 'https://comparateur-tech.com',
      'X-Title': 'Comparateur-Tech translation',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Applique la traduction (objet EN) sur l'outil, en clés plates en.*
function applyTranslation(tool, en, src) {
  // readMore : on garde le href FR (les pages EN peuvent ne pas exister), on traduit title/desc
  if (en.readMore && Array.isArray(tool.readMore)) {
    en.readMore = tool.readMore.map((orig, i) => ({
      href: orig.href,
      title: en.readMore[i]?.title || orig.title,
      desc: en.readMore[i]?.desc || orig.desc,
    }));
  }
  for (const f of ALL_FIELDS) {
    if (en[f] !== undefined && src[f] !== undefined) {
      tool[`en.${f}`] = en[f];
    }
  }
}

async function main() {
  // Lancé automatiquement (postinstall/prebuild/predev) : SANS clé, on saute
  // proprement (exit 0) pour ne JAMAIS casser install/build/dev.
  if (!DRY_RUN && !API_KEY) {
    console.log('[translate-tools] Aucune cle OPENROUTER_API_KEY (ni dans .env.local) : traduction ignoree.');
    return;
  }
  const tools = JSON.parse(fs.readFileSync(DATA, 'utf8'));

  let candidates = tools.filter(needsTranslation);
  if (ONLY_IDS.length) candidates = candidates.filter((t) => ONLY_IDS.includes(t.id));
  if (ONLY_RICH) candidates = candidates.filter(isRich);
  if (LIMIT) candidates = candidates.slice(0, LIMIT);

  console.log(`Modele          : ${MODEL}`);
  console.log(`A traduire      : ${candidates.length} outils (sur ${tools.length})`);
  console.log(`Mode            : ${DRY_RUN ? 'DRY-RUN (aucun appel API)' : 'REEL'}`);
  if (DRY_RUN) {
    console.log('Exemples:', candidates.slice(0, 15).map((t) => t.id).join(', '));
    return;
  }

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const backup = path.join(BACKUP_DIR, `tools.json.pre-translate-${Date.now()}.json`);
  fs.copyFileSync(DATA, backup);
  console.log(`Sauvegarde      : ${path.relative(ROOT, backup)}`);

  let done = 0, failed = 0;
  for (const tool of candidates) {
    const src = buildSource(tool);
    if (!Object.keys(src).length) { continue; }
    let attempt = 0;
    while (attempt < 3) {
      try {
        const raw = await callLLM(buildPrompt(tool, src));
        const en = parseJsonLoose(raw);
        applyTranslation(tool, en, src);
        done++;
        process.stdout.write(`\rOK ${done}/${candidates.length}  (${tool.id.padEnd(24).slice(0, 24)})   `);
        break;
      } catch (e) {
        attempt++;
        if (attempt >= 3) { failed++; console.log(`\n[echec] ${tool.id}: ${e.message}`); }
        else await sleep(1500 * attempt);
      }
    }
    // sauvegarde incrementale (resumable)
    if (done % SAVE_EVERY === 0) fs.writeFileSync(DATA, JSON.stringify(tools, null, 0), 'utf8');
    await sleep(300); // throttle leger
  }
  fs.writeFileSync(DATA, JSON.stringify(tools, null, 0), 'utf8');
  console.log(`\n\nTermine : ${done} traduits, ${failed} echecs. tools.json mis a jour.`);
  console.log('Relancez la commande pour continuer les outils restants (le script reprend ou il s est arrete).');
}

main().catch((e) => { console.error('\nErreur fatale:', e); process.exit(1); });
