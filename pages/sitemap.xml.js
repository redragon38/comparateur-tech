import fs from 'fs';
import path from 'path';
import { IA_SUBCATEGORIES } from '../lib/ia-subcategories';

const BASE_URL = (process.env.SITE_URL || 'https://comparateur-tech.com').replace(/\/$/, '');

// lastmod must reflect meaningful content changes, not the build date.
const STATIC_PAGES = [
  { path: '/', lastmod: '2026-04-19' },
  { path: '/outils', lastmod: '2026-04-19' },
  { path: '/comparatifs', lastmod: '2026-04-19' },
  { path: '/blog', lastmod: '2026-05-02' },
  { path: '/methodologie', lastmod: '2026-05-02' },
  { path: '/outils/intelligence-artificielle', lastmod: '2026-05-02' },
  { path: '/ia-generative', lastmod: '2026-05-02' },
  { path: '/top-10-vpn', lastmod: '2026-05-02' },
  { path: '/top-10-antivirus', lastmod: '2026-05-02' },
  { path: '/top-10-hebergement-web', lastmod: '2026-05-02' },
  { path: '/top-10-intelligence-artificielle', lastmod: '2026-05-02' },
  { path: '/top-10-cybersecurite', lastmod: '2026-05-02' },
  { path: '/partenaires', lastmod: '2025-12-01' },
  { path: '/pourquoi-nous', lastmod: '2025-12-01' },
  { path: '/temoignages', lastmod: '2025-12-01' },
  { path: '/newsletter', lastmod: '2025-12-01' },
  { path: '/contact', lastmod: '2025-09-01' },
  { path: '/cgu', lastmod: '2026-05-02' },
  { path: '/mentions-legales', lastmod: '2026-05-02' },
];

// Blog articles kept in sync with pages/blog/index.js and pages/blog/[slug].js.
const BLOG_ARTICLES = [
  { path: '/blog/openai-api-vs-anthropic-api', lastmod: '2026-04-19' },
  { path: '/blog/meilleurs-comparateurs-ia-2025', lastmod: '2025-03-13' },
  { path: '/blog/meilleurs-comparateurs-vpn-2025', lastmod: '2025-03-14' },
  { path: '/blog/meilleurs-comparateurs-antivirus-2025', lastmod: '2025-03-14' },
  { path: '/blog/meilleurs-comparateurs-hebergement-web-2025', lastmod: '2026-05-02' },
  { path: '/blog/meilleur-vpn-2025', lastmod: '2025-02-18' },
  { path: '/blog/hebergement-wordpress-2025', lastmod: '2025-02-11' },
  { path: '/blog/antivirus-gratuit-vs-payant', lastmod: '2025-02-04' },
  { path: '/blog/outils-ia-productivite', lastmod: '2025-01-28' },
  { path: '/blog/vpn-streaming-netflix', lastmod: '2025-01-21' },
  { path: '/blog/hebergement-petit-budget', lastmod: '2025-01-14' },
];

const TOOL_CATEGORIES = [
  'vpn',
  'hebergement-web',
  'antivirus',
  'cybersecurite',
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function normalizeLastmod(value, fallback) {
  const date = String(value || fallback || '').slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : fallback;
}

function urlEntry({ path: urlPath, lastmod }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(`${BASE_URL}${urlPath}`)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    '  </url>',
  ].join('\n');
}

function generateSitemap(tools) {
  const catalogLastmod = tools
    .map(tool => tool.updatedAt || tool.createdAt)
    .filter(Boolean)
    .sort()
    .pop() || '2026-04-19';

  const categoryUrls = TOOL_CATEGORIES.map(category => ({
    path: `/outils/${category}`,
    lastmod: catalogLastmod,
  }));

  const iaSubcategoryUrls = IA_SUBCATEGORIES.map(subcategory => ({
    path: `/outils/intelligence-artificielle/${subcategory.slug}`,
    lastmod: catalogLastmod,
  }));

  const toolUrls = tools
    .filter(tool => tool.id)
    .map(tool => ({
      path: `/tool/${tool.id}`,
      lastmod: normalizeLastmod(tool.updatedAt || tool.createdAt, catalogLastmod),
    }));

  const urls = [
    ...STATIC_PAGES,
    ...categoryUrls,
    ...iaSubcategoryUrls,
    ...BLOG_ARTICLES,
    ...toolUrls,
  ];

  const uniqueUrls = Array.from(
    new Map(urls.map(item => [item.path, {
      path: item.path,
      lastmod: normalizeLastmod(item.lastmod, catalogLastmod),
    }])).values()
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(urlEntry).join('\n')}
</urlset>`;
}

function SitemapPage() {
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
