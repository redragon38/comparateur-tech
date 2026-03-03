import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Star, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolCard from '../../components/ToolCard';
import SEO from '../../components/SEO';

// Fonction utilitaire pour normaliser les slugs (enlever accents)
function normalizeSlug(text) {
  return text.toLowerCase()
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/à/g, 'a')
    .replace(/ù/g, 'u')
    .replace(/ô/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ /g, '-');
}

// Métadonnées par catégorie
const CATEGORY_META = {
  'intelligence-artificielle': {
    label: 'Intelligence artificielle',
    icon: '🤖',
    color: 'from-purple-600 to-violet-500',
    colorSolid: '#a855f7',
    glow: 'rgba(168,85,247,0.2)',
    border: 'border-purple-500/30',
    bg: 'bg-purple-900/20',
    textColor: 'text-gray-900',
    desc: 'Boostez votre productivité avec des outils IA de pointe : automatisation, génération de contenu, analyse et bien plus encore.',
    longDesc: "L'intelligence artificielle révolutionne la façon dont les créateurs et entrepreneurs travaillent. Des outils de génération de contenu aux plateformes d'automatisation, découvrez comment l'IA peut transformer votre quotidien.",
  },
  'hebergement-web': {
    label: 'Hébergement web',
    icon: '🌐',
    color: 'from-emerald-600 to-teal-500',
    colorSolid: '#10b981',
    glow: 'rgba(16,185,129,0.2)',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-900/20',
    textColor: 'text-gray-900',
    desc: 'Hébergez vos sites et applications web avec les meilleures plateformes sélectionnées par TheCreamAI.',
    longDesc: "Un hébergement web fiable est la fondation de tout projet en ligne. Qu'il s'agisse d'un blog, d'une boutique e-commerce ou d'une application web, choisir le bon hébergeur est crucial pour la performance, la sécurité et la disponibilité de votre site.",
  },
  'vpn': {
    label: 'VPN',
    icon: '🛡️',
    color: 'from-blue-600 to-cyan-500',
    colorSolid: '#3b82f6',
    glow: 'rgba(59,130,246,0.2)',
    border: 'border-blue-500/30',
    bg: 'bg-blue-900/20',
    textColor: 'text-gray-900',
    desc: 'Protégez votre vie privée, sécurisez vos connexions et naviguez librement avec les meilleurs VPN sélectionnés par TheCreamAI.',
    longDesc: 'Un VPN (Virtual Private Network) est indispensable pour tout créateur ou entrepreneur soucieux de sa sécurité numérique. Que vous travailliez depuis un café, en déplacement ou depuis chez vous, un VPN chiffre vos connexions et masque votre adresse IP.',
  },
  'ia-generative': {
    label: 'IA générative',
    icon: '✨',
    color: 'from-pink-600 to-violet-500',
    colorSolid: '#ec4899',
    glow: 'rgba(236,72,153,0.2)',
    border: 'border-pink-500/30',
    bg: 'bg-pink-900/20',
    textColor: 'text-gray-900',
    desc: 'Générez du texte, des images et des vidéos avec les meilleurs outils d\'IA générative : ChatGPT, Midjourney, Claude et bien plus.',
    longDesc: "L'IA générative transforme la création de contenu. Que ce soit pour rédiger, illustrer, coder ou générer des vidéos, ces outils permettent de produire en quelques secondes ce qui prenait des heures. Découvrez notre sélection des meilleures solutions d'IA générative pour booster votre créativité et votre productivité.",
  },
  'antivirus': {
    label: 'Antivirus',
    icon: '🦠',
    color: 'from-red-600 to-orange-500',
    colorSolid: '#ef4444',
    glow: 'rgba(239,68,68,0.2)',
    border: 'border-red-500/30',
    bg: 'bg-red-900/20',
    textColor: 'text-gray-900',
    desc: 'Protégez vos appareils contre les virus, malwares, ransomwares et toutes les cybermenaces avec les meilleures solutions antivirus.',
    longDesc: 'Un antivirus performant est la première ligne de défense contre les cybermenaces. Que vous soyez créateur, entrepreneur ou particulier, protéger vos appareils et vos données est une priorité. Découvrez les solutions les plus efficaces pour sécuriser votre environnement numérique.',
  },
};

// Les 5 catégories fixes (slug -> label)
const FIXED_CATEGORIES = [
  { slug: 'intelligence-artificielle', label: 'Intelligence artificielle' },
  { slug: 'ia-generative', label: 'IA générative' },
  { slug: 'hebergement-web', label: 'Hébergement web' },
  { slug: 'vpn', label: 'VPN' },
  { slug: 'antivirus', label: 'Antivirus' },
];

function getMetaForCategory(slug) {
  return CATEGORY_META[slug] || {
    label: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    icon: '🛠️',
    color: 'from-pink-600 to-purple-500',
    colorSolid: '#ec4899',
    glow: 'rgba(236,72,153,0.2)',
    border: 'border-pink-500/30',
    bg: 'bg-pink-900/20',
    textColor: 'text-gray-900',
    desc: 'Découvrez les meilleurs outils de cette catégorie, sélectionnés pour les créateurs et entrepreneurs.',
    longDesc: 'Une sélection rigoureuse des meilleurs outils pour vous aider à booster votre activité.',
  };
}

