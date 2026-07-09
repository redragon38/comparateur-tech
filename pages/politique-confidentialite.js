import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildBreadcrumbSchema, buildWebPageSchema } from '../components/SEO';
import { ShieldCheck } from 'lucide-react';

const sections = [
  {
    title: 'Données collectées',
    text: 'Comparateur-Tech peut collecter les informations que vous envoyez volontairement via les formulaires de contact ou de partenariat, ainsi que des données techniques limitées nécessaires au fonctionnement du site.',
  },
  {
    title: 'Finalités',
    text: 'Ces données servent à répondre aux demandes, maintenir le site, mesurer l’audience après consentement et améliorer les contenus éditoriaux.',
  },
  {
    title: 'Cookies et mesure d’audience',
    text: 'Les cookies strictement nécessaires peuvent être utilisés sans consentement. Les trackers d’audience ou marketing ne sont chargés qu’après acceptation dans la bannière cookies.',
  },
  {
    title: 'Liens externes et affiliation',
    text: 'Certains liens renvoient vers des sites tiers ou partenaires. Ces sites disposent de leurs propres politiques de confidentialité, que nous vous invitons à consulter.',
  },
  {
    title: 'Durée de conservation',
    text: 'Les messages reçus peuvent être conservés le temps nécessaire au traitement de la demande. Les préférences cookies sont stockées localement dans votre navigateur.',
  },
  {
    title: 'Vos droits',
    text: 'Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à comparateur.tech@gmail.com.',
  },
];

export default function PolitiqueConfidentialitePage() {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Politique de confidentialité' },
    ]),
    buildWebPageSchema({
      name: 'Politique de confidentialité',
      description: 'Politique de confidentialité de Comparateur-Tech : données personnelles, cookies, trackers et droits RGPD.',
      url: '/politique-confidentialite',
    }),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Politique de confidentialité | Comparateur-Tech"
        description="Données personnelles, cookies, trackers, affiliation et droits RGPD : consultez la politique de confidentialité de Comparateur-Tech."
        canonical="https://comparateur-tech.com/politique-confidentialite"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-10 text-center">
          <div className="gradient-purple mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Politique de confidentialité</h1>
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
