import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { toCardTool } from '../lib/tool-data';

const META = {
  label: 'Antivirus',
  catFilter: 'Antivirus',
  icon: '🦠',
  color: 'from-red-600 to-orange-400',
  colorLight: 'from-red-50 to-orange-50',
  border: 'border-red-200',
  badge: 'bg-red-50 border-red-200 text-red-700',
  desc: 'Les meilleurs antivirus pour protéger vos appareils contre les cybermenaces en 2026.',
};

const OTHERS = [
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 IA', icon: '🤖' },
  { href: '/top-10-vpn', label: 'Top 10 VPN', icon: '🛡️' },
  { href: '/top-10-hebergement-web', label: 'Top 10 Hébergement', icon: '🌐' },
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
  { href: '/comparatifs/bitdefender-vs-norton', label: 'Bitdefender vs Norton', desc: 'Duel des deux antivirus les plus populaires : protection, prix et impact système.' },
  { href: '/guides/meilleur-antivirus-windows', label: 'Meilleur antivirus Windows', desc: 'Guide complet pour protéger un PC Windows en 2026.' },
  { href: '/guides/meilleur-antivirus-gratuit', label: 'Meilleur antivirus gratuit', desc: 'Les meilleures protections gratuites et leurs limites face au payant.' },
  { href: '/guides/meilleur-antivirus-mac', label: 'Meilleur antivirus Mac', desc: 'Protéger macOS contre adwares et menaces sans ralentir la machine.' },
  { href: '/guides/meilleur-antivirus-android', label: 'Meilleur antivirus Android', desc: 'Sécuriser son mobile : apps malveillantes, phishing et antivol.' },
  { href: '/tool/webroot', label: 'Avis Webroot', desc: 'Que vaut cet antivirus cloud ultra-léger dès 2,08 €/mois ? Notre test.' },
  { href: '/tool/malwarebytes', label: 'Avis Malwarebytes', desc: 'Le spécialiste anti-malware : forces, limites et tarifs.' },
  { href: '/blog/antivirus-gratuit-vs-payant', label: 'Antivirus gratuit vs payant', desc: 'Faut-il vraiment payer pour un antivirus ? Notre analyse.' },
  { href: '/alternatives/alternative-bitdefender', label: 'Alternatives à Bitdefender', desc: 'Les solutions à comparer avant de choisir.' },
  { href: '/outils/antivirus', label: 'Tous les antivirus', desc: 'Le catalogue complet des antivirus testés et notés.' },
  { href: '/top-10-cybersecurite', label: 'Top 10 cybersécurité', desc: 'Compléter sa protection : VPN, gestionnaires de mots de passe, etc.' },
];

const FAQS = [
  { q: 'Quel est le meilleur antivirus en 2026 ?', a: 'Selon nos tests, Bitdefender et Norton dominent le classement grâce à leurs taux de détection, leur protection en temps réel et leur faible impact sur les performances. Le bon choix dépend ensuite du nombre d’appareils, du budget et des outils inclus (VPN, gestionnaire de mots de passe, contrôle parental).' },
  { q: 'Un antivirus gratuit suffit-il ?', a: 'Un antivirus gratuit (ou Microsoft Defender intégré à Windows) couvre les menaces de base. Les versions payantes ajoutent la protection anti-phishing avancée, la protection ransomware, le pare-feu renforcé et le support, recommandés si vous gérez des données sensibles ou des paiements en ligne.' },
  { q: 'Comment avons-nous classé ces antivirus ?', a: 'Le classement repose sur des critères publics : taux de détection des laboratoires indépendants, impact sur les performances, fonctionnalités incluses, qualité du support et rapport qualité-prix. Notre méthodologie complète est consultable sur la page Méthodologie.' },
  { q: 'Faut-il un antivirus sur Mac ou Android ?', a: 'Oui, le risque existe aussi hors Windows : adwares sur Mac, applications malveillantes et phishing sur Android. La plupart des suites de ce classement couvrent plusieurs plateformes avec une seule licence multi-appareils.' },
];

export default function Top10Antivirus({ tools }) {
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      faqs={FAQS}
      clusterLinks={CLUSTER_LINKS}
      seo={{
        title: 'Top 10 antivirus 2026 : classement comparatif',
        description: `Découvrez le Top 10 des meilleurs antivirus en 2026. ${META.desc}`,
        canonical: 'https://comparateur-tech.com/top-10-antivirus',
        keywords: 'top 10 antivirus, meilleur antivirus 2026, comparatif antivirus',
      }}
    />
  );
}
