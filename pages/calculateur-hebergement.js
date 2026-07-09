import Link from 'next/link';
import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildArticleSchema, buildBreadcrumbSchema, buildFAQSchema } from '../components/SEO';
import { ArrowRight, Calculator, Check, Copy } from 'lucide-react';
import {
  BAROMETRE_DATE,
  BAROMETRE_DATE_LABEL,
  HOSTING_PRICING,
  formatEuro,
  increasePct,
  totalCost,
} from '../lib/barometre-data';

const CANONICAL = 'https://comparateur-tech.com/calculateur-hebergement';

const FAQS = [
  {
    q: 'Pourquoi calculer le coût d’un hébergement sur 3 ans ?',
    a: 'Parce que le prix affiché ne dure que la première période d’engagement : au renouvellement, le tarif est souvent multiplié par 2 ou 3. Sur 3 ans, un hébergeur « à 1 €/mois » peut coûter plus cher qu’une offre stable à 6 €/mois. Trois ans correspondent à la durée de vie typique d’un site avant refonte ou migration.',
  },
  {
    q: 'Le calculateur prend-il en compte le nom de domaine ?',
    a: 'Oui, en option : la plupart des hébergeurs offrent le domaine la première année (environ 12 €/an ensuite). Cochez la case correspondante pour l’inclure dans le calcul du coût total.',
  },
  {
    q: 'D’où viennent les prix pré-remplis ?',
    a: `Des sites officiels des hébergeurs, relevés manuellement en ${BAROMETRE_DATE_LABEL} pour l'offre mutualisée standard la plus mise en avant, en euros TTC. Les prix changent souvent : vérifiez le tarif du jour avant de souscrire, et utilisez les champs manuels pour tester n'importe quelle offre.`,
  },
  {
    q: 'Peut-on citer ces données ?',
    a: 'Oui, le tableau comparatif et le calculateur sont librement citables avec un lien vers cette page comme source (licence CC BY 4.0).',
  },
];

function buildAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculateur de coût réel d’hébergement web sur 3 ans',
    url: CANONICAL,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR' },
    creator: { '@type': 'Organization', name: 'Comparateur-Tech', url: 'https://comparateur-tech.com' },
  };
}

function CitationBlock() {
  const [copied, setCopied] = useState(false);
  const snippet = `Source : <a href="${CANONICAL}">Calculateur de coût réel d'hébergement, Comparateur-Tech</a>`;
  const copy = () => {
    navigator.clipboard?.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <section className="bg-purple-50 border border-purple-200 rounded-3xl p-5 sm:p-7">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Citer ces données</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Ce comparatif et ce calculateur sont librement réutilisables (licence CC BY 4.0) avec un lien vers cette page comme source.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <code className="flex-1 bg-white border border-purple-200 rounded-xl px-4 py-3 text-xs text-gray-700 overflow-x-auto whitespace-nowrap">{snippet}</code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 rounded-xl gradient-purple text-white px-5 py-3 text-sm font-bold hover:shadow-md transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copié !' : 'Copier le lien source'}
        </button>
      </div>
    </section>
  );
}

const DOMAIN_YEARLY = 12;

