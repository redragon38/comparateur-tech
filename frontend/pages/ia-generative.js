import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ToolCard from '../components/ToolCard';
import SEO from '../components/SEO';
import { ExternalLink, Star, ChevronRight, Sparkles, RotateCcw, Copy, CheckCircle, Brain, Zap, Wand2, FileText } from 'lucide-react';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
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

const USE_CASES = [
  { icon: '✍️', label: 'Rédaction', prompt: 'Rédige un article de blog de 300 mots sur les avantages de l\'IA générative pour les créateurs de contenu.' },
  { icon: '📧', label: 'Email pro', prompt: 'Écris un email professionnel pour proposer un partenariat à une startup tech.' },
  { icon: '💡', label: 'Idées', prompt: 'Génère 10 idées de contenu créatif pour les réseaux sociaux d\'une marque lifestyle.' },
  { icon: '🔍', label: 'Résumé', prompt: 'Résume en 5 points clés comment l\'IA générative transforme le monde du travail en 2025.' },
  { icon: '🛒', label: 'Copywriting', prompt: 'Crée une description produit percutante pour un outil SaaS de productivité basé sur l\'IA.' },
  { icon: '🎯', label: 'Stratégie', prompt: 'Propose une stratégie de contenu en 3 étapes pour lancer un blog sur l\'intelligence artificielle.' },
];

const TONES = ['Professionnel', 'Casual', 'Créatif', 'Technique', 'Persuasif'];

const SIDEBAR_CATEGORIES = [
  { slug: 'intelligence-artificielle', label: 'Intelligence artificielle', icon: '🤖', count: null },
  { slug: 'ia-generative', label: 'IA générative', icon: '✨', count: null },
  { slug: 'hebergement-web', label: 'Hébergement web', icon: '🌐', count: null },
  { slug: 'vpn', label: 'VPN', icon: '🛡️', count: null },
  { slug: 'antivirus', label: 'Antivirus', icon: '🦠', count: null },
];

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= Math.floor(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function IAGenerativePage({ tools }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState('Professionnel');
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
          system: `Tu es un assistant de rédaction créatif et professionnel. Réponds toujours en français. Ton actuel : ${selectedTone}. Fournis une réponse de haute qualité, bien structurée et directement utilisable.`,
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
      setError('Une erreur est survenue. Veuillez réessayer.');
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
        title="IA Générative — Meilleurs outils | Comparateur-Tech"
        description="Découvrez les meilleurs outils d'IA générative : ChatGPT, Midjourney, Claude, Gemini… Comparez et trouvez l'outil parfait pour créer textes, images et vidéos."
        canonical="https://comparateur-tech.com/ia-generative"
      />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">

          {/* Hero catégorie */}
          <section className="relative py-16 bg-white overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 400px at 50% -50px, rgba(236,72,153,0.12), transparent)' }} />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils" className="hover:text-gray-900 transition-colors">Outils</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">IA générative</span>
              </nav>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-600 to-violet-500 flex items-center justify-center text-4xl flex-shrink-0 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(236,72,153,0.3)' }}>
                  ✨
                </div>
                <div>
                  <div className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-900 bg-pink-900/10 border border-pink-500/30 px-3 py-1 rounded-full mb-3">
                    {tools.length} outil{tools.length > 1 ? 's' : ''} disponible{tools.length > 1 ? 's' : ''}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">IA générative</h1>
                  <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
                    Générez du texte, des images et des vidéos avec les meilleurs outils d&apos;IA générative : ChatGPT, Midjourney, Claude et bien plus.
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
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Catégories</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/outils" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-purple-50 transition-all">
                        <span className="flex items-center gap-2"><span>🗂️</span> Tous les outils</span>
                      </Link>
                    </li>
                    {SIDEBAR_CATEGORIES.map(cat => {
                      const isActive = cat.slug === 'ia-generative';
                      return (
                        <li key={cat.slug}>
                          <Link
                            href={cat.slug === 'ia-generative' ? '/ia-generative' : `/outils/${cat.slug}`}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all font-${isActive ? 'semibold' : 'normal'} ${isActive ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'text-gray-700 hover:bg-purple-50'}`}>
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
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
                    L&apos;IA générative transforme la création de contenu. Que ce soit pour rédiger, illustrer, coder ou générer des vidéos, ces outils permettent de produire en quelques secondes ce qui prenait des heures. Découvrez notre sélection des meilleures solutions pour booster votre créativité et votre productivité.
                  </p>
                </div>

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
                    <p className="text-gray-600 text-lg">Aucun outil dans cette catégorie pour l&apos;instant.</p>
                  </div>
                )}

                {/* ─── Générateur IA ─── */}
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-violet-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-md shadow-purple-300/30">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-lg">Essayez l&apos;IA générative</h2>
                        <p className="text-gray-500 text-sm">Générez du contenu professionnel en quelques secondes</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Exemples */}
                    <div className="mb-5">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Essayez un exemple</p>
                      <div className="flex flex-wrap gap-2">
                        {USE_CASES.map((uc, i) => (
                          <button key={i} onClick={() => handleUseCase(uc.prompt)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all">
                            <span>{uc.icon}</span> {uc.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ton */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ton :</span>
                      {TONES.map(tone => (
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
                        placeholder="Décrivez ce que vous souhaitez générer…"
                        className="w-full h-32 resize-none text-gray-800 text-sm leading-relaxed placeholder-gray-400 outline-none p-4 bg-transparent"
                      />
                      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <span className="text-xs text-gray-400">{prompt.length}/1000 · <kbd className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">⌘ Enter</kbd></span>
                        <div className="flex gap-2">
                          {(prompt || result) && (
                            <button onClick={() => { setPrompt(''); setResult(''); setShowResult(false); }} className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2 flex items-center gap-1.5 transition-colors">
                              <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                          )}
                          <button onClick={handleGenerate} disabled={!prompt.trim() || loading}
                            className="flex items-center gap-2 gradient-purple text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-purple-300/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 min-h-[44px]">
                            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Génération…</> : <><Sparkles className="w-4 h-4" /> Générer</>}
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
                            <span className="text-sm font-semibold text-purple-700">Résultat</span>
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{selectedTone}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                              {copied ? <><CheckCircle className="w-4 h-4 text-green-500" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier</>}
                            </button>
                            <button onClick={handleGenerate} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                              <RotateCcw className="w-4 h-4" /> Régénérer
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
