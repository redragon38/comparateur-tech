import fs from 'fs';
import path from 'path';
import Top10Page from '../components/Top10Page';
import { toCardTool } from '../lib/tool-data';

const META = {
  label: 'Cybersécurité',
  catFilter: 'Cybersécurité',
  icon: '🔐',
  color: 'from-slate-600 to-gray-800',
  colorLight: 'from-slate-50 to-gray-100',
  border: 'border-slate-200',
  badge: 'bg-slate-50 border-slate-200 text-slate-700',
  desc: 'Les meilleurs outils de cybersécurité pour protéger vos accès, vos comptes et vos infrastructures en 2026.',
};

const OTHERS = [
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 IA', icon: '🤖' },
  { href: '/top-10-vpn', label: 'Top 10 VPN', icon: '🛡️' },
  { href: '/top-10-hebergement-web', label: 'Top 10 Hébergement', icon: '🌐' },
  { href: '/top-10-antivirus', label: 'Top 10 Antivirus', icon: '🦠' },
];

function normalizeSlug(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const tools = allTools
    .filter((tool) =>
      (tool.categories || []).some((cat) => {
        const raw = String(cat || '').trim();
        return (
          raw === META.catFilter ||
          normalizeSlug(raw) === 'cybersecurite'
        );
      })
    )
    .sort((a, b) => {
      const ratingDiff = (b.rating?.value || 0) - (a.rating?.value || 0);
      if (ratingDiff !== 0) return ratingDiff;

      const reviewsDiff = (b.rating?.count || 0) - (a.rating?.count || 0);
      if (reviewsDiff !== 0) return reviewsDiff;

      return (a.name || '').localeCompare(b.name || '');
    })
    .slice(0, 10);

  return {
    props: { tools: tools.map(toCardTool) },
  };
}

const CLUSTER_LINKS = [
  { href: '/tool/bitwarden', label: 'Avis Bitwarden', desc: 'Le gestionnaire de mots de passe open source de référence, gratuit ou Premium à 10 $/an.' },
  { href: '/guides/meilleur-gestionnaire-mots-de-passe', label: 'Meilleur gestionnaire de mots de passe', desc: 'Bitwarden, 1Password, Dashlane, KeePass : lequel choisir en 2026 ?' },
  { href: '/guides/gestionnaire-mots-de-passe-gratuit', label: 'Gestionnaire de mots de passe gratuit', desc: 'Les meilleures offres gratuites et leurs vraies limites.' },
  { href: '/comparatifs/bitdefender-vs-norton', label: 'Bitdefender vs Norton', desc: 'Quel antivirus choisir pour compléter sa protection ?' },
  { href: '/top-10-antivirus', label: 'Top 10 antivirus', desc: 'Le classement des meilleures suites de protection 2026.' },
  { href: '/top-10-vpn', label: 'Top 10 VPN', desc: 'Sécuriser sa connexion et son adresse IP.' },
  { href: '/outils/cybersecurite', label: 'Tous les outils cybersécurité', desc: 'Le catalogue complet : gestionnaires de mots de passe, SIEM, pentest, etc.' },
];

const FAQS = [
  { q: 'Quels outils de cybersécurité sont indispensables ?', a: 'Pour un particulier ou un indépendant : un gestionnaire de mots de passe (Bitwarden, 1Password), l’authentification à deux facteurs, un antivirus à jour et un VPN sur les réseaux publics. Pour une entreprise s’ajoutent la sauvegarde, le filtrage des emails et la supervision des accès.' },
  { q: 'Pourquoi utiliser un gestionnaire de mots de passe ?', a: 'La réutilisation de mots de passe est la première cause de compromission de comptes. Un gestionnaire comme Bitwarden génère et stocke un mot de passe unique et fort par service, chiffré de bout en bout, pour un coût nul ou quasi nul.' },
  { q: 'Comment protéger une PME avec un petit budget ?', a: 'Commencez par les fondamentaux à fort impact : gestionnaire de mots de passe d’équipe, double authentification généralisée, mises à jour automatiques, sauvegardes testées et sensibilisation au phishing. Ces mesures bloquent la majorité des attaques courantes pour quelques euros par utilisateur.' },
];

export default function Top10Cybersecurite({ tools }) {
  return (
    <Top10Page
      tools={tools}
      meta={META}
      others={OTHERS}
      faqs={FAQS}
      clusterLinks={CLUSTER_LINKS}
      seo={{
        title: 'Top 10 cybersécurité 2026 : outils à comparer',
        description: 'Découvrez les meilleurs outils de cybersécurité en 2026 pour protéger vos accès, comptes, appareils et infrastructures.',
        canonical: 'https://comparateur-tech.com/top-10-cybersecurite',
        keywords: 'top 10 cybersécurité, meilleur outil cybersécurité 2026, comparatif cybersécurité',
      }}
    />
  );
}
