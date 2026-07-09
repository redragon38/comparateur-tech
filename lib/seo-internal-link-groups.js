const aiCoreLinks = [
  { href: '/outils/intelligence-artificielle', label: 'Tous les outils IA' },
  { href: '/top-10-intelligence-artificielle', label: 'Top 10 outils IA' },
  { href: '/ia', label: 'Hub intelligence artificielle' },
  { href: '/ia-generative', label: 'IA générative' },
];

const aiAlternativeLinks = [
  { href: '/alternatives/chatgpt', label: 'Alternatives à ChatGPT' },
  { href: '/alternatives/claude-ai', label: 'Alternatives à Claude' },
  { href: '/alternatives/gemini', label: 'Alternatives à Gemini' },
  { href: '/alternatives/perplexity', label: 'Alternatives à Perplexity' },
  { href: '/alternatives/midjourney', label: 'Alternatives à Midjourney' },
  { href: '/alternatives/cursor', label: 'Alternatives à Cursor' },
];

const aiComparisonLinks = [
  { href: '/comparatifs/chatgpt-vs-claude', label: 'ChatGPT vs Claude' },
  { href: '/comparatifs/chatgpt-vs-gemini', label: 'ChatGPT vs Gemini' },
  { href: '/comparatifs/chatgpt-vs-perplexity', label: 'ChatGPT vs Perplexity' },
  { href: '/comparatifs/chatgpt-vs-mistral', label: 'ChatGPT vs Mistral AI' },
  { href: '/comparatifs/claude-vs-gemini', label: 'Claude vs Gemini' },
  { href: '/comparatifs/cursor-vs-github-copilot', label: 'Cursor vs GitHub Copilot' },
];

const aiUsecaseLinks = [
  { href: '/meilleurs-outils/ia-pour-seo', label: 'Meilleurs outils IA pour SEO' },
  { href: '/meilleurs-outils/ia-pour-etudiants', label: 'Meilleurs outils IA pour étudiants' },
  { href: '/meilleurs-outils/ia-pour-developpeurs', label: 'Meilleurs outils IA pour développeurs' },
];

const vpnLinks = [
  { href: '/vpn', label: 'Hub VPN' },
  { href: '/barometre-prix-vpn', label: 'Baromètre prix VPN 2026' },
  { href: '/top-10-vpn', label: 'Top 10 VPN' },
  { href: '/outils/vpn', label: 'Tous les VPN' },
  { href: '/alternatives/nordvpn', label: 'Alternatives à NordVPN' },
  { href: '/alternatives/surfshark', label: 'Alternatives à Surfshark' },
  { href: '/comparatifs/nordvpn-vs-surfshark', label: 'NordVPN vs Surfshark' },
  { href: '/comparatifs/nordvpn-vs-cyberghost', label: 'NordVPN vs CyberGhost' },
  { href: '/comparatifs/expressvpn-vs-surfshark', label: 'ExpressVPN vs Surfshark' },
  { href: '/comparatifs/surfshark-vs-cyberghost', label: 'Surfshark vs CyberGhost' },
  { href: '/comparatifs/proton-vpn-vs-mullvad', label: 'Proton VPN vs Mullvad' },
];

const hostingLinks = [
  { href: '/hebergement', label: 'Hub hébergement web' },
  { href: '/calculateur-hebergement', label: 'Calculateur coût hébergement' },
  { href: '/top-10-hebergement-web', label: 'Top 10 hébergement web' },
  { href: '/outils/hebergement-web', label: 'Tous les hébergeurs web' },
  { href: '/meilleurs-outils/hebergement-wordpress', label: 'Meilleurs hébergements WordPress' },
];

const securityLinks = [
  { href: '/cybersecurite', label: 'Hub cybersécurité' },
  { href: '/top-10-cybersecurite', label: 'Top 10 cybersécurité' },
  { href: '/top-10-antivirus', label: 'Top 10 antivirus' },
  { href: '/outils/cybersecurite', label: 'Outils cybersécurité' },
  { href: '/outils/antivirus', label: 'Outils antivirus' },
];

export const HOME_SEO_LINK_GROUPS = [
  { title: 'Intelligence artificielle', links: aiCoreLinks },
  { title: 'Alternatives IA populaires', links: aiAlternativeLinks },
  { title: 'Comparatifs IA populaires', links: aiComparisonLinks },
  { title: 'Meilleurs outils par usage', links: aiUsecaseLinks },
  { title: 'VPN', links: vpnLinks },
  { title: 'Hébergement web', links: hostingLinks },
  { title: 'Cybersécurité', links: securityLinks },
];

