import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Search, ArrowRight, Star, Shield, Cpu, Globe, Zap } from 'lucide-react';
import { useRouter } from 'next/router';

const QUICK_LINKS = [
  { label: '🤖 IA', href: '/outils/intelligence-artificielle' },
  { label: '🛡️ VPN', href: '/outils/vpn' },
  { label: '🌐 Hébergement', href: '/outils/hebergement-web' },
  { label: '🦠 Antivirus', href: '/outils/antivirus' },
];

const STATS = [
  { value: 32, suffix: '+', label: 'Outils testés', icon: <Zap className="w-4 h-4" /> },
  { value: 4, suffix: '', label: 'Catégories', icon: <Globe className="w-4 h-4" /> },
  { value: 100, suffix: '%', label: 'Vérifiés', icon: <Shield className="w-4 h-4" /> },
  { value: 12, suffix: 'k+', label: 'Lecteurs/mois', icon: <Star className="w-4 h-4" /> },
];

function AnimatedNumber({ target, suffix }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let c = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      c += step;
      if (c >= target) { setCount(target); clearInterval(timer); }
      else setCount(c);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/outils?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative py-14 sm:py-20 md:py-24 overflow-hidden bg-gradient-to-b from-purple-50 to-white">
      {/* Blobs réduits sur mobile pour les perfs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[700px] h-[300px] sm:h-[500px] bg-purple-200/30 sm:bg-purple-200/40 rounded-full filter blur-[60px] sm:blur-[100px] pointer-events-none" />
      <div className="hidden sm:block absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-200/30 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-purple-200 text-gray-600 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
          Mis à jour 2025 · Sélection experte vérifiée
        </div>

        {/* Titre — taille adaptée mobile */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900">
          Trouvez les meilleurs<br className="hidden sm:block" />
          {' '}outils du web<br />
          <span className="text-gray-900">en quelques secondes</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
          IA, VPN, hébergement web, antivirus — comparez les meilleures solutions, vérifiées par nos experts.
        </p>

        {/* CTAs — pleine largeur sur mobile */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4 sm:px-0">
          <Link href="/outils"
            className="gradient-purple text-white px-6 sm:px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-purple-400/60 hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-2 text-base min-h-[52px]">
            ⚡ Explorer les outils
          </Link>
          <Link href="/top-10-intelligence-artificielle"
            className="bg-white border border-purple-200 text-gray-900 px-6 sm:px-8 py-4 rounded-xl font-semibold hover:border-purple-400 hover:bg-purple-50 transition-all inline-flex items-center justify-center gap-2 shadow-sm text-base min-h-[52px]">
            🏆 Voir le Top 10
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center px-4 sm:px-0">
          <div className="grid grid-cols-3 divide-x divide-purple-100 bg-white border border-purple-100 rounded-2xl overflow-hidden w-full max-w-sm sm:max-w-lg shadow-sm">
            <div className="text-center py-4 sm:py-6 px-2 sm:px-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">32+</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider font-semibold">Outils</div>
            </div>
            <div className="text-center py-4 sm:py-6 px-2 sm:px-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">4</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider font-semibold">Catégories</div>
            </div>
            <div className="text-center py-4 sm:py-6 px-2 sm:px-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">100%</div>
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider font-semibold">Vérifiés</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
