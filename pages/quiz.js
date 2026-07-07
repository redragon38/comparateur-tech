import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildBreadcrumbSchema, buildFAQSchema } from '../components/SEO';
import { ArrowRight, ArrowLeft, RotateCcw, Star, Trophy } from 'lucide-react';
import { useT, useLocale } from '../lib/i18n';

/* ── Normalisation accent-insensible pour le scoring ─────────────────── */
function norm(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/* ── Catégories du quiz (une catégorie IA regroupe IA + IA générative) ─ */
const QUIZ_CATS = [
  { value: 'vpn', match: ['VPN'], icon: '🛡️', accent: '#3b82f6', soft: '#eff6ff' },
  { value: 'ia', match: ['Intelligence artificielle', 'IA générative'], icon: '🤖', accent: '#7c3aed', soft: '#f5f3ff' },
  { value: 'hebergement', match: ['Hébergement web'], icon: '🌐', accent: '#059669', soft: '#ecfdf5' },
  { value: 'antivirus', match: ['Antivirus'], icon: '🦠', accent: '#dc2626', soft: '#fff1f2' },
  { value: 'cybersecurite', match: ['Cybersécurité'], icon: '🔐', accent: '#334155', soft: '#f8fafc' },
];

/* ── Signaux de scoring (indépendants de la langue) ──────────────────── */
/* Une entrée par question, chaque option = { kw, budget, trial }.        */
const SIGNALS = {
  vpn: [
    [ // Q1 usage
      { kw: ['streaming', 'netflix', 'debloqu'] },
      { kw: ['confidentialite', 'no-log', 'no log', 'anonym', 'vie privee', 'chiffrement', 'privee'] },
      { kw: ['vitesse', 'rapide', 'performance', 'serveurs', 'jeu', 'gaming'] },
      { kw: ['wifi', 'securis', 'protection', 'nomade'] },
    ],
    [ // Q2 budget
      { budget: 'free' },
      { budget: 'mid' },
      { budget: 'premium' },
    ],
    [ // Q3 niveau
      { kw: ['intuiti', 'simple', 'facile', 'apps'] },
      { kw: ['avance', 'protocole', 'configurable', 'multi-hop', 'multihop'] },
    ],
  ],
  ia: [
    [ // Q1 tâche
      { kw: ['redaction', 'texte', 'ecrire', 'contenu', 'article'] },
      { kw: ['image', 'visuel', 'illustration', 'design', 'photo'] },
      { kw: ['code', 'developpeur', 'coding', 'api', 'ide'] },
      { kw: ['productivite', 'projet', 'tache', 'organisation'] },
      { kw: ['recherche', 'sources', 'analyse', 'synthese'] },
    ],
    [ // Q2 budget
      { budget: 'free' },
      { budget: 'mid' },
      { budget: 'premium' },
    ],
    [ // Q3 priorité
      { kw: ['qualite', 'precision', 'performant', 'fiable'] },
      { kw: ['confidentialite', 'donnees', 'privee', 'rgpd'] },
      { kw: ['integration', 'api', 'connect', 'workflow'] },
    ],
  ],
  hebergement: [
    [ // Q1 projet
      { kw: ['blog', 'wordpress', 'simple', 'vitrine'] },
      { kw: ['commerce', 'boutique', 'ecommerce', 'woocommerce'] },
      { kw: ['vps', 'serveur', 'developpeur', 'cloud', 'technique'] },
      { kw: ['performance', 'rapide', 'cdn', 'trafic', 'scalab'] },
    ],
    [ // Q2 budget
      { budget: 'free' },
      { budget: 'mid' },
      { budget: 'premium' },
    ],
    [ // Q3 support
      { kw: ['francais', 'france', 'support'] },
      { kw: ['performance', 'technique', 'controle'] },
    ],
  ],
  antivirus: [
    [ // Q1 appareils
      { kw: ['windows', 'pc'] },
      { kw: ['multi', 'appareils', 'famille', 'suite'] },
      { kw: ['mac', 'macos', 'apple'] },
      { kw: ['android', 'ios', 'mobile'] },
    ],
    [ // Q2 budget
      { budget: 'free' },
      { budget: 'mid' },
      { budget: 'premium' },
    ],
    [ // Q3 besoin
      { kw: ['protection', 'detection', 'ransomware', 'malware'] },
      { kw: ['leger', 'performance', 'rapide', 'discret'] },
      { kw: ['vpn', 'mot de passe', 'password', 'suite', 'complet'] },
    ],
  ],
  cybersecurite: [
    [ // Q1 besoin
      { kw: ['mot de passe', 'password', 'gestionnaire', 'coffre'] },
      { kw: ['authentification', '2fa', 'mfa', 'identite'] },
      { kw: ['reseau', 'pentest', 'scan', 'vulnerab', 'intrusion'] },
      { kw: ['siem', 'surveillance', 'detection', 'monitoring', 'log'] },
    ],
    [ // Q2 profil
      { kw: ['simple', 'particulier', 'intuiti'] },
      { kw: ['equipe', 'entreprise', 'pme', 'collabor'] },
      { kw: ['avance', 'technique', 'expert'] },
    ],
    [ // Q3 budget
      { budget: 'free' },
      { budget: 'premium' },
    ],
  ],
};

function scoreTool(tool, cat, answers) {
  let score = (tool.rating || 0) * 1.2 + (tool.featured ? 0.4 : 0);
  const qs = SIGNALS[cat] || [];
  answers.forEach((ansIdx, qi) => {
    const opt = qs[qi]?.[ansIdx];
    if (!opt) return;
    if (opt.kw) {
      for (const k of opt.kw) if (tool.hay.includes(norm(k))) { score += 1.6; }
    }
    if (opt.budget === 'free') score += tool.isFree ? 3.2 : -1.2;
    if (opt.budget === 'premium') score += tool.isPremium ? 1.4 : 0;
    if (opt.budget === 'mid') score += (!tool.isFree ? 0.6 : 0.2);
  });
  return score;
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const all = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const byCat = {};
  for (const c of QUIZ_CATS) {
    const list = all
      .filter(t => (t.categories || []).some(cat => c.match.includes(cat)))
      .map(t => {
        const priceHay = norm(`${t.price || ''} ${t.short || ''} ${t.highlight || ''}`);
        const hay = norm([t.short, t.highlight, ...(t.strengthShort || [])].filter(Boolean).join(' '));
        return {
          id: t.id,
          name: t.name,
          logo: t.logo || null,
          price: t.price || null,
          trial: !!t.trial,
          rating: t.rating?.value || null,
          featured: !!t.featured,
          short: t.short || t.highlight || '',
          hay,
          isFree: /\b(gratuit|free|open source|freemium)\b/.test(priceHay),
          isPremium: /\b(premium|pro|business|entreprise|abonnement)\b/.test(priceHay),
        };
      });
    byCat[c.value] = list;
  }
  return { props: { byCat } };
}

const CONTENT = {
  fr: {
    seoTitle: 'Quiz : quel outil tech est fait pour vous ? | Comparateur-Tech',
    seoDescription: 'Répondez à 3 questions et découvrez le VPN, l’outil IA, l’hébergeur, l’antivirus ou l’outil de cybersécurité le plus adapté à votre besoin. Gratuit, sans inscription.',
    breadcrumb: 'Quiz',
    badge: '🧭 Quiz de recommandation',
    h1: 'Trouvez l’outil fait pour vous',
    intro: 'En moins d’une minute et sans inscription, notre quiz analyse votre besoin et vous recommande l’outil le plus adapté, avec des alternatives sérieuses à comparer.',
    chooseCategory: 'Quel type d’outil cherchez-vous ?',
    catLabels: {
      vpn: 'VPN', ia: 'Intelligence artificielle', hebergement: 'Hébergement web', antivirus: 'Antivirus', cybersecurite: 'Cybersécurité',
    },
    catDesc: {
      vpn: 'Sécuriser sa connexion et sa vie privée',
      ia: 'Rédaction, image, code, productivité',
      hebergement: 'Héberger un site ou une application',
      antivirus: 'Protéger ses appareils',
      cybersecurite: 'Mots de passe, authentification, réseau',
    },
    step: 'Question', of: 'sur',
    back: 'Précédent', restart: 'Recommencer',
    resultBadge: 'Notre recommandation',
    topPick: 'Le mieux adapté à votre profil',
    alternatives: 'À comparer aussi',
    viewTool: 'Voir la fiche',
    retake: 'Refaire le quiz',
    browseAll: 'Voir tous les outils de la catégorie',
    reviews: 'avis',
    freeTrial: 'Essai gratuit',
    // Questions FR (même ordre que SIGNALS)
    questions: {
      vpn: [
        { q: 'Quel est votre usage principal ?', options: ['Streaming et déblocage de catalogues', 'Confidentialité et anonymat', 'Vitesse et jeu en ligne', 'Sécurité en Wi-Fi public'] },
        { q: 'Quel budget ?', options: ['Gratuit', 'Bon rapport qualité-prix', 'Premium, peu importe le prix'] },
        { q: 'Votre niveau ?', options: ['Débutant, je veux la simplicité', 'Avancé, je veux du contrôle'] },
      ],
      ia: [
        { q: 'Pour quelle tâche principale ?', options: ['Rédaction et texte', 'Image et visuels', 'Code et développement', 'Productivité et projets', 'Recherche et analyse'] },
        { q: 'Quel budget ?', options: ['Gratuit', 'Freemium équilibré', 'Premium'] },
        { q: 'Votre priorité ?', options: ['Qualité des résultats', 'Confidentialité des données', 'Intégrations avec mes outils'] },
      ],
      hebergement: [
        { q: 'Quel type de projet ?', options: ['Blog ou site vitrine', 'Boutique e-commerce', 'Application ou projet dev', 'Site à fort trafic'] },
        { q: 'Quel budget ?', options: ['Petit budget', 'Équilibré', 'Premium'] },
        { q: 'Ce qui compte le plus ?', options: ['Support en français', 'Autonomie et performance'] },
      ],
      antivirus: [
        { q: 'Combien d’appareils à protéger ?', options: ['1 PC Windows', 'Toute la famille, multi-appareils', 'Un Mac', 'Surtout mobile'] },
        { q: 'Quel budget ?', options: ['Gratuit', 'Payant équilibré', 'Suite premium complète'] },
        { q: 'Votre besoin principal ?', options: ['Protection maximale', 'Léger et discret', 'Suite tout-en-un (VPN, mots de passe…)'] },
      ],
      cybersecurite: [
        { q: 'Quel besoin principal ?', options: ['Gérer mes mots de passe', 'Authentification forte (2FA)', 'Réseau, pentest, vulnérabilités', 'Surveillance et détection'] },
        { q: 'Votre profil ?', options: ['Particulier', 'Équipe ou PME', 'Expert technique'] },
        { q: 'Quel budget ?', options: ['Gratuit', 'Payant'] },
      ],
    },
    whyIntro: 'Pourquoi cet outil ?',
    faq: [
      { q: 'Le quiz est-il gratuit ?', a: 'Oui, le quiz est entièrement gratuit et ne demande aucune inscription. Vos réponses ne sont pas enregistrées : le calcul se fait dans votre navigateur.' },
      { q: 'Comment la recommandation est-elle calculée ?', a: 'Nous croisons vos réponses (usage, budget, niveau) avec les caractéristiques des outils de notre catalogue : note, points forts, tarif et présence d’un essai gratuit. L’outil le plus proche de votre profil est mis en avant, avec des alternatives à comparer.' },
      { q: 'Les recommandations sont-elles influencées par l’affiliation ?', a: 'Non. Le classement du quiz repose sur les mêmes critères que nos comparatifs et n’est jamais modifié par un partenariat commercial.' },
    ],
  },
  en: {
    seoTitle: 'Quiz: which tech tool is right for you? | Comparateur-Tech',
    seoDescription: 'Answer 3 questions and find the VPN, AI tool, web host, antivirus or cybersecurity tool best suited to your needs. Free, no sign-up.',
    breadcrumb: 'Quiz',
    badge: '🧭 Recommendation quiz',
    h1: 'Find the tool made for you',
    intro: 'In under a minute and with no sign-up, our quiz analyzes your needs and recommends the best-suited tool, with solid alternatives to compare.',
    chooseCategory: 'What kind of tool are you looking for?',
    catLabels: {
      vpn: 'VPN', ia: 'Artificial intelligence', hebergement: 'Web hosting', antivirus: 'Antivirus', cybersecurite: 'Cybersecurity',
    },
    catDesc: {
      vpn: 'Secure your connection and privacy',
      ia: 'Writing, image, code, productivity',
      hebergement: 'Host a website or application',
      antivirus: 'Protect your devices',
      cybersecurite: 'Passwords, authentication, network',
    },
    step: 'Question', of: 'of',
    back: 'Back', restart: 'Restart',
    resultBadge: 'Our recommendation',
    topPick: 'Best match for your profile',
    alternatives: 'Also worth comparing',
    viewTool: 'View details',
    retake: 'Retake the quiz',
    browseAll: 'See all tools in this category',
    reviews: 'reviews',
    freeTrial: 'Free trial',
    questions: {
      vpn: [
        { q: 'What is your main use?', options: ['Streaming and unblocking catalogs', 'Privacy and anonymity', 'Speed and online gaming', 'Security on public Wi-Fi'] },
        { q: 'What budget?', options: ['Free', 'Good value for money', 'Premium, price no object'] },
        { q: 'Your level?', options: ['Beginner, I want simplicity', 'Advanced, I want control'] },
      ],
      ia: [
        { q: 'For which main task?', options: ['Writing and text', 'Images and visuals', 'Code and development', 'Productivity and projects', 'Research and analysis'] },
        { q: 'What budget?', options: ['Free', 'Balanced freemium', 'Premium'] },
        { q: 'Your priority?', options: ['Output quality', 'Data privacy', 'Integrations with my tools'] },
      ],
      hebergement: [
        { q: 'What type of project?', options: ['Blog or showcase site', 'E-commerce store', 'App or dev project', 'High-traffic site'] },
        { q: 'What budget?', options: ['Small budget', 'Balanced', 'Premium'] },
        { q: 'What matters most?', options: ['French-language support', 'Autonomy and performance'] },
      ],
      antivirus: [
        { q: 'How many devices to protect?', options: ['1 Windows PC', 'The whole family, multi-device', 'A Mac', 'Mainly mobile'] },
        { q: 'What budget?', options: ['Free', 'Balanced paid', 'Full premium suite'] },
        { q: 'Your main need?', options: ['Maximum protection', 'Light and unobtrusive', 'All-in-one suite (VPN, passwords…)'] },
      ],
      cybersecurite: [
        { q: 'What is your main need?', options: ['Manage my passwords', 'Strong authentication (2FA)', 'Network, pentest, vulnerabilities', 'Monitoring and detection'] },
        { q: 'Your profile?', options: ['Individual', 'Team or SMB', 'Technical expert'] },
        { q: 'What budget?', options: ['Free', 'Paid'] },
      ],
    },
    whyIntro: 'Why this tool?',
    faq: [
      { q: 'Is the quiz free?', a: 'Yes, the quiz is completely free and requires no sign-up. Your answers are not stored: the calculation happens in your browser.' },
      { q: 'How is the recommendation calculated?', a: 'We match your answers (use case, budget, level) against the characteristics of the tools in our catalog: rating, strengths, price and the presence of a free trial. The tool closest to your profile is highlighted, with alternatives to compare.' },
      { q: 'Are the recommendations influenced by affiliation?', a: 'No. The quiz ranking relies on the same criteria as our comparisons and is never changed by a commercial partnership.' },
    ],
  },
};

function Stars({ val }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.floor(val || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-100'}`} />
      ))}
    </div>
  );
}