export default function CalculateurHebergement() {
  const [presetId, setPresetId] = useState('hostinger');
  const [promoMonthly, setPromoMonthly] = useState('2.99');
  const [promoMonths, setPromoMonths] = useState('48');
  const [renewalMonthly, setRenewalMonthly] = useState('7.99');
  const [totalMonths, setTotalMonths] = useState('36');
  const [includeDomain, setIncludeDomain] = useState(true);

  const applyPreset = (id) => {
    setPresetId(id);
    const preset = HOSTING_PRICING.find(item => item.id === id);
    if (preset) {
      setPromoMonthly(String(preset.promoMonthly));
      setPromoMonths(String(preset.promoMonths));
      setRenewalMonthly(String(preset.renewalMonthly));
    }
  };

  const result = useMemo(() => {
    const promo = Math.max(parseFloat(String(promoMonthly).replace(',', '.')) || 0, 0);
    const months = Math.max(parseInt(promoMonths, 10) || 0, 0);
    const renewal = Math.max(parseFloat(String(renewalMonthly).replace(',', '.')) || 0, 0);
    const total = Math.min(Math.max(parseInt(totalMonths, 10) || 36, 1), 120);
    const effectivePromoMonths = Math.min(months, total);
    const hostingCost = promo * effectivePromoMonths + renewal * (total - effectivePromoMonths);
    // Domaine : offert la 1ère année chez la plupart des hébergeurs, payant ensuite.
    const domainYears = Math.max(Math.ceil(total / 12) - 1, 0);
    const domainCost = includeDomain ? domainYears * DOMAIN_YEARLY : 0;
    const totalCostValue = hostingCost + domainCost;
    const advertised = promo * total;
    return {
      total,
      totalCostValue,
      monthlyAverage: totalCostValue / total,
      advertised,
      gapPct: advertised > 0 ? Math.round(((totalCostValue - advertised) / advertised) * 100) : 0,
    };
  }, [promoMonthly, promoMonths, renewalMonthly, totalMonths, includeDomain]);

  const rows = useMemo(
    () => [...HOSTING_PRICING].sort((a, b) => totalCost(a) - totalCost(b)),
    []
  );

  const title = 'Calculateur : le coût réel de votre hébergement web sur 3 ans';
  const description = `Outil gratuit : calculez ce que votre hébergement web coûtera vraiment sur 3 ans, renouvellement et domaine compris. Comparatif du coût réel de ${HOSTING_PRICING.length} hébergeurs (relevé ${BAROMETRE_DATE_LABEL}).`;

  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Calculateur hébergement' },
    ]),
    buildArticleSchema({
      title,
      description,
      url: '/calculateur-hebergement',
      datePublished: BAROMETRE_DATE,
      dateModified: BAROMETRE_DATE,
      section: 'Études',
    }),
    buildAppSchema(),
    buildFAQSchema(FAQS),
  ];

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all';

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Calculateur coût hébergement web : le vrai prix sur 3 ans"
        description={description}
        canonical={CANONICAL}
        structuredData={structuredData}
        ogType="article"
        datePublished={BAROMETRE_DATE}
        dateModified={BAROMETRE_DATE}
        articleSection="Études"
      />
      <Header />
      <main>
        <section className="bg-gradient-to-b from-purple-50 to-white border-b border-purple-100 py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Calculator className="w-4 h-4" /> Outil gratuit
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
              Combien coûte vraiment votre hébergement sur 3 ans ?
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Le prix promo ne dure que la première période : au renouvellement, la facture grimpe souvent de 100 à 300 %.
              Ce calculateur révèle le coût total réel, renouvellement et nom de domaine compris.
            </p>
            <p className="text-sm text-gray-400 mt-4">Prix pré-remplis relevés en {BAROMETRE_DATE_LABEL} · modifiables librement</p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-6xl space-y-8">

          {/* Calculateur */}
          <section className="bg-white border border-purple-200 rounded-3xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Le calculateur</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label htmlFor="preset" className="block text-sm font-semibold text-gray-700 mb-2">Pré-remplir avec un hébergeur</label>
                  <select id="preset" value={presetId} onChange={e => applyPreset(e.target.value)} className={inputClass}>
                    {HOSTING_PRICING.map(item => (
                      <option key={item.id} value={item.id}>{item.name}, {item.plan}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="promo" className="block text-sm font-semibold text-gray-700 mb-2">Prix promo (€/mois)</label>
                    <input id="promo" type="number" min="0" step="0.01" value={promoMonthly} onChange={e => setPromoMonthly(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="engagement" className="block text-sm font-semibold text-gray-700 mb-2">Durée promo (mois)</label>
                    <input id="engagement" type="number" min="0" step="1" value={promoMonths} onChange={e => setPromoMonths(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="renouvellement" className="block text-sm font-semibold text-gray-700 mb-2">Renouvellement (€/mois)</label>
                    <input id="renouvellement" type="number" min="0" step="0.01" value={renewalMonthly} onChange={e => setRenewalMonthly(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="duree" className="block text-sm font-semibold text-gray-700 mb-2">Durée totale (mois)</label>
                    <input id="duree" type="number" min="1" max="120" step="1" value={totalMonths} onChange={e => setTotalMonths(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={includeDomain} onChange={e => setIncludeDomain(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-400" />
                  Inclure un nom de domaine ({DOMAIN_YEARLY} €/an, offert la 1ère année)
                </label>
              </div>

              <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 flex flex-col justify-center gap-5">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Coût total réel sur {result.total} mois</p>
                  <p className="text-4xl font-bold text-purple-700">{formatEuro(result.totalCostValue)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Soit en moyenne</p>
                    <p className="text-xl font-bold text-gray-900">{formatEuro(result.monthlyAverage)} / mois</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Si le prix promo durait toujours</p>
                    <p className="text-xl font-bold text-gray-400 line-through decoration-red-300">{formatEuro(result.advertised)}</p>
                  </div>
                </div>
                {result.gapPct > 0 && (
                  <p className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    Vous paierez {result.gapPct} % de plus que ce que suggère le prix affiché.
                  </p>
                )}
                {result.gapPct <= 0 && (
                  <p className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    Tarif stable : le prix affiché reflète le coût réel. C’est rare, profitez-en.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Tableau comparatif */}
          <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coût réel sur 3 ans : {HOSTING_PRICING.length} hébergeurs comparés</h2>
            <p className="text-sm text-gray-500 mb-5">Hors domaine, offre mutualisée standard, prix TTC relevés en {BAROMETRE_DATE_LABEL}. Classement par coût total croissant.</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Hébergeur</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Offre</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Prix promo / mois</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Renouvellement / mois</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Hausse</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Coût réel 36 mois</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(item => {
                    const pct = increasePct(item);
                    return (
                      <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-4 py-3">
                          <Link href={`/tool/${item.id}`} className="font-bold text-gray-900 hover:text-purple-700">{item.name}</Link>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{item.plan}</td>
                        <td className="px-4 py-3 text-gray-700">{formatEuro(item.promoMonthly)}</td>
                        <td className="px-4 py-3 text-gray-700">{formatEuro(item.renewalMonthly)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${
                            pct === 0
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : pct >= 100
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                          }`}>
                            {pct === 0 ? 'Stable' : `+${pct} %`}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">{formatEuro(totalCost(item))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Enseignements + méthodo */}
          <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-7">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Pourquoi le prix affiché est trompeur</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Les hébergeurs subventionnent massivement la première période d’engagement pour apparaître en tête des
                comparateurs de prix, puis se rattrapent au renouvellement. Résultat : l’ordre des hébergeurs « les moins
                chers » change du tout au tout selon qu’on regarde le prix d’appel ou le coût sur 3 ans.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Les offres à tarif stable, sans yo-yo entre promo et renouvellement, se distinguent dans notre tableau
                par le badge « Stable ». Plus lisibles, elles sont souvent les plus économiques dès que le site vit plus
                de deux ans. Pour choisir, consultez aussi notre guide du{' '}
                <Link href="/guides/meilleur-hebergement-pas-cher" className="text-purple-700 font-semibold hover:underline">meilleur hébergement pas cher</Link>.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Méthodologie</h2>
              <p className="text-gray-600 leading-relaxed">
                Relevé manuel effectué en {BAROMETRE_DATE_LABEL} sur les sites officiels des hébergeurs, depuis la France, en euros TTC.
                Pour chaque hébergeur : l’offre mutualisée standard la plus mise en avant, son prix mensuel promotionnel avec la durée
                d’engagement associée, et le tarif de renouvellement indiqué dans les conditions tarifaires. Le coût sur 36 mois
                cumule la période promotionnelle au tarif promo puis le renouvellement. Cette page est mise à jour régulièrement ;
                la date de relevé fait foi.
              </p>
            </div>
          </section>

          <CitationBlock />

          {/* FAQ */}
          <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Questions fréquentes</h2>
            <div className="space-y-3">
              {FAQS.map(item => (
                <div key={item.q} className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Liens connexes */}
          <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Pour aller plus loin</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { href: '/guides/meilleur-hebergement-pas-cher', label: 'Hébergement pas cher' },
                { href: '/guides/meilleur-hebergement-wordpress', label: 'Hébergement WordPress' },
                { href: '/comparatifs/hostinger-vs-o2switch', label: 'Hostinger vs o2switch' },
                { href: '/comparatifs/ovhcloud-vs-o2switch', label: 'OVHcloud vs o2switch' },
                { href: '/barometre-prix-vpn', label: 'Baromètre prix VPN 2026' },
                { href: '/top-10-hebergement-web', label: 'Top 10 hébergement web' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="rounded-2xl bg-purple-50 border border-purple-200 p-4 text-purple-800 font-semibold hover:bg-purple-100 transition-colors flex items-center justify-between gap-3">
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
