import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { useT } from '../lib/i18n';

const STYLE = {
  slug: 'vpn',
  catFilter: 'VPN',
  icon: '🛡️',
  color: 'from-blue-600 to-blue-400',
  colorLight: 'from-blue-50 to-cyan-50',
  border: 'border-blue-200',
  badge: 'bg-blue-50 border-blue-200 text-blue-700',
};

const CONTENT = {
  fr: {
    label: 'VPN',
    desc: 'Les meilleurs VPN pour sécuriser vos connexions et protéger votre vie privée en 2026.',
    seoTitle: 'Top 10 VPN 2026 : classement comparatif',
    seoDescription: 'Découvrez le Top 10 des meilleurs VPN en 2026. Les meilleurs VPN pour sécuriser vos connexions et protéger votre vie privée.',
    keywords: 'top 10 vpn, meilleur vpn 2026, comparatif vpn',
  },
  en: {
    label: 'VPN',
    desc: 'The best VPNs to secure your connections and protect your privacy in 2026.',
    seoTitle: 'Top 10 VPNs 2026: comparative ranking',
    seoDescription: 'Discover the Top 10 best VPNs in 2026. The best VPNs to secure your connections and protect your privacy.',
    keywords: 'top 10 vpn, best vpn 2026, vpn comparison',
  },
};

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const tools = allTools
    .filter(t => (t.categories || []).includes(STYLE.catFilter))
    .sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
    .slice(0, 10);
  return { props: { tools } };
}

export default function Top10VPN({ tools }) {
  const t = useT(CONTENT);
  return (
    <Top10Page
      tools={tools}
      meta={{ ...STYLE, label: t.label, desc: t.desc }}
      seo={{
        title: t.seoTitle,
        description: t.seoDescription,
        canonical: 'https://comparateur-tech.com/top-10-vpn',
        keywords: t.keywords,
      }}
    />
  );
}
