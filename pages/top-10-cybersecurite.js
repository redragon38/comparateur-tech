import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { useT } from '../lib/i18n';

const STYLE = {
  slug: 'cybersecurite',
  catFilter: 'Cybersécurité',
  icon: '🔐',
  color: 'from-slate-600 to-gray-800',
  colorLight: 'from-slate-50 to-gray-100',
  border: 'border-slate-200',
  badge: 'bg-slate-50 border-slate-200 text-slate-700',
};

const CONTENT = {
  fr: {
    label: 'Cybersécurité',
    desc: 'Les meilleurs outils de cybersécurité pour protéger vos accès, vos comptes et vos infrastructures en 2026.',
    seoTitle: 'Top 10 cybersécurité 2026 : outils à comparer',
    seoDescription: 'Découvrez les meilleurs outils de cybersécurité en 2026 pour protéger vos accès, comptes, appareils et infrastructures.',
    keywords: 'top 10 cybersécurité, meilleur outil cybersécurité 2026, comparatif cybersécurité',
  },
  en: {
    label: 'Cybersecurity',
    desc: 'The best cybersecurity tools to protect your access, accounts and infrastructure in 2026.',
    seoTitle: 'Top 10 cybersecurity 2026: tools to compare',
    seoDescription: 'Discover the best cybersecurity tools in 2026 to protect your access, accounts, devices and infrastructure.',
    keywords: 'top 10 cybersecurity, best cybersecurity tool 2026, cybersecurity comparison',
  },
};

function normalizeSlug(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const tools = allTools
    .filter((tool) =>
      (tool.categories || []).some((cat) => {
        const raw = String(cat || '').trim();
        return (
          raw === STYLE.catFilter ||
          normalizeSlug(raw) === 'cybersecurite'
        );
      })
    )
    .sort((a, b) => {
      const ratingDiff = (b.rating?.value || 0) - (a.rating?.value || 0);
      if (ratingDiff !== 0) return ratingDiff;

      const reviewsDiff = (b.rating?.count || 0) - (a.rating?.count || 0);
      if (reviewsDiff !== 0) return reviewsDiff;

      return (a.name || '').localeCompare(b.name || '');
    })
    .slice(0, 10);

  return {
    props: { tools },
  };
}

export default function Top10Cybersecurite({ tools }) {
  const t = useT(CONTENT);
  return (
    <Top10Page
      tools={tools}
      meta={{ ...STYLE, label: t.label, desc: t.desc }}
      seo={{
        title: t.seoTitle,
        description: t.seoDescription,
        canonical: 'https://comparateur-tech.com/top-10-cybersecurite',
        keywords: t.keywords,
      }}
    />
  );
}
