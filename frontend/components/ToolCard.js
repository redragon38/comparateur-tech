import { Star, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CAT_META = {
  'VPN':                       { icon: '🛡️', topBar: 'bg-blue-500',    border: 'border-blue-200',    badge: 'bg-blue-50 border-blue-200 text-blue-700'         },
  'Intelligence artificielle': { icon: '🤖', topBar: 'bg-violet-500',  border: 'border-violet-200',  badge: 'bg-violet-50 border-violet-200 text-violet-700'   },
  'Hébergement web':           { icon: '🌐', topBar: 'bg-emerald-500', border: 'border-emerald-200', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  'Antivirus':                 { icon: '🦠', topBar: 'bg-red-500',     border: 'border-red-200',     badge: 'bg-red-50 border-red-200 text-red-700'            },
  'IA générative':             { icon: '✨', topBar: 'bg-pink-500',    border: 'border-pink-200',    badge: 'bg-pink-50 border-pink-200 text-pink-700'         },
};

function Stars({ val }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(val || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function ToolCard({ tool }) {
  const cat = tool.categories?.[0];
  const meta = CAT_META[cat] || { icon: '🛠️', topBar: 'bg-purple-500', border: 'border-purple-200', badge: 'bg-purple-50 border-purple-200 text-purple-700' };
  const url = tool.website || tool.affiliateUrl || tool.link || '#';

  return (
    <div className={`bg-white rounded-2xl flex flex-col overflow-hidden border-2 ${meta.border} transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1`}>
      <div className={`h-1.5 w-full ${meta.topBar}`} />

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Logo + badges */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain p-1.5" loading="lazy"
                onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span class="text-2xl">${meta.icon}</span>`; }} />
            ) : <span className="text-2xl">{meta.icon}</span>}
          </div>
          <div className="flex flex-col gap-1 items-end">
            {tool.verified && <span className="bg-green-50 border border-green-200 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-bold">✓ Vérifié</span>}
            {tool.featured && <span className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-1.5 py-0.5 rounded-full text-xs font-bold">🏆 Top</span>}
            {tool.trial && <span className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-1.5 py-0.5 rounded-full text-xs font-bold">🆓 Essai</span>}
          </div>
        </div>

        {/* Nom */}
        <Link href={`/tool/${tool.id}`}>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">{tool.name}</h3>
        </Link>

        {/* Prix */}
        {tool.price && (
          <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${meta.badge}`}>{tool.price}</span>
        )}

        {/* Description */}
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2 flex-1 mb-3 sm:mb-4">{tool.short || tool.highlight || ''}</p>

        {/* Note */}
        {tool.rating && (
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Stars val={tool.rating.value} />
            <span className="text-xs text-gray-500">{tool.rating.value} ({tool.rating.count})</span>
          </div>
        )}

        {/* Boutons — empilés sur petit écran */}
        <div className="flex flex-col xs:flex-row gap-2 mt-auto">
          <Link href={`/tool/${tool.id}`}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all min-h-[44px]">
            Voir la fiche <ArrowRight className="w-3 h-3" />
          </Link>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="flex-1 gradient-purple text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 hover:shadow-md hover:shadow-purple-300/40 transition-all min-h-[44px]">
            Site officiel <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
