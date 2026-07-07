import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildBreadcrumbSchema } from '../components/SEO';
import { useT, useLocale } from '../lib/i18n';

const LAST_UPDATED_ISO = '2026-07-06';

const CONTENT = {
  fr: {
    seo: {
      title: 'Notre méthodologie de test | Comparateur-Tech',
      description:
        "Critères mesurés, grilles de notation pondérées par catégorie, indépendance vis-à-vis de l'affiliation et conditions de test : comment nous évaluons VPN, hébergeurs, antivirus et outils IA.",
    },
    breadcrumbHome: 'Accueil',
    breadcrumbPage: 'Notre méthodologie de test',
    badge: 'Méthodologie éditoriale',
    h1: 'Comment nous testons et comparons les outils',
    intro:
      "Chaque note publiée sur Comparateur-Tech repose sur une grille de critères pondérés, publique et identique pour tous les outils d'une même catégorie. Cette page décrit ce que nous mesurons, comment nous le mesurons, et ce qui garantit l'indépendance de nos classements.",
    lastUpdated: 'Dernière mise à jour : ',
    lastUpdatedLabel: '6 juillet 2026',
    protocolTitle: 'Notre protocole en quatre étapes',
    steps: [
      { num: '1', title: 'Sélection', desc: "Nous choisissons les outils à tester selon leur pertinence pour nos lecteurs : parts de marché, demandes reçues, nouveautés notables. Aucun éditeur ne peut acheter sa place dans un comparatif." },
      { num: '2', title: 'Tests', desc: "Chaque outil est utilisé en conditions réelles : création de compte, configuration, mesures répétées sur plusieurs jours. Les critères mesurés dépendent de la catégorie (voir ci-dessous)." },
      { num: '3', title: 'Notation pondérée', desc: "Les résultats sont convertis en note sur 10 selon une grille pondérée, publique et identique pour tous les outils d'une même catégorie. La note ne fait l'objet d'aucun ajustement commercial." },
      { num: '4', title: 'Réévaluation', desc: "Les prix, offres et performances évoluent. Nous réévaluons les comparatifs majeurs au minimum une fois par trimestre, et chaque page affiche sa date de dernière mise à jour." },
    ],
    criteriaTitle: 'Critères et pondérations par catégorie',
    criteriaIntro:
      "Un VPN ne se note pas comme un hébergeur. Chaque catégorie possède sa propre grille ; les pondérations ci-dessous sont celles réellement utilisées pour calculer les notes affichées sur le site.",
    categoriesNavAria: 'Accès direct aux catégories',
    tableCaptionPrefix: 'Grille de notation pondérée',
    tableHead: { criterion: 'Critère', weight: 'Pondération', measure: 'Ce que nous mesurons' },
    categories: [
      {
        id: 'vpn',
        title: 'VPN',
        intro: "Un VPN se juge d'abord sur ce qu'il promet : protéger la connexion sans la ralentir excessivement. Nous mesurons la vitesse avant/après connexion, vérifions l'absence de fuites et analysons ce que l'éditeur peut réellement savoir de ses utilisateurs.",
        rows: [
          ['Vitesse', '25 %', 'Débit descendant et montant avec/sans VPN, latence, stabilité sur plusieurs serveurs (France, Europe, États-Unis), mesures répétées à différents moments de la journée'],
          ['Fuites DNS / IP / WebRTC', '25 %', "Tests de fuite DNS, IPv4/IPv6 et WebRTC sur chaque application, comportement du kill switch en cas de coupure forcée de la connexion"],
          ['Juridiction et politique no-log', '20 %', "Pays d'immatriculation et lois applicables, contenu réel de la politique de confidentialité, existence d'audits indépendants publiés, antécédents (demandes judiciaires, incidents)"],
          ['Fonctionnalités', '15 %', "Kill switch, split tunneling, protocoles disponibles (WireGuard, OpenVPN), multi-hop, nombre d'appareils simultanés, qualité des applications"],
          ['Tarifs', '15 %', "Prix réel après la première période d'engagement, conditions de remboursement, transparence du renouvellement"],
        ],
      },
      {
        id: 'hebergement',
        title: 'Hébergement web',
        intro: "Pour un hébergeur, les deux chiffres qui comptent sont la disponibilité et le temps de réponse. Nous les mesurons sur la durée avec un site témoin, plutôt que de reprendre les chiffres annoncés par l'hébergeur.",
        rows: [
          ['Uptime', '25 %', "Disponibilité mesurée sur un site témoin via un service de monitoring externe, sur une période d'au moins 30 jours, comparée à la garantie contractuelle (SLA)"],
          ['TTFB et performance', '25 %', "Time To First Byte mesuré depuis la France, temps de chargement complet d'une page type, comportement sous charge légère, présence de cache et de CDN"],
          ['Support', '20 %', 'Temps de première réponse constaté (chat, ticket), disponibilité en français, pertinence technique des réponses à des questions réelles'],
          ['Fonctionnalités et limites', '15 %', "Sauvegardes automatiques, certificats SSL, nombre de sites et de bases de données, limites réelles des offres « illimitées », facilité de migration"],
          ['Tarifs', '15 %', 'Prix de la première année et prix au renouvellement (souvent très différents), frais cachés, conditions de remboursement'],
        ],
      },
      {
        id: 'antivirus',
        title: 'Antivirus',
        intro: "Nous ne disposons pas d'un laboratoire de virologie : pour le taux de détection, nous nous appuyons sur les résultats publiés par les laboratoires indépendants de référence (AV-TEST, AV-Comparatives), que nous croisons et complétons par nos propres mesures d'impact système et d'ergonomie.",
        rows: [
          ['Taux de détection', '30 %', 'Résultats des derniers tests AV-TEST et AV-Comparatives (protection en conditions réelles et détection de malwares répandus), régularité des scores dans le temps'],
          ['Impact système', '20 %', "Ralentissement mesuré au démarrage, à l'ouverture d'applications et lors d'un scan complet, consommation mémoire au repos"],
          ['Faux positifs', '15 %', 'Nombre de fausses alertes relevé par les laboratoires indépendants, comportement constaté avec des logiciels légitimes courants'],
          ['Fonctionnalités', '20 %', 'Pare-feu, protection web et anti-phishing, protection ransomware, périmètre réel des modules annoncés (VPN inclus, gestionnaire de mots de passe)'],
          ['Tarifs', '15 %', "Prix de la première année et au renouvellement, nombre d'appareils couverts, pratiques commerciales (reconduction tacite, désabonnement)"],
        ],
      },
      {
        id: 'ia',
        title: 'Outils IA',
        intro: "Les outils d'IA générative sont plus difficiles à noter objectivement : la qualité dépend de l'usage. Nous utilisons une série de tâches identiques pour tous les outils d'une même sous-catégorie et accordons un poids important à la confidentialité des données, souvent négligée dans ce secteur.",
        rows: [
          ['Qualité des sorties', '30 %', "Série de tâches types identiques pour tous les outils comparés (rédaction, code, image… selon la sous-catégorie), évaluées sur la fiabilité, la pertinence et la régularité des résultats"],
          ['Tarifs et limites', '20 %', "Prix des formules, quotas réels (requêtes, tokens, générations), différences concrètes entre offre gratuite et payante"],
          ['Confidentialité des données', '20 %', "Utilisation des données des utilisateurs pour l'entraînement, possibilité de refus (opt-out), localisation des données, conformité RGPD annoncée"],
          ['Intégrations', '15 %', 'API disponible, connecteurs natifs, export des données, compatibilité avec les outils de travail courants'],
          ['Prise en main', '15 %', "Clarté de l'interface, courbe d'apprentissage, qualité de la documentation, disponibilité en français"],
        ],
      },
    ],
    independence: {
      title: 'Notre indépendance',
      lead: "Comparateur-Tech est financé par l'affiliation : certains liens vers les sites des éditeurs nous rapportent une commission lorsqu'un lecteur souscrit une offre. Ce modèle nous permet de rester gratuits et sans publicité intrusive, mais il impose des règles strictes.",
      bullets: [
        { bold: "Les classements ne sont jamais influencés par l'affiliation.", rest: " Les notes sont calculées à partir de la grille pondérée avant toute considération commerciale, et un outil sans programme d'affiliation peut occuper la première place d'un comparatif." },
        { bold: '', rest: "Aucun éditeur ne peut acheter une note, une position dans un classement ou la suppression d'une critique. Nous refusons les articles sponsorisés présentés comme des tests." },
        { bold: '', rest: 'Les liens d\'affiliation sont signalés et balisés rel="sponsored" conformément aux recommandations de Google.' },
      ],
      outroBefore: 'Le détail de notre financement est présenté sur la page ',
      outroLink: 'À propos',
      outroAfter: '.',
    },
    conditions: {
      title: 'Matériel et conditions de test',
      lead: "Pour que les mesures soient comparables d'un outil à l'autre, tous les tests sont réalisés dans les mêmes conditions :",
      items: [
        { label: 'Machine', value: '[À COMPLÉTER : modèle, processeur, RAM, OS, ex. PC portable sous Windows 11, Ryzen 7, 16 Go]' },
        { label: 'Connexion', value: '[À COMPLÉTER : type et débit, ex. fibre 1 Gb/s symétrique, opérateur X]' },
        { label: 'Localisation', value: '[À COMPLÉTER : ville ou région de test, ex. tests réalisés depuis la France (région Auvergne-Rhône-Alpes)]' },
        { label: 'Outils de mesure', value: '[À COMPLÉTER : ex. Speedtest/nPerf pour les débits, ipleak.net et dnsleaktest.com pour les fuites, UptimeRobot pour le monitoring, WebPageTest pour le TTFB]' },
        { label: 'Protocole', value: 'chaque mesure est répétée au moins trois fois à des moments différents de la journée ; nous retenons la médiane, pas le meilleur résultat.' },
      ],
    },
    limits: {
      title: 'Les limites de notre méthode',
      paras: [
        "Aucune méthodologie n'est parfaite, et nous préférons être clairs sur les limites de la nôtre. Nos mesures reflètent nos conditions de test : vos débits VPN dépendront de votre connexion, et le TTFB d'un hébergeur varie selon la localisation des visiteurs. Une bonne note ne signifie pas qu'un outil convient à tout le monde, elle signifie qu'il tient ses promesses dans sa catégorie.",
        "Les comparatifs majeurs sont réévalués au minimum chaque trimestre, et systématiquement lorsqu'un changement important survient (nouvelle tarification, incident de sécurité, audit publié). Chaque page affiche sa date de dernière mise à jour.",
      ],
      reportBefore: 'Vous avez repéré une erreur ou une information obsolète ? ',
      reportLink: 'Signalez-la-nous',
      reportAfter: ' : nous corrigeons et créditons les signalements pertinents.',
    },
  },
  en: {
    seo: {
      title: 'Our Testing Methodology | Comparateur-Tech',
      description:
        'Measured criteria, weighted rating grids per category, independence from affiliate revenue and testing conditions: how we evaluate VPNs, web hosts, antivirus software and AI tools.',
    },
    breadcrumbHome: 'Home',
    breadcrumbPage: 'Our testing methodology',
    badge: 'Editorial methodology',
    h1: 'How we test and compare tools',
    intro:
      'Every rating published on Comparateur-Tech is based on a weighted grid of criteria, public and identical for all tools in the same category. This page explains what we measure, how we measure it, and what guarantees the independence of our rankings.',
    lastUpdated: 'Last updated: ',
    lastUpdatedLabel: 'July 6, 2026',
    protocolTitle: 'Our four-step protocol',
    steps: [
      { num: '1', title: 'Selection', desc: 'We choose which tools to test based on their relevance to our readers: market share, reader requests, notable newcomers. No vendor can buy a spot in a comparison.' },
      { num: '2', title: 'Testing', desc: 'Each tool is used in real conditions: account creation, configuration, repeated measurements over several days. The criteria measured depend on the category (see below).' },
      { num: '3', title: 'Weighted rating', desc: 'Results are converted into a score out of 10 using a weighted grid that is public and identical for all tools in the same category. Scores are never adjusted for commercial reasons.' },
      { num: '4', title: 'Re-evaluation', desc: 'Prices, plans and performance change. We re-evaluate major comparisons at least once a quarter, and every page displays its last-updated date.' },
    ],
    criteriaTitle: 'Criteria and weightings by category',
    criteriaIntro:
      'A VPN cannot be rated like a web host. Each category has its own grid; the weightings below are the ones actually used to calculate the scores displayed on the site.',
    categoriesNavAria: 'Jump to a category',
    tableCaptionPrefix: 'Weighted rating grid',
    tableHead: { criterion: 'Criterion', weight: 'Weight', measure: 'What we measure' },
    categories: [
      {
        id: 'vpn',
        title: 'VPN',
        intro: 'A VPN is judged first on what it promises: protecting your connection without slowing it down excessively. We measure speed with and without the VPN, verify the absence of leaks, and analyze what the provider can actually know about its users.',
        rows: [
          ['Speed', '25%', 'Download and upload throughput with/without VPN, latency, stability across several servers (France, Europe, United States), measurements repeated at different times of day'],
          ['DNS / IP / WebRTC leaks', '25%', 'DNS, IPv4/IPv6 and WebRTC leak tests on every app, kill-switch behavior when the connection is forcibly dropped'],
          ['Jurisdiction and no-log policy', '20%', 'Country of incorporation and applicable laws, actual content of the privacy policy, published independent audits, track record (legal requests, incidents)'],
          ['Features', '15%', 'Kill switch, split tunneling, available protocols (WireGuard, OpenVPN), multi-hop, simultaneous devices, quality of the apps'],
          ['Pricing', '15%', 'Real price after the first commitment period, refund conditions, renewal transparency'],
        ],
      },
      {
        id: 'hebergement',
        title: 'Web hosting',
        intro: 'For a web host, the two numbers that matter are availability and response time. We measure them over time with a test site, rather than repeating the figures advertised by the host.',
        rows: [
          ['Uptime', '25%', 'Availability measured on a test site through an external monitoring service over at least 30 days, compared to the contractual guarantee (SLA)'],
          ['TTFB and performance', '25%', 'Time To First Byte measured from France, full load time of a typical page, behavior under light load, presence of caching and a CDN'],
          ['Support', '20%', 'Observed first-response time (chat, ticket), availability in French, technical relevance of answers to real questions'],
          ['Features and limits', '15%', 'Automatic backups, SSL certificates, number of sites and databases, real limits of “unlimited” plans, ease of migration'],
          ['Pricing', '15%', 'First-year price versus renewal price (often very different), hidden fees, refund conditions'],
        ],
      },
      {
        id: 'antivirus',
        title: 'Antivirus',
        intro: 'We do not run a virology lab: for detection rates, we rely on results published by the leading independent laboratories (AV-TEST, AV-Comparatives), which we cross-check and complement with our own measurements of system impact and usability.',
        rows: [
          ['Detection rate', '30%', 'Results from the latest AV-TEST and AV-Comparatives tests (real-world protection and detection of widespread malware), consistency of scores over time'],
          ['System impact', '20%', 'Measured slowdown at startup, when opening applications and during a full scan, idle memory usage'],
          ['False positives', '15%', 'Number of false alerts reported by independent laboratories, observed behavior with common legitimate software'],
          ['Features', '20%', 'Firewall, web and anti-phishing protection, ransomware protection, real scope of advertised modules (bundled VPN, password manager)'],
          ['Pricing', '15%', 'First-year and renewal prices, number of devices covered, commercial practices (auto-renewal, cancellation)'],
        ],
      },
      {
        id: 'ia',
        title: 'AI tools',
        intro: 'Generative AI tools are harder to rate objectively: quality depends on the use case. We run an identical series of tasks for all tools in the same subcategory, and we give significant weight to data privacy, often neglected in this sector.',
        rows: [
          ['Output quality', '30%', 'A series of standard tasks identical for all compared tools (writing, code, images… depending on the subcategory), assessed on reliability, relevance and consistency of results'],
          ['Pricing and limits', '20%', 'Plan prices, real quotas (requests, tokens, generations), concrete differences between free and paid tiers'],
          ['Data privacy', '20%', 'Whether user data is used for training, opt-out availability, data location, stated GDPR compliance'],
          ['Integrations', '15%', 'Available API, native connectors, data export, compatibility with common work tools'],
          ['Ease of use', '15%', 'Interface clarity, learning curve, documentation quality, availability in French'],
        ],
      },
    ],
    independence: {
      title: 'Our independence',
      lead: 'Comparateur-Tech is funded through affiliate links: some links to vendor websites earn us a commission when a reader signs up. This model keeps the site free and without intrusive ads, but it comes with strict rules.',
      bullets: [
        { bold: 'Rankings are never influenced by affiliation.', rest: ' Scores are calculated from the weighted grid before any commercial consideration, and a tool with no affiliate program can rank first in a comparison.' },
        { bold: '', rest: 'No vendor can buy a score, a ranking position or the removal of criticism. We refuse sponsored articles presented as reviews.' },
        { bold: '', rest: 'Affiliate links are disclosed and tagged rel="sponsored" in line with Google\'s guidelines.' },
      ],
      outroBefore: 'Details about our funding are available on the ',
      outroLink: 'About page',
      outroAfter: '.',
    },
    conditions: {
      title: 'Hardware and testing conditions',
      lead: 'So that measurements are comparable from one tool to the next, all tests are run under the same conditions:',
      items: [
        { label: 'Machine', value: '[TO BE COMPLETED: model, CPU, RAM, OS, e.g. Windows 11 laptop, Ryzen 7, 16 GB]' },
        { label: 'Connection', value: '[TO BE COMPLETED: type and speed, e.g. symmetric 1 Gb/s fiber, ISP X]' },
        { label: 'Location', value: '[TO BE COMPLETED: test city or region, e.g. tests run from France (Auvergne-Rhône-Alpes region)]' },
        { label: 'Measurement tools', value: '[TO BE COMPLETED: e.g. Speedtest/nPerf for throughput, ipleak.net and dnsleaktest.com for leaks, UptimeRobot for monitoring, WebPageTest for TTFB]' },
        { label: 'Protocol', value: 'every measurement is repeated at least three times at different times of day; we keep the median, not the best result.' },
      ],
    },
    limits: {
      title: 'The limits of our method',
      paras: [
        'No methodology is perfect, and we prefer to be upfront about the limits of ours. Our measurements reflect our testing conditions: your VPN speeds will depend on your connection, and a host\'s TTFB varies with your visitors\' location. A good score does not mean a tool suits everyone, it means it keeps its promises within its category.',
        'Major comparisons are re-evaluated at least quarterly, and systematically whenever something significant changes (new pricing, security incident, published audit). Every page displays its last-updated date.',
      ],
      reportBefore: 'Spotted an error or outdated information? ',
      reportLink: 'Let us know',
      reportAfter: ': we correct and credit relevant reports.',
    },
  },
};

