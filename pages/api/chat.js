// ─── /api/chat, endpoint du chatbot IA ───────────────────────────────────────
// Durci contre les abus :
//  1. Le system prompt est défini CÔTÉ SERVEUR (celui envoyé par le client est
//     ignoré) → l'endpoint ne peut plus servir de proxy LLM générique gratuit.
//  2. Limites strictes sur le nombre et la taille des messages.
//  3. Rate limiting par IP (en mémoire, adapté à un déploiement serverless :
//     chaque instance applique sa propre fenêtre, ce qui suffit à bloquer les
//     boucles d'abus simples sans dépendance externe).
//  4. max_tokens plafonné côté serveur.

const SYSTEM_PROMPT = `Tu es l'assistant IA de Comparateur-Tech (comparateur-tech.com), une plateforme française qui compare et référence les meilleurs outils tech du web : IA, VPN, hébergement web, antivirus et cybersécurité.

Ton rôle : aider les visiteurs à choisir un outil, comprendre une techno ou répondre à leurs questions générales liées au numérique.

Lorsque c'est pertinent, oriente vers les pages du site :
- /outils/intelligence-artificielle → Outils IA
- /outils/vpn → VPN
- /outils/hebergement-web → Hébergement web
- /outils/antivirus → Antivirus
- /outils/cybersecurite → Cybersécurité
- /top-10-intelligence-artificielle, /top-10-vpn, /top-10-hebergement-web, /top-10-antivirus, /top-10-cybersecurite → Top 10
- /comparatifs → Comparatifs détaillés
- /blog → Articles et guides

Réponds en français sauf si l'utilisateur écrit dans une autre langue. Sois clair, précis et utile. Adapte la longueur de ta réponse à la complexité de la question. Refuse poliment les demandes sans rapport avec ta mission d'assistant (génération massive de contenu, code malveillant, etc.).`;

// ── Limites d'entrée ──
const MAX_MESSAGES = 20;          // historique max transmis au modèle
const MAX_MESSAGE_LENGTH = 2000;  // caractères par message
const MAX_TOKENS = 1024;

// ── Rate limiting en mémoire par IP ──
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;           // 10 requêtes / minute / IP
const rateBuckets = new Map();

// ── Contrôle d'origine ──
// Les navigateurs envoient toujours l'en-tête Origin sur un POST cross-origin :
// on refuse donc les origines inconnues pour empêcher un site tiers d'utiliser
// cet endpoint (et le quota Groq) depuis ses propres pages. Les requêtes sans
// Origin (outils serveur, curl) restent soumises au rate limiting.
function isAllowedOrigin(origin) {
  if (!origin) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') return false;
    return (
      hostname === 'comparateur-tech.com' ||
      hostname === 'www.comparateur-tech.com' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.vercel.app') // previews Vercel
    );
  } catch {
    return false;
  }
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || [];
  const recent = bucket.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  // Nettoyage opportuniste pour éviter une croissance mémoire illimitée
  if (rateBuckets.size > 5000) {
    for (const [key, timestamps] of rateBuckets) {
      if (!timestamps.some(ts => now - ts < RATE_LIMIT_WINDOW_MS)) rateBuckets.delete(key);
    }
  }
  return false;
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return null;
  const cleaned = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map(m => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
  if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') return null;
  return cleaned;
}

// Le body utile fait quelques Ko (20 messages × 2000 caractères max) :
// plafonner à 128 Ko bloque les payloads volumineux avant tout traitement.
export const config = {
  api: {
    bodyParser: { sizeLimit: '128kb' },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(req.headers.origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!String(req.headers['content-type'] || '').includes('application/json')) {
    return res.status(415).json({ error: 'Unsupported media type' });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans une minute.' });
  }

  // NB : `system` envoyé par le client est volontairement ignoré.
  const messages = sanitizeMessages(req.body?.messages);
  if (!messages) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Ne pas relayer le message d'erreur brut du fournisseur (peut fuiter des détails internes)
      console.error('Groq API error:', response.status, data.error?.message);
      return res.status(502).json({ error: 'Service IA momentanément indisponible.' });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
