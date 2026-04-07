import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://comparateur-tech.com';

const STATIC_PAGES = [
  { url: '/',                                 changefreq: 'weekly',  priority: '1.0' },
  { url: '/outils',                           changefreq: 'weekly',  priority: '0.9' },
  { url: '/comparatifs',                      changefreq: 'weekly',  priority: '0.8' },
  { url: '/blog',                             changefreq: 'weekly',  priority: '0.8' },
  { url: '/outils/intelligence-artificielle', changefreq: 'weekly',  priority: '0.8' },
  { url: '/ia-generative',                    changefreq: 'weekly',  priority: '0.7' },
  { url: '/top-10-vpn',                       changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-antivirus',                 changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-hebergement-web',           changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-intelligence-artificielle', changefreq: 'monthly', priority: '0.7' },
  { url: '/partenaires',                      changefreq: 'monthly', priority: '0.5' },
  { url: '/pourquoi-nous',                    changefreq: 'monthly', priority: '0.5' },
  { url: '/temoignages',                      changefreq: 'monthly', priority: '0.5' },
  { url: '/newsletter',                       changefreq: 'monthly', priority: '0.4' },
  { url: '/contact',                          changefreq: 'yearly',  priority: '0.4' },
  { url: '/cgu',                              changefreq: 'yearly',  priority: '0.2' },
  { url: '/mentions-legales',                 changefreq: 'yearly',  priority: '0.2' },
];

// Tous les articles blog (synchronisé avec pages/blog/index.js et pages/blog/[slug].js)
const BLOG_ARTICLES = [
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
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = STATIC_PAGES.map(p =>
    urlEntry(p.url, today, p.changefreq, p.priority)
  ).join('');

  const categoryUrls = OUTILS_CATEGORIES.map(cat =>
    urlEntry(`/outils/${cat}`, today, 'weekly', '0.7')
  ).join('');

  const iaSubUrls = IA_SUBCATEGORIES.map(sub =>
    urlEntry(`/outils/intelligence-artificielle/${sub}`, today, 'weekly', '0.6')
  ).join('');

  const toolUrls = tools.map(t =>
    urlEntry(`/tool/${t.id}`, t.updatedAt || t.createdAt || today, 'monthly', '0.8')
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
