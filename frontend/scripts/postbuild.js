/**
 * Hook post-build Next.js
 * Appelé automatiquement par npm après chaque "npm run build"
 * grâce au script "postbuild" dans package.json.
 */
const generateSitemap = require('./generate-sitemap');

console.log('\n🚀 Post-build : génération du sitemap...');
try {
  generateSitemap();
} catch (err) {
  // On avertit sans bloquer le build (process.exit(1) ferait échouer Vercel)
  console.warn('⚠️  Sitemap non généré :', err.message);
}
