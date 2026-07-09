import Link from 'next/link';
import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildArticleSchema, buildBreadcrumbSchema, buildFAQSchema } from '../components/SEO';
import { ArrowRight, BarChart3, Check, Copy, TrendingUp } from 'lucide-react';
import {
  BAROMETRE_DATE,
  BAROMETRE_DATE_LABEL,
  VPN_PRICING,
  averageIncreasePct,
  formatEuro,
  increasePct,
} from '../lib/barometre-data';

const CANONICAL = 'https://comparateur-tech.com/barometre-prix-vpn';

const FAQS = [
  {
    q: 'Pourquoi les prix des VPN augmentent-ils au renouvellement ?',
    a: 'Les tarifs promotionnels servent à acquérir de nouveaux clients : l’éditeur vend la première période à perte ou à marge nulle, puis se rattrape au renouvellement, facturé au tarif « catalogue ». Cette pratique est légale tant qu’elle est affichée, mais elle est rarement mise en avant.',
  },
  {
    q: 'Comment éviter la hausse au renouvellement de son VPN ?',
    a: 'Trois méthodes : désactiver le renouvellement automatique et se réabonner via une offre « nouveau client », contacter le support avant l’échéance pour négocier le maintien du tarif promotionnel, ou choisir un VPN à prix fixe comme Mullvad (5 €/mois sans promo ni hausse).',
  },
  {
    q: 'Ces prix sont-ils exacts ?',
    a: `Les tarifs ont été relevés manuellement sur les sites officiels des éditeurs en ${BAROMETRE_DATE_LABEL}, en euros TTC, pour l’offre standard la plus mise en avant. Les prix VPN changent fréquemment (promotions saisonnières) : la page est mise à jour régulièrement et la date de relevé est toujours affichée.`,
  },
  {
    q: 'Peut-on réutiliser ces données ?',
    a: 'Oui, ce baromètre est librement citable par la presse, les blogs et les créateurs de contenu, avec un lien vers cette page comme source (voir le bloc « Citer cette étude »).',
  },
];

function buildDatasetSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Baromètre des prix VPN 2026 : tarif promotionnel vs renouvellement',
    description: `Relevé comparatif des prix promotionnels et des tarifs de renouvellement de ${VPN_PRICING.length} VPN grand public, effectué en ${BAROMETRE_DATE_LABEL} sur les sites officiels des éditeurs.`,
    url: CANONICAL,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    dateModified: BAROMETRE_DATE,
    creator: { '@type': 'Organization', name: 'Comparateur-Tech', url: 'https://comparateur-tech.com' },
    keywords: ['VPN', 'prix VPN', 'renouvellement VPN', 'tarifs VPN 2026'],
  };
}

