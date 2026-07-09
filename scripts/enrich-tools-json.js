#!/usr/bin/env node
/**
 * Enrichit public/data/tools.json :
 * - supprime les entrées sans website (doublons hébergement vides)
 * - logos via Google favicon / Clearbit (domaine partenaire ou site)
 * - ratings dérivés du fournisseur / modèle (plus de 0 pour les squelettes IA)
 */
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'tools.json');
// Backups écrits HORS de public/ pour ne pas être servis publiquement.
const backupDir = path.join(__dirname, '..', 'data-backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
const backupPath = path.join(backupDir, `tools.json.bak-${new Date().toISOString().slice(0, 10)}`);
const DEFAULT_LOGO = '/logos/tool-default.svg';

/** Fournisseurs / marques connus → domaine + note éditoriale de base */
const BRAND = {
  OpenAI: { domain: 'openai.com', rating: 4.8 },
  Anthropic: { domain: 'anthropic.com', rating: 4.8 },
  'Google': { domain: 'google.com', rating: 4.5 },
  'Google DeepMind': { domain: 'deepmind.google', rating: 4.7 },
  Meta: { domain: 'meta.com', rating: 4.4 },
  Mistral: { domain: 'mistral.ai', rating: 4.5 },
  'Mistral AI': { domain: 'mistral.ai', rating: 4.5 },
  Cohere: { domain: 'cohere.com', rating: 4.5 },
  xAI: { domain: 'x.ai', rating: 4.3 },
  Perplexity: { domain: 'perplexity.ai', rating: 4.6 },
  'Perplexity AI': { domain: 'perplexity.ai', rating: 4.6 },
  Midjourney: { domain: 'midjourney.com', rating: 4.7 },
  'Midjourney Inc.': { domain: 'midjourney.com', rating: 4.7 },
  Stability: { domain: 'stability.ai', rating: 4.5 },
  'Stability AI': { domain: 'stability.ai', rating: 4.5 },
  Nvidia: { domain: 'nvidia.com', rating: 4.6 },
  Amazon: { domain: 'amazon.com', rating: 4.6 },
  'Amazon Bedrock': { domain: 'aws.amazon.com', rating: 4.6 },
  Microsoft: { domain: 'microsoft.com', rating: 4.5 },
  'Azure Cognitive Services': { domain: 'azure.microsoft.com', rating: 4.5 },
  Cloudflare: { domain: 'cloudflare.com', rating: 4.7 },
  'Cloudflare AI Gateway': { domain: 'cloudflare.com', rating: 4.6 },
  DigitalOcean: { domain: 'digitalocean.com', rating: 4.6 },
  GitHub: { domain: 'github.com', rating: 4.6 },
  'GitHub Models': { domain: 'github.com', rating: 4.6 },
  Ollama: { domain: 'ollama.com', rating: 4.4 },
  'Ollama Cloud': { domain: 'ollama.com', rating: 4.4 },
  HuggingFace: { domain: 'huggingface.co', rating: 4.5 },
  'Hugging Face': { domain: 'huggingface.co', rating: 4.5 },
  Replicate: { domain: 'replicate.com', rating: 4.4 },
  Together: { domain: 'together.ai', rating: 4.4 },
  Groq: { domain: 'groq.com', rating: 4.5 },
  Fireworks: { domain: 'fireworks.ai', rating: 4.4 },
  Clarifai: { domain: 'clarifai.com', rating: 4.3 },
  NanoGPT: { domain: 'nano-gpt.com', rating: 4.2 },
  'Kilo Gateway': { domain: 'kilo.ai', rating: 4.2 },
  'Vercel AI Gateway': { domain: 'vercel.com', rating: 4.3 },
  Poe: { domain: 'poe.com', rating: 4.3 },
  NovitaAI: { domain: 'novita.ai', rating: 4.2 },
  'LLM Gateway': { domain: 'llmgateway.io', rating: 4.2 },
  Venice: { domain: 'venice.ai', rating: 4.2 },
  'Venice AI': { domain: 'venice.ai', rating: 4.2 },
  SiliconFlow: { domain: 'siliconflow.cn', rating: 4.2 },
  'SiliconFlow (China)': { domain: 'siliconflow.cn', rating: 4.2 },
  Alibaba: { domain: 'alibabacloud.com', rating: 4.4 },
  'Alibaba (China)': { domain: 'alibabacloud.com', rating: 4.4 },
  Qwen: { domain: 'qwen.ai', rating: 4.4 },
  DeepSeek: { domain: 'deepseek.com', rating: 4.5 },
  ByteDance: { domain: 'bytedance.com', rating: 4.3 },
  Snyk: { domain: 'snyk.io', rating: 4.7 },
  Semgrep: { domain: 'semgrep.dev', rating: 4.6 },
  Wazuh: { domain: 'wazuh.com', rating: 4.7 },
  Trivy: { domain: 'aqua.security', rating: 4.8 },
  Falco: { domain: 'falco.org', rating: 4.6 },
};

/** Préfixes d’id → marque modèle (quand partner = passerelle) */
const ID_PREFIX = [
  ['openai-', { domain: 'openai.com', rating: 4.8 }],
  ['openai', { domain: 'openai.com', rating: 4.8 }],
  ['anthropic', { domain: 'anthropic.com', rating: 4.8 }],
  ['claude', { domain: 'anthropic.com', rating: 4.8 }],
  ['gpt-', { domain: 'openai.com', rating: 4.7 }],
  ['gemini', { domain: 'google.com', rating: 4.5 }],
  ['google', { domain: 'google.com', rating: 4.5 }],
  ['mistral', { domain: 'mistral.ai', rating: 4.5 }],
  ['llama', { domain: 'meta.com', rating: 4.4 }],
  ['meta-', { domain: 'meta.com', rating: 4.4 }],
  ['qwen', { domain: 'qwen.ai', rating: 4.4 }],
  ['deepseek', { domain: 'deepseek.com', rating: 4.5 }],
  ['grok', { domain: 'x.ai', rating: 4.3 }],
  ['cohere', { domain: 'cohere.com', rating: 4.5 }],
  ['nvidia', { domain: 'nvidia.com', rating: 4.6 }],
  ['flux', { domain: 'blackforestlabs.ai', rating: 4.6 }],
  ['stable-diffusion', { domain: 'stability.ai', rating: 4.5 }],
  ['dall-e', { domain: 'openai.com', rating: 4.5 }],
  ['solar-', { domain: 'upstage.ai', rating: 4.3 }],
  ['glm', { domain: 'zhipuai.cn', rating: 4.3 }],
  ['doubao', { domain: 'volcengine.com', rating: 4.3 }],
  ['hf-', { domain: 'huggingface.co', rating: 4.4 }],
];

const DOC_HOST_RE = /^(docs|doc|learn|developers|api|cloud)\./i;
const GENERIC_HOSTS = new Set([
  'github.com',
  'gitlab.com',
  'bitbucket.org',
  'localhost',
]);

function hashCount(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 18 + (h % 72);
}

function hostFromUrl(url) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    let host = new URL(url).hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    return host || null;
  } catch {
    return null;
  }
}

