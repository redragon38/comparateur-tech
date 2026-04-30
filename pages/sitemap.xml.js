import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://comparateur-tech.com';

// lastmod : vraie date de dernière modif éditoriale, pas la date du build.
// Mettre à jour manuellement quand le contenu de la page change.
const STATIC_PAGES = [
  { url: '/',                                 lastmod: '2026-04-19', changefreq: 'weekly',  priority: '1.0' },
  { url: '/outils',                           lastmod: '2026-04-19', changefreq: 'weekly',  priority: '0.9' },
  { url: '/comparatifs',                      lastmod: '2026-04-19', changefreq: 'weekly',  priority: '0.8' },
  { url: '/blog',                             lastmod: '2026-04-19', changefreq: 'weekly',  priority: '0.8' },
  { url: '/outils/intelligence-artificielle', lastmod: '2026-04-19', changefreq: 'weekly',  priority: '0.8' },
  { url: '/ia-generative',                    lastmod: '2026-04-19', changefreq: 'weekly',  priority: '0.7' },
  { url: '/top-10-vpn',                       lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-antivirus',                 lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-hebergement-web',           lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-intelligence-artificielle', lastmod: '2026-04-19', changefreq: 'monthly', priority: '0.7' },
  { url: '/partenaires',                      lastmod: '2025-12-01', changefreq: 'monthly', priority: '0.5' },
  { url: '/pourquoi-nous',                    lastmod: '2025-12-01', changefreq: 'monthly', priority: '0.5' },
  { url: '/temoignages',                      lastmod: '2025-12-01', changefreq: 'monthly', priority: '0.5' },
  { url: '/newsletter',                       lastmod: '2025-12-01', changefreq: 'monthly', priority: '0.4' },
  { url: '/contact',                          lastmod: '2025-09-01', changefreq: 'yearly',  priority: '0.4' },
  { url: '/cgu',                              lastmod: '2025-09-01', changefreq: 'yearly',  priority: '0.2' },
  { url: '/mentions-legales',                 lastmod: '2025-09-01', changefreq: 'yearly',  priority: '0.2' },
];

// Tous les articles blog (synchronisé avec pages/blog/index.js et pages/blog/[slug].js)
const BLOG_ARTICLES = [
  { slug: 'openai-api-vs-anthropic-api',                date: '2026-04-19' },
  { slug: 'meilleurs-comparateurs-ia-2025',             date: '2025-03-13' },
  { slug: 'meilleurs-comparateurs-vpn-2025',            date: '2025-03-14' },
  { slug: 'meilleurs-comparateurs-antivirus-2025',      date: '2025-03-14' },
  { slug: 'meilleurs-comparateurs-hebergement-web-2025',date: '2025-03-14' },
  { slug: 'meilleur-vpn-2025',                          date: '2025-02-18' },
  { slug: 'hebergement-wordpress-2025',                 date: '2025-02-11' },
  { slug: 'antivirus-gratuit-vs-payant',                date: '2025-02-04' },
  { slug: 'outils-ia-productivite',                     date: '2025-01-28' },
  { slug: 'vpn-streaming-netflix',                      date: '2025-01-21' },
  { slug: 'hebergement-petit-budget',                   date: '2025-01-14' },
];

const OUTILS_CATEGORIES = [
  'vpn',
  'hebergement-web',
  'antivirus',
  'cybersecurite',
  'intelligence-artificielle',
];

const IA_SUBCATEGORIES = [
  'redaction', 'image', 'video', 'recherche', 'agent', 'productivite', 'code', 'audio',
];

function urlEntry(loc, lastmod, changefreq, priority) {
  return `
  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap(tools) {
  // Date de référence pour les pages dépendantes du catalogue (catégories, sous-catégories).
  // On prend la date de modif la plus récente parmi les outils → Google détecte les vrais changements.
  const catalogLastmod = tools
    .map(t => t.updatedAt || t.createdAt)
    .filter(Boolean)
    .sort()
    .pop() || '2026-04-19';

  const staticUrls = STATIC_PAGES.map(p =>
    urlEntry(p.url, p.lastmod, p.changefreq, p.priority)
  ).join('');

  const categoryUrls = OUTILS_CATEGORIES.map(cat =>
    urlEntry(`/outils/${cat}`, catalogLastmod, 'weekly', '0.7')
  ).join('');

  const iaSubUrls = IA_SUBCATEGORIES.map(sub =>
    urlEntry(`/outils/intelligence-artificielle/${sub}`, catalogLastmod, 'weekly', '0.6')
  ).join('');

  const toolUrls = tools.map(t =>
    urlEntry(`/tool/${t.id}`, t.updatedAt || t.createdAt || catalogLastmod, 'monthly', '0.8')
  ).join('');

  const blogUrls = BLOG_ARTICLES.map(a =>
    urlEntry(`/blog/${a.slug}`, a.date, 'monthly', '0.7')
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls}
${categoryUrls}
${iaSubUrls}
${toolUrls}
${blogUrls}
</urlset>`;
}

function SitemapPage() { return null; }

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const sitemap = generateSitemap(tools);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default SitemapPage;