function CitationBlock({ title }) {
  const [copied, setCopied] = useState(false);
  const snippet = `Source : <a href="${CANONICAL}">${title}, Comparateur-Tech</a>`;
  const copy = () => {
    navigator.clipboard?.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <section className="bg-purple-50 border border-purple-200 rounded-3xl p-5 sm:p-7">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Citer cette étude</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Journalistes, blogueurs, créateurs : ces données sont librement réutilisables (licence CC BY 4.0),
        avec un lien vers cette page comme source. La date de relevé est toujours affichée pour garantir la fraîcheur des chiffres.
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

export default function BarometrePrixVpn() {
  const rows = useMemo(
    () => [...VPN_PRICING].sort((a, b) => increasePct(b) - increasePct(a)),
    []
  );
  const avgIncrease = averageIncreasePct(VPN_PRICING);
  const biggest = rows[0];
  const stable = rows.filter(item => increasePct(item) === 0);

  const title = `Baromètre des prix VPN 2026 : +${avgIncrease} % en moyenne au renouvellement`;
  const description = `Étude exclusive : prix promo vs tarif de renouvellement de ${VPN_PRICING.length} VPN, relevés en ${BAROMETRE_DATE_LABEL}. Hausse moyenne de ${avgIncrease} %, jusqu'à +${increasePct(biggest)} % chez ${biggest.name}.`;

  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Baromètre prix VPN' },
    ]),
    buildArticleSchema({
      title,
      description,
      url: '/barometre-prix-vpn',
      datePublished: BAROMETRE_DATE,
      dateModified: BAROMETRE_DATE,
      section: 'Études',
    }),
    buildDatasetSchema(),
    buildFAQSchema(FAQS),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`Baromètre prix VPN 2026 : promo vs renouvellement (+${avgIncrease} %)`}
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
              <BarChart3 className="w-4 h-4" /> Étude Comparateur-Tech
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
              Baromètre des prix VPN 2026 : le vrai coût après la promo
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Les VPN affichent des tarifs promotionnels agressifs, mais que payez-vous vraiment au renouvellement ?
              Nous avons relevé les deux prix pour {VPN_PRICING.length} VPN grand public. Résultat : la facture grimpe
              de {avgIncrease} % en moyenne, et jusqu’à +{increasePct(biggest)} %.
            </p>
            <p className="text-sm text-gray-400 mt-4">Relevé effectué en {BAROMETRE_DATE_LABEL} sur les sites officiels · mis à jour régulièrement</p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-6xl space-y-8">

          {/* Chiffres clés */}
          <section className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-purple-700 mb-1">+{avgIncrease} %</p>
              <p className="text-sm text-gray-500">hausse moyenne au renouvellement sur {VPN_PRICING.length} VPN</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-purple-700 mb-1">+{increasePct(biggest)} %</p>
              <p className="text-sm text-gray-500">la plus forte hausse constatée ({biggest.name})</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-purple-700 mb-1">{stable.length}</p>
              <p className="text-sm text-gray-500">VPN seulement sans aucune hausse ({stable.map(s => s.name).join(', ')})</p>
            </div>
          </section>

          {/* Tableau */}
          <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Prix promo vs prix de renouvellement, VPN par VPN</h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">Prix mensuels en euros TTC, offre standard la plus mise en avant par chaque éditeur. Classement par hausse décroissante.</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">VPN</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Prix promo / mois</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Engagement initial</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Au renouvellement / mois</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">Hausse</th>
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
                        <td className="px-4 py-3 text-gray-700">{formatEuro(item.promoMonthly)}</td>
                        <td className="px-4 py-3 text-gray-500">{item.promoMonths <= 1 ? 'Sans engagement' : `${item.promoMonths} mois`}</td>
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Enseignements */}
          <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-7">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Ce que révèle ce baromètre</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Le prix affiché en page d’accueil d’un VPN n’est presque jamais celui que vous paierez la deuxième année.
                Sur les {VPN_PRICING.length} services relevés, la hausse moyenne atteint {avgIncrease} % au renouvellement,
                et plusieurs éditeurs font plus que doubler la facture. Un abonnement souscrit à 2 € par mois peut ainsi
                se renouveler à 6 ou 7 €, sans qu’aucune fonctionnalité n’ait changé.
              </p>
              <p className="text-gray-600 leading-relaxed">
                À l’opposé, une minorité d’acteurs pratique un prix honnête et constant : {stable.map(s => s.name).join(' et ')} affichent
                le même tarif à vie. Plus chers à l’entrée, ils deviennent souvent plus économiques dès la troisième année.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Comment ne pas subir la hausse</h2>
              <p className="text-gray-600 leading-relaxed">
                Trois parades fonctionnent : désactiver le renouvellement automatique dès l’achat puis repartir sur une offre
                « nouveau client » à l’échéance ; contacter le support quelques jours avant le renouvellement pour négocier le
                maintien du tarif promotionnel (les services client l’accordent fréquemment pour éviter une résiliation) ;
                ou choisir d’emblée un VPN à prix fixe. Pour comparer les offres actuelles, consultez notre guide du{' '}
                <Link href="/guides/meilleur-vpn-pas-cher" className="text-purple-700 font-semibold hover:underline">meilleur VPN pas cher</Link>.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Méthodologie</h2>
              <p className="text-gray-600 leading-relaxed">
                Relevé manuel effectué en {BAROMETRE_DATE_LABEL} sur les sites officiels des éditeurs, depuis la France.
                Pour chaque VPN : l’offre standard la plus mise en avant, son prix mensuel promotionnel (mois offerts inclus
                dans le calcul de l’engagement) et le tarif appliqué au renouvellement tel qu’indiqué dans les conditions
                tarifaires ou la FAQ de l’éditeur. Prix en euros TTC, arrondis au centime. Les tarifs évoluant fréquemment,
                la date de relevé fait foi ; cette page est mise à jour régulièrement.
              </p>
            </div>
          </section>

          <CitationBlock title="Baromètre des prix VPN 2026" />

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
                { href: '/comparatifs/meilleur-vpn', label: 'Meilleur VPN 2026' },
                { href: '/guides/meilleur-vpn-pas-cher', label: 'Meilleur VPN pas cher' },
                { href: '/guides/meilleur-vpn-gratuit', label: 'Meilleur VPN gratuit' },
                { href: '/comparatifs/nordvpn-vs-surfshark', label: 'NordVPN vs Surfshark' },
                { href: '/calculateur-hebergement', label: 'Calculateur coût hébergement' },
                { href: '/top-10-vpn', label: 'Top 10 VPN' },
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
