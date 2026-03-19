import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';

const META = {
  label: 'VPN',
  catFilter: 'VPN',
  icon: '🛡️',
  color: 'from-blue-600 to-blue-400',
  colorLight: 'from-blue-50 to-cyan-50',
  border: 'border-blue-200',
  badge: 'bg-blue-50 border-blue-200 text-blue-700',
  desc: 'Les meilleurs VPN pour sécuriser vos connexions et protéger votre vie privée en 2025.',
};

const OTHERS = [
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 IA', icon: '🤖' },
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

export default function Top10VPN({ tools }) {
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      seo={{
        title: 'Top 10 VPN 2025 — Classement & Comparatif',
        description: `Découvrez le Top 10 des meilleurs VPN en 2025. ${META.desc}`,
        canonical: 'https://comparateur-tech.com/top-10-vpn',
        keywords: 'top 10 vpn, meilleur vpn 2025, comparatif vpn',
      }}
    />
  );
}
