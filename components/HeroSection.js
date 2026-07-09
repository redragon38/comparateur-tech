import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Shield, Globe, Zap } from 'lucide-react';
import { useRouter } from 'next/router';
import { useT } from '../lib/i18n';

const DICT = {
  fr: {
    quickLinks: [
      { label: '🤖 Outils IA', href: '/outils/intelligence-artificielle' },
      { label: '⚖️ ChatGPT vs Claude', href: '/comparatifs/chatgpt-vs-claude' },
      { label: '💻 IA développeurs', href: '/guides/meilleurs-outils-ia-pour-developpeurs' },
      { label: '🛡️ VPN streaming', href: '/guides/meilleur-vpn-streaming' },
      { label: '🌐 Hébergement WordPress', href: '/guides/meilleur-hebergement-wordpress' },
    ],
    methodologyLink: '📘 Notre méthodologie',
    badge: 'Comparateur-Tech aide à choisir les meilleurs outils IA, VPN, hébergements et logiciels tech',
    h1a: 'Comparez les meilleurs outils IA,',
    h1b: 'VPN, hébergement et cybersécurité',
    subtitle: 'Trouvez rapidement l’outil adapté à votre besoin : prix, essais gratuits, points forts, limites, alternatives et verdict éditorial en langage simple.',
    affiliate: 'Certains liens peuvent être affiliés, sans coût supplémentaire pour vous.',
    searchPlaceholder: 'Rechercher ChatGPT, NordVPN, Hostinger, Bitdefender...',
    searchButton: 'Rechercher',
    statAnalyzed: 'Outils analysés',
    statAI: 'Outils IA',
    statAIDev: 'Outils IA dev',
    reviewsChecked: 'fiches relues',
    verticalsCovered: 'verticales couvertes',
    card1Desc: 'Les fiches sont structurées pour comparer vite : prix, essai, points forts, limites et alternatives.',
    card2Desc: 'IA, VPN, hébergement, antivirus et cybersécurité restent accessibles depuis des pages dédiées.',
    card3Title: 'Verdicts orientés usage',
    card3Desc: 'Chaque fiche aide à savoir pour qui l’outil est adapté, et dans quel cas il vaut mieux comparer une alternative.',
  },
  en: {
    quickLinks: [
      { label: '🤖 AI tools', href: '/outils/intelligence-artificielle' },
      { label: '⚖️ ChatGPT vs Claude', href: '/comparatifs/chatgpt-vs-claude' },
      { label: '💻 AI for developers', href: '/guides/meilleurs-outils-ia-pour-developpeurs' },
      { label: '🛡️ Streaming VPN', href: '/guides/meilleur-vpn-streaming' },
      { label: '🌐 WordPress hosting', href: '/guides/meilleur-hebergement-wordpress' },
    ],
    methodologyLink: '📘 Our methodology',
    badge: 'Comparateur-Tech helps you choose the best AI, VPN, hosting and tech tools',
    h1a: 'Compare the best AI tools,',
    h1b: 'VPN, hosting and cybersecurity',
    subtitle: 'Quickly find the right tool for your needs: pricing, free trials, strengths, limitations, alternatives and a plain-language editorial verdict.',
    affiliate: 'Some links may be affiliated, at no extra cost to you.',
    searchPlaceholder: 'Search ChatGPT, NordVPN, Hostinger, Bitdefender...',
    searchButton: 'Search',
    statAnalyzed: 'Tools analyzed',
    statAI: 'AI tools',
    statAIDev: 'AI dev tools',
    reviewsChecked: 'reviews checked',
    verticalsCovered: 'verticals covered',
    card1Desc: 'Reviews are structured for fast comparison: price, trial, strengths, limitations and alternatives.',
    card2Desc: 'AI, VPN, hosting, antivirus and cybersecurity stay accessible from dedicated pages.',
    card3Title: 'Use-case driven verdicts',
    card3Desc: 'Every review helps you know who the tool fits, and when it is better to compare an alternative.',
  },
};

function AnimatedCounter({ target, suffix, delay = 0 }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      let c = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const interval = setInterval(() => {
        c = Math.min(c + step, target);
        setCount(c);
        if (c >= target) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible, target, delay]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HeroSection({ stats }) {
  const t = useT(DICT);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/outils?q=${encodeURIComponent(query.trim())}`);
  };

  const primaryStats = [
    { value: stats?.totalTools || 129, suffix: '+', label: t.statAnalyzed },
    { value: stats?.aiTools || 46, suffix: '', label: t.statAI },
    { value: stats?.aiDevTools || 18, suffix: '', label: t.statAIDev },
  ];

  return (
    <section className="relative py-14 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 'min(700px, 130vw)',
          height: 'min(500px, 70vw)',
          background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.25) 0%, transparent 70%)',
          transform: 'translate(-50%, -20%)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      <div
        className="hidden sm:block absolute bottom-0 right-0 pointer-events-none"
        style={{ width: '300px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <div
          className="inline-flex items-center gap-2 bg-white border border-purple-200 text-gray-700 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft flex-shrink-0" />
          {t.badge}
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 550ms 60ms cubic-bezier(0.16,1,0.3,1), transform 550ms 60ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {t.h1a}
          <br className="hidden sm:block" />
          {t.h1b}
        </h1>

        <p
          className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 600ms 120ms cubic-bezier(0.16,1,0.3,1), transform 600ms 120ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {t.subtitle}
        </p>
        <p className="mx-auto -mt-5 mb-8 max-w-2xl text-sm text-gray-500">
          {t.affiliate}
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-lg shadow-purple-100/40 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
            <button type="submit" className="gradient-purple text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-300/50 transition-all inline-flex items-center justify-center gap-2 min-h-[48px]">
              {t.searchButton} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-10">
          {t.quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">
              {item.label}
            </Link>
          ))}
          <Link href="/methodologie" className="bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-full text-sm font-semibold transition-all">
            {t.methodologyLink}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto mt-8">
          {primaryStats.map((item, index) => (
            <div key={item.label} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                <AnimatedCounter target={item.value} suffix={item.suffix} delay={index * 80} />
              </div>
              <div className="text-sm text-gray-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mt-8 sm:mt-10">
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
            <Shield className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-semibold text-gray-900">{stats?.verifiedTools || 127} {t.reviewsChecked}</p>
            <p className="text-sm text-gray-500 mt-1">{t.card1Desc}</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
            <Globe className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-semibold text-gray-900">{stats?.totalCategories || 5} {t.verticalsCovered}</p>
            <p className="text-sm text-gray-500 mt-1">{t.card2Desc}</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
            <Zap className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-semibold text-gray-900">{t.card3Title}</p>
            <p className="text-sm text-gray-500 mt-1">{t.card3Desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
