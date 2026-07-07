import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import SEO, { buildBreadcrumbSchema, buildFAQSchema, buildItemListSchema } from '../components/SEO';
import { ExternalLink, Star, ChevronRight, Sparkles, RotateCcw, Copy, CheckCircle, Brain, Zap, Wand2, FileText } from 'lucide-react';
import { useT, useLocale } from '../lib/i18n';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  function normalizeSlug(text) {
    return text.toLowerCase()
      .replace(/é/g, 'e').replace(/è/g, 'e').replace(/ê/g, 'e')
      .replace(/à/g, 'a').replace(/ù/g, 'u').replace(/ô/g, 'o')
      .replace(/ç/g, 'c').replace(/ /g, '-');
  }

  const tools = allTools.filter(tool =>
    (tool.categories || []).some(cat => normalizeSlug(cat) === 'ia-generative')
  );

  return { props: { tools } };
}

const SIDEBAR_STYLE = [
  { slug: 'intelligence-artificielle', icon: '🤖' },
  { slug: 'ia-generative', icon: '✨' },
  { slug: 'hebergement-web', icon: '🌐' },
  { slug: 'vpn', icon: '🛡️' },
  { slug: 'antivirus', icon: '🦠' },
];

const CONTENT = {
  fr: {
    seoTitle: 'IA Générative, Meilleurs outils | Comparateur-Tech',
    seoDescription: "Découvrez les meilleurs outils d'IA générative : ChatGPT, Midjourney, Claude, Gemini… Comparez et trouvez l'outil parfait pour créer textes, images et vidéos.",
    home: 'Accueil', tools: 'Outils', genAI: 'IA générative',
    itemListName: 'Meilleurs outils IA générative',
    itemListDesc: 'Sélection des outils IA générative pour texte, image, vidéo, audio et création de contenu.',
    toolsAvailable: (n) => `${n} outil${n > 1 ? 's' : ''} disponible${n > 1 ? 's' : ''}`,
    heroIntro: "Générez du texte, des images et des vidéos avec les meilleurs outils d'IA générative : ChatGPT, Midjourney, Claude et bien plus.",
    categories: 'Catégories', allTools: 'Tous les outils',
    catLabels: {
      'intelligence-artificielle': 'Intelligence artificielle', 'ia-generative': 'IA générative',
      'hebergement-web': 'Hébergement web', 'vpn': 'VPN', 'antivirus': 'Antivirus',
    },
    longDesc: "L'IA générative transforme la création de contenu. Que ce soit pour rédiger, illustrer, coder ou générer des vidéos, ces outils permettent de produire en quelques secondes ce qui prenait des heures. Découvrez notre sélection des meilleures solutions pour booster votre créativité et votre productivité.",
    howToChoose: "Comment choisir un outil d'IA générative ?",
    howToChooseIntro: "Le bon choix dépend du format à produire, du niveau de contrôle attendu et des droits d'usage. Une IA très forte pour écrire ne sera pas forcément la meilleure pour générer des images ou créer des vidéos.",
    criteria: ['Qualité du rendu sur vos exemples', "Droits d'usage des contenus générés", 'Coût des crédits ou abonnements', 'Contrôle du style, du ton et des exports'],
    noTools: "Aucun outil dans cette catégorie pour l'instant.",
    faqTitle: "Questions fréquentes sur l'IA générative",
    faq: [
      { q: "Quel outil d'IA générative choisir ?", a: 'Choisissez selon le format principal à produire : texte, image, vidéo, audio ou contenu marketing. Testez ensuite le même brief sur plusieurs outils pour comparer la qualité réelle.' },
      { q: 'Les contenus générés par IA sont-ils utilisables commercialement ?', a: "Cela dépend des conditions de chaque outil et de votre formule. Vérifiez toujours les droits d'usage, les restrictions de marque et les règles liées aux contenus générés." },
      { q: 'Faut-il un outil IA généraliste ou spécialisé ?', a: "Un outil généraliste suffit pour démarrer, mais un outil spécialisé devient souvent meilleur pour l'image, la vidéo, la voix, le design ou les workflows de production réguliers." },
    ],
    useCases: [
      { icon: '✍️', label: 'Rédaction', prompt: "Rédige un article de blog de 300 mots sur les avantages de l'IA générative pour les créateurs de contenu." },
      { icon: '📧', label: 'Email pro', prompt: 'Écris un email professionnel pour proposer un partenariat à une startup tech.' },
      { icon: '💡', label: 'Idées', prompt: "Génère 10 idées de contenu créatif pour les réseaux sociaux d'une marque lifestyle." },
      { icon: '🔍', label: 'Résumé', prompt: "Résume en 5 points clés comment l'IA générative transforme le monde du travail en 2026." },
      { icon: '🛒', label: 'Copywriting', prompt: "Crée une description produit percutante pour un outil SaaS de productivité basé sur l'IA." },
      { icon: '🎯', label: 'Stratégie', prompt: "Propose une stratégie de contenu en 3 étapes pour lancer un blog sur l'intelligence artificielle." },
    ],
    tones: ['Professionnel', 'Casual', 'Créatif', 'Technique', 'Persuasif'],
    generatorTitle: "Essayez l'IA générative",
    generatorSubtitle: 'Générez du contenu professionnel en quelques secondes',
    tryExample: 'Essayez un exemple',
    toneLabel: 'Ton :',
    textareaPlaceholder: 'Décrivez ce que vous souhaitez générer…',
    reset: 'Reset', generating: 'Génération…', generate: 'Générer',
    resultLabel: 'Résultat', copied: 'Copié !', copy: 'Copier', regenerate: 'Régénérer',
    errorMsg: 'Une erreur est survenue. Veuillez réessayer.',
    systemLang: 'français',
  },
  en: {
    seoTitle: 'Generative AI, Best tools | Comparateur-Tech',
    seoDescription: 'Discover the best generative AI tools: ChatGPT, Midjourney, Claude, Gemini… Compare and find the perfect tool to create text, images and videos.',
    home: 'Home', tools: 'Tools', genAI: 'Generative AI',
    itemListName: 'Best generative AI tools',
    itemListDesc: 'A selection of generative AI tools for text, image, video, audio and content creation.',
    toolsAvailable: (n) => `${n} tool${n > 1 ? 's' : ''} available`,
    heroIntro: 'Generate text, images and videos with the best generative AI tools: ChatGPT, Midjourney, Claude and many more.',
    categories: 'Categories', allTools: 'All tools',
    catLabels: {
      'intelligence-artificielle': 'Artificial intelligence', 'ia-generative': 'Generative AI',
      'hebergement-web': 'Web hosting', 'vpn': 'VPN', 'antivirus': 'Antivirus',
    },
    longDesc: 'Generative AI is transforming content creation. Whether for writing, illustrating, coding or generating videos, these tools produce in seconds what used to take hours. Discover our selection of the best solutions to boost your creativity and productivity.',
    howToChoose: 'How to choose a generative AI tool?',
    howToChooseIntro: 'The right choice depends on the format to produce, the level of control you need and usage rights. An AI that excels at writing will not necessarily be the best at generating images or creating videos.',
    criteria: ['Output quality on your own examples', 'Usage rights for generated content', 'Cost of credits or subscriptions', 'Control over style, tone and exports'],
    noTools: 'No tools in this category yet.',
    faqTitle: 'Frequently asked questions about generative AI',
    faq: [
      { q: 'Which generative AI tool should I choose?', a: 'Choose based on the main format to produce: text, image, video, audio or marketing content. Then test the same brief across several tools to compare real quality.' },
      { q: 'Can AI-generated content be used commercially?', a: 'It depends on each tool\'s terms and your plan. Always check usage rights, brand restrictions and the rules around generated content.' },
      { q: 'Do I need a generalist or a specialized AI tool?', a: 'A generalist tool is enough to get started, but a specialized tool is often better for image, video, voice, design or regular production workflows.' },
    ],
    useCases: [
      { icon: '✍️', label: 'Writing', prompt: 'Write a 300-word blog post about the benefits of generative AI for content creators.' },
      { icon: '📧', label: 'Pro email', prompt: 'Write a professional email proposing a partnership to a tech startup.' },
      { icon: '💡', label: 'Ideas', prompt: 'Generate 10 creative content ideas for the social media of a lifestyle brand.' },
      { icon: '🔍', label: 'Summary', prompt: 'Summarize in 5 key points how generative AI is transforming the world of work in 2026.' },
      { icon: '🛒', label: 'Copywriting', prompt: 'Write a punchy product description for an AI-powered productivity SaaS tool.' },
      { icon: '🎯', label: 'Strategy', prompt: 'Propose a 3-step content strategy to launch a blog about artificial intelligence.' },
    ],
    tones: ['Professional', 'Casual', 'Creative', 'Technical', 'Persuasive'],
    generatorTitle: 'Try generative AI',
    generatorSubtitle: 'Generate professional content in seconds',
    tryExample: 'Try an example',
    toneLabel: 'Tone:',
    textareaPlaceholder: 'Describe what you want to generate…',
    reset: 'Reset', generating: 'Generating…', generate: 'Generate',
    resultLabel: 'Result', copied: 'Copied!', copy: 'Copy', regenerate: 'Regenerate',
    errorMsg: 'Something went wrong. Please try again.',
    systemLang: 'English',
  },
};

