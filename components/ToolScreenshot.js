import { useLocale, pickToolText } from '../lib/i18n';

// Palette de marque par catégorie (réutilise la logique des autres composants).
const CAT_STYLE = {
  'VPN': { accent: '#3b82f6', soft: '#eff6ff', icon: '🛡️' },
  'Intelligence artificielle': { accent: '#7c3aed', soft: '#f5f3ff', icon: '🤖' },
  'Hébergement web': { accent: '#059669', soft: '#ecfdf5', icon: '🌐' },
  'Antivirus': { accent: '#dc2626', soft: '#fff1f2', icon: '🦠' },
  'Cybersécurité': { accent: '#334155', soft: '#f8fafc', icon: '🔐' },
  'IA générative': { accent: '#db2777', soft: '#fdf2f8', icon: '✨' },
};
const DEFAULT_STYLE = { accent: '#7c3aed', soft: '#f5f3ff', icon: '🛠️' };

const UI = {
  fr: {
    caption: (name) => `Aperçu du site officiel de ${name}`,
    alt: (name) => `Aperçu de la page d'accueil de ${name}`,
    visit: 'Visiter',
    homepage: 'Page d’accueil',
    tryFree: 'Essai gratuit',
    generated: 'Aperçu généré à partir des données publiques de l’outil',
  },
  en: {
    caption: (name) => `Preview of the official ${name} website`,
    alt: (name) => `Preview of the ${name} homepage`,
    visit: 'Visit',
    homepage: 'Homepage',
    tryFree: 'Free trial',
    generated: 'Preview generated from the tool’s public data',
  },
};

function domainOf(url) {
  if (!url) return 'example.com';
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
}

/**
 * Aperçu "screenshot" GÉNÉRÉ (pas une vraie capture) : une maquette de fenêtre de
 * navigateur construite à partir des données de l'outil (logo, couleur de marque,
 * domaine réel, nom, accroche, CTA). Rendu instantané, aucune dépendance externe,
 * valable pour les 139 outils. Le texte visible sert aussi le SEO/GEO.
 */
export default function ToolScreenshot({ tool }) {
  const locale = useLocale();
  const t = UI[locale] || UI.fr;
  const cat = tool.categories?.[0];
  const s = CAT_STYLE[cat] || DEFAULT_STYLE;
  const url = tool.website || tool.affiliateUrl || '#';
  const domain = domainOf(tool.website || tool.affiliateUrl);
  const tagline = pickToolText(tool, locale, 'highlight') || pickToolText(tool, locale, 'short') || '';

  return (
    <figure className="my-0">
      <div
        className="rounded-2xl overflow-hidden border shadow-sm"
        style={{ borderColor: `${s.accent}22`, boxShadow: `0 10px 30px ${s.accent}14` }}
        role="img"
        aria-label={t.alt(tool.name)}
      >
        {/* Barre de navigateur */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 border-b border-gray-200">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <div className="flex-1 mx-2 bg-white border border-gray-200 rounded-md px-3 py-1 text-[11px] text-gray-500 truncate">
            🔒 {domain}
          </div>
        </div>

        {/* Fausse page d'accueil */}
        <div className="relative" style={{ background: `linear-gradient(180deg, ${s.soft} 0%, #ffffff 60%)` }}>
          {/* Nav du faux site */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: `${s.accent}14` }}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center overflow-hidden" style={{ borderColor: `${s.accent}22` }}>
                {tool.logo
                  ? <img src={tool.logo} alt="" width={28} height={28} loading="lazy" decoding="async" className="w-full h-full object-contain p-0.5" />
                  : <span className="text-sm">{s.icon}</span>}
              </div>
              <span className="font-bold text-gray-800 text-sm">{tool.name}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <span className="w-10 h-1.5 rounded-full bg-gray-200" />
              <span className="w-10 h-1.5 rounded-full bg-gray-200" />
              <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-md" style={{ background: s.accent }}>{t.visit}</span>
            </div>
          </div>

          {/* Héros du faux site */}
          <div className="px-5 sm:px-8 py-8 sm:py-10">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3" style={{ color: s.accent, background: '#ffffff', border: `1px solid ${s.accent}22` }}>
              {s.icon} {cat || t.homepage}
            </span>
            <p className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-snug max-w-md mb-2">
              {tool.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-md mb-5 line-clamp-2">
              {tagline}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white px-4 py-2 rounded-lg" style={{ background: s.accent }}>{t.visit} {tool.name} →</span>
              {tool.trial && <span className="text-[11px] font-semibold px-3 py-2 rounded-lg" style={{ color: s.accent, background: '#fff', border: `1px solid ${s.accent}22` }}>{t.tryFree}</span>}
            </div>
          </div>
        </div>
      </div>
      <figcaption className="text-center text-[11px] text-gray-400 mt-2">
        <a href={url} target="_blank" rel="sponsored nofollow noopener noreferrer" className="hover:text-purple-600 hover:underline">
          {t.caption(tool.name)}
        </a>
        <span className="block mt-0.5 text-gray-300">{t.generated}</span>
      </figcaption>
    </figure>
  );
}
