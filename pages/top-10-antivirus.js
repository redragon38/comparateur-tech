import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { useT } from '../lib/i18n';

const STYLE = {
  slug: 'antivirus',
  catFilter: 'Antivirus',
  icon: '🦠',
  color: 'from-red-600 to-orange-400',
  colorLight: 'from-red-50 to-orange-50',
  border: 'border-red-200',
  badge: 'bg-red-50 border-red-200 text-red-700',
};

const CONTENT = {
  fr: {
    label: 'Antivirus',
    desc: 'Les meilleurs antivirus pour protéger vos appareils contre les cybermenaces en 2026.',
    seoTitle: 'Top 10 antivirus 2026 : classement comparatif',
    seoDescription: 'Découvrez le Top 10 des meilleurs antivirus en 2026. Les meilleurs antivirus pour protéger vos appareils contre les cybermenaces.',
    keywords: 'top 10 antivirus, meilleur antivirus 2026, comparatif antivirus',
  },
  en: {
    label: 'Antivirus',
    desc: 'The best antivirus software to protect your devices against cyber threats in 2026.',
    seoTitle: 'Top 10 antivirus 2026: comparative ranking',
    seoDescription: 'Discover the Top 10 best antivirus software in 2026. The best antivirus to protect your devices against cyber threats.',
    keywords: 'top 10 antivirus, best antivirus 2026, antivirus comparison',
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

export default function Top10Antivirus({ tools }) {
  const t = useT(CONTENT);
  return (
    <Top10Page
      tools={tools}
      meta={{ ...STYLE, label: t.label, desc: t.desc }}
      seo={{
        title: t.seoTitle,
        description: t.seoDescription,
        canonical: 'https://comparateur-tech.com/top-10-antivirus',
        keywords: t.keywords,
      }}
    />
  );
}
