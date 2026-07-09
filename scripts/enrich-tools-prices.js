#!/usr/bin/env node
/**
 * Met à jour les prix dans public/data/tools.json :
 * - modèles IA API : tarifs OpenRouter (réels) + repli par tier
 * - fiches produits : prix publics affichés « à partir de »
 */
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'public', 'data', 'tools.json');
const openRouterPath = path.join(__dirname, '.openrouter-models.json');

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatPerM(usdPerToken) {
  const perM = usdPerToken * 1e6;
  if (perM >= 10) return perM.toFixed(2).replace('.', ',');
  if (perM >= 1) return perM.toFixed(2).replace('.', ',');
  return perM.toFixed(2).replace('.', ',');
}

function apiPriceLabel(inputPerToken, outputPerToken) {
  const inM = formatPerM(inputPerToken);
  const outM = formatPerM(outputPerToken);
  return `Pay-as-you-go · dès ${inM} $/M tokens (entrée) · ${outM} $/M (sortie)`;
}

/** USD par token (entrée / sortie), repli si pas de match OpenRouter */
const TIER_FALLBACK = [
  [/opus|o3-pro|gpt-5-pro|sonnet-4|claude-4-opus/i, { in: 15e-6, out: 75e-6 }],
  [/o3-mini|o1-pro|o1-preview|\bo1\b/i, { in: 15e-6, out: 60e-6 }],
  [/gpt-5|gpt-4o(?!-mini)|claude-3-5-sonnet|sonnet/i, { in: 2.5e-6, out: 10e-6 }],
  [/gpt-4o-mini|mini|haiku|flash|nano|turbo/i, { in: 0.15e-6, out: 0.6e-6 }],
  [/70b|72b|34b|32b/i, { in: 0.5e-6, out: 1.5e-6 }],
  [/8b|7b|9b/i, { in: 0.08e-6, out: 0.3e-6 }],
  [/3b|1b|2b/i, { in: 0.04e-6, out: 0.12e-6 }],
  [/free|oss|open/i, { in: 0, out: 0 }],
];

const DEFAULT_API = { in: 1e-6, out: 3e-6 };

