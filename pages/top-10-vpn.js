import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { toCardTool } from '../lib/tool-data';

const META = {
  label: 'VPN',
  catFilter: 'VPN',
  icon: '🛡️',
  color: 'from-blue-600 to-blue-400',
  colorLight: 'from-blue-50 to-cyan-50',
  border: 'border-blue-200',
  badge: 'bg-blue-50 border-blue-200 text-blue-700',
  desc: 'Les meilleurs VPN pour sécuriser vos connexions et protéger votre vie privée en 2026.',
};

const OTHERS = [
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 IA', icon: '🤖' },
  { href: '/top-10-hebergement-web', label: 'Top 10 Hébergement', icon: '🌐' },
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
  { href: '/comparatifs/nordvpn-vs-surfshark', label: 'NordVPN vs Surfshark', desc: 'Le duel premium vs rapport qualité-prix : vitesse, streaming, appareils.' },
  { href: '/comparatifs/nordvpn-vs-expressvpn', label: 'NordVPN vs ExpressVPN', desc: 'Quel VPN premium choisir en 2026 ? Notre comparatif complet.' },
  { href: '/guides/meilleur-vpn-streaming', label: 'Meilleur VPN pour streaming', desc: 'Les VPN qui débloquent réellement les catalogues étrangers.' },
  { href: '/guides/meilleur-vpn-pas-cher', label: 'Meilleur VPN pas cher', desc: 'Le meilleur rapport qualité-prix : tarifs réels et renouvellement.' },
  { href: '/guides/meilleur-vpn-gratuit', label: 'Meilleur VPN gratuit', desc: 'Les rares VPN gratuits fiables et leurs limites concrètes.' },
  { href: '/alternatives/alternative-nordvpn', label: 'Alternatives à NordVPN', desc: 'Les VPN à comparer avant de s’abonner.' },
  { href: '/meilleurs-outils/vpn-confidentialite', label: 'VPN pour la confidentialité', desc: 'Les VPN no-log audités pour protéger votre vie privée.' },
  { href: '/outils/vpn', label: 'Tous les VPN', desc: 'Le catalogue complet des VPN testés et notés.' },
];

const FAQS = [
  { q: 'Quel est le meilleur VPN en 2026 ?', a: 'NordVPN reste la valeur sûre premium (vitesse, sécurité, streaming), tandis que Surfshark domine le rapport qualité-prix avec ses connexions illimitées. Proton VPN et Mullvad sont les références pour la confidentialité stricte.' },
  { q: 'Un VPN gratuit est-il fiable ?', a: 'Rarement. Beaucoup de VPN gratuits monétisent vos données, limitent fortement le débit ou le volume. Les seules options gratuites sérieuses sont les offres limitées d’acteurs réputés comme Proton VPN. Pour un usage régulier, un VPN payant à 2-4 €/mois reste le bon choix.' },
  { q: 'Un VPN ralentit-il la connexion ?', a: 'Légèrement, oui : le chiffrement et le détour par un serveur ajoutent de la latence. Les meilleurs VPN du classement (protocole WireGuard) limitent la perte à 5-15 % sur une connexion fibre, ce qui reste imperceptible en streaming ou navigation.' },
  { q: 'Les VPN sont-ils légaux en France ?', a: 'Oui, utiliser un VPN est parfaitement légal en France et dans l’Union européenne. C’est l’usage qui compte : un VPN ne rend pas légale une activité qui ne l’est pas.' },
];

export default function Top10VPN({ tools }) {
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      faqs={FAQS}
      clusterLinks={CLUSTER_LINKS}
      seo={{
        title: 'Top 10 VPN 2026 : classement comparatif',
        description: `Découvrez le Top 10 des meilleurs VPN en 2026. ${META.desc}`,
        canonical: 'https://comparateur-tech.com/top-10-vpn',
        keywords: 'top 10 vpn, meilleur vpn 2026, comparatif vpn',
      }}
    />
  );
}
