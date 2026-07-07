import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { useT } from '../lib/i18n';

const STYLE = {
  slug: 'intelligence-artificielle',
  catFilter: 'Intelligence artificielle',
  icon: '🤖',
  color: 'from-violet-600 to-purple-500',
  colorLight: 'from-violet-50 to-purple-50',
  border: 'border-violet-200',
  badge: 'bg-violet-50 border-violet-200 text-violet-700',
};

const CONTENT = {
  fr: {
    label: 'Intelligence Artificielle',
    desc: 'Les meilleurs outils IA pour booster votre productivité et créativité en 2026.',
    seoTitle: 'Top 10 outils IA 2026 : classement comparatif',
    seoDescription: 'Découvrez le Top 10 des meilleurs outils IA en 2026. Les meilleurs outils IA pour booster votre productivité et créativité.',
    keywords: 'top 10 ia, meilleur outil ia 2026, comparatif intelligence artificielle',
  },
  en: {
    label: 'Artificial Intelligence',
    desc: 'The best AI tools to boost your productivity and creativity in 2026.',
    seoTitle: 'Top 10 AI tools 2026: comparative ranking',
    seoDescription: 'Discover the Top 10 best AI tools in 2026. The best AI tools to boost your productivity and creativity.',
    keywords: 'top 10 ai, best ai tool 2026, artificial intelligence comparison',
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

export default function Top10IA({ tools }) {
  const t = useT(CONTENT);
  return (
    <Top10Page
      tools={tools}
      meta={{ ...STYLE, label: t.label, desc: t.desc }}
      seo={{
        title: t.seoTitle,
        description: t.seoDescription,
        canonical: 'https://comparateur-tech.com/top-10-intelligence-artificielle',
        keywords: t.keywords,
      }}
    />
  );
}