/** Fiches produits : prix publics « à partir de » (engagement annuel quand applicable) */
const CURATED = {
  nordvpn: { price: 'À partir de 3,99 €/mois (engagement 2 ans)', priceMonthly: 3.99, priceCurrency: 'EUR' },
  surfshark: { price: 'À partir de 2,49 €/mois (engagement 2 ans)', priceMonthly: 2.49, priceCurrency: 'EUR' },
  'pia-vpn': { price: 'À partir de 2,19 $/mois (engagement 2 ans)', priceMonthly: 2.19, priceCurrency: 'USD' },
  'vypr-vpn': { price: 'À partir de 5 $/mois (facturation annuelle)', priceMonthly: 5, priceCurrency: 'USD' },
  'astrill-vpn': { price: 'À partir de 12,50 $/mois', priceMonthly: 12.5, priceCurrency: 'USD' },
  ovpn: { price: 'À partir de 4 $/mois (facturation annuelle)', priceMonthly: 4, priceCurrency: 'USD' },
  infomaniak: { price: 'À partir de 5,75 €/mois', priceMonthly: 5.75, priceCurrency: 'EUR' },
  gandi: { price: 'À partir de 4,99 €/mois', priceMonthly: 4.99, priceCurrency: 'EUR' },
  kaspersky: { price: 'À partir de 2,92 €/mois (suite annuelle)', priceMonthly: 2.92, priceCurrency: 'EUR' },
  webroot: { price: 'À partir de 2,08 €/mois (antivirus annuel)', priceMonthly: 2.08, priceCurrency: 'EUR' },
  'sophos-home': { price: 'À partir de 3,33 €/mois (Premium annuel)', priceMonthly: 3.33, priceCurrency: 'EUR' },
  grok: { price: 'Gratuit · X Premium+ dès 16 $/mois', priceMonthly: 16, priceCurrency: 'USD' },
  'mistral-ai': { price: 'Gratuit · API pay-as-you-go dès 0,10 $/M tokens', priceMonthly: null, priceCurrency: 'USD' },
  llama: { price: 'Gratuit · open source (API hébergée selon fournisseur)', priceMonthly: 0, priceCurrency: 'USD' },
  'stable-diffusion': { price: 'Gratuit · open source (API selon hébergeur)', priceMonthly: 0, priceCurrency: 'USD' },
  'openai-api': {
    price: 'Pay-as-you-go · dès 0,15 $/M tokens (GPT-4o mini entrée)',
    priceMonthly: null,
    priceCurrency: 'USD',
  },
  'anthropic-api': {
    price: 'Pay-as-you-go · dès 0,25 $/M tokens (Claude Haiku entrée)',
    priceMonthly: null,
    priceCurrency: 'USD',
  },
  cohere: {
    price: 'Gratuit (essai) · API dès 0,15 $/M tokens (Command R)',
    priceMonthly: null,
    priceCurrency: 'USD',
  },
  'mistral-large': {
    price: 'Pay-as-you-go · dès 2 $/M tokens (Mistral Large entrée)',
    priceMonthly: null,
    priceCurrency: 'USD',
  },
  'flux-ai': {
    price: 'Pay-as-you-go · dès 0,025 $/image (Flux Schnell)',
    priceMonthly: null,
    priceCurrency: 'USD',
  },
  'jasper-ai': { price: 'À partir de 49 $/mois', priceMonthly: 49, priceCurrency: 'USD' },
  'aws-amazon': { price: 'Pay-as-you-go (Bedrock, selon modèle)', priceMonthly: null, priceCurrency: 'USD' },
  snyk: { price: 'Gratuit · Team dès 25 $/mois / développeur', priceMonthly: 25, priceCurrency: 'USD' },
  semgrep: { price: 'Gratuit (OSS) · Pro dès 40 $/mois / développeur', priceMonthly: 40, priceCurrency: 'USD' },
  wazuh: { price: 'Gratuit (open source) · Cloud dès 20 $/mois', priceMonthly: 20, priceCurrency: 'USD' },
  trivy: { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'USD' },
  falco: { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'USD' },
  wireshark: { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'EUR' },
  nmap: { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'EUR' },
  'kali-linux': { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'EUR' },
  snort: { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'EUR' },
  'owasp-zap': { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'EUR' },
  keepass: { price: 'Gratuit · open source', priceMonthly: 0, priceCurrency: 'EUR' },
  crowdsec: { price: 'Gratuit (open source) · Console Pro dès 29 €/mois', priceMonthly: 29, priceCurrency: 'EUR' },
  authy: { price: 'Gratuit', priceMonthly: 0, priceCurrency: 'USD' },
  'urban-vpn': { price: 'Gratuit (limité)', priceMonthly: 0, priceCurrency: 'USD' },
  '360-total-security': { price: 'Gratuit · Premium dès 14,99 $/an', priceMonthly: 1.25, priceCurrency: 'USD' },
  burpsuite: { price: 'Gratuit (Community) · Pro dès 449 $/an', priceMonthly: 37.42, priceCurrency: 'USD' },
  metasploit: { price: 'Gratuit (Community) · Pro sur devis', priceMonthly: null, priceCurrency: 'USD' },
  'hashicorp-vault': { price: 'Gratuit (open source) · Enterprise sur devis', priceMonthly: null, priceCurrency: 'USD' },
  openvas: { price: 'Gratuit (Greenbone) · Enterprise sur devis', priceMonthly: null, priceCurrency: 'EUR' },
  pfsense: { price: 'Gratuit (CE) · Netgate Plus dès 129 $/an', priceMonthly: 10.75, priceCurrency: 'USD' },
  nessus: { price: 'Gratuit (Essentials) · Expert dès ~3 590 $/an', priceMonthly: null, priceCurrency: 'USD' },
  crowdstrike: { price: 'Sur devis (Falcon, entreprise)', priceMonthly: null, priceCurrency: 'USD' },
  'sentinel-one': { price: 'Sur devis (entreprise)', priceMonthly: null, priceCurrency: 'USD' },
  veracode: { price: 'Sur devis (entreprise)', priceMonthly: null, priceCurrency: 'USD' },
  'splunk-siem': { price: 'Sur devis (entreprise)', priceMonthly: null, priceCurrency: 'USD' },
};

