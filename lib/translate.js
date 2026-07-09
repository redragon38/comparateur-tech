/**
 * lib/translate.js — traduction FR->EN d'un outil A LA DEMANDE (runtime), sans build.
 *
 * Utilisé par getStaticProps des pages EN (ISR fallback:'blocking') : quand une fiche
 * /en/tool/xxx est visitee et que l'anglais manque, on la traduit une fois puis Next
 * met la page en cache. Aucun build long, la traduction se remplit au fil des visites.
 *
 * Sans OPENROUTER_API_KEY, la fonction renvoie {} (l'appelant retombe sur le FR).
 * Les clés renvoyées sont PLATES ("en.short", "en.verdict", ...) pour coller au format
 * existant lu par pickToolText / applyLocale.
 */

const STRING_FIELDS = ['short', 'highlight', 'description', 'verdict'];
const ARRAY_FIELDS = ['strengths', 'strengthShort', 'limitations', 'limitationsShort', 'idealFor', 'notFor', 'tags'];
const ALL_FIELDS = [...STRING_FIELDS, ...ARRAY_FIELDS, 'article', 'faq', 'readMore', 'categories'];

const MODEL = process.env.TRANSLATE_MODEL || 'openai/gpt-4o-mini';
const API_URL = process.env.TRANSLATE_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

function apiKey() {
  return process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '';
}

/** Anglais déjà présent ? (clés plates en.short prioritaires) */
export function hasEnglish(tool) {
  return !!(tool && (tool['en.short'] || (tool.en && tool.en.short)));
}

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

function buildMessages(tool, src) {
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

async function callLLM(messages, key) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Traduit un outil et renvoie les clés plates en.* (ex: { 'en.short': '...', ... }).
 * - Si l'anglais existe déjà : renvoie {} (rien à faire).
 * - Sans clé API ou en cas d'échec : renvoie {} (l'appelant retombe sur le FR).
 */
export async function translateToolEn(tool) {
  if (!tool || hasEnglish(tool)) return {};
  const key = apiKey();
  if (!key) return {};
  const src = buildSource(tool);
  if (!Object.keys(src).length) return {};
  try {
    const raw = await callLLM(buildMessages(tool, src), key);
    const en = parseJsonLoose(raw);
    // readMore : garder le href FR, ne traduire que title/desc
    if (en.readMore && Array.isArray(tool.readMore)) {
      en.readMore = tool.readMore.map((orig, i) => ({
        href: orig.href,
        title: en.readMore[i]?.title || orig.title,
        desc: en.readMore[i]?.desc || orig.desc,
      }));
    }
    const out = {};
    for (const f of ALL_FIELDS) {
      if (en[f] !== undefined && src[f] !== undefined) out[`en.${f}`] = en[f];
    }
    return out;
  } catch {
    return {};
  }
}
