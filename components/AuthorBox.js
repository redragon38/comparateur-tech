import Link from 'next/link';
import { useT } from '../lib/i18n';

const CONTENT = {
  fr: {
    role: 'Fondateur & analyste éditorial',
    bio: "Je teste et compare des outils numériques avec un angle simple : comprendre à qui ils conviennent vraiment, quels sont leurs points forts, leurs limites et leur rapport qualité/prix.",
    expertise: ['IA & productivité', 'Outils web', 'Comparatifs logiciels', 'Veille SEO'],
    lastReview: 'Dernière relecture : ',
    contributeTitle: "Ce que j'apporte sur Comparateur-Tech",
    contribute: 'Analyse des fiches, synthèse des offres, comparaison fonctionnelle, revue du pricing et rédaction des verdicts.',
    methodTitle: 'Méthode',
    method: "Relecture critique des promesses marketing, comparaison par usage, mise à jour régulière et transparence sur l'affiliation.",
    seeMethodology: 'Voir la méthodologie',
    contactAuthor: "Contacter l'auteur",
  },
  en: {
    role: 'Founder & editorial analyst',
    bio: 'I test and compare digital tools with a simple angle: understanding who they really suit, what their strengths and limitations are, and their value for money.',
    expertise: ['AI & productivity', 'Web tools', 'Software comparisons', 'SEO monitoring'],
    lastReview: 'Last reviewed: ',
    contributeTitle: 'What I bring to Comparateur-Tech',
    contribute: 'Listing analysis, offer summaries, feature comparisons, pricing reviews and writing the verdicts.',
    methodTitle: 'Method',
    method: 'Critical review of marketing claims, comparison by use case, regular updates and transparency about affiliation.',
    seeMethodology: 'See the methodology',
    contactAuthor: 'Contact the author',
  },
};

export default function AuthorBox({
  name = 'Lucas Bonin',
  role,
  bio,
  expertise,
  updatedAt = '29 mars 2026',
}) {
  const t = useT(CONTENT);
  const resolvedRole = role || t.role;
  const resolvedBio = bio || t.bio;
  const resolvedExpertise = expertise || t.expertise;

  return (
    <section className="mt-10 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-5 md:items-start">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
          LB
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
            <div>
              <p className="text-lg font-bold text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">{resolvedRole}</p>
            </div>
            <p className="text-xs text-gray-500">{t.lastReview}{updatedAt}</p>
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">{resolvedBio}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {resolvedExpertise.map((item) => (
              <span key={item} className="text-xs bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-full font-medium">
                {item}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="font-semibold text-gray-900 mb-1">{t.contributeTitle}</p>
              <p className="text-gray-600">{t.contribute}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="font-semibold text-gray-900 mb-1">{t.methodTitle}</p>
              <p className="text-gray-600">{t.method}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/methodologie" className="text-purple-700 font-semibold hover:underline">{t.seeMethodology}</Link>
            <Link href="/contact" className="text-purple-700 font-semibold hover:underline">{t.contactAuthor}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
