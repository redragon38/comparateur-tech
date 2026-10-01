#!/usr/bin/env node

/**
 * Validate the generated sitemap without depending on a third-party package.
 *
 * Usage:
 *   SITEMAP_URL=http://localhost:3000/sitemap.xml node scripts/validate-sitemap.js
 *   npm run sitemap:validate
 */

const sitemapUrl = process.env.SITEMAP_URL || `${process.env.SITE_URL || 'https://comparateur-tech.com'}/sitemap.xml`;

function fail(message) {
  console.error(`✗ Sitemap invalide : ${message}`);
  process.exitCode = 1;
}

async function main() {
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    fail(`HTTP ${response.status} pour ${sitemapUrl}`);
    return;
  }

  const xml = await response.text();
  if (!xml.includes('<urlset') || !xml.includes('</urlset>')) {
    fail('racine XML <urlset> introuvable');
    return;
  }

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(match => match[1]);
  const duplicates = locs.filter((loc, index) => locs.indexOf(loc) !== index);
  const invalidLocs = locs.filter(loc => {
    try {
      const parsed = new URL(loc);
      return parsed.protocol !== 'https:' || parsed.hostname !== 'comparateur-tech.com' || /\s/.test(loc);
    } catch {
      return true;
    }
  });
  const invalidDates = lastmods.filter(date => !/^\d{4}-\d{2}-\d{2}$/.test(date));

  if (!locs.length) return fail('aucune URL trouvée');
  if (duplicates.length) return fail(`${duplicates.length} URL dupliquée(s)`);
  if (invalidLocs.length) return fail(`${invalidLocs.length} URL non canonique(s) ou non HTTPS`);
  if (invalidDates.length) return fail(`${invalidDates.length} lastmod invalide(s)`);

  console.log(`✓ Sitemap valide : ${locs.length} URL(s), ${lastmods.length} lastmod, aucune duplication.`);
}

main().catch(error => fail(error.message));