export const SILO_SEO_LINK_GROUPS = {
  ia: [
    { title: 'Guides IA', links: [...aiCoreLinks, ...aiUsecaseLinks] },
    { title: 'Alternatives IA populaires', links: aiAlternativeLinks.slice(0, 4) },
    { title: 'Comparatifs IA populaires', links: aiComparisonLinks.slice(0, 3) },
  ],
  vpn: [
    {
      title: 'Guides VPN',
      links: [
        ...vpnLinks,
        { href: '/alternatives/proton-vpn', label: 'Alternatives à Proton VPN' },
        { href: '/alternatives/expressvpn', label: 'Alternatives à ExpressVPN' },
        { href: '/comparatifs/nordvpn-vs-expressvpn', label: 'NordVPN vs ExpressVPN' },
        { href: '/meilleurs-outils/vpn-streaming', label: 'Meilleurs VPN streaming' },
        { href: '/meilleurs-outils/vpn-confidentialite', label: 'Meilleurs VPN confidentialité' },
      ],
    },
  ],
  hebergement: [
    {
      title: 'Guides hébergement',
      links: [
        ...hostingLinks,
        { href: '/alternatives/hostinger', label: 'Alternatives à Hostinger' },
        { href: '/alternatives/o2switch', label: 'Alternatives à o2switch' },
        { href: '/alternatives/infomaniak', label: 'Alternatives à Infomaniak' },
        { href: '/alternatives/siteground', label: 'Alternatives à SiteGround' },
        { href: '/comparatifs/hostinger-vs-o2switch', label: 'Hostinger vs o2switch' },
      ],
    },
  ],
  cybersecurite: [
    {
      title: 'Guides sécurité',
      links: [
        ...securityLinks,
        { href: '/alternatives/bitdefender', label: 'Alternatives à Bitdefender' },
        { href: '/alternatives/norton360', label: 'Alternatives à Norton 360' },
        { href: '/alternatives/avast', label: 'Alternatives à Avast' },
        { href: '/alternatives/malwarebytes', label: 'Alternatives à Malwarebytes' },
        { href: '/comparatifs/bitdefender-vs-norton', label: 'Bitdefender vs Norton 360' },
        { href: '/comparatifs/bitdefender-vs-kaspersky', label: 'Bitdefender vs Kaspersky' },
        { href: '/comparatifs/norton-vs-mcafee', label: 'Norton vs McAfee' },
        { href: '/comparatifs/avast-vs-avg', label: 'Avast vs AVG' },
        { href: '/comparatifs/bitwarden-vs-1password', label: 'Bitwarden vs 1Password' },
        { href: '/comparatifs/dashlane-vs-1password', label: 'Dashlane vs 1Password' },
        { href: '/meilleurs-outils/antivirus-windows', label: 'Meilleurs antivirus Windows' },
        { href: '/meilleurs-outils/cybersecurite-pme', label: 'Cybersécurité pour PME' },
      ],
    },
  ],
  alternatives: [
    { title: 'Alternatives IA', links: aiAlternativeLinks },
    { title: 'Alternatives VPN', links: vpnLinks.filter(link => link.href.startsWith('/alternatives/')) },
    {
      title: 'Alternatives hébergement et sécurité',
      links: [
        { href: '/alternatives/hostinger', label: 'Alternatives à Hostinger' },
        { href: '/alternatives/bitdefender', label: 'Alternatives à Bitdefender' },
      ],
    },
  ],
};

export const TOOLS_SEO_LINK_GROUPS = [
  {
    title: 'Grandes catégories',
    links: [
      { href: '/outils/intelligence-artificielle', label: 'Outils IA' },
      { href: '/outils/vpn', label: 'Outils VPN' },
      { href: '/outils/hebergement-web', label: 'Outils hébergement web' },
      { href: '/outils/cybersecurite', label: 'Outils cybersécurité' },
      { href: '/outils/antivirus', label: 'Outils antivirus' },
    ],
  },
  { title: 'Sous-catégories IA', links: [
    { href: '/outils/intelligence-artificielle/redaction', label: 'IA de rédaction' },
    { href: '/outils/intelligence-artificielle/image', label: 'IA image' },
    { href: '/outils/intelligence-artificielle/recherche', label: 'IA recherche' },
    { href: '/outils/intelligence-artificielle/code', label: 'IA code' },
    { href: '/outils/intelligence-artificielle/productivite', label: 'Productivité IA' },
  ] },
  { title: 'Guides populaires', links: [...aiUsecaseLinks, { href: '/meilleurs-outils/vpn-streaming', label: 'Meilleurs VPN streaming' }] },
];

export const COMPARATIFS_SEO_LINK_GROUPS = [
  { title: 'Comparatifs IA', links: aiComparisonLinks },
  {
    title: 'Comparatifs VPN et hébergement',
    links: [
      { href: '/comparatifs/nordvpn-vs-surfshark', label: 'NordVPN vs Surfshark' },
      { href: '/comparatifs/nordvpn-vs-expressvpn', label: 'NordVPN vs ExpressVPN' },
      { href: '/comparatifs/nordvpn-vs-cyberghost', label: 'NordVPN vs CyberGhost' },
      { href: '/comparatifs/expressvpn-vs-surfshark', label: 'ExpressVPN vs Surfshark' },
      { href: '/comparatifs/surfshark-vs-cyberghost', label: 'Surfshark vs CyberGhost' },
      { href: '/comparatifs/proton-vpn-vs-mullvad', label: 'Proton VPN vs Mullvad' },
      { href: '/comparatifs/hostinger-vs-o2switch', label: 'Hostinger vs o2switch' },
      { href: '/comparatifs/hostinger-vs-siteground', label: 'Hostinger vs SiteGround' },
    ],
  },
  {
    title: 'Comparatifs sécurité',
    links: [
      { href: '/comparatifs/bitdefender-vs-norton', label: 'Bitdefender vs Norton 360' },
      { href: '/comparatifs/bitdefender-vs-kaspersky', label: 'Bitdefender vs Kaspersky' },
      { href: '/comparatifs/norton-vs-mcafee', label: 'Norton vs McAfee' },
      { href: '/comparatifs/avast-vs-avg', label: 'Avast vs AVG' },
      { href: '/comparatifs/bitwarden-vs-1password', label: 'Bitwarden vs 1Password' },
      { href: '/comparatifs/dashlane-vs-1password', label: 'Dashlane vs 1Password' },
    ],
  },
];
