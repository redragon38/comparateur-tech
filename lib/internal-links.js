const LEGACY_INTERNAL_HREFS = {
  '/comparatifs/meilleurs-vpn': '/top-10-vpn',
  '/comparisons/best-vpn': '/top-10-vpn',
  '/comparatif-vpn': '/top-10-vpn',
  '/vpn-comparatif': '/top-10-vpn',
  '/comparatif-vpn-2026': '/top-10-vpn',
  '/vpn-comparison': '/top-10-vpn',
  '/vpn-comparison-2026': '/top-10-vpn',
  '/vpn-security-comparison': '/top-10-vpn',
  '/comparatif-vpn-securite': '/top-10-vpn',
  '/guides/vpn': '/outils/vpn',
  '/guide-vpn-complet': '/outils/vpn',
  '/vpn-guide-complet': '/outils/vpn',
  '/complete-vpn-guide': '/outils/vpn',
  '/guides/vpn-streaming': '/blog/vpn-streaming-netflix',
  '/streaming/debloquer-contenus': '/blog/vpn-streaming-netflix',
  '/guides/protection-wifi-public': '/outils/vpn',
  '/guides/public-wifi-security': '/outils/vpn',
  '/guide-securite-internet': '/outils/vpn',
  '/internet-security-guide': '/outils/vpn',
  '/blog/confidentialite-en-ligne': '/outils/vpn',
  '/blog/securite-wifi-public': '/outils/vpn',
  '/vpn-anonymat-guide': '/outils/vpn',
  '/vpn-anonymity-guide': '/outils/vpn',
  '/securite/chiffrement': '/outils/vpn',
  '/securite/navigation-securisee': '/outils/vpn',
  '/securite/protection-donnees': '/outils/vpn',
  '/blog/meilleurs-antivirus': '/top-10-antivirus',
  '/blog/best-antivirus': '/top-10-antivirus',
  '/blog/antivirus-gratuit': '/blog/antivirus-gratuit-vs-payant',
  '/blog/free-antivirus': '/blog/antivirus-gratuit-vs-payant',
  '/categorie/intelligence-artificielle': '/outils/intelligence-artificielle',
  '/outils/gestion-de-projet': '/outils/intelligence-artificielle/productivite',
  '/tools/project-management': '/outils/intelligence-artificielle/productivite',
  '/guides/productivite-equipe': '/outils/intelligence-artificielle/productivite',
  '/guides/team-productivity': '/outils/intelligence-artificielle/productivite',
  '/guides/agents-ia': '/outils/intelligence-artificielle/agent',
  '/guides/ai-agents': '/outils/intelligence-artificielle/agent',
  '/comparatifs/outils-automation': '/outils/intelligence-artificielle/agent',
  '/comparatifs/alternatives-asana': '/outils/intelligence-artificielle/productivite',
  '/blog/cybersecurite-pme': '/top-10-cybersecurite',
  '/blog/cybersecurity-for-smb': '/top-10-cybersecurite',
  '/blog/protection-ransomware': '/top-10-cybersecurite',
  '/blog/ransomware-protection': '/top-10-cybersecurite',
  '/blog/cybersecurite-vie-privee': '/top-10-cybersecurite',
  '/blog/cybersecurity-privacy': '/top-10-cybersecurite',
  '/comparatifs/outils-pentesting': '/outils/cybersecurite',
  '/comparatifs/meilleurs-siem': '/outils/cybersecurite',
  '/guides/gestionnaire-mot-de-passe': '/outils/cybersecurite',
  '/guides/password-manager': '/outils/cybersecurite',
  '/guides/analyse-trafic-reseau': '/outils/cybersecurite',
  '/guides/test-intrusion-debutant': '/outils/cybersecurite',
  '/guides/securite-application-web': '/outils/cybersecurite',
  '/guides/bug-bounty-debutant': '/outils/cybersecurite',
  '/guides/scan-reseau-debutant': '/outils/cybersecurite',
  '/guides/devsecops-secrets': '/outils/cybersecurite',
  '/guides/installer-kali-linux': '/outils/cybersecurite',
  '/guides/certification-oscp': '/outils/cybersecurite',
  '/guides/ids-ips-entreprise': '/outils/cybersecurite',
  '/guides/scanner-vulnerabilites': '/outils/cybersecurite',
  '/guides/devsecops-shift-left': '/outils/cybersecurite',
  '/guides/creer-soc-entreprise': '/outils/cybersecurite',
};

export function normalizeInternalHref(href) {
  if (typeof href !== 'string' || !href.startsWith('/')) return href;

  const [withoutHash, hash] = href.split('#');
  const [pathname, query] = withoutHash.split('?');
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const canonicalPath = LEGACY_INTERNAL_HREFS[normalizedPath] || normalizedPath;

  return `${canonicalPath}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
}

export { LEGACY_INTERNAL_HREFS };
