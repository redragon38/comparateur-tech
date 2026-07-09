import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { toCardTool } from '../lib/tool-data';

const META = {
  label: 'Hébergement Web',
  catFilter: 'Hébergement web',
  icon: '🌐',
  color: 'from-emerald-600 to-green-400',
  colorLight: 'from-emerald-50 to-green-50',
  border: 'border-emerald-200',
  badge: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  desc: 'Les meilleurs hébergeurs web pour lancer et gérer vos projets en ligne en 2026.',
};

const OTHERS = [
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 IA', icon: '🤖' },
  { href: '/top-10-vpn', label: 'Top 10 VPN', icon: '🛡️' },
  { href: '/top-10-antivirus', label: 'Top 10 Antivirus', icon: '🦠' },
  { href: '/top-10-cybersecurite', label: 'Top 10 Cybersécurité', icon: '🔐' },
];

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const tools = allTools
    .filter(t => (t.categories || []).includes(META.catFilter))
    .sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
    .slice(0, 10);
  return { props: { tools: tools.map(toCardTool) } };
}

const CLUSTER_LINKS = [
  { href: '/comparatifs/hostinger-vs-o2switch', label: 'Hostinger vs o2switch', desc: 'Le duel des deux hébergeurs préférés des francophones : prix, support, performances.' },
  { href: '/comparatifs/ovhcloud-vs-hostinger', label: 'OVHcloud vs Hostinger', desc: 'Souveraineté européenne contre rapport qualité-prix : le match 2026.' },
  { href: '/comparatifs/ovhcloud-vs-o2switch', label: 'OVHcloud vs o2switch', desc: 'Le duel des hébergeurs français : gamme complète contre offre tout-illimité.' },
  { href: '/guides/meilleur-hebergement-wordpress', label: 'Meilleur hébergement WordPress', desc: 'Choisir le bon hébergeur pour un site WordPress en 2026.' },
  { href: '/guides/meilleur-hebergement-pas-cher', label: 'Meilleur hébergement pas cher', desc: 'Les hébergeurs au meilleur prix sans piège sur le renouvellement.' },
  { href: '/tool/ovhcloud', label: 'Avis OVHcloud', desc: 'Le leader européen du cloud : forces, limites et tarifs dès 3,99 €/mois.' },
  { href: '/alternatives/ovhcloud', label: 'Alternatives à OVHcloud', desc: 'Les hébergeurs à comparer face au leader européen du cloud.' },
  { href: '/alternatives/alternative-hostinger', label: 'Alternatives à Hostinger', desc: 'Les hébergeurs à comparer avant de s’engager.' },
  { href: '/blog/hebergement-petit-budget', label: 'Héberger un site à petit budget', desc: 'Les meilleures options à moins de 5 €/mois.' },
  { href: '/outils/hebergement-web', label: 'Tous les hébergeurs', desc: 'Le catalogue complet des hébergeurs testés et notés.' },
];

const FAQS = [
  { q: 'Quel est le meilleur hébergeur web en 2026 ?', a: 'Pour la majorité des projets francophones, Hostinger, o2switch et OVHcloud offrent le meilleur équilibre entre prix, performances et support. Hostinger excelle sur le rapport qualité-prix, o2switch sur l’offre tout-illimité hébergée en France, OVHcloud sur la gamme et la souveraineté européenne.' },
  { q: 'Quel hébergement choisir pour WordPress ?', a: 'Un hébergement mutualisé optimisé WordPress suffit pour la plupart des sites (blog, vitrine, petit e-commerce). Vérifiez la présence de sauvegardes automatiques, d’un certificat SSL inclus, du cache serveur et d’une installation WordPress en un clic. Notre guide dédié détaille les meilleures options.' },
  { q: 'Combien coûte un hébergement web ?', a: 'Les offres mutualisées sérieuses démarrent entre 2 et 5 €/mois en promotion (attention au tarif de renouvellement, souvent 2 à 3 fois plus élevé). Un VPS commence vers 5-10 €/mois et un hébergement cloud managé vers 20-30 €/mois.' },
  { q: 'Hébergeur français ou international ?', a: 'Un hébergeur avec des datacenters en France ou en Europe (o2switch, OVHcloud, Infomaniak) garantit de meilleures latences pour une audience francophone et simplifie la conformité RGPD. Les acteurs internationaux compensent par des CDN intégrés.' },
];

export default function Top10Hebergement({ tools }) {
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      faqs={FAQS}
      clusterLinks={CLUSTER_LINKS}
      seo={{
        title: 'Top 10 hébergement web 2026 : comparatif',
        description: `Découvrez le Top 10 des meilleurs hébergeurs web en 2026. ${META.desc}`,
        canonical: 'https://comparateur-tech.com/top-10-hebergement-web',
        keywords: 'top 10 hebergement web, meilleur hebergeur 2026, comparatif hebergement',
      }}
    />
  );
}