export default function MethodologiePage() {
  const t = useT(CONTENT);
  const locale = useLocale();

  const structuredData = [
    buildBreadcrumbSchema([
      { name: t.breadcrumbHome, url: '/' },
      { name: t.breadcrumbPage },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: t.breadcrumbPage,
      url: `https://comparateur-tech.com/${locale}/methodologie`,
      inLanguage: locale,
      dateModified: LAST_UPDATED_ISO,
      description: t.seo.description,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seo.title}
        description={t.seo.description}
        canonical="https://comparateur-tech.com/methodologie"
        dateModified={LAST_UPDATED_ISO}
        structuredData={structuredData}
      />
      <Header />
      <main>
        {/* Hero, centré (règle UX du site : héros et titres centrés) */}
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white border-b border-purple-100">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <span className="inline-block bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              {t.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.h1}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {t.intro}
            </p>
            <p className="text-sm text-gray-500">
              {t.lastUpdated}<time dateTime={LAST_UPDATED_ISO}>{t.lastUpdatedLabel}</time>
            </p>
          </div>
        </section>

        <div className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">

            {/* 1. Protocole */}
            <section aria-labelledby="protocole">
              <h2 id="protocole" className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.protocolTitle}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {t.steps.map((step) => (
                  <div key={step.num} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span aria-hidden="true" className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                        {step.num}
                      </span>
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Critères par catégorie */}
            <section aria-labelledby="criteres">
              <h2 id="criteres" className="text-2xl font-bold text-gray-900 mb-3 text-center">{t.criteriaTitle}</h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-center max-w-2xl mx-auto">
                {t.criteriaIntro}
              </p>
              <nav aria-label={t.categoriesNavAria} className="flex flex-wrap justify-center gap-2 mb-8">
                {t.categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="text-sm bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full font-medium hover:bg-purple-50 transition-colors"
                  >
                    {cat.title}
                  </a>
                ))}
              </nav>

              <div className="space-y-8">
                {t.categories.map((cat) => (
                  <section
                    key={cat.id}
                    id={cat.id}
                    aria-labelledby={`titre-${cat.id}`}
                    className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm scroll-mt-24"
                  >
                    <h3 id={`titre-${cat.id}`} className="text-xl font-bold text-gray-900 mb-3 text-center">{cat.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{cat.intro}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <caption className="sr-only">{t.tableCaptionPrefix}, {cat.title}</caption>
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th scope="col" className="text-left py-3 pr-4 text-gray-900">{t.tableHead.criterion}</th>
                            <th scope="col" className="text-left py-3 pr-4 text-gray-900 whitespace-nowrap">{t.tableHead.weight}</th>
                            <th scope="col" className="text-left py-3 text-gray-900">{t.tableHead.measure}</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          {cat.rows.map(([label, weight, detail], i) => (
                            <tr key={label} className={i < cat.rows.length - 1 ? 'border-b border-gray-100' : ''}>
                              <td className="py-3 pr-4 font-medium text-gray-900 align-top">{label}</td>
                              <td className="py-3 pr-4 align-top whitespace-nowrap">{weight}</td>
                              <td className="py-3 align-top leading-relaxed">{detail}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))}
              </div>
            </section>

            {/* 3. Indépendance */}
            <section aria-labelledby="independance-titre" id="independance" className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm scroll-mt-24">
              <h2 id="independance-titre" className="text-2xl font-bold text-gray-900 mb-4 text-center">{t.independence.title}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t.independence.lead}</p>
                <ul className="list-disc pl-5 space-y-2">
                  {t.independence.bullets.map((item, i) => (
                    <li key={i}>
                      {item.bold && <strong className="text-gray-900">{item.bold}</strong>}
                      {item.rest}
                    </li>
                  ))}
                </ul>
                <p>
                  {t.independence.outroBefore}
                  <Link href="/a-propos" className="text-purple-700 font-semibold hover:underline">{t.independence.outroLink}</Link>
                  {t.independence.outroAfter}
                </p>
              </div>
            </section>

            {/* 4. Matériel et conditions de test */}
            <section aria-labelledby="conditions-titre" id="conditions" className="bg-purple-50 rounded-3xl border border-purple-200 p-8 scroll-mt-24">
              <h2 id="conditions-titre" className="text-2xl font-bold text-gray-900 mb-4 text-center">{t.conditions.title}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t.conditions.lead}</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
                {t.conditions.items.map((item) => (
                  <li key={item.label}>
                    <strong className="text-gray-900">{item.label} :</strong> {item.value}
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. Limites et mises à jour */}
            <section aria-labelledby="limites-titre" id="limites" className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm scroll-mt-24">
              <h2 id="limites-titre" className="text-2xl font-bold text-gray-900 mb-4 text-center">{t.limits.title}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {t.limits.paras.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p>
                  {t.limits.reportBefore}
                  <Link href="/contact" className="text-purple-700 font-semibold hover:underline">{t.limits.reportLink}</Link>
                  {t.limits.reportAfter}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
