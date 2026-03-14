import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import Link from 'next/link';

const ARTICLES = [
  { slug: 'meilleurs-comparateurs-antivirus-2025', category: 'Antivirus', catColor: 'text-gray-900 bg-red-900/20 border-red-500/20', date: '14 mar. 2025', readTime: '7 min', title: 'Meilleurs comparateurs d\'antivirus en 2025 : Top 10 pour faire le bon choix', excerpt: 'AV-TEST, AV-Comparatives, PCMag… On a analysé les meilleures plateformes pour comparer les antivirus et choisir la protection qui vous correspond vraiment.', emoji: '🛡️', featured: true },
  { slug: 'meilleurs-comparateurs-hebergement-web-2025', category: 'Hébergement', catColor: 'text-gray-900 bg-emerald-900/20 border-emerald-500/20', date: '14 mar. 2025', readTime: '8 min', title: 'Meilleurs comparateurs d\'hébergement web en 2025 : Top 10 pour choisir sans se tromper', excerpt: 'Hosting Facts, WPBeginner, Review Signal… Les meilleures plateformes pour comparer les hébergeurs web et ne pas se faire piéger par les offres trompeuses.', emoji: '🌐', featured: true },
  { slug: 'meilleurs-comparateurs-vpn-2025', category: 'VPN', catColor: 'text-gray-900 bg-blue-900/20 border-blue-500/20', date: '14 mar. 2025', readTime: '8 min', title: 'Meilleurs comparateurs de VPN en 2025 : Top 10 pour bien choisir', excerpt: 'VPNMentor, Privacy Guides, Comparitech… On a analysé les meilleures plateformes pour comparer les VPN et trouver celui qui correspond à vos besoins.', emoji: '🔒', featured: true },
  { slug: 'meilleurs-comparateurs-ia-2025', category: 'IA', catColor: 'text-gray-900 bg-purple-900/20 border-purple-500/20', date: '13 mar. 2025', readTime: '9 min', title: 'Meilleurs comparateurs d\'IA en 2025 : notre guide complet + Top 10', excerpt: 'Des centaines d\'outils IA existent. Mais quels comparateurs utiliser pour s\'y retrouver ? On a analysé les meilleures plateformes et sélectionné le top 10.', emoji: '🧠', featured: true },
  { slug: 'meilleur-vpn-2025', category: 'VPN', catColor: 'text-gray-900 bg-blue-900/20 border-blue-500/20', date: '18 fév. 2025', readTime: '8 min', title: 'Meilleur VPN 2025 : notre classement après 6 semaines de tests', excerpt: 'NordVPN, ExpressVPN, Proton VPN… On a tout testé. Voici le classement définitif pour 2025 avec des tests de vitesse réels, prix et verdict.', emoji: '🔐', featured: false },
  { slug: 'hebergement-wordpress-2025', category: 'Hébergement', catColor: 'text-gray-900 bg-emerald-900/20 border-emerald-500/20', date: '11 fév. 2025', readTime: '6 min', title: 'Quel hébergeur WordPress choisir en 2025 ? Guide complet', excerpt: 'Kinsta, o2switch, SiteGround ou Hostinger ? On compare les performances, prix et support pour vous aider à choisir.', emoji: '💻', featured: false },
  { slug: 'antivirus-gratuit-vs-payant', category: 'Antivirus', catColor: 'text-gray-900 bg-red-900/20 border-red-500/20', date: '4 fév. 2025', readTime: '5 min', title: 'Antivirus gratuit vs payant : vraiment une différence en 2025 ?', excerpt: 'Les antivirus gratuits suffisent-ils vraiment ? On analyse les différences concrètes pour vous aider à décider.', emoji: '🦠', featured: false },
  { slug: 'outils-ia-productivite', category: 'IA', catColor: 'text-gray-900 bg-purple-900/20 border-purple-500/20', date: '28 jan. 2025', readTime: '7 min', title: 'Top 5 outils IA pour booster votre productivité en 2025', excerpt: 'De ClickUp à Emergent, on vous présente les outils IA qui changent vraiment la façon de travailler.', emoji: '🤖', featured: false },
  { slug: 'vpn-streaming-netflix', category: 'VPN', catColor: 'text-gray-900 bg-blue-900/20 border-blue-500/20', date: '21 jan. 2025', readTime: '4 min', title: 'Les meilleurs VPN pour Netflix, Disney+ et le streaming en 2025', excerpt: 'Tous les VPN ne fonctionnent pas pour le streaming. On a testé les 10 principaux pour vous dire lesquels marchent vraiment.', emoji: '📺', featured: false },
  { slug: 'hebergement-petit-budget', category: 'Hébergement', catColor: 'text-gray-900 bg-emerald-900/20 border-emerald-500/20', date: '14 jan. 2025', readTime: '5 min', title: 'Héberger son site pour moins de 3€/mois : c\'est possible ?', excerpt: 'Petit budget, grandes ambitions. On a trouvé les hébergeurs les plus accessibles sans sacrifier les performances.', emoji: '💸', featured: false },
];

