import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';

const META = {
  label: 'Intelligence Artificielle',
  catFilter: 'Intelligence artificielle',
  icon: '🤖',
  color: 'from-violet-600 to-purple-500',
  colorLight: 'from-violet-50 to-purple-50',
  border: 'border-violet-200',
  badge: 'bg-violet-50 border-violet-200 text-violet-700',
  desc: 'Les meilleurs outils IA pour booster votre productivité et créativité en 2025.',
};

const OTHERS = [
  { href: '/top-10-vpn', label: 'Top 10 VPN', icon: '🛡️' },
  { href: '/top-10-hebergement-web', label: 'Top 10 Hébergement', icon: '🌐' },
  { href: '/top-10-antivirus', label: 'Top 10 Antivirus', icon: '🦠' },
];

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const tools = allTools
    .filter(t => (t.categories || []).includes(META.catFilter))
    .sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
    .slice(0, 10);
  return { props: { tools } };
}

export default function Top10IA({ tools }) {
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      seo={{
        title: 'Top 10 Intelligence Artificielle 2025 — Classement & Comparatif',
        description: `Découvrez le Top 10 des meilleurs outils IA en 2025. ${META.desc}`,
        canonical: 'https://comparateur-tech.com/top-10-intelligence-artificielle',
        keywords: 'top 10 ia, meilleur outil ia 2025, comparatif intelligence artificielle',
      }}
    />
  );
}
