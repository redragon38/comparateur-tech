import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Shield, Globe, Zap } from 'lucide-react';
import { useRouter } from 'next/router';

const QUICK_LINKS = [
  { label: '🤖 IA', href: '/outils/intelligence-artificielle' },
  { label: '🛡️ VPN', href: '/outils/vpn' },
  { label: '🌐 Hébergement', href: '/outils/hebergement-web' },
  { label: '🦠 Antivirus', href: '/outils/antivirus' },
];

function AnimatedCounter({ target, suffix, delay = 0 }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.5 });
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

  return (
    <section className="relative py-14 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 'min(700px, 130vw)',
          height: 'min(500px, 70vw)',
          background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.25) 0%, transparent 70%)',
          filter: 'blur(0)',
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
          Tests éditoriaux, benchmarks et sélection indépendante
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 550ms 60ms cubic-bezier(0.16,1,0.3,1), transform 550ms 60ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          Comparez les meilleurs outils
          <br className="hidden sm:block" />
          pour choisir plus vite,
          <br />
          <span className="text-gray-900">avec une vraie méthode de test</span>
        </h1>

        <p
          className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-8 sm:mb-10"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 600ms 120ms cubic-bezier(0.16,1,0.3,1), transform 600ms 120ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          IA, VPN, hébergement et cybersécurité : nous analysons les prix, les fonctionnalités,
          les limites réelles et les cas d'usage pour aider freelances, créateurs et petites équipes
          à faire le bon choix.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-lg shadow-purple-100/40 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Rechercher un outil, une marque, un besoin..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
            <button type="submit" className="gradient-purple text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-300/50 transition-all inline-flex items-center justify-center gap-2 min-h-[48px]">
              Rechercher <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-10">
          {QUICK_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-full text-sm font-semibold transition-all">
              {item.label}
            </Link>
          ))}
          <Link href="/methodologie" className="bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-full text-sm font-semibold transition-all">
            📘 Notre méthodologie
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mt-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              <AnimatedCounter target={stats?.totalTools || 115} suffix="+" />
            </div>
            <div className="text-sm text-gray-500 mt-1">Outils analysés</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              <AnimatedCounter target={stats?.totalCategories || 4} suffix="" />
            </div>
            <div className="text-sm text-gray-500 mt-1">Verticales couvertes</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              <AnimatedCounter target={stats?.verifiedPercent || 98} suffix="%" />
            </div>
            <div className="text-sm text-gray-500 mt-1">Fiches revues</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mt-8 sm:mt-10">
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
            <Shield className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-semibold text-gray-900">Comparatifs fiables</p>
            <p className="text-sm text-gray-500 mt-1">Méthode éditoriale claire, signaux de confiance et sélection indépendante.</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
            <Globe className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-semibold text-gray-900">Vue d'ensemble rapide</p>
            <p className="text-sm text-gray-500 mt-1">Prix, points forts, limites et alternatives sur une seule page.</p>
          </div>
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
            <Zap className="w-5 h-5 text-purple-600 mb-2" />
            <p className="font-semibold text-gray-900">Choix par usage</p>
            <p className="text-sm text-gray-500 mt-1">Nous t'aidons à choisir selon ton besoin réel, pas seulement selon la note.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
