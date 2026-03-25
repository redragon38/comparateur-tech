import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Star, Shield, Globe, Zap } from 'lucide-react';
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
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
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

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stagger d'entrée après mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/outils?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative py-14 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-b from-purple-50 via-white to-white">
      {/* Blobs décoratifs — GPU compositing */}
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
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white border border-purple-200 text-gray-600 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft flex-shrink-0" />
          Mis à jour 2025 · Sélection experte vérifiée
        </div>

        {/* Titre */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 550ms 60ms cubic-bezier(0.16,1,0.3,1), transform 550ms 60ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          Trouvez les meilleurs<br className="hidden sm:block" />
          {' '}outils du web<br />
          <span className="text-gray-900">en quelques secondes</span>
        </h1>

        {/* Sous-titre */}
        <p
          className="text-base sm:text-xl text-gray-500 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 550ms 120ms cubic-bezier(0.16,1,0.3,1), transform 550ms 120ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          IA, VPN, hébergement web, antivirus — comparez les meilleures solutions, vérifiées par nos experts.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4 sm:px-0"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 550ms 180ms cubic-bezier(0.16,1,0.3,1), transform 550ms 180ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Link
            href="/outils"
            className="gradient-purple text-white px-6 sm:px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-purple-400/60 hover:-translate-y-1 active:translate-y-0 transition-all duration-200 inline-flex items-center justify-center gap-2 text-base min-h-[52px]"
          >
            ⚡ Explorer les outils
          </Link>
          <Link
            href="/top-10-intelligence-artificielle"
            className="bg-white border border-purple-200 text-gray-900 px-6 sm:px-8 py-4 rounded-xl font-semibold hover:border-purple-400 hover:bg-purple-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-sm text-base min-h-[52px]"
          >
            🏆 Voir le Top 10
          </Link>
        </div>

        {/* Stats */}
        <div
          className="flex justify-center px-4 sm:px-0"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 550ms 240ms cubic-bezier(0.16,1,0.3,1), transform 550ms 240ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="grid grid-cols-3 divide-x divide-purple-100 bg-white border border-purple-100 rounded-2xl overflow-hidden w-full max-w-sm sm:max-w-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            {[
              { target: 32, suffix: '+', label: 'Outils' },
              { target: 4,  suffix: '',  label: 'Catégories' },
              { target: 100, suffix: '%', label: 'Vérifiés' },
            ].map(({ target, suffix, label }, i) => (
              <div key={label} className="text-center py-4 sm:py-6 px-2 sm:px-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  <AnimatedCounter target={target} suffix={suffix} delay={i * 80} />
                </div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
