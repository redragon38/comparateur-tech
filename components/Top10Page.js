import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import { Star, ExternalLink, ArrowRight, Trophy, ChevronRight } from 'lucide-react';

function Stars({ val }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(val || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

function getRankBadge(rank) {
  if (rank === 0) return { emoji: '🥇', label: '#1', bg: 'bg-yellow-50 border-yellow-300 text-yellow-800' };
  if (rank === 1) return { emoji: '🥈', label: '#2', bg: 'bg-gray-100 border-gray-300 text-gray-700' };
  if (rank === 2) return { emoji: '🥉', label: '#3', bg: 'bg-orange-50 border-orange-300 text-orange-800' };
  return { emoji: '', label: `#${rank + 1}`, bg: 'bg-purple-50 border-purple-200 text-purple-700' };
}

export default function Top10Page({ tools, meta, others, seo }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO {...seo} />
      <Header />
      <main>

        {/* ── Hero ── */}
        <section className={`py-12 sm:py-20 bg-gradient-to-b ${meta.colorLight} border-b ${meta.border}`}>
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-purple-200 text-gray-600 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-sm">
              <Trophy className="w-3.5 h-3.5" /> Classement 2025
            </div>
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{meta.icon}</div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-gray-900">
              Top 10 <span>{meta.label}</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg max-w-xl mx-auto px-2">{meta.desc}</p>
          </div>
        </section>

        {/* ── Liste ── */}
        <div className="container mx-auto px-3 sm:px-6 py-8 sm:py-16 max-w-4xl">
          <div className="space-y-3 sm:space-y-4 mb-12 sm:mb-16">
            {tools.map((tool, i) => {
              const badge = getRankBadge(i);
              const url = tool.affiliateUrl || tool.website || '#';
              const isTop3 = i < 3;

              return (
                <div key={tool.id}
                  className={`bg-white rounded-2xl border-2 ${isTop3 ? meta.border : 'border-gray-100'} shadow-sm hover:shadow-md transition-all overflow-hidden`}>

                  {/* Barre colorée top */}
                  {isTop3 && <div className={`h-1 w-full bg-gradient-to-r ${meta.color}`} />}

                  {/* ── Layout MOBILE : carte verticale ── */}
                  <div className="sm:hidden p-4">
                    {/* Ligne 1 : rang + logo + nom + badges */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Badge rang */}
                      <div className={`w-11 h-11 rounded-xl border-2 ${badge.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                        {badge.emoji
                          ? <span className="text-base leading-none">{badge.emoji}</span>
                          : <span className="text-sm font-bold">{badge.label}</span>
                        }
                      </div>

                      {/* Logo */}
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {tool.logo ? (
                          <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain p-1.5" loading="lazy"
                            onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span class="text-xl">${meta.icon}</span>`; }} />
                        ) : <span className="text-xl">{meta.icon}</span>}
                      </div>

                      {/* Nom + badges inline */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base leading-tight truncate">{tool.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {tool.verified && <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">✓</span>}
                          {tool.trial && <span className="text-xs bg-cyan-50 border border-cyan-200 text-cyan-700 px-1.5 py-0.5 rounded-full font-semibold">🆓 Essai</span>}
                          {tool.price && <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${meta.badge}`}>{tool.price}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{tool.short || tool.highlight}</p>

                    {/* Note + barre */}
                    {tool.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <Stars val={tool.rating.value} />
                        <span className="text-xs text-gray-500">{tool.rating.value}/5</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${meta.color} rounded-full`} style={{ width: `${(tool.rating.value / 5) * 100}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Boutons — pleine largeur */}
                    <div className="flex gap-2">
                      <Link href={`/tool/${tool.id}`}
                        className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 hover:bg-purple-50 hover:border-purple-300 transition-all min-h-[44px]">
                        Voir la fiche <ArrowRight className="w-3 h-3" />
                      </Link>
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="flex-1 gradient-purple text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 hover:shadow-md transition-all min-h-[44px]">
                        Site officiel <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* ── Layout DESKTOP : ligne horizontale ── */}
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-5 p-5">
                      {/* Badge rang */}
                      <div className={`w-14 h-14 rounded-2xl border-2 ${badge.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                        {badge.emoji && <span className="text-xl leading-none">{badge.emoji}</span>}
                        <span className="text-xs font-bold mt-0.5">{badge.label}</span>
                      </div>

                      {/* Logo */}
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {tool.logo ? (
                          <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain p-2" loading="lazy"
                            onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span class="text-2xl">${meta.icon}</span>`; }} />
                        ) : <span className="text-2xl">{meta.icon}</span>}
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-lg">{tool.name}</h3>
                          {tool.verified && <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Vérifié</span>}
                          {tool.trial && <span className="text-xs bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full font-semibold">🆓 Essai gratuit</span>}
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-1">{tool.short || tool.highlight}</p>
                        {tool.rating && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <Stars val={tool.rating.value} />
                            <span className="text-xs text-gray-500">{tool.rating.value}/5 ({tool.rating.count} avis)</span>
                          </div>
                        )}
                      </div>

                      {/* Prix + boutons */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {tool.price && <span className={`text-xs font-bold px-3 py-1 rounded-full border ${meta.badge}`}>{tool.price}</span>}
                        <div className="flex gap-2">
                          <Link href={`/tool/${tool.id}`}
                            className="border border-purple-200 text-gray-600 px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1 hover:bg-purple-50 transition-all min-h-[44px]">
                            Fiche <ArrowRight className="w-3 h-3" />
                          </Link>
                          <a href={url} target="_blank" rel="noopener noreferrer"
                            className="gradient-purple text-white px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1 hover:shadow-md transition-all min-h-[44px]">
                            Site <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Barre de note desktop */}
                    {tool.rating && (
                      <div className="px-5 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-10">Note</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${meta.color} rounded-full`} style={{ width: `${(tool.rating.value / 5) * 100}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-8 text-right">{tool.rating.value}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Autres Top 10 ── */}
          <div className="border-t border-gray-100 pt-10 sm:pt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Voir les autres Top 10</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {others.map(cat => (
                <Link key={cat.href} href={cat.href}
                  className="bg-white border-2 border-purple-100 rounded-2xl p-4 sm:p-5 flex items-center gap-3 hover:border-purple-300 hover:shadow-md transition-all group shadow-sm min-h-[72px]">
                  <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{cat.label}</p>
                    <p className="text-xs text-gray-400">Classement 2025</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
