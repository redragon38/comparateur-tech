import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Shield } from 'lucide-react';

const sections = [
  {
    number: '1',
    title: 'Éditeur du site',
    content: (
      <>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          Le site <strong>comparateur-tech.com</strong> est édité par :
        </p>
        <ul className="space-y-1 text-sm text-gray-600">
          <li><span className="font-semibold text-gray-700">Statut :</span> Particulier (site personnel)</li>
          <li><span className="font-semibold text-gray-700">Email :</span>{' '}
            <a href="mailto:comparateur.tech@gmail.com" className="text-purple-600 hover:underline">comparateur.tech@gmail.com</a>
          </li>
        </ul>
        <p className="text-gray-500 text-sm leading-relaxed mt-3 italic">
          Conformément à l'article 6 III-2 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, les informations personnelles complètes de l'éditeur peuvent être communiquées aux autorités judiciaires sur demande.
        </p>
      </>
    ),
  },
  {
    number: '2',
    title: 'Hébergement',
    content: (
      <>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">Le site est hébergé par :</p>
        <ul className="space-y-1 text-sm text-gray-600">
          <li><span className="font-semibold text-gray-700">Hébergeur :</span> Vercel</li>
          <li><span className="font-semibold text-gray-700">Entreprise :</span> Vercel Inc.</li>
          <li><span className="font-semibold text-gray-700">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
          <li><span className="font-semibold text-gray-700">Site web :</span>{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">https://vercel.com</a>
          </li>
        </ul>
      </>
    ),
  },
  {
    number: '3',
    title: 'Propriété intellectuelle',
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        L'ensemble des contenus présents sur le site comparateur-tech.com (textes, images, logos, design, structure du site, etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction, modification ou diffusion sans autorisation préalable est interdite.
      </p>
    ),
  },
  {
    number: '4',
    title: 'Responsabilité',
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Les informations présentes sur le site comparateur-tech.com sont fournies à titre informatif. Malgré les efforts apportés à leur exactitude, l'éditeur ne peut garantir que les informations sont complètes, exactes ou à jour. L'utilisateur est seul responsable de l'utilisation qu'il fait des informations fournies sur le site.
      </p>
    ),
  },
  {
    number: '5',
    title: "Liens d'affiliation",
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Le site comparateur-tech.com peut contenir des liens d'affiliation. Cela signifie que l'éditeur peut percevoir une commission si l'utilisateur effectue un achat via certains liens, sans coût supplémentaire pour l'utilisateur. Les comparaisons et recommandations sont réalisées de manière indépendante.
      </p>
    ),
  },
  {
    number: '6',
    title: 'Données personnelles',
    content: (
      <>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          Le site peut collecter certaines données personnelles (par exemple via un formulaire de contact). Ces données sont utilisées uniquement pour répondre aux demandes des utilisateurs et ne sont pas revendues à des tiers.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          Conformément au Règlement Général sur la Protection des Données (RGPD), l'utilisateur dispose des droits suivants :
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600 mb-3">
          {["droit d'accès", 'droit de rectification', 'droit de suppression', "droit d'opposition"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 text-sm">
          Pour exercer ces droits :{' '}
          <a href="mailto:comparateur.tech@gmail.com" className="text-purple-600 hover:underline">comparateur.tech@gmail.com</a>
        </p>
      </>
    ),
  },
  {
    number: '7',
    title: 'Cookies',
    content: (
      <>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">Le site peut utiliser des cookies afin de :</p>
        <ul className="space-y-1.5 text-sm text-gray-600 mb-3">
          {["améliorer l'expérience utilisateur", "analyser le trafic", "suivre les liens d'affiliation"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 text-sm leading-relaxed">
          L'utilisateur peut configurer son navigateur afin de refuser les cookies.
        </p>
      </>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Mentions légales – Comparateur-Tech"
        description="Mentions légales du site comparateur-tech.com : éditeur, hébergement, propriété intellectuelle, données personnelles et cookies."
      />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-purple mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Mentions légales</h1>
          <p className="text-gray-500 text-sm">Dernière mise à jour : 2025</p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section) => (
            <div
              key={section.number}
              className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 sm:p-7"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {section.number}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">{section.title}</h2>
              </div>
              {section.content}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
