import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, LayoutGrid, Trophy, Mail } from 'lucide-react';

const CATEGORIES = [
  { slug: 'ia-generative',            label: 'IA Générative',            icon: '✨', desc: 'ChatGPT, Midjourney, Claude…', href: '/ia-generative' },
  { slug: 'intelligence-artificielle', label: 'Intelligence artificielle', icon: '🤖', desc: 'Outils IA pour la productivité', href: '/outils/intelligence-artificielle' },
  { slug: 'hebergement-web',           label: 'Hébergement web',           icon: '🌐', desc: 'Hébergez vos projets web', href: '/outils/hebergement-web' },
  { slug: 'vpn',                       label: 'VPN',                       icon: '🛡️', desc: 'Sécurisez vos connexions', href: '/outils/vpn' },
  { slug: 'antivirus',                 label: 'Antivirus',                 icon: '🦠', desc: 'Protégez vos appareils', href: '/outils/antivirus' },
];

const TOP10_CATEGORIES = [
  { slug: 'intelligence-artificielle', label: 'IA', icon: '🤖' },
  { slug: 'hebergement-web',           label: 'Hébergement', icon: '🌐' },
  { slug: 'vpn',                       label: 'VPN', icon: '🛡️' },
  { slug: 'antivirus',                 label: 'Antivirus', icon: '🦠' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [outilsOpen, setOutilsOpen] = useState(false);
  const [top10Open, setTop10Open] = useState(false);
  const [topbarVisible, setTopbarVisible] = useState(true);
  const outilsRef = useRef(null);
  const top10Ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (outilsRef.current && !outilsRef.current.contains(e.target)) setOutilsOpen(false);
      if (top10Ref.current && !top10Ref.current.contains(e.target)) setTop10Open(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      {topbarVisible && (
        <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-violet-700 text-white text-center py-2.5 text-sm font-medium px-4 relative">
          🎉 Sélection mise à jour — <strong>40 outils vérifiés</strong> pour booster votre activité &nbsp;·&nbsp;
          <Link href="/outils" className="underline font-bold hover:text-purple-200 transition-colors">Voir la sélection →</Link>
          <button onClick={() => setTopbarVisible(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 flex items-center justify-center">
                <img src="/logo.png" alt="Thecreamai" className="w-9 h-9 object-contain" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 group-hover:text-purple-700 transition-colors">Thecreamai</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all">
                Accueil
              </Link>

              {/* Dropdown Outils */}
              <div className="relative" ref={outilsRef}>
                <button onClick={() => { setOutilsOpen(!outilsOpen); setTop10Open(false); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${outilsOpen ? 'text-purple-700 bg-purple-50' : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'}`}>
                  Outils <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${outilsOpen ? 'rotate-180' : ''}`} />
                </button>
                {outilsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-100/50 overflow-hidden animate-fade-in">
                    <Link href="/outils" onClick={() => setOutilsOpen(false)} className="flex items-center gap-3 px-4 py-3.5 hover:bg-purple-50 transition-colors border-b border-purple-50 group">
                      <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">Tous les outils</p>
                        <p className="text-gray-400 text-xs">Explorer la sélection complète</p>
                      </div>
                    </Link>
                    <div className="p-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2 py-1.5">Catégories</p>
                      {CATEGORIES.map(cat => (
                        <Link key={cat.slug} href={cat.href} onClick={() => setOutilsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 transition-colors group">
                          <span className="text-xl w-8 text-center">{cat.icon}</span>
                          <div>
                            <p className="text-gray-700 font-medium text-sm group-hover:text-purple-700">{cat.label}</p>
                            <p className="text-gray-400 text-xs">{cat.desc}</p>
                          </div>
                          {cat.slug === 'ia-generative' && (
                            <span className="ml-auto text-xs bg-pink-50 border border-pink-200 text-pink-600 px-1.5 py-0.5 rounded-full font-semibold">New</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/comparatifs" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all">
                Comparatifs
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all">
                Blog
              </Link>
              <Link href="/newsletter" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Newsletter
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all">
                Contact
              </Link>

              {/* Top 10 dropdown */}
              <div className="relative ml-2" ref={top10Ref}>
                <button onClick={() => { setTop10Open(!top10Open); setOutilsOpen(false); }}
                  className="flex items-center gap-2 gradient-purple text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md shadow-purple-300/50 hover:shadow-purple-400/50 hover:-translate-y-0.5 transition-all min-h-[44px]">
                  <Trophy className="w-4 h-4" />
                  Top 10
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${top10Open ? 'rotate-180' : ''}`} />
                </button>
                {top10Open && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-100/50 overflow-hidden p-2 animate-fade-in">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2 py-1.5">Par catégorie</p>
                    {TOP10_CATEGORIES.map(cat => (
                      <Link key={cat.slug} href={`/top-10-${cat.slug}`} onClick={() => setTop10Open(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 transition-colors group">
                        <span className="text-lg w-7 text-center">{cat.icon}</span>
                        <span className="text-gray-700 font-medium text-sm group-hover:text-purple-700">Top 10 {cat.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="md:hidden text-gray-700 hover:text-purple-700 transition-colors p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-50 bg-white shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-1">
            <Link href="/" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm font-medium">Accueil</Link>
            <Link href="/outils" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 font-semibold text-sm">🛠️ Tous les outils</Link>
            <div className="ml-4 border-l border-purple-100 pl-4 space-y-1">
              {CATEGORIES.map(cat => (
                <Link key={cat.slug} href={cat.href} onClick={closeMobile} className="flex items-center gap-2 text-gray-500 hover:text-purple-700 py-2 text-sm">
                  <span>{cat.icon}</span>{cat.label}
                  {cat.slug === 'ia-generative' && (
                    <span className="text-xs bg-pink-50 border border-pink-200 text-pink-600 px-1.5 py-0.5 rounded-full font-semibold">New</span>
                  )}
                </Link>
              ))}
            </div>
            <Link href="/comparatifs" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm">⚖️ Comparatifs</Link>
            <Link href="/blog" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm">📰 Blog</Link>
            <Link href="/newsletter" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm">📧 Newsletter</Link>
            <Link href="/contact" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm">✉️ Contact</Link>
            <div className="pt-3 border-t border-purple-50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 py-1.5">🏆 Top 10</p>
              {TOP10_CATEGORIES.map(cat => (
                <Link key={cat.slug} href={`/top-10-${cat.slug}`} onClick={closeMobile} className="flex items-center gap-2 text-gray-700 hover:text-purple-700 px-3 py-2 rounded-xl hover:bg-purple-50 text-sm">
                  <span>{cat.icon}</span>Top 10 {cat.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-purple-100">
              <Link href="/outils" onClick={closeMobile}
                className="w-full gradient-purple text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg shadow-purple-300/40 min-h-[48px]">
                ⚡ Explorer les outils
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