export default function QuizPage({ byCat }) {
  const t = useT(CONTENT);
  const locale = useLocale();
  const [cat, setCat] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const catMeta = QUIZ_CATS.find(c => c.value === cat);
  const questions = cat ? t.questions[cat] : [];
  const totalSteps = questions.length;
  const done = cat && step >= totalSteps;

  const ranked = useMemo(() => {
    if (!done) return [];
    const list = (byCat[cat] || []).map(tool => ({ tool, s: scoreTool(tool, cat, answers) }));
    list.sort((a, b) => b.s - a.s);
    return list.map(x => x.tool);
  }, [done, cat, answers, byCat]);

  const top = ranked[0];
  const alts = ranked.slice(1, 4);

  const pickCategory = (value) => { setCat(value); setStep(0); setAnswers([]); };
  const answer = (optIdx) => { const next = [...answers]; next[step] = optIdx; setAnswers(next); setStep(step + 1); };
  const goBack = () => { if (step === 0) { setCat(null); } else { setStep(step - 1); } };
  const restart = () => { setCat(null); setStep(0); setAnswers([]); };

  const structuredData = [
    buildBreadcrumbSchema([{ name: locale === 'en' ? 'Home' : 'Accueil', url: '/' }, { name: t.breadcrumb }]),
    buildFAQSchema(t.faq),
  ];

  const accent = catMeta?.accent || '#7c3aed';
  const soft = catMeta?.soft || '#f5f3ff';

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title={t.seoTitle} description={t.seoDescription} canonical="https://comparateur-tech.com/quiz" structuredData={structuredData} />
      <Header />
      <main>
        {/* Hero */}
        <section className="py-14 sm:py-16 bg-gradient-to-b from-purple-50 to-white border-b border-purple-100">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <span className="inline-block bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-5 shadow-sm">{t.badge}</span>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">{t.h1}</h1>
            <p className="text-gray-600 leading-relaxed">{t.intro}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6 max-w-3xl">

            {/* Étape 0 : choix de catégorie */}
            {!cat && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t.chooseCategory}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {QUIZ_CATS.map((c) => (
                    <button key={c.value} onClick={() => pickCategory(c.value)}
                      className="text-left bg-white border-2 border-gray-200 rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-1 hover:shadow-md transition-all"
                      style={{ borderColor: `${c.accent}22` }}>
                      <span className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: c.soft }}>{c.icon}</span>
                      <span>
                        <span className="block font-bold text-gray-900">{t.catLabels[c.value]}</span>
                        <span className="block text-sm text-gray-500 mt-0.5">{t.catDesc[c.value]}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            {cat && !done && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={goBack} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> {t.back}
                  </button>
                  <span className="text-xs font-semibold text-gray-400">{t.step} {step + 1} {t.of} {totalSteps}</span>
                </div>
                {/* Barre de progression */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-7">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(step / totalSteps) * 100}%`, background: accent }} />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-6">{questions[step].q}</h2>
                <div className="space-y-3">
                  {questions[step].options.map((opt, i) => (
                    <button key={i} onClick={() => answer(i)}
                      className="w-full text-left bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-medium text-gray-800 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800 transition-all flex items-center justify-between group">
                      {opt}
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Résultat */}
            {done && top && (
              <div>
                <div className="rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${soft}, #ffffff)`, border: `1px solid ${accent}33` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5" style={{ color: accent }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>{t.resultBadge}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white border flex items-center justify-center overflow-hidden flex-shrink-0" style={{ borderColor: `${accent}22` }}>
                      {top.logo ? <img src={top.logo} alt={`Logo ${top.name}`} width={80} height={80} className="w-full h-full object-contain p-2" /> : <span className="text-3xl">{catMeta.icon}</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{t.topPick}</p>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{top.name}</h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">{top.short}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {top.rating && <span className="flex items-center gap-1.5"><Stars val={top.rating} /><span className="text-sm font-bold" style={{ color: accent }}>{top.rating}</span></span>}
                        {top.price && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700">{top.price}</span>}
                        {top.trial && <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: accent, background: '#fff', border: `1px solid ${accent}22` }}>{t.freeTrial}</span>}
                      </div>
                    </div>
                    <Link href={`/tool/${top.id}`} className="text-white font-bold px-6 py-3 rounded-xl text-sm text-center transition-all hover:-translate-y-0.5 flex-shrink-0" style={{ background: accent }}>
                      {t.viewTool} →
                    </Link>
                  </div>
                </div>

                {alts.length > 0 && (
                  <>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">{t.alternatives}</h3>
                    <div className="grid sm:grid-cols-3 gap-3 mb-8">
                      {alts.map((tool) => (
                        <Link key={tool.id} href={`/tool/${tool.id}`} className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-md transition-all">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {tool.logo ? <img src={tool.logo} alt="" width={32} height={32} className="w-full h-full object-contain p-1" /> : <span>{catMeta.icon}</span>}
                            </div>
                            <p className="font-bold text-sm text-gray-900 truncate">{tool.name}</p>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{tool.short}</p>
                          {tool.rating && <p className="text-xs font-bold mt-2" style={{ color: accent }}>{tool.rating}/5</p>}
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={restart} className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 transition-all">
                    <RotateCcw className="w-4 h-4" /> {t.retake}
                  </button>
                  <Link href={`/outils/${cat === 'ia' ? 'intelligence-artificielle' : cat === 'hebergement' ? 'hebergement-web' : cat}`} className="inline-flex items-center justify-center gap-2 gradient-purple text-white px-6 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all">
                    {t.browseAll} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ, utile SEO/GEO */}
        <section className="pb-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="space-y-4">
                {t.faq.map((item) => (
                  <div key={item.q} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