export async function getStaticPaths() {
  // Uniquement les 3 catégories fixes
  const paths = FIXED_CATEGORIES.map(cat => ({
    params: { category: cat.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const slug = params.category;
  const meta = getMetaForCategory(slug);

  // Trouver le label correspondant au slug
  const fixedCat = FIXED_CATEGORIES.find(c => c.slug === slug);
  const catLabel = fixedCat ? fixedCat.label : slug.replace(/-/g, ' ');

  // Filtrer les outils de cette catégorie
  const tools = allTools.filter(tool =>
    (tool.categories || []).some(
      cat => normalizeSlug(cat) === slug
    )
  );

  // Sidebar : uniquement les 3 catégories fixes avec leur comptage
  const allCategories = FIXED_CATEGORIES.map(fixCat => ({
    slug: fixCat.slug,
    label: fixCat.label,
    count: allTools.filter(t =>
      (t.categories || []).some(cat => normalizeSlug(cat) === fixCat.slug)
    ).length,
  }));

  return {
    props: { tools, meta, slug, allCategories },
  };
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.floor(value) ? 'text-gray-600 fill-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
}

export default function CategoryPage({ tools, meta, slug, allCategories }) {
  return (
    <>
      <SEO
        title={`${meta.label} – Meilleurs outils | TheCreamAI`}
        description={meta.desc}
        canonical={`https://thecreamai.com/outils/${slug}`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* ── HERO CATÉGORIE ── */}
          <section className="relative py-20 overflow-hidden">
            {/* Glow de fond */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 800px 400px at 50% -50px, ${meta.glow}, transparent)`,
              }}
            />
            <div className="container mx-auto px-6 relative z-10">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                <Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils" className="hover:text-gray-900 transition-colors">Outils</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">{meta.label}</span>
              </nav>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icône */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-4xl flex-shrink-0 shadow-2xl`}
                  style={{ boxShadow: `0 0 40px ${meta.glow}` }}>
                  {meta.icon}
                </div>
                <div>
                  <div className={`inline-block text-xs font-semibold tracking-widest uppercase ${meta.textColor} ${meta.bg} border ${meta.border} px-3 py-1 rounded-full mb-3`}>
                    {tools.length} outil{tools.length > 1 ? 's' : ''} disponible{tools.length > 1 ? 's' : ''}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    {meta.label}
                  </h1>
                  <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-6 pb-32">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* ── SIDEBAR CATÉGORIES ── */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 sticky top-24">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Catégories</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        href="/outils"
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-600 hover:bg-purple-900/30 transition-all group"
                      >
                        <span className="flex items-center gap-2">
                          <span>🗂️</span> Tous les outils
                        </span>
                      </Link>
                    </li>
                    {allCategories.map(cat => {
                      const m = getMetaForCategory(cat.slug);
                      const isActive = cat.slug === slug;
                      return (
                        <li key={cat.slug}>
                          <Link
                            href={`/outils/${cat.slug}`}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${
                              isActive
                                ? `${m.bg} ${m.textColor} border ${m.border} font-semibold`
                                : 'text-gray-900 hover:text-gray-900 hover:bg-purple-900/30'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{m.icon}</span>
                              <span>{cat.label}</span>
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-md ${isActive ? m.bg : 'bg-purple-900/30'} ${m.textColor}`}>
                              {cat.count}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>

              {/* ── CONTENU PRINCIPAL ── */}
              <div className="flex-1 min-w-0">

                {/* Description longue */}
                {meta.longDesc && (
                  <div className={`gradient-card border ${meta.border} rounded-2xl p-6 mb-8`}>
                    <p className="text-gray-600 leading-relaxed">{meta.longDesc}</p>
                  </div>
                )}

                {/* Grille d'outils */}
                {tools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {tools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} onSelect={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-purple-100 shadow-sm">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-900 text-lg">Aucun outil dans cette catégorie pour l&apos;instant.</p>
                    <Link href="/outils" className="inline-block mt-4 text-gray-900 hover:text-gray-900 transition-colors">
                      ← Voir tous les outils
                    </Link>
                  </div>
                )}

                {/* Navigation vers autres catégories */}
                {allCategories.filter(c => c.slug !== slug).length > 0 && (
                  <div className="mt-16">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Autres catégories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {allCategories
                        .filter(c => c.slug !== slug)
                        .map(cat => {
                          const m = getMetaForCategory(cat.slug);
                          return (
                            <Link
                              key={cat.slug}
                              href={`/outils/${cat.slug}`}
                              className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 flex items-center gap-4 hover:-translate-y-1 hover:border-purple-500/40 transition-all duration-300 group"
                            >
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                {m.icon}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{cat.label}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{cat.count} outil{cat.count > 1 ? 's' : ''}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-900 group-hover:text-gray-900 transition-colors ml-auto" />
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
