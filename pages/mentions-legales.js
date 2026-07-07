import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Shield } from 'lucide-react';
import { useT } from '../lib/i18n';

const EMAIL = 'comparateur.tech@gmail.com';

const CONTENT = {
  fr: {
    seoTitle: 'Mentions légales – Comparateur-Tech',
    seoDescription: 'Mentions légales du site comparateur-tech.com : éditeur, hébergement, propriété intellectuelle, données personnelles et cookies.',
    h1: 'Mentions légales',
    lastUpdate: 'Dernière mise à jour : 2026',
    forRights: 'Pour exercer ces droits : ',
    sections: [
      { number: '1', title: 'Éditeur du site', intro: 'Le site comparateur-tech.com est édité par :', keyValues: [['Statut', 'Particulier (site personnel)'], ['Email', { email: EMAIL }]], note: "Conformément à l'article 6 III-2 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, les informations personnelles complètes de l'éditeur peuvent être communiquées aux autorités judiciaires sur demande." },
      { number: '2', title: 'Hébergement', intro: 'Le site est hébergé par :', keyValues: [['Hébergeur', 'Vercel'], ['Entreprise', 'Vercel Inc.'], ['Adresse', '340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis'], ['Site web', { link: 'https://vercel.com' }]] },
      { number: '3', title: 'Propriété intellectuelle', paragraphs: ["L'ensemble des contenus présents sur le site comparateur-tech.com (textes, images, logos, design, structure du site, etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction, modification ou diffusion sans autorisation préalable est interdite."] },
      { number: '4', title: 'Responsabilité', paragraphs: ["Les informations présentes sur le site comparateur-tech.com sont fournies à titre informatif. Malgré les efforts apportés à leur exactitude, l'éditeur ne peut garantir que les informations sont complètes, exactes ou à jour. L'utilisateur est seul responsable de l'utilisation qu'il fait des informations fournies sur le site."] },
      { number: '5', title: "Liens d'affiliation", paragraphs: ["Le site comparateur-tech.com peut contenir des liens d'affiliation. Cela signifie que l'éditeur peut percevoir une commission si l'utilisateur effectue un achat via certains liens, sans coût supplémentaire pour l'utilisateur. Les comparaisons et recommandations sont réalisées de manière indépendante."] },
      { number: '6', title: 'Données personnelles', paragraphs: ['Le site peut collecter certaines données personnelles (par exemple via un formulaire de contact). Ces données sont utilisées uniquement pour répondre aux demandes des utilisateurs et ne sont pas revendues à des tiers.'], intro: "Conformément au Règlement Général sur la Protection des Données (RGPD), l'utilisateur dispose des droits suivants :", list: ["droit d'accès", 'droit de rectification', 'droit de suppression', "droit d'opposition"], rights: true },
      { number: '7', title: 'Cookies', intro: 'Le site peut utiliser des cookies afin de :', list: ["améliorer l'expérience utilisateur", 'analyser le trafic', "suivre les liens d'affiliation"], outro: "L'utilisateur peut configurer son navigateur afin de refuser les cookies." },
    ],
  },
  en: {
    seoTitle: 'Legal notice – Comparateur-Tech',
    seoDescription: 'Legal notice for comparateur-tech.com: publisher, hosting, intellectual property, personal data and cookies.',
    h1: 'Legal notice',
    lastUpdate: 'Last updated: 2026',
    forRights: 'To exercise these rights: ',
    sections: [
      { number: '1', title: 'Site publisher', intro: 'The comparateur-tech.com website is published by:', keyValues: [['Status', 'Individual (personal website)'], ['Email', { email: EMAIL }]], note: 'In accordance with article 6 III-2 of French law no. 2004-575 of 21 June 2004 on confidence in the digital economy, the publisher\'s full personal information may be provided to judicial authorities on request.' },
      { number: '2', title: 'Hosting', intro: 'The site is hosted by:', keyValues: [['Host', 'Vercel'], ['Company', 'Vercel Inc.'], ['Address', '340 S Lemon Ave #4133, Walnut, CA 91789, USA'], ['Website', { link: 'https://vercel.com' }]] },
      { number: '3', title: 'Intellectual property', paragraphs: ['All content on the comparateur-tech.com website (text, images, logos, design, site structure, etc.) is protected by intellectual property law. Any reproduction, modification or distribution without prior authorization is prohibited.'] },
      { number: '4', title: 'Liability', paragraphs: ['The information on the comparateur-tech.com website is provided for informational purposes. Despite efforts to ensure its accuracy, the publisher cannot guarantee that the information is complete, accurate or up to date. The user is solely responsible for how they use the information provided on the site.'] },
      { number: '5', title: 'Affiliate links', paragraphs: ['The comparateur-tech.com website may contain affiliate links. This means the publisher may earn a commission if the user makes a purchase through certain links, at no additional cost to the user. Comparisons and recommendations are made independently.'] },
      { number: '6', title: 'Personal data', paragraphs: ['The site may collect certain personal data (for example via a contact form). This data is used solely to respond to user requests and is not resold to third parties.'], intro: 'In accordance with the General Data Protection Regulation (GDPR), the user has the following rights:', list: ['right of access', 'right of rectification', 'right of erasure', 'right to object'], rights: true },
      { number: '7', title: 'Cookies', intro: 'The site may use cookies in order to:', list: ['improve the user experience', 'analyze traffic', 'track affiliate links'], outro: 'The user can configure their browser to refuse cookies.' },
    ],
  },
};

function KeyValue({ label, value }) {
  if (value && value.email) {
    return <li><span className="font-semibold text-gray-700">{label} :</span>{' '}<a href={`mailto:${value.email}`} className="text-purple-600 hover:underline">{value.email}</a></li>;
  }
  if (value && value.link) {
    return <li><span className="font-semibold text-gray-700">{label} :</span>{' '}<a href={value.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">{value.link}</a></li>;
  }
  return <li><span className="font-semibold text-gray-700">{label} :</span> {value}</li>;
}

function Section({ section, forRights }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl gradient-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {section.number}
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900">{section.title}</h2>
      </div>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{p}</p>
      ))}

      {section.intro && !section.keyValues && <p className="text-gray-600 text-sm leading-relaxed mb-2">{section.intro}</p>}

      {section.keyValues && (
        <>
          {section.intro && <p className="text-gray-600 text-sm leading-relaxed mb-2">{section.intro}</p>}
          <ul className="space-y-1 text-sm text-gray-600">
            {section.keyValues.map(([label, value]) => <KeyValue key={label} label={label} value={value} />)}
          </ul>
          {section.note && <p className="text-gray-500 text-sm leading-relaxed mt-3 italic">{section.note}</p>}
        </>
      )}

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

      {section.rights && (
        <p className="text-gray-600 text-sm">
          {forRights}
          <a href={`mailto:${EMAIL}`} className="text-purple-600 hover:underline">{EMAIL}</a>
        </p>
      )}

      {section.outro && <p className="text-gray-600 text-sm leading-relaxed">{section.outro}</p>}
    </div>
  );
}

export default function MentionsLegalesPage() {
  const t = useT(CONTENT);
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/mentions-legales"
      />
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-purple mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{t.h1}</h1>
          <p className="text-gray-500 text-sm">{t.lastUpdate}</p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {t.sections.map((section) => (
            <Section key={section.number} section={section} forRights={t.forRights} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
