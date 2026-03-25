/**
 * /pages/sitemap.xml.js
 *
 * Génère un sitemap.xml dynamique à partir des données réelles.
 * Couvre toutes les routes statiques + les pages dynamiques (tools, blog, outils).
 *
 * POURQUOI : Sans sitemap, Google doit découvrir les pages par lui-même.
 * Avec 115+ outils, le risque d'oubli d'indexation est élevé.
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://comparateur-tech.com';

// Pages statiques avec leurs priorités et fréquences de mise à jour
const STATIC_PAGES = [
  { url: '/',                               changefreq: 'weekly',  priority: '1.0' },
  { url: '/outils',                         changefreq: 'weekly',  priority: '0.9' },
  { url: '/comparatifs',                    changefreq: 'weekly',  priority: '0.8' },
  { url: '/blog',                           changefreq: 'weekly',  priority: '0.8' },
  { url: '/outils/intelligence-artificielle', changefreq: 'weekly', priority: '0.8' },
  { url: '/ia-generative',                  changefreq: 'weekly',  priority: '0.7' },
  { url: '/top-10-vpn',                     changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-antivirus',               changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-hebergement-web',         changefreq: 'monthly', priority: '0.7' },
  { url: '/top-10-intelligence-artificielle', changefreq: 'monthly', priority: '0.7' },
  { url: '/partenaires',                    changefreq: 'monthly', priority: '0.5' },
  { url: '/pourquoi-nous',                  changefreq: 'monthly', priority: '0.5' },
  { url: '/temoignages',                    changefreq: 'monthly', priority: '0.5' },
  { url: '/newsletter',                     changefreq: 'monthly', priority: '0.4' },
  { url: '/contact',                        changefreq: 'yearly',  priority: '0.4' },
  { url: '/cgu',                            changefreq: 'yearly',  priority: '0.2' },
  { url: '/mentions-legales',               changefreq: 'yearly',  priority: '0.2' },
];

// Slugs des articles de blog (doit correspondre aux clés dans ARTICLES de /pages/blog/[slug].js)
const BLOG_SLUGS = [
  'meilleur-vpn-2025',
  'hebergement-wordpress-2025',
  'antivirus-gratuit-vs-payant',
  'outils-ia-productivite',
  'vpn-streaming-netflix',
  'meilleurs-comparateurs-ia-2025',
];

// Catégories dynamiques pour /outils/[category]
const OUTILS_CATEGORIES = [
  'vpn',
  'hebergement-web',
  'antivirus',
  'intelligence-artificielle',
];

function generateSitemap(tools) {
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = STATIC_PAGES.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const toolUrls = tools.map(t => `
  <url>
    <loc>${BASE_URL}/tool/${t.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const blogUrls = BLOG_SLUGS.map(slug => `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const categoryUrls = OUTILS_CATEGORIES.map(cat => `
  <url>
    <loc>${BASE_URL}/outils/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${categoryUrls}
${toolUrls}
${blogUrls}
</urlset>`;
}

function SitemapPage() {
  // getServerSideProps gère tout, ce composant n'est jamais rendu
  return null;
}

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
