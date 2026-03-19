import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';

const META = {
  label: 'Antivirus',
  catFilter: 'Antivirus',
  icon: '🦠',
  color: 'from-red-600 to-orange-400',
  colorLight: 'from-red-50 to-orange-50',
  border: 'border-red-200',
  badge: 'bg-red-50 border-red-200 text-red-700',
  desc: 'Les meilleurs antivirus pour protéger vos appareils contre les cybermenaces en 2025.',
};

const OTHERS = [
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 IA', icon: '🤖' },
  { href: '/top-10-vpn', label: 'Top 10 VPN', icon: '🛡️' },
  { href: '/top-10-hebergement-web', label: 'Top 10 Hébergement', icon: '🌐' },
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

export default function Top10Antivirus({ tools }) {
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      seo={{
        title: 'Top 10 Antivirus 2025 — Classement & Comparatif',
        description: `Découvrez le Top 10 des meilleurs antivirus en 2025. ${META.desc}`,
        canonical: 'https://comparateur-tech.com/top-10-antivirus',
        keywords: 'top 10 antivirus, meilleur antivirus 2025, comparatif antivirus',
      }}
    />
  );
}