export default function BlogPage() {
  const featured = ARTICLES.filter(a => a.featured);
  const rest = ARTICLES.filter(a => !a.featured);

  return (
    <div className="min-h-screen">
      <SEO
        title="Blog Thecreamai — Guides, Comparatifs & Conseils outils"
        description="Retrouvez nos guides experts, comparatifs détaillés et conseils pratiques sur les meilleurs outils IA, VPN, hébergement web et antivirus."
        canonical="https://thecreamai.com/blog"
        keywords="blog outils IA, guide VPN, tutoriel hébergement web, conseils antivirus"
      />
      <Header />
      <main>
        <section className="relative py-24 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <span className="inline-block bg-purple-900/30 border border-purple-500/30 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">📰 Blog & Guides</span>
            <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
              Guides, conseils &<br />
              <span className="text-gray-900">comparatifs experts</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-lg mx-auto">Tout ce qu'il faut savoir sur les meilleurs outils du web, expliqué simplement.</p>
          </div>
        </section>

        <div className="container mx-auto px-6 pb-24">
          <div className="mb-14">
            <h2 className="text-sm font-bold mb-6 text-gray-900 uppercase tracking-wider">À la une</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((article, i) => (
                <Link key={i} href={`/blog/${article.slug}`} className="gradient-card rounded-2xl overflow-hidden hover:border-purple-500/50 hover:-translate-y-2 transition-all group block">
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 p-10 text-center text-6xl">{article.emoji}</div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${article.catColor}`}>{article.category}</span>
                      <span className="text-gray-600 text-xs">{article.date} · {article.readTime} de lecture</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-gray-900 transition-colors leading-snug">{article.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
                    <p className="text-gray-600 text-sm font-semibold mt-4">Lire l'article →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold mb-6 text-gray-900 uppercase tracking-wider">Tous les articles</h2>
            <div className="space-y-4">
              {rest.map((article, i) => (
                <Link key={i} href={`/blog/${article.slug}`} className="gradient-card rounded-2xl p-5 flex items-center gap-5 hover:border-purple-500/50 hover:-translate-y-1 transition-all group block">
                  <div className="w-14 h-14 rounded-xl bg-purple-900/30 flex items-center justify-center text-3xl flex-shrink-0">{article.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${article.catColor}`}>{article.category}</span>
                      <span className="text-gray-600 text-xs">{article.date} · {article.readTime}</span>
                    </div>
                    <h3 className="font-bold group-hover:text-gray-900 transition-colors truncate">{article.title}</h3>
                    <p className="text-gray-600 text-sm mt-0.5 truncate">{article.excerpt}</p>
                  </div>
                  <span className="text-gray-600 text-sm font-semibold flex-shrink-0 hidden sm:block">Lire →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
