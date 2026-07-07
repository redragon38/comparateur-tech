import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { useT } from '../lib/i18n';

const STYLE = {
  slug: 'hebergement-web',
  catFilter: 'Hébergement web',
  icon: '🌐',
  color: 'from-emerald-600 to-green-400',
  colorLight: 'from-emerald-50 to-green-50',
  border: 'border-emerald-200',
  badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

const CONTENT = {
  fr: {
    label: 'Hébergement Web',
    desc: 'Les meilleurs hébergeurs web pour lancer et gérer vos projets en ligne en 2026.',
    seoTitle: 'Top 10 hébergement web 2026 : comparatif',
    seoDescription: 'Découvrez le Top 10 des meilleurs hébergeurs web en 2026. Les meilleurs hébergeurs pour lancer et gérer vos projets en ligne.',
    keywords: 'top 10 hebergement web, meilleur hebergeur 2026, comparatif hebergement',
  },
  en: {
    label: 'Web Hosting',
    desc: 'The best web hosts to launch and manage your online projects in 2026.',
    seoTitle: 'Top 10 web hosting 2026: comparison',
    seoDescription: 'Discover the Top 10 best web hosts in 2026. The best hosting providers to launch and manage your online projects.',
    keywords: 'top 10 web hosting, best web host 2026, hosting comparison',
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

export default function Top10Hebergement({ tools }) {
  const t = useT(CONTENT);
  return (
    <Top10Page
      tools={tools}
      meta={{ ...STYLE, label: t.label, desc: t.desc }}
      seo={{
        title: t.seoTitle,
        description: t.seoDescription,
        canonical: 'https://comparateur-tech.com/top-10-hebergement-web',
        keywords: t.keywords,
      }}
    />
  );
}