function registrableDomain(host) {
  if (!host) return null;
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const multi = new Set(['co.uk', 'com.au', 'com.br', 'co.jp', 'com.cn']);
  const tail = parts.slice(-2).join('.');
  if (multi.has(tail) && parts.length >= 3) return parts.slice(-3).join('.');
  return parts.slice(-2).join('.');
}

function isUsableBrandHost(host) {
  if (!host || GENERIC_HOSTS.has(host)) return false;
  if (DOC_HOST_RE.test(host)) return false;
  if (host.includes('amazonaws.com')) return false;
  return true;
}

function brandFromId(id) {
  const lower = (id || '').toLowerCase();
  for (const [prefix, brand] of ID_PREFIX) {
    if (lower.startsWith(prefix) || lower.includes(`-${prefix}`)) return brand;
  }
  return null;
}

function brandFromPartner(partner) {
  if (!partner) return null;
  if (BRAND[partner]) return BRAND[partner];
  const key = Object.keys(BRAND).find(
    (k) => k.toLowerCase() === partner.toLowerCase()
  );
  return key ? BRAND[key] : null;
}

function resolveBrand(tool) {
  const fromId = brandFromId(tool.id);
  const fromPartner = brandFromPartner(tool.partner);
  const isIa = (tool.categories || []).includes('Intelligence artificielle');

  // Modèle IA : logo/note du éditeur du modèle (OpenAI, Anthropic…) avant la passerelle
  if (isIa && fromId) return fromId;
  if (fromPartner) return fromPartner;
  if (fromId) return fromId;

  const host = hostFromUrl(tool.website);
  if (host && isUsableBrandHost(host)) {
    const domain = registrableDomain(host);
    return { domain, rating: 4.3 };
  }

  if (host) {
    return { domain: registrableDomain(host), rating: 4.2 };
  }

  return null;
}

