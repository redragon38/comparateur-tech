import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { FileText } from 'lucide-react';

const sections = [
  {
    number: '1',
    title: 'Objet',
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Les présentes CGU ont pour objet de définir les conditions d'utilisation du site <strong>comparateur-tech.com</strong>, qui propose un service de comparaison de solutions technologiques (IA, antivirus, VPN, hébergement web, etc.). L'utilisation du site implique l'acceptation pleine et entière des présentes conditions.
      </p>
    ),
  },
  {
    number: '2',
    title: 'Accès au site',
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Tous les frais liés à l'accès au site (matériel informatique, connexion Internet, etc.) sont à la charge de l'utilisateur.
      </p>
    ),
  },
  {
    number: '3',
    title: 'Fonctionnement du comparateur',
    content: (
      <>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">Le site propose :</p>
        <ul className="space-y-1.5 text-sm text-gray-600 mb-3">
          {['des comparatifs', 'des analyses', 'des recommandations', 'des liens vers des services tiers'].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-600 text-sm leading-relaxed">
          Les informations sont fournies à titre informatif et ne constituent pas un conseil professionnel.
        </p>
      </>
    ),
  },
  {
    number: '4',
    title: 'Services tiers',
    content: (
      <>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          Le site peut rediriger vers des sites externes. L'éditeur du site comparateur-tech.com ne peut être tenu responsable :
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600">
          {['du contenu de ces sites', 'de leurs services', "de leurs conditions d'utilisation"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: '5',
    title: 'Limitation de responsabilité',
    content: (
      <>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          L'éditeur ne pourra être tenu responsable :
        </p>
        <ul className="space-y-1.5 text-sm text-gray-600">
          {[
            "d'erreurs ou d'omissions dans les informations",
            "de l'indisponibilité du site",
            "d'un dommage résultant de l'utilisation du site",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: '6',
    title: 'Modification des CGU',
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités à les consulter régulièrement.
      </p>
    ),
  },
  {
    number: '7',
    title: 'Droit applicable',
    content: (
      <p className="text-gray-600 text-sm leading-relaxed">
        Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux juridictions compétentes en France.
      </p>
    ),
  },
];

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Conditions Générales d'Utilisation – Comparateur-Tech"
        description="Conditions générales d'utilisation du site comparateur-tech.com : accès, fonctionnement, responsabilité et droit applicable."
      />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-purple mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Conditions Générales d'Utilisation
          </h1>
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