function buildOpenRouterIndex(models) {
  const entries = [];
  for (const m of models) {
    const id = m.id.toLowerCase();
    const slug = id.split('/').pop();
    entries.push({ slug, model: m });
    const noDate = slug.replace(/-20\d{2,}$/, '');
    if (noDate !== slug) entries.push({ slug: noDate, model: m });
    entries.push({ slug: norm(id.replace(/\//g, '-')), model: m });
  }
  entries.sort((a, b) => b.slug.length - a.slug.length);
  return entries;
}

function extractCandidates(tool) {
  const id = norm(tool.id);
  const cands = new Set([id]);
  const parts = id.split('-');
  for (let i = 0; i < parts.length; i++) cands.add(parts.slice(i).join('-'));
  const m = id.match(/models?-(.+)$/);
  if (m) cands.add(m[1]);
  for (const tag of tool.tags || []) cands.add(norm(tag));
  return [...cands].sort((a, b) => b.length - a.length);
}

function matchOpenRouter(tool, entries) {
  const cands = extractCandidates(tool);
  for (const cand of cands) {
    for (const e of entries) {
      if (cand.length < 3) continue;
      if (
        cand === e.slug ||
        cand.endsWith(e.slug) ||
        e.slug.endsWith(cand) ||
        (cand.length >= 6 && cand.includes(e.slug))
      ) {
        return e.model;
      }
    }
  }
  return null;
}

function tierFallback(tool) {
  const hay = `${tool.id} ${tool.name} ${(tool.tags || []).join(' ')}`;
  for (const [re, prices] of TIER_FALLBACK) {
    if (re.test(hay)) return prices;
  }
  return DEFAULT_API;
}

function pricingFromModel(model) {
  const p = model?.pricing;
  if (!p) return null;
  const input = parseFloat(p.prompt);
  const output = parseFloat(p.completion);
  if (!Number.isFinite(input) || !Number.isFinite(output)) return null;
  return { in: input, out: output };
}

function enrichApiTool(tool, entries) {
  const matched = matchOpenRouter(tool, entries);
  const prices = pricingFromModel(matched) || tierFallback(tool);
  const price = prices.in === 0 && prices.out === 0
    ? 'Gratuit · open source / API hébergée'
    : apiPriceLabel(prices.in, prices.out);

  return {
    ...tool,
    price,
    priceMonthly: null,
    priceCurrency: 'USD',
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function enrichCurated(tool) {
  const patch = CURATED[tool.id];
  if (!patch) return tool;
  return {
    ...tool,
    ...patch,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function main() {
  if (!fs.existsSync(openRouterPath)) {
    console.error('Manque scripts/.openrouter-models.json, lancez :');
    console.error('curl -sS https://openrouter.ai/api/v1/models -o scripts/.openrouter-models.json');
    process.exit(1);
  }

  const tools = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const models = JSON.parse(fs.readFileSync(openRouterPath, 'utf8')).data || [];
  const entries = buildOpenRouterIndex(models);

  let apiUpdated = 0;
  let apiMatched = 0;
  let curatedUpdated = 0;

  const enriched = tools.map((tool) => {
    if (CURATED[tool.id]) {
      const out = enrichCurated(tool);
      if (out.price !== tool.price) curatedUpdated++;
      return out;
    }

    const isIaApiModel =
      tool.price === 'API' ||
      ((tool.categories || []).includes('Intelligence artificielle') &&
        !tool.hasReview &&
        tool.priceMonthly == null &&
        !String(tool.price || '').includes('$/M'));

    if (isIaApiModel) {
      const matched = matchOpenRouter(tool, entries);
      if (matched) apiMatched++;
      const out = enrichApiTool(tool, entries);
      if (out.price !== tool.price) apiUpdated++;
      return out;
    }

    return tool;
  });

  fs.writeFileSync(dataPath, JSON.stringify(enriched, null, 2) + '\n', 'utf8');

  console.log(
    JSON.stringify(
      {
        total: enriched.length,
        apiTools: enriched.filter((t) => t.price?.includes('Pay-as-you-go') || t.price?.includes('$/M')).length,
        openRouterMatches: apiMatched,
        apiLabelsUpdated: apiUpdated,
        curatedUpdated,
        stillApiLiteral: enriched.filter((t) => t.price === 'API').length,
        sansPrix: enriched.filter((t) => !t.price).length,
      },
      null,
      2
    )
  );
}

main();
