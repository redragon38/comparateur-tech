import fs from 'fs';
import path from 'path';
import { IA_SUBCATEGORIES } from '../lib/ia-subcategories';
import { DECISION_PAGES } from '../lib/decision-pages';
import {
  USECASE_PAGES,
  getComparisonPairs,
  getIndexableAlternativeUrls,
  getUsecaseTools,
} from '../lib/programmatic-seo';

const BASE_URL = (process.env.SITE_URL || 'https://comparateur-tech.com').replace(/\/$/, '');
const PRIORITY_URL_LIMIT = 500;
const MIN_DESCRIPTION_LENGTH = 80;

const STATIC_PRIORITY_PAGES = [
  { path: '/', lastmod: '2026-04-19' },
  { path: '/outils', lastmod: '2026-04-19' },
  { path: '/comparatifs', lastmod: '2026-07-04' },
  { path: '/barometre-prix-vpn', lastmod: '2026-07-04' },
  { path: '/calculateur-hebergement', lastmod: '2026-07-04' },
  { path: '/alternatives', lastmod: '2026-06-03' },
  { path: '/ia', lastmod: '2026-06-03' },
  { path: '/vpn', lastmod: '2026-06-03' },
  { path: '/hebergement', lastmod: '2026-06-03' },
  { path: '/cybersecurite', lastmod: '2026-06-03' },
  { path: '/outils/intelligence-artificielle', lastmod: '2026-05-02' },
  { path: '/top-10-vpn', lastmod: '2026-05-02' },
  { path: '/top-10-antivirus', lastmod: '2026-05-02' },
  { path: '/top-10-hebergement-web', lastmod: '2026-05-02' },
  { path: '/top-10-intelligence-artificielle', lastmod: '2026-05-02' },
  { path: '/top-10-cybersecurite', lastmod: '2026-05-02' },
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

function hasStrongToolData(tool) {
  const description = tool.description || tool.shortDescription || tool.summary || '';
  return Boolean(tool.id && tool.name && description.length >= MIN_DESCRIPTION_LENGTH);
}

function toolPriorityScore(tool) {
  let score = 0;
  const description = tool.description || tool.shortDescription || tool.summary || '';

  if (tool.featured || tool.isFeatured) score += 80;
  if (tool.popular || tool.isPopular) score += 70;
  if (tool.rating) score += Number(tool.rating) * 10;
  if (tool.category) score += 15;
  if (tool.pricing || tool.price) score += 10;
  if (tool.website || tool.url) score += 10;
  if (description.length >= 300) score += 20;
  if (description.length >= 700) score += 20;
  if (tool.updatedAt) score += 10;

  return score;
}

function generatePrioritySitemap(tools) {
  const catalogLastmod = tools
    .map(tool => tool.updatedAt || tool.createdAt)
    .filter(Boolean)
    .sort()
    .pop() || '2026-04-19';

  const categoryUrls = TOOL_CATEGORIES.map(category => ({
    path: `/outils/${category}`,
    lastmod: catalogLastmod,
  }));

  const iaSubcategoryUrls = IA_SUBCATEGORIES.slice(0, 80).map(subcategory => ({
    path: `/outils/intelligence-artificielle/${subcategory.slug}`,
    lastmod: catalogLastmod,
  }));

  const decisionUrls = Object.values(DECISION_PAGES)
    .filter(page => page.canonicalPath)
    .slice(0, 80)
    .map(page => ({
      path: page.canonicalPath,
      lastmod: page.lastmod || catalogLastmod,
    }));

  const strongTools = tools
    .filter(hasStrongToolData)
    .sort((a, b) => toolPriorityScore(b) - toolPriorityScore(a));

  const toolUrls = strongTools.slice(0, 160).map(tool => ({
    path: `/tool/${tool.id}`,
    lastmod: normalizeLastmod(tool.updatedAt || tool.createdAt, catalogLastmod),
  }));

  const alternativeUrls = getIndexableAlternativeUrls(strongTools)
    .slice(0, 100)
    .map(pagePath => ({
      path: pagePath,
      lastmod: catalogLastmod,
    }));

  const comparisonUrls = getComparisonPairs(strongTools)
    .slice(0, 100)
    .map(pair => ({
      path: pair.path,
      lastmod: catalogLastmod,
    }));

  const usecaseUrls = USECASE_PAGES
    .filter(page => getUsecaseTools(tools, page, 8).length >= 5)
    .slice(0, 50)
    .map(page => ({
      path: `/meilleurs-outils/${page.slug}`,
      lastmod: catalogLastmod,
    }));

  const urls = [
    ...STATIC_PRIORITY_PAGES,
    ...categoryUrls,
    ...iaSubcategoryUrls,
    ...decisionUrls,
    ...usecaseUrls,
    ...alternativeUrls,
    ...comparisonUrls,
    ...toolUrls,
  ];

  const uniqueUrls = Array.from(
    new Map(urls.map(item => [item.path, {
      path: item.path,
      lastmod: normalizeLastmod(item.lastmod, catalogLastmod),
    }])).values()
  ).slice(0, PRIORITY_URL_LIMIT);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(urlEntry).join('\n')}
</urlset>`;
}

function SitemapPriorityPage() {
  return null;
}

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const sitemap = generatePrioritySitemap(tools);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default SitemapPriorityPage;
