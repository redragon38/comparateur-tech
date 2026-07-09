import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronDown, LayoutGrid, Trophy } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useUI } from '../lib/i18n';

export default function Header() {
  const ui = useUI();
  const CATEGORIES = ui.categories;
  const TOP10_CATEGORIES = ui.top10Categories;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [outilsOpen, setOutilsOpen] = useState(false);
  const [top10Open, setTop10Open] = useState(false);
  const [topbarVisible, setTopbarVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const outilsRef = useRef(null);
  const top10Ref = useRef(null);

  // Scroll detection pour header glassmorphism
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermer dropdowns au clic extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (outilsRef.current && !outilsRef.current.contains(e.target)) setOutilsOpen(false);
      if (top10Ref.current && !top10Ref.current.contains(e.target)) setTop10Open(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquer le scroll body quand menu mobile ouvert
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Fermer menu mobile sur Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setMobileMenuOpen(false); setOutilsOpen(false); setTop10Open(false); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <>
      {/* ── Topbar ── */}
      {topbarVisible && (
        <div className="bg-gradient-to-r from-violet-700 via-purple-600 to-violet-700 text-white text-center py-2.5 text-sm font-medium px-4 relative">
          {ui.topbar.before}<strong>{ui.topbar.bold}</strong>{ui.topbar.after} &nbsp;·&nbsp;
          <Link href="/outils" className="underline font-bold hover:text-purple-200 transition-colors">{ui.topbar.cta}</Link>
          <button
            onClick={() => setTopbarVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 rounded"
            aria-label={ui.topbar.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Header principal ── */}
      <header
        className={[
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-purple-100 shadow-sm shadow-purple-100/50'
            : 'bg-white/90 backdrop-blur-lg border-purple-50',
        ].join(' ')}
        style={{ transition: 'background-color 300ms, box-shadow 300ms, border-color 300ms' }}
      >
        <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Comparateur-Tech"
                  className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105"
                  width={36} height={36}
                />
              </div>
              <span className="text-xl font-extrabold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
                Comparateur-Tech
              </span>
            </Link>

            {/* Nav desktop */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all duration-200">
                {ui.nav.home}
              </Link>

              {/* Dropdown Outils */}
              <div className="relative" ref={outilsRef}>
                <button
                  onClick={() => { setOutilsOpen(!outilsOpen); setTop10Open(false); }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    outilsOpen ? 'text-purple-700 bg-purple-50' : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  {ui.nav.tools}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${outilsOpen ? 'rotate-180' : ''}`} />
                </button>
                {outilsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-100/50 overflow-hidden animate-scale-in">
                    <Link href="/outils" onClick={() => setOutilsOpen(false)} className="flex items-center gap-3 px-4 py-3.5 hover:bg-purple-50 transition-colors duration-150 border-b border-purple-50">
                      <div className="w-9 h-9 rounded-xl gradient-purple flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{ui.nav.allTools}</p>
                        <p className="text-gray-400 text-xs">{ui.nav.exploreAll}</p>
                      </div>
                    </Link>
                    <div className="p-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2 py-1.5">{ui.nav.categories}</p>
                      {CATEGORIES.map((cat, i) => (
                        <Link
                          key={cat.slug}
                          href={cat.href}
                          onClick={() => setOutilsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 transition-colors duration-150 group"
                          style={{ animationDelay: `${i * 30}ms` }}
                        >
                          <span className="text-xl w-8 text-center">{cat.icon}</span>
                          <div>
                            <p className="text-gray-700 font-medium text-sm group-hover:text-purple-700 transition-colors duration-150">{cat.label}</p>
                            <p className="text-gray-400 text-xs">{cat.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/comparatifs" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all duration-200">
                {ui.nav.comparisons}
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all duration-200">
                {ui.nav.blog}
              </Link>
              <Link href="/methodologie" className="text-gray-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 text-sm font-medium transition-all duration-200">
                {ui.nav.methodology}
              </Link>

              {/* Top 10 dropdown */}
              <div className="relative ml-2" ref={top10Ref}>
                <button
                  onClick={() => { setTop10Open(!top10Open); setOutilsOpen(false); }}
                  className="flex items-center gap-2 gradient-purple text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md shadow-purple-300/50 hover:shadow-purple-400/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 min-h-[44px]"
                >
                  <Trophy className="w-4 h-4" />
                  {ui.nav.top10}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${top10Open ? 'rotate-180' : ''}`} />
                </button>
                {top10Open && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-100/50 overflow-hidden p-2 animate-scale-in">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-2 py-1.5">{ui.nav.byCategory}</p>
                    {TOP10_CATEGORIES.map((cat, i) => (
                      <Link
                        key={cat.slug}
                        href={`/top-10-${cat.slug}`}
                        onClick={() => setTop10Open(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 transition-colors duration-150 group"
                        style={{ animationDelay: `${i * 25}ms` }}
                      >
                        <span className="text-lg w-7 text-center">{cat.icon}</span>
                        <span className="text-gray-700 font-medium text-sm group-hover:text-purple-700 transition-colors duration-150">Top 10 {cat.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sélecteur de langue */}
              <LanguageSwitcher className="ml-2" />
            </div>

            {/* Burger mobile + langue */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <button
                className="text-gray-700 hover:text-purple-700 transition-colors duration-200 p-2 rounded-lg hover:bg-purple-50 active:scale-95"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? ui.nav.closeMenu : ui.nav.openMenu}
                aria-expanded={mobileMenuOpen}
              >
              <span
                className="block w-6 relative"
                style={{ height: '18px' }}
              >
                <span
                  className="absolute left-0 h-0.5 bg-current rounded-full transition-all duration-300"
                  style={{
                    width: '100%',
                    top: mobileMenuOpen ? '50%' : '0',
                    transform: mobileMenuOpen ? 'translateY(-50%) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="absolute left-0 h-0.5 bg-current rounded-full transition-all duration-200"
                  style={{
                    width: '75%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: mobileMenuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="absolute left-0 h-0.5 bg-current rounded-full transition-all duration-300"
                  style={{
                    width: '100%',
                    bottom: mobileMenuOpen ? '50%' : '0',
                    transform: mobileMenuOpen ? 'translateY(50%) rotate(-45deg)' : 'none',
                  }}
                />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Overlay mobile ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 overlay-blur"
          onClick={closeMobile}
          aria-hidden="true"
          style={{ top: topbarVisible ? '88px' : '64px' }}
        />
      )}

      {/* ── Menu mobile (drawer) ── */}
      <div
        className={[
          'md:hidden fixed left-0 right-0 z-40 bg-white shadow-2xl shadow-purple-200/40 border-t border-purple-50 overflow-y-auto',
          'transition-all duration-300',
        ].join(' ')}
        style={{
          top: topbarVisible ? '88px' : '64px',
          maxHeight: mobileMenuOpen ? 'calc(100vh - 88px)' : '0',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          overflow: 'hidden',
          transitionTimingFunction: mobileMenuOpen ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.4, 0, 1, 1)',
        }}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="px-4 pt-4 pb-8 space-y-1">
          <Link href="/" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm font-medium transition-all duration-150">{ui.nav.home}</Link>
          <Link href="/outils" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 font-semibold text-sm transition-all duration-150">🛠️ {ui.nav.allTools}</Link>
          <div className="ml-4 border-l border-purple-100 pl-4 space-y-1">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={cat.href} onClick={closeMobile} className="flex items-center gap-2 text-gray-500 hover:text-purple-700 py-2 text-sm transition-colors duration-150">
                <span>{cat.icon}</span>{cat.label}
              </Link>
            ))}
          </div>
          <Link href="/comparatifs" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm transition-all duration-150">⚖️ {ui.nav.comparisons}</Link>
          <Link href="/methodologie" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm transition-all duration-150">📘 {ui.nav.methodology}</Link>
          <Link href="/blog" onClick={closeMobile} className="block text-gray-700 hover:text-purple-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm transition-all duration-150">📰 {ui.nav.blog}</Link>
          <div className="pt-3 border-t border-purple-50">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 py-1.5">{ui.nav.usefulLinks}</p>
            <Link href="/newsletter" onClick={closeMobile} className="block text-gray-500 hover:text-purple-700 px-3 py-2 rounded-xl hover:bg-purple-50 text-sm transition-all duration-150">📧 {ui.nav.newsletter}</Link>
            <Link href="/contact" onClick={closeMobile} className="block text-gray-500 hover:text-purple-700 px-3 py-2 rounded-xl hover:bg-purple-50 text-sm transition-all duration-150">✉️ {ui.nav.contact}</Link>
            <Link href="/partenaires" onClick={closeMobile} className="block text-gray-500 hover:text-purple-700 px-3 py-2 rounded-xl hover:bg-purple-50 text-sm transition-all duration-150">🤝 {ui.nav.partners}</Link>
          </div>
          <div className="pt-3 border-t border-purple-50">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 px-3 py-1.5">🏆 {ui.nav.top10}</p>
            {TOP10_CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/top-10-${cat.slug}`} onClick={closeMobile} className="flex items-center gap-2 text-gray-700 hover:text-purple-700 px-3 py-2 rounded-xl hover:bg-purple-50 text-sm transition-all duration-150">
                <span>{cat.icon}</span>{ui.nav.top10} {cat.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-purple-100">
            <Link
              href="/outils"
              onClick={closeMobile}
              className="w-full gradient-purple text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg shadow-purple-300/40 min-h-[48px] active:scale-98 transition-all duration-150"
            >
              ⚡ Explorer les outils
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