export default function IAGenerativePage({ tools }) {
  const t = useT(CONTENT);
  const locale = useLocale();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState(t.tones[0]);
  const [showResult, setShowResult] = useState(false);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  const handleUseCase = (p) => {
    setPrompt(p);
    textareaRef.current?.focus();
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    setShowResult(false);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a creative and professional writing assistant. Always respond in ${t.systemLang}. Current tone: ${selectedTone}. Provide a high-quality, well-structured and directly usable response.`,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.text || '').join('') || '';
      setResult(text);
      setShowResult(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(t.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/ia-generative"
        structuredData={[
          buildBreadcrumbSchema([
            { name: t.home, url: '/' },
            { name: t.tools, url: '/outils' },
            { name: t.genAI },
          ]),
          buildItemListSchema({
            name: t.itemListName,
            description: t.itemListDesc,
            items: tools,
          }),
          buildFAQSchema(t.faq),
        ]}
      />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">

          {/* Hero catégorie */}
          <section className="relative py-16 bg-white overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 400px at 50% -50px, rgba(236,72,153,0.12), transparent)' }} />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link href="/" className="hover:text-gray-900 transition-colors">{t.home}</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils" className="hover:text-gray-900 transition-colors">{t.tools}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{t.genAI}</span>
              </nav>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-600 to-violet-500 flex items-center justify-center text-4xl flex-shrink-0 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(236,72,153,0.3)' }}>
                  ✨
                </div>
                <div>
                  <div className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-900 bg-pink-900/10 border border-pink-500/30 px-3 py-1 rounded-full mb-3">
                    {t.toolsAvailable(tools.length)}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">{t.genAI}</h1>
                  <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
                    {t.heroIntro}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 pb-20">
            <div className="flex flex-col lg:flex-row gap-10 mt-10">

              {/* Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 sticky top-24">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">{t.categories}</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/outils" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-purple-50 transition-all">
                        <span className="flex items-center gap-2"><span>🗂️</span> {t.allTools}</span>
                      </Link>
                    </li>
                    {SIDEBAR_STYLE.map(cat => {
                      const isActive = cat.slug === 'ia-generative';
                      return (
                        <li key={cat.slug}>
                          <Link
                            href={cat.slug === 'ia-generative' ? '/ia-generative' : `/outils/${cat.slug}`}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all font-${isActive ? 'semibold' : 'normal'} ${isActive ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'text-gray-700 hover:bg-purple-50'}`}>
                            <span>{cat.icon}</span>
                            <span>{t.catLabels[cat.slug]}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>

              {/* Contenu principal */}
              <div className="flex-1 min-w-0">

                {/* Description */}
                <div className="bg-white border border-pink-200/60 rounded-2xl p-6 mb-8">
                  <p className="text-gray-600 leading-relaxed">
                    {t.longDesc}
                  </p>
                </div>

                <section className="bg-white border border-pink-200/60 rounded-2xl p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">{t.howToChoose}</h2>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    {t.howToChooseIntro}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {t.criteria.map(criterion => (
                      <div key={criterion} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800">{criterion}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Grille d'outils */}
                {tools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {tools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} onSelect={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-purple-100 shadow-sm mb-16">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-600 text-lg">{t.noTools}</p>
                  </div>
                )}

                <section className="bg-white border border-pink-200/60 rounded-2xl p-6 mb-16">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">{t.faqTitle}</h2>
                  <div className="space-y-4">
                    {t.faq.map(item => (
                      <div key={item.q} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">{item.q}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ─── Générateur IA ─── */}
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-violet-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-md shadow-purple-300/30">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-lg">{t.generatorTitle}</h2>
                        <p className="text-gray-500 text-sm">{t.generatorSubtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Exemples */}
                    <div className="mb-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{t.tryExample}</p>
                      <div className="flex flex-wrap gap-2">
                        {t.useCases.map((uc, i) => (
                          <button key={i} onClick={() => handleUseCase(uc.prompt)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all">
                            <span>{uc.icon}</span> {uc.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ton */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.toneLabel}</span>
                      {t.tones.map(tone => (
                        <button key={tone} onClick={() => setSelectedTone(tone)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedTone === tone ? 'gradient-purple text-white shadow-sm' : 'bg-gray-100 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700'}`}>
                          {tone}
                        </button>
                      ))}
                    </div>

                    {/* Textarea */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-400 transition-colors">
                      <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
                        placeholder={t.textareaPlaceholder}
                        className="w-full h-32 resize-none text-gray-800 text-sm leading-relaxed placeholder-gray-400 outline-none p-4 bg-transparent"
                      />
                      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <span className="text-xs text-gray-400">{prompt.length}/1000 · <kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">⌘ Enter</kbd></span>
                        <div className="flex gap-2">
                          {(prompt || result) && (
                            <button onClick={() => { setPrompt(''); setResult(''); setShowResult(false); }} className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2 flex items-center gap-1.5 transition-colors">
                              <RotateCcw className="w-4 h-4" /> {t.reset}
                            </button>
                          )}
                          <button onClick={handleGenerate} disabled={!prompt.trim() || loading}
                            className="flex items-center gap-2 gradient-purple text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-purple-300/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 min-h-[44px]">
                            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t.generating}</> : <><Sparkles className="w-4 h-4" /> {t.generate}</>}
                          </button>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">⚠️ {error}</div>
                    )}

                    {showResult && result && (
                      <div ref={resultRef} className="mt-5 border border-purple-100 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-purple-50 border-b border-purple-100">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700">{t.resultLabel}</span>
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{selectedTone}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                              {copied ? <><CheckCircle className="w-4 h-4 text-green-500" /> {t.copied}</> : <><Copy className="w-4 h-4" /> {t.copy}</>}
                            </button>
                            <button onClick={handleGenerate} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                              <RotateCcw className="w-4 h-4" /> {t.regenerate}
                            </button>
                          </div>
                        </div>
                        <div className="p-5 bg-white">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
