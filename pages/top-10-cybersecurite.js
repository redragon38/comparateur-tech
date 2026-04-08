import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';

const META = {
  label: 'Cybersécurité',
  catFilter: 'Cybersécurité',
  icon: '🔐',
  color: 'from-slate-600 to-gray-800',
  colorLight: 'from-slate-50 to-gray-100',
  border: 'border-slate-200',
  badge: 'bg-slate-50 border-slate-200 text-slate-700',
  desc: 'Les meilleurs outils de cybersécurité pour protéger vos accès, vos comptes et vos infrastructures en 2025.',
};

const OTHERS = [
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 IA', icon: '🤖' },
  { href: '/top-10-vpn', label: 'Top 10 VPN', icon: '🛡️' },
  { href: '/top-10-hebergement-web', label: 'Top 10 Hébergement', icon: '🌐' },
  { href: '/top-10-antivirus', label: 'Top 10 Antivirus', icon: '🦠' },
];

function normalizeSlug(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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
          raw === META.catFilter ||
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
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      seo={{
        title: 'Top 10 Cybersécurité 2025 — Classement & Comparatif | Comparateur-Tech',
        description: `Découvrez le Top 10 des meilleurs outils de cybersécurité en 2025. ${META.desc}`,
        canonical: 'https://comparateur-tech.com/top-10-cybersecurite',
        keywords: 'top 10 cybersécurité, meilleur outil cybersécurité 2025, comparatif cybersécurité',
      }}
    />
  );
}
