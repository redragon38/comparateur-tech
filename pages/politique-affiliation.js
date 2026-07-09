import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildBreadcrumbSchema, buildWebPageSchema } from '../components/SEO';
import { ShieldCheck } from 'lucide-react';

const sections = [
  {
    title: 'Principe',
    text: 'Certains liens présents sur Comparateur-Tech peuvent être affiliés. Si vous cliquez puis souscrivez à une offre, nous pouvons percevoir une commission, sans coût supplémentaire pour vous.',
  },
  {
    title: 'Indépendance éditoriale',
    text: 'La présence d’un programme partenaire ne garantit pas une recommandation. Nous pouvons mettre en avant un outil non affilié si sa pertinence est meilleure pour le lecteur.',
  },
  {
    title: 'Classements',
    text: 'Les classements s’appuient sur des critères éditoriaux : adéquation au besoin, prix, limites, fonctionnalités, fiabilité perçue, transparence et alternatives disponibles.',
  },
  {
    title: 'Transparence',
    text: 'Les pages comparatives et fiches importantes affichent une mention indiquant que certains liens peuvent être affiliés.',
  },
];

export default function PolitiqueAffiliationPage() {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Politique d’affiliation' },
    ]),
    buildWebPageSchema({
      name: 'Politique d’affiliation',
      description: 'Politique d’affiliation de Comparateur-Tech : transparence, indépendance éditoriale et fonctionnement des liens partenaires.',
      url: '/politique-affiliation',
    }),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Politique d’affiliation | Comparateur-Tech"
        description="Découvrez comment Comparateur-Tech utilise certains liens affiliés sans coût supplémentaire pour les lecteurs, avec indépendance éditoriale."
        canonical="https://comparateur-tech.com/politique-affiliation"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-10 text-center">
          <div className="gradient-purple mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Politique d’affiliation</h1>
          <p className="text-sm text-gray-500">Dernière mise à jour : 3 juin 2026</p>
        </div>

        <div className="space-y-5">
          {sections.map((section, index) => (
            <section key={section.title} className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="gradient-purple flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">{section.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{section.text}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
