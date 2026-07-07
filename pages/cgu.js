import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { FileText } from 'lucide-react';
import { useT } from '../lib/i18n';

const CONTENT = {
  fr: {
    seoTitle: "Conditions Générales d'Utilisation – Comparateur-Tech",
    seoDescription: "Conditions générales d'utilisation du site comparateur-tech.com : accès, fonctionnement, responsabilité et droit applicable.",
    h1: "Conditions Générales d'Utilisation",
    lastUpdate: 'Dernière mise à jour : 2026',
    sections: [
      { number: '1', title: 'Objet', paragraphs: ["Les présentes CGU ont pour objet de définir les conditions d'utilisation du site comparateur-tech.com, qui propose un service de comparaison de solutions technologiques (IA, antivirus, VPN, hébergement web, etc.). L'utilisation du site implique l'acceptation pleine et entière des présentes conditions."] },
      { number: '2', title: 'Accès au site', paragraphs: ["Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Tous les frais liés à l'accès au site (matériel informatique, connexion Internet, etc.) sont à la charge de l'utilisateur."] },
      { number: '3', title: 'Fonctionnement du comparateur', intro: 'Le site propose :', list: ['des comparatifs', 'des analyses', 'des recommandations', 'des liens vers des services tiers'], outro: 'Les informations sont fournies à titre informatif et ne constituent pas un conseil professionnel.' },
      { number: '4', title: 'Services tiers', intro: "Le site peut rediriger vers des sites externes. L'éditeur du site comparateur-tech.com ne peut être tenu responsable :", list: ['du contenu de ces sites', 'de leurs services', "de leurs conditions d'utilisation"] },
      { number: '5', title: 'Limitation de responsabilité', intro: "L'éditeur ne pourra être tenu responsable :", list: ["d'erreurs ou d'omissions dans les informations", "de l'indisponibilité du site", "d'un dommage résultant de l'utilisation du site"] },
      { number: '6', title: 'Modification des CGU', paragraphs: ["L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités à les consulter régulièrement."] },
      { number: '7', title: 'Droit applicable', paragraphs: ['Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux juridictions compétentes en France.'] },
    ],
  },
  en: {
    seoTitle: 'Terms of Use – Comparateur-Tech',
    seoDescription: 'Terms of use of comparateur-tech.com: access, operation, liability and applicable law.',
    h1: 'Terms of Use',
    lastUpdate: 'Last updated: 2026',
    sections: [
      { number: '1', title: 'Purpose', paragraphs: ['These Terms of Use define the conditions for using the comparateur-tech.com website, which provides a service comparing technology solutions (AI, antivirus, VPN, web hosting, etc.). Using the site implies full acceptance of these terms.'] },
      { number: '2', title: 'Access to the site', paragraphs: ['The site is freely accessible to any user with Internet access. All costs related to accessing the site (computer equipment, Internet connection, etc.) are the user\'s responsibility.'] },
      { number: '3', title: 'How the comparison works', intro: 'The site provides:', list: ['comparisons', 'analyses', 'recommendations', 'links to third-party services'], outro: 'Information is provided for informational purposes and does not constitute professional advice.' },
      { number: '4', title: 'Third-party services', intro: 'The site may redirect to external sites. The publisher of comparateur-tech.com cannot be held responsible for:', list: ['the content of these sites', 'their services', 'their terms of use'] },
      { number: '5', title: 'Limitation of liability', intro: 'The publisher cannot be held responsible for:', list: ['errors or omissions in the information', 'the unavailability of the site', 'any damage resulting from the use of the site'] },
      { number: '6', title: 'Changes to the Terms', paragraphs: ['The publisher reserves the right to modify these Terms at any time. Users are encouraged to review them regularly.'] },
      { number: '7', title: 'Applicable law', paragraphs: ['These Terms are governed by French law. Any dispute will be submitted to the competent courts in France.'] },
    ],
  },
};

function Section({ section }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl gradient-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {section.number}
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900">{section.title}</h2>
      </div>
      {section.paragraphs?.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed">{p}</p>
      ))}
      {section.intro && <p className="text-gray-600 text-sm leading-relaxed mb-2">{section.intro}</p>}
      {section.list && (
        <ul className="space-y-1.5 text-sm text-gray-600 mb-3">
          {section.list.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {section.outro && <p className="text-gray-600 text-sm leading-relaxed">{section.outro}</p>}
    </div>
  );
}

export default function CGUPage() {
  const t = useT(CONTENT);
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/cgu"
      />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-purple mb-4">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {t.h1}
          </h1>
          <p className="text-gray-500 text-sm">{t.lastUpdate}</p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {t.sections.map((section) => (
            <Section key={section.number} section={section} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