function faviconLogo(domain) {
  if (!domain) return DEFAULT_LOGO;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

function clearbitLogo(domain) {
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function pickLogo(tool, brand) {
  const existing = (tool.logo || '').trim();
  // Conserver uniquement les logos locaux déjà validés
  if (existing.startsWith('/partners/') || existing.startsWith('/logos/')) {
    return existing;
  }

  const domain = brand?.domain || registrableDomain(hostFromUrl(tool.website));
  if (!domain) return DEFAULT_LOGO;

  // Clearbit en priorité (meilleure qualité), favicon Google en secours côté navigateur via même domaine
  return clearbitLogo(domain) || faviconLogo(domain);
}

function isIaApiTool(tool) {
  return (
    tool.price === 'API' ||
    (tool.categories || []).includes('Intelligence artificielle')
  );
}

function pickRating(tool, brand) {
  const current = tool.rating?.value || 0;
  const isCurated =
    tool.hasReview || (tool.logo || '').startsWith('/partners/');
  const keepExisting =
    current > 0 && (isCurated || !isIaApiTool(tool));

  if (keepExisting) {
    return {
      value: current,
      count: tool.rating?.count || hashCount(tool.id),
    };
  }

  const base = brand?.rating ?? 4.2;
  const value = isIaApiTool(tool)
    ? Math.min(4.9, Math.max(4.0, Math.round((base - 0.15) * 10) / 10))
    : base;

  return { value, count: hashCount(tool.id) };
}

function enrichTool(tool) {
  const brand = resolveBrand(tool);
  const logo = pickLogo(tool, brand);
  const rating = pickRating(tool, brand);
  const changed = logo !== (tool.logo || '') || rating.value !== (tool.rating?.value || 0);

  return {
    ...tool,
    logo,
    rating,
    _changed: changed,
  };
}

function main() {
  const raw = fs.readFileSync(dataPath, 'utf8');
  const tools = JSON.parse(raw);

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(dataPath, backupPath);
    console.log(`Sauvegarde : ${backupPath}`);
  }

  const removed = tools.filter((t) => !(t.website || '').trim());
  const kept = tools.filter((t) => (t.website || '').trim());

  let logoFilled = 0;
  let ratingFilled = 0;
  const enriched = kept.map((tool) => {
    const hadLogo = !!(tool.logo || '').trim();
    const hadRating = (tool.rating?.value || 0) > 0;
    const out = enrichTool(tool);
    if (!hadLogo && out.logo) logoFilled++;
    if (!hadRating && out.rating.value > 0) ratingFilled++;
    delete out._changed;
    return out;
  });

  fs.writeFileSync(dataPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');

  const stats = {
    avant: tools.length,
    supprimés: removed.length,
    après: enriched.length,
    logosAjoutés: logoFilled,
    notesAjoutées: ratingFilled,
    sansLogo: enriched.filter((t) => !(t.logo || '').trim()).length,
    noteZero: enriched.filter((t) => !(t.rating?.value > 0)).length,
    sansSite: enriched.filter((t) => !(t.website || '').trim()).length,
  };

  console.log(JSON.stringify(stats, null, 2));
  if (removed.length) {
    console.log(
      'Exemples supprimés:',
      removed.slice(0, 5).map((t) => t.id).join(', ')
    );
  }
}

main();
