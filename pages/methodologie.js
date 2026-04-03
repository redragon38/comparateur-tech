import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildBreadcrumbSchema } from '../components/SEO';

export default function MethodologiePage() {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Notre méthodologie de test' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Notre méthodologie de test',
      url: 'https://comparateur-tech.com/methodologie',
      description: 'Découvrez comment Comparateur-Tech évalue les outils IA, VPN, hébergement et cybersécurité : critères, benchmarks, indépendance éditoriale et fréquence de mise à jour.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Notre méthodologie de test | Comparateur-Tech"
        description="Critères de notation, benchmarks, protocole éditorial, transparence affiliation et fréquence de mise à jour : découvrez comment nous évaluons les outils."
        canonical="https://comparateur-tech.com/methodologie"
        structuredData={structuredData}
      />
      <Header />
      <main>
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white border-b border-purple-100">
          <div className="container mx-auto px-6 max-w-4xl">
            <span className="inline-block bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              Méthodologie éditoriale
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Comment nous testons et comparons les outils
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Comparateur-Tech a pour objectif d'aider les lecteurs à choisir un outil adapté à leur usage réel,
              et pas seulement à son argumentaire marketing. Nos comparatifs reposent sur une grille d'analyse
              commune, des vérifications manuelles, des benchmarks lorsque c'est pertinent et une politique
              éditoriale indépendante.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">
            <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Ce que nous évaluons</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Chaque outil est analysé selon sa catégorie. Nous ne notons pas un VPN comme un générateur d'images,
                mais nous gardons une base commune pour faciliter la comparaison.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Critères communs</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Clarté de l'offre et du pricing</li>
                    <li>Qualité de l'interface et prise en main</li>
                    <li>Richesse fonctionnelle</li>
                    <li>Rapport qualité/prix</li>
                    <li>Support, documentation et fiabilité perçue</li>
                    <li>Présence d'un essai gratuit ou d'une version gratuite</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Critères spécifiques</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>VPN : vitesse, confidentialité, politique de logs, apps, streaming, pays couverts</li>
                    <li>Hébergement : performance, support, localisation, sauvegardes, simplicité, limites techniques</li>
                    <li>IA : qualité des sorties, cas d'usage, vitesse, précision, intégrations</li>
                    <li>Cybersécurité : niveau de protection, impact sur les performances, simplicité d'usage</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Notre système de notation</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                La note finale résulte d'un ensemble de critères pondérés. Les pondérations peuvent varier selon la catégorie,
                mais notre logique reste la même : valoriser l'utilité réelle, la transparence et la cohérence entre promesse
                marketing et expérience vécue.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 pr-4 text-gray-900">Critère</th>
                      <th className="text-left py-3 pr-4 text-gray-900">Poids indicatif</th>
                      <th className="text-left py-3 text-gray-900">Ce que nous regardons</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100"><td className="py-3 pr-4">Fonctionnalités</td><td className="py-3 pr-4">25 %</td><td className="py-3">Richesse, cohérence, utilité réelle</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-3 pr-4">Prise en main</td><td className="py-3 pr-4">15 %</td><td className="py-3">Clarté de l'interface, vitesse de démarrage, UX</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-3 pr-4">Performance</td><td className="py-3 pr-4">20 %</td><td className="py-3">Temps de réponse, stabilité, qualité de résultat</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-3 pr-4">Prix / valeur</td><td className="py-3 pr-4">20 %</td><td className="py-3">Tarifs, limitations, rapport coût / bénéfice</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-3 pr-4">Support / confiance</td><td className="py-3 pr-4">10 %</td><td className="py-3">Documentation, réputation, politique commerciale</td></tr>
                    <tr><td className="py-3 pr-4">Transparence</td><td className="py-3 pr-4">10 %</td><td className="py-3">Mentions des limites, promesses réalistes, clarté marketing</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Comment se déroule un test</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p><strong className="text-gray-900">Étape 1 :</strong> vérification de l'offre officielle : prix, fonctionnalités, version gratuite, politique d'essai, limitations et positionnement.</p>
                <p><strong className="text-gray-900">Étape 2 :</strong> prise en main directe ou relecture critique approfondie de la documentation, de la démo et des usages concrets.</p>
                <p><strong className="text-gray-900">Étape 3 :</strong> comparaison avec des concurrents de même catégorie pour identifier les vraies différences.</p>
                <p><strong className="text-gray-900">Étape 4 :</strong> formulation d'un verdict par profil d'utilisateur : débutant, freelance, équipe, projet avancé ou usage occasionnel.</p>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Benchmarks et outils de vérification</h2>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>VPN : vitesse, stabilité, localisation des serveurs, politique de confidentialité, fonctionnalités de sécurité</li>
                <li>Hébergement : temps de réponse, simplicité du panneau, sauvegardes, support, promesse de ressources</li>
                <li>IA : qualité des sorties sur plusieurs prompts, vitesse, précision, régularité, possibilités de contrôle</li>
                <li>Cybersécurité : impact sur les performances, couverture fonctionnelle, lisibilité des alertes</li>
              </ul>
            </section>

            <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Indépendance éditoriale</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Certains liens présents sur Comparateur-Tech peuvent être affiliés. Cela signifie que nous pouvons percevoir une commission si un lecteur s'inscrit via un lien partenaire.</p>
                <p>Cette rémunération n'influence pas l'existence d'une fiche ni sa note. Nous pouvons recommander un outil non affilié si nous estimons qu'il répond mieux au besoin du lecteur.</p>
                <p>Lorsqu'une page contient des liens affiliés, nous cherchons à le signaler clairement, sans masquer la nature commerciale de certains liens.</p>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Mise à jour des contenus</h2>
              <p className="text-gray-600 leading-relaxed">
                Les marchés IA, VPN et hébergement évoluent vite. Nous revoyons régulièrement les prix, les offres,
                les arguments commerciaux et les alternatives. Une date de mise à jour doit apparaître sur les pages majeures.
              </p>
            </section>

            <section className="bg-purple-50 rounded-3xl border border-purple-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Ce que notre note ne veut pas dire</h2>
              <p className="text-gray-700 leading-relaxed">
                Une excellente note ne signifie pas qu'un outil est parfait pour tout le monde. Notre objectif est d'aider
                chaque lecteur à identifier l'outil le plus adapté à son besoin, à son budget et à son niveau.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
