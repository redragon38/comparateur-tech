// Nouveaux articles de blog bilingues (SEO/GEO). Chaque article existe en FR et EN.
// Consommé par pages/blog/[slug].js (corps) et pages/blog/index.js (liste).

const CAT_COLOR = {
  VPN: 'text-gray-600 bg-blue-900/20 border-blue-500/20',
  Hebergement: 'text-gray-600 bg-emerald-900/20 border-emerald-500/20',
  Antivirus: 'text-gray-600 bg-red-900/20 border-red-500/20',
  IA: 'text-gray-600 bg-purple-900/20 border-purple-500/20',
  Cyber: 'text-gray-600 bg-slate-900/20 border-slate-500/20',
};

export const NEW_BLOG = [
  {
    slug: 'comment-choisir-vpn-2026',
    emoji: '🛡️',
    catKey: 'VPN',
    catColor: CAT_COLOR.VPN,
    date: '6 juil. 2026',
    dateEn: 'Jul 6, 2026',
    readTime: '9 min',
    featured: true,
    published: '2026-07-06',
    modified: '2026-07-06',
    fr: {
      category: 'VPN',
      title: 'Comment choisir un VPN en 2026 : le guide complet',
      excerpt: 'Vitesse, politique no-log, juridiction, streaming, prix : les 6 critères qui comptent vraiment pour choisir un VPN, et les erreurs à éviter.',
      intro: 'Choisir un VPN ne se résume pas à prendre le moins cher ou celui qui a le plus de serveurs. Voici les critères qui font réellement la différence en 2026, expliqués simplement, pour éviter les pièges marketing.',
      sections: [
        { title: 'La politique de logs et la juridiction', content: 'Le critère numéro un reste ce que le fournisseur peut savoir de vous. Privilégiez un VPN avec une politique no-log claire, idéalement auditée par un cabinet indépendant, et vérifiez le pays d\'immatriculation : une juridiction hors des accords de partage de renseignements offre une protection supplémentaire. Une promesse marketing ne vaut rien sans audit public pour la confirmer.' },
        { title: 'La vitesse et la stabilité réelles', content: 'Un bon VPN doit chiffrer votre trafic sans effondrer votre débit. Les protocoles modernes comme WireGuard (souvent renommé selon les marques) offrent les meilleures performances. Regardez des tests de vitesse mesurés depuis plusieurs pays plutôt que le nombre de serveurs annoncé, qui ne dit rien de la qualité.' },
        { title: 'Le streaming et les usages', content: 'Si vous voulez débloquer des catalogues, vérifiez que le VPN maintient un accès fiable à vos plateformes : c\'est une course permanente entre les VPN et les services de streaming. Pour le téléchargement P2P, assurez-vous que les serveurs l\'autorisent. Définissez votre usage principal avant de comparer.' },
        { title: 'Les fonctionnalités de sécurité', content: 'Un kill switch, qui coupe Internet si le VPN tombe, est indispensable pour éviter les fuites. Le split tunneling, les protections anti-fuite DNS et le multi-hop sont des bonus utiles selon votre profil. Vérifiez aussi le nombre d\'appareils connectables simultanément.' },
        { title: 'Le prix réel et l\'engagement', content: 'Le tarif affiché est souvent celui de la première période. Regardez le prix au renouvellement, la durée d\'engagement et la garantie de remboursement. Un abonnement de 2 ou 3 ans est moins cher au mois, mais vous engage longtemps : ne vous engagez que si vous avez pu tester le service.' },
        { title: 'Notre méthode et vos prochaines étapes', content: 'Nous évaluons chaque VPN sur la vitesse, l\'absence de fuites, la politique no-log, les fonctionnalités et le prix. Pas sûr de votre besoin ? Notre quiz vous oriente en une minute vers le VPN adapté à votre profil, avec des alternatives à comparer.' },
      ],
      faq: [
        { q: 'Un VPN gratuit suffit-il ?', a: 'Pour un usage très occasionnel, un VPN gratuit sérieux peut dépanner, mais il impose souvent des limites de données, moins de serveurs et des vitesses réduites. Pour le streaming, la confidentialité ou un usage régulier, un abonnement payant reste plus fiable.' },
        { q: 'Un VPN ralentit-il forcément la connexion ?', a: 'Le chiffrement induit toujours une légère perte de débit, mais avec un protocole moderne et un serveur proche, elle est souvent imperceptible. Un mauvais VPN, lui, peut diviser votre vitesse par deux.' },
        { q: 'Le no-log est-il vérifiable ?', a: 'Oui, en partie : cherchez un audit indépendant récent et les antécédents du fournisseur face à des demandes judiciaires. Une politique no-log sans audit reste une simple déclaration.' },
      ],
    },
    en: {
      category: 'VPN',
      title: 'How to choose a VPN in 2026: the complete guide',
      excerpt: 'Speed, no-log policy, jurisdiction, streaming, price: the 6 criteria that truly matter when choosing a VPN, and the mistakes to avoid.',
      intro: 'Choosing a VPN is not about picking the cheapest or the one with the most servers. Here are the criteria that really make the difference in 2026, explained simply, to help you avoid the marketing traps.',
      sections: [
        { title: 'Logging policy and jurisdiction', content: 'The number-one criterion is what the provider can know about you. Choose a VPN with a clear no-log policy, ideally audited by an independent firm, and check the country of incorporation: a jurisdiction outside intelligence-sharing alliances offers extra protection. A marketing promise means nothing without a public audit to back it up.' },
        { title: 'Real speed and stability', content: 'A good VPN should encrypt your traffic without collapsing your bandwidth. Modern protocols like WireGuard (often rebranded by each provider) deliver the best performance. Look at speed tests measured from several countries rather than the advertised server count, which says nothing about quality.' },
        { title: 'Streaming and use cases', content: 'If you want to unblock catalogs, check that the VPN maintains reliable access to your platforms: it is a constant race between VPNs and streaming services. For P2P downloading, make sure the servers allow it. Define your main use case before comparing.' },
        { title: 'Security features', content: 'A kill switch, which cuts your Internet if the VPN drops, is essential to prevent leaks. Split tunneling, DNS-leak protection and multi-hop are useful bonuses depending on your profile. Also check how many devices you can connect simultaneously.' },
        { title: 'Real price and commitment', content: 'The advertised price is often only for the first term. Check the renewal price, the commitment length and the money-back guarantee. A 2- or 3-year plan is cheaper per month but locks you in for a long time: only commit once you have been able to test the service.' },
        { title: 'Our method and your next steps', content: 'We rate every VPN on speed, absence of leaks, no-log policy, features and price. Not sure what you need? Our quiz guides you in one minute to the VPN suited to your profile, with alternatives to compare.' },
      ],
      faq: [
        { q: 'Is a free VPN enough?', a: 'For very occasional use, a reputable free VPN can help, but it often imposes data caps, fewer servers and reduced speeds. For streaming, privacy or regular use, a paid subscription remains more reliable.' },
        { q: 'Does a VPN always slow down the connection?', a: 'Encryption always causes a slight loss of bandwidth, but with a modern protocol and a nearby server it is often unnoticeable. A poor VPN, however, can halve your speed.' },
        { q: 'Can no-log claims be verified?', a: 'Partly: look for a recent independent audit and the provider\'s track record with legal requests. A no-log policy without an audit remains just a statement.' },
      ],
    },
  },
  {
    slug: 'comment-choisir-hebergeur-web-2026',
    emoji: '🌐',
    catKey: 'Hebergement',
    catColor: CAT_COLOR.Hebergement,
    date: '6 juil. 2026',
    dateEn: 'Jul 6, 2026',
    readTime: '8 min',
    featured: true,
    published: '2026-07-06',
    modified: '2026-07-06',
    fr: {
      category: 'Hébergement',
      title: 'Comment choisir son hébergeur web en 2026',
      excerpt: 'Uptime, TTFB, support, sauvegardes, prix de renouvellement : le guide pour choisir un hébergeur selon votre projet, du blog à la boutique.',
      intro: 'Le bon hébergeur dépend d\'abord de votre projet. Un blog, une boutique e-commerce et une application n\'ont pas les mêmes besoins. Voici comment décider sans vous fier au seul prix d\'appel.',
      sections: [
        { title: 'Définir son type de projet', content: 'Un site vitrine ou un blog fonctionne très bien sur un hébergement mutualisé abordable. Une boutique e-commerce a besoin de plus de ressources et de rapidité. Une application ou un projet à fort trafic demandera un VPS ou du cloud. Identifier ce besoin en premier évite de payer trop, ou trop peu.' },
        { title: 'La performance : uptime et TTFB', content: 'Deux chiffres comptent vraiment : la disponibilité (uptime), qui doit s\'approcher de 99,9 %, et le temps de réponse du serveur (TTFB). Un bon TTFB depuis votre zone de visiteurs améliore le référencement et l\'expérience utilisateur. Méfiez-vous des chiffres annoncés sans mesure indépendante.' },
        { title: 'Le support et les sauvegardes', content: 'Le jour où votre site tombe, la qualité du support fait toute la différence. Vérifiez la disponibilité, la langue et la réactivité réelle. Les sauvegardes automatiques, faciles à restaurer, sont un filet de sécurité indispensable, surtout pour une boutique.' },
        { title: 'Le prix de renouvellement, le vrai piège', content: 'La plupart des hébergeurs affichent un prix de première année très bas, puis multiplient le tarif au renouvellement. Comparez toujours le prix à long terme, pas seulement l\'offre d\'appel. Vérifiez aussi les frais cachés et les conditions de remboursement.' },
        { title: 'Comparer et se décider', content: 'Nous évaluons les hébergeurs sur l\'uptime mesuré, le TTFB, le support testé, les fonctionnalités et le prix réel. Pour trouver rapidement l\'hébergeur adapté à votre projet, notre quiz vous propose une recommandation personnalisée en une minute.' },
      ],
      faq: [
        { q: 'Mutualisé ou VPS ?', a: 'Le mutualisé suffit pour un blog ou un site vitrine à trafic modéré. Le VPS devient pertinent dès que vous avez besoin de ressources dédiées, de plus de contrôle ou d\'encaisser un trafic important.' },
        { q: 'L\'hébergement « illimité » existe-t-il vraiment ?', a: 'Non, il y a toujours des limites techniques (processeur, mémoire, requêtes) même quand l\'espace disque est présenté comme illimité. Lisez les conditions d\'usage acceptable.' },
        { q: 'Faut-il un hébergeur français ?', a: 'Un hébergeur proche de vos visiteurs améliore le TTFB, et un support en français facilite la gestion. Ce n\'est pas obligatoire, mais souvent confortable pour un public francophone.' },
      ],
    },
    en: {
      category: 'Hosting',
      title: 'How to choose a web host in 2026',
      excerpt: 'Uptime, TTFB, support, backups, renewal price: the guide to choosing a host based on your project, from a blog to an online store.',
      intro: 'The right host depends first on your project. A blog, an e-commerce store and an application do not have the same needs. Here is how to decide without relying on the introductory price alone.',
      sections: [
        { title: 'Define your type of project', content: 'A showcase site or a blog runs very well on affordable shared hosting. An e-commerce store needs more resources and speed. An application or a high-traffic project will require a VPS or cloud hosting. Identifying this need first prevents you from paying too much, or too little.' },
        { title: 'Performance: uptime and TTFB', content: 'Two numbers really matter: availability (uptime), which should approach 99.9%, and the server response time (TTFB). A good TTFB from your visitors\' region improves SEO and user experience. Be wary of figures advertised without independent measurement.' },
        { title: 'Support and backups', content: 'The day your site goes down, the quality of support makes all the difference. Check availability, language and real responsiveness. Automatic backups that are easy to restore are an essential safety net, especially for a store.' },
        { title: 'Renewal price, the real trap', content: 'Most hosts advertise a very low first-year price, then multiply the rate at renewal. Always compare the long-term price, not just the introductory offer. Also check for hidden fees and refund conditions.' },
        { title: 'Compare and decide', content: 'We rate hosts on measured uptime, TTFB, tested support, features and the real price. To quickly find the host suited to your project, our quiz offers a personalized recommendation in one minute.' },
      ],
      faq: [
        { q: 'Shared hosting or VPS?', a: 'Shared hosting is enough for a blog or a showcase site with moderate traffic. A VPS becomes relevant as soon as you need dedicated resources, more control or the ability to handle significant traffic.' },
        { q: 'Does "unlimited" hosting really exist?', a: 'No, there are always technical limits (CPU, memory, requests) even when disk space is presented as unlimited. Read the acceptable-use terms.' },
        { q: 'Do I need a local host?', a: 'A host close to your visitors improves TTFB, and support in your language makes management easier. It is not mandatory, but often convenient for a local audience.' },
      ],
    },
  },
  {
    slug: 'comment-choisir-antivirus-2026',
    emoji: '🦠',
    catKey: 'Antivirus',
    catColor: CAT_COLOR.Antivirus,
    date: '6 juil. 2026',
    dateEn: 'Jul 6, 2026',
    readTime: '7 min',
    featured: false,
    published: '2026-07-06',
    modified: '2026-07-06',
    fr: {
      category: 'Antivirus',
      title: 'Comment choisir un antivirus en 2026',
      excerpt: 'Taux de détection, impact système, faux positifs, fonctionnalités : comment choisir un antivirus efficace sans ralentir votre machine.',
      intro: 'Un antivirus doit protéger sans transformer votre ordinateur en escargot. Voici les critères objectifs pour choisir, et pourquoi le gratuit peut suffire dans certains cas mais pas dans d\'autres.',
      sections: [
        { title: 'Le taux de détection', content: 'C\'est le cœur du sujet. Appuyez-vous sur les résultats des laboratoires indépendants de référence comme AV-TEST et AV-Comparatives, qui testent la protection contre des menaces réelles chaque mois. Un antivirus doit afficher des scores élevés et réguliers dans le temps, pas seulement une bonne note ponctuelle.' },
        { title: 'L\'impact sur les performances', content: 'Une bonne protection ne doit pas plomber votre machine. Les mêmes laboratoires mesurent le ralentissement au démarrage, à l\'ouverture d\'applications et pendant un scan. Sur un ordinateur ancien, ce critère devient aussi important que la détection elle-même.' },
        { title: 'Les faux positifs', content: 'Un antivirus trop zélé qui bloque des logiciels légitimes est pénible et peut vous pousser à désactiver la protection. Vérifiez le nombre de faux positifs relevé par les tests indépendants : un bon produit trouve l\'équilibre entre vigilance et tranquillité.' },
        { title: 'Les fonctionnalités et le prix', content: 'Au-delà de l\'antivirus, les suites ajoutent pare-feu, protection anti-phishing, VPN ou gestionnaire de mots de passe. Ces options ont de la valeur si vous les utilisez vraiment. Comparez le périmètre réel de chaque formule et le prix au renouvellement, souvent plus élevé que la première année.' },
        { title: 'Gratuit ou payant, et ensuite', content: 'Pour un usage basique et prudent, un antivirus gratuit sérieux couplé à de bonnes habitudes peut suffire. Pour des données sensibles, une famille ou une petite entreprise, une suite payante apporte une protection plus complète. Notre quiz vous aide à trancher selon vos appareils et votre budget.' },
      ],
      faq: [
        { q: 'Windows Defender suffit-il ?', a: 'Il offre une protection de base désormais correcte pour un usage prudent. Pour une protection avancée, des modules anti-ransomware, un VPN ou un contrôle parental, une suite dédiée reste supérieure.' },
        { q: 'Un antivirus ralentit-il le PC ?', a: 'Les bons produits ont un impact minime au quotidien. Le ralentissement se ressent surtout pendant les scans complets, que l\'on peut planifier la nuit.' },
        { q: 'Faut-il un antivirus sur Mac ?', a: 'macOS est plutôt bien protégé, mais pas immunisé, notamment contre le phishing et les logiciels indésirables. Un antivirus léger apporte une couche de sécurité utile selon votre usage.' },
      ],
    },
    en: {
      category: 'Antivirus',
      title: 'How to choose an antivirus in 2026',
      excerpt: 'Detection rate, system impact, false positives, features: how to choose an effective antivirus without slowing down your machine.',
      intro: 'An antivirus should protect you without turning your computer into a snail. Here are the objective criteria for choosing, and why free can be enough in some cases but not others.',
      sections: [
        { title: 'The detection rate', content: 'This is the heart of the matter. Rely on the results of leading independent labs like AV-TEST and AV-Comparatives, which test protection against real threats every month. An antivirus should show high, consistent scores over time, not just a one-off good grade.' },
        { title: 'Impact on performance', content: 'Good protection should not bog down your machine. The same labs measure the slowdown at startup, when opening applications and during a scan. On an older computer, this criterion becomes as important as detection itself.' },
        { title: 'False positives', content: 'An overzealous antivirus that blocks legitimate software is annoying and may push you to disable protection. Check the number of false positives reported by independent tests: a good product balances vigilance and peace of mind.' },
        { title: 'Features and price', content: 'Beyond the antivirus, suites add a firewall, anti-phishing protection, a VPN or a password manager. These options are worth it if you actually use them. Compare the real scope of each plan and the renewal price, often higher than the first year.' },
        { title: 'Free or paid, and then what', content: 'For basic, careful use, a reputable free antivirus combined with good habits can be enough. For sensitive data, a family or a small business, a paid suite provides more complete protection. Our quiz helps you decide based on your devices and budget.' },
      ],
      faq: [
        { q: 'Is Windows Defender enough?', a: 'It now offers decent baseline protection for careful use. For advanced protection, anti-ransomware modules, a VPN or parental controls, a dedicated suite remains superior.' },
        { q: 'Does an antivirus slow down the PC?', a: 'Good products have minimal day-to-day impact. Slowdown is mainly felt during full scans, which can be scheduled at night.' },
        { q: 'Do I need an antivirus on Mac?', a: 'macOS is fairly well protected, but not immune, especially against phishing and unwanted software. A lightweight antivirus adds a useful layer of security depending on your usage.' },
      ],
    },
  },
  {
    slug: 'comment-choisir-outil-ia-2026',
    emoji: '🤖',
    catKey: 'IA',
    catColor: CAT_COLOR.IA,
    date: '6 juil. 2026',
    dateEn: 'Jul 6, 2026',
    readTime: '8 min',
    featured: false,
    published: '2026-07-06',
    modified: '2026-07-06',
    fr: {
      category: 'IA',
      title: 'Comment choisir un outil IA en 2026',
      excerpt: 'Qualité des résultats, confidentialité des données, tarifs, intégrations : la méthode pour choisir le bon outil IA selon votre usage réel.',
      intro: 'Il existe désormais un outil IA pour presque tout. Le vrai enjeu n\'est plus de trouver un outil, mais de choisir celui qui convient à votre usage, votre budget et vos exigences de confidentialité.',
      sections: [
        { title: 'Partir de la tâche, pas de la marque', content: 'Un excellent outil de rédaction n\'est pas forcément bon pour l\'image ou le code. Définissez d\'abord votre besoin principal : écrire, générer des visuels, coder, analyser, gérer des projets. Un outil spécialisé bat souvent un généraliste sur son terrain.' },
        { title: 'Tester la qualité sur vos exemples', content: 'Ne vous fiez pas aux démos parfaites. Prenez un même exemple représentatif de votre travail et testez-le sur deux ou trois outils. La régularité des résultats compte autant que le meilleur résultat obtenu une fois.' },
        { title: 'La confidentialité des données', content: 'Point souvent négligé : vos données servent-elles à entraîner le modèle ? Existe-t-il une option pour refuser ? Où sont hébergées les données ? Pour un usage professionnel ou sensible, ces réponses sont décisives et doivent être claires.' },
        { title: 'Tarifs, limites et intégrations', content: 'Comparez les quotas réels (requêtes, générations, tokens), pas seulement le prix. Vérifiez ce que l\'offre gratuite permet vraiment et si l\'outil s\'intègre à vos applications via une API ou des connecteurs. Un outil isolé ralentit votre flux de travail.' },
        { title: 'Trouver le bon outil rapidement', content: 'Nous évaluons les outils IA sur la qualité, le prix, la confidentialité, les intégrations et la prise en main. Pour identifier celui qui correspond à votre tâche, notre quiz vous propose une recommandation en une minute, avec des alternatives.' },
      ],
      faq: [
        { q: 'Un seul outil IA peut-il tout faire ?', a: 'Un généraliste suffit pour démarrer et couvrir des besoins variés, mais pour un usage exigeant (image, vidéo, code, voix), un outil spécialisé donne généralement de meilleurs résultats.' },
        { q: 'Les données sont-elles confidentielles ?', a: 'Cela dépend de l\'outil et de votre formule. Vérifiez la politique d\'entraînement, l\'option de refus (opt-out) et la localisation des données avant de traiter des informations sensibles.' },
        { q: 'Le gratuit suffit-il ?', a: 'Pour tester ou un usage ponctuel, souvent oui. Les offres payantes apportent plus de contexte, de vitesse, de quotas et parfois de meilleures garanties de confidentialité.' },
      ],
    },
    en: {
      category: 'AI',
      title: 'How to choose an AI tool in 2026',
      excerpt: 'Output quality, data privacy, pricing, integrations: the method to choose the right AI tool based on your real use case.',
      intro: 'There is now an AI tool for almost everything. The real challenge is no longer finding a tool, but choosing the one that fits your use case, budget and privacy requirements.',
      sections: [
        { title: 'Start from the task, not the brand', content: 'An excellent writing tool is not necessarily good for images or code. First define your main need: writing, generating visuals, coding, analyzing, managing projects. A specialized tool often beats a generalist on its home turf.' },
        { title: 'Test quality on your own examples', content: 'Do not trust polished demos. Take a single example representative of your work and test it across two or three tools. Consistency of results matters as much as the best result obtained once.' },
        { title: 'Data privacy', content: 'An often-overlooked point: is your data used to train the model? Is there an opt-out? Where is the data stored? For professional or sensitive use, these answers are decisive and should be clear.' },
        { title: 'Pricing, limits and integrations', content: 'Compare real quotas (requests, generations, tokens), not just the price. Check what the free plan really allows and whether the tool integrates with your apps via an API or connectors. An isolated tool slows down your workflow.' },
        { title: 'Find the right tool quickly', content: 'We rate AI tools on quality, price, privacy, integrations and ease of use. To identify the one that matches your task, our quiz offers a recommendation in one minute, with alternatives.' },
      ],
      faq: [
        { q: 'Can a single AI tool do everything?', a: 'A generalist is enough to get started and cover varied needs, but for demanding use (image, video, code, voice), a specialized tool generally delivers better results.' },
        { q: 'Is the data confidential?', a: 'It depends on the tool and your plan. Check the training policy, the opt-out option and data location before processing sensitive information.' },
        { q: 'Is the free tier enough?', a: 'For testing or occasional use, often yes. Paid plans provide more context, speed, quotas and sometimes stronger privacy guarantees.' },
      ],
    },
  },
  {
    slug: 'gestionnaire-mots-de-passe-guide-2026',
    emoji: '🔑',
    catKey: 'Cyber',
    catColor: CAT_COLOR.Cyber,
    date: '6 juil. 2026',
    dateEn: 'Jul 6, 2026',
    readTime: '6 min',
    featured: false,
    published: '2026-07-06',
    modified: '2026-07-06',
    fr: {
      category: 'Cybersécurité',
      title: 'Gestionnaire de mots de passe : pourquoi et comment en 2026',
      excerpt: 'Pourquoi un gestionnaire de mots de passe est le geste de sécurité le plus rentable, et comment en choisir un fiable sans risque.',
      intro: 'La réutilisation des mots de passe est la première cause de piratage de comptes. Un gestionnaire de mots de passe règle ce problème en une fois. Voici pourquoi il est indispensable et comment en choisir un.',
      sections: [
        { title: 'Le problème que ça résout', content: 'Retenir un mot de passe unique et complexe pour chaque site est impossible humainement. Résultat : on réutilise les mêmes, et une seule fuite compromet des dizaines de comptes. Un gestionnaire génère et retient des mots de passe forts à votre place, derrière un seul mot de passe maître.' },
        { title: 'Le chiffrement et l\'architecture zero-knowledge', content: 'Un bon gestionnaire chiffre vos données localement avec une architecture dite « zero-knowledge » : même l\'éditeur ne peut pas lire vos mots de passe. Vérifiez le chiffrement utilisé (AES-256 est un standard) et l\'existence d\'audits de sécurité indépendants.' },
        { title: 'Les fonctionnalités qui comptent', content: 'La synchronisation entre appareils, le remplissage automatique, l\'alerte en cas de fuite connue et le partage sécurisé sont les fonctions les plus utiles. La double authentification pour protéger le coffre lui-même est fortement recommandée.' },
        { title: 'Gratuit, payant ou open source', content: 'Plusieurs gestionnaires gratuits sérieux existent, parfois open source, ce qui permet un audit public du code. Les offres payantes ajoutent le partage familial, un stockage sécurisé et un support. Choisissez selon votre besoin de partage et de multi-appareils.' },
        { title: 'Passer à l\'action', content: 'Le meilleur gestionnaire est celui que vous utiliserez vraiment. Commencez par migrer vos comptes les plus sensibles (email, banque). Notre quiz cybersécurité vous oriente vers l\'outil adapté à votre profil, particulier ou équipe.' },
      ],
      faq: [
        { q: 'Est-ce risqué de tout mettre au même endroit ?', a: 'Le coffre est chiffré et protégé par votre mot de passe maître et idéalement une double authentification. Le risque de réutiliser des mots de passe faibles partout est bien plus grand que celui d\'un gestionnaire sérieux.' },
        { q: 'Que se passe-t-il si j\'oublie le mot de passe maître ?', a: 'Avec une architecture zero-knowledge, l\'éditeur ne peut pas le récupérer. Certains proposent des options de récupération : configurez-les dès le départ et notez votre mot de passe maître en lieu sûr.' },
        { q: 'Le gestionnaire du navigateur suffit-il ?', a: 'Il dépanne, mais un gestionnaire dédié offre un meilleur chiffrement, la synchronisation multiplateforme, l\'alerte aux fuites et le partage sécurisé.' },
      ],
    },
    en: {
      category: 'Cybersecurity',
      title: 'Password managers: why and how in 2026',
      excerpt: 'Why a password manager is the most cost-effective security step, and how to choose a reliable one safely.',
      intro: 'Password reuse is the number-one cause of account hacking. A password manager solves this problem in one move. Here is why it is essential and how to choose one.',
      sections: [
        { title: 'The problem it solves', content: 'Remembering a unique, complex password for every site is humanly impossible. As a result, people reuse the same ones, and a single leak compromises dozens of accounts. A manager generates and remembers strong passwords for you, behind a single master password.' },
        { title: 'Encryption and zero-knowledge architecture', content: 'A good manager encrypts your data locally with a so-called "zero-knowledge" architecture: even the vendor cannot read your passwords. Check the encryption used (AES-256 is a standard) and the existence of independent security audits.' },
        { title: 'The features that matter', content: 'Cross-device sync, autofill, breach alerts for known leaks and secure sharing are the most useful features. Two-factor authentication to protect the vault itself is strongly recommended.' },
        { title: 'Free, paid or open source', content: 'Several reputable free managers exist, some open source, which allows a public audit of the code. Paid plans add family sharing, secure storage and support. Choose based on your need for sharing and multiple devices.' },
        { title: 'Taking action', content: 'The best manager is the one you will actually use. Start by migrating your most sensitive accounts (email, banking). Our cybersecurity quiz points you to the tool suited to your profile, individual or team.' },
      ],
      faq: [
        { q: 'Is it risky to put everything in one place?', a: 'The vault is encrypted and protected by your master password and ideally two-factor authentication. The risk of reusing weak passwords everywhere is far greater than that of a reputable manager.' },
        { q: 'What happens if I forget the master password?', a: 'With a zero-knowledge architecture, the vendor cannot recover it. Some offer recovery options: set them up from the start and store your master password safely.' },
        { q: 'Is the browser\'s manager enough?', a: 'It helps, but a dedicated manager offers stronger encryption, cross-platform sync, breach alerts and secure sharing.' },
      ],
    },
  },
  {
    slug: 'vpn-gratuit-ou-payant-2026',
    emoji: '💸',
    catKey: 'VPN',
    catColor: CAT_COLOR.VPN,
    date: '6 juil. 2026',
    dateEn: 'Jul 6, 2026',
    readTime: '6 min',
    featured: false,
    published: '2026-07-06',
    modified: '2026-07-06',
    fr: {
      category: 'VPN',
      title: 'VPN gratuit ou payant : que choisir en 2026 ?',
      excerpt: 'Ce que cache un VPN gratuit, quand il suffit, et quand un abonnement payant devient indispensable. Comparaison honnête.',
      intro: 'Un VPN gratuit est tentant, mais « gratuit » a souvent un coût caché. Voici comment distinguer un VPN gratuit acceptable d\'un service à fuir, et quand payer en vaut vraiment la peine.',
      sections: [
        { title: 'Le vrai coût du gratuit', content: 'Faire tourner une infrastructure VPN coûte cher. Un service gratuit doit se financer autrement : publicité, limites de données, revente de données de navigation dans les pires cas. Un VPN gratuit sérieux se reconnaît à sa transparence et au fait qu\'il propose aussi une offre payante.' },
        { title: 'Les limites courantes du gratuit', content: 'Quota de données mensuel, choix de serveurs réduit, vitesses bridées, streaming rarement débloqué : le gratuit convient pour un usage ponctuel comme sécuriser une connexion Wi-Fi publique de temps en temps, mais montre vite ses limites.' },
        { title: 'Quand le payant s\'impose', content: 'Pour le streaming, le téléchargement, un usage quotidien, ou dès que la confidentialité est un vrai enjeu, un abonnement payant apporte vitesse, serveurs, fonctionnalités de sécurité et une politique no-log crédible, souvent auditée. Les tarifs deviennent raisonnables sur les engagements longs.' },
        { title: 'Bien choisir dans les deux cas', content: 'Gratuit ou payant, appliquez les mêmes critères : politique de logs, juridiction, présence d\'un kill switch. La plupart des bons VPN payants offrent une garantie de remboursement : c\'est l\'occasion de tester sans risque. Notre quiz vous aide à décider selon votre budget et votre usage.' },
      ],
      faq: [
        { q: 'Un VPN gratuit est-il dangereux ?', a: 'Pas nécessairement, mais certains gratuits douteux journalisent ou revendent vos données. Restez sur des noms connus qui proposent aussi une offre payante et une politique claire.' },
        { q: 'Peut-on regarder Netflix avec un VPN gratuit ?', a: 'Rarement de façon fiable. Le déblocage streaming demande des serveurs constamment renouvelés, ce que le gratuit ne peut généralement pas maintenir.' },
        { q: 'Combien coûte un bon VPN payant ?', a: 'Sur un engagement long, les meilleurs VPN reviennent souvent à quelques euros par mois. Comparez toujours le prix au renouvellement, pas seulement l\'offre de départ.' },
      ],
    },
    en: {
      category: 'VPN',
      title: 'Free vs paid VPN: which to choose in 2026?',
      excerpt: 'What a free VPN hides, when it is enough, and when a paid subscription becomes essential. An honest comparison.',
      intro: 'A free VPN is tempting, but "free" often has a hidden cost. Here is how to tell an acceptable free VPN from a service to avoid, and when paying is truly worth it.',
      sections: [
        { title: 'The real cost of free', content: 'Running a VPN infrastructure is expensive. A free service has to fund itself another way: advertising, data caps, and in the worst cases reselling browsing data. A reputable free VPN is recognizable by its transparency and the fact that it also offers a paid plan.' },
        { title: 'The common limits of free', content: 'Monthly data cap, reduced server choice, throttled speeds, streaming rarely unblocked: free is fine for occasional use like securing a public Wi-Fi connection now and then, but quickly shows its limits.' },
        { title: 'When paid becomes necessary', content: 'For streaming, downloading, daily use, or whenever privacy is a real concern, a paid subscription brings speed, servers, security features and a credible, often audited no-log policy. Prices become reasonable on longer commitments.' },
        { title: 'Choosing well in both cases', content: 'Free or paid, apply the same criteria: logging policy, jurisdiction, presence of a kill switch. Most good paid VPNs offer a money-back guarantee: use it to test risk-free. Our quiz helps you decide based on your budget and use case.' },
      ],
      faq: [
        { q: 'Is a free VPN dangerous?', a: 'Not necessarily, but some shady free VPNs log or resell your data. Stick to well-known names that also offer a paid plan and a clear policy.' },
        { q: 'Can you watch Netflix with a free VPN?', a: 'Rarely in a reliable way. Streaming unblocking requires constantly refreshed servers, which free services generally cannot maintain.' },
        { q: 'How much does a good paid VPN cost?', a: 'On a long commitment, the best VPNs often come to a few euros per month. Always compare the renewal price, not just the introductory offer.' },
      ],
    },
  },
];

const CAT_LABEL_EN = { VPN: 'VPN', 'Hébergement': 'Hosting', Antivirus: 'Antivirus', IA: 'AI', 'Cybersécurité': 'Cybersecurity' };

/** Article complet localisé (corps) pour pages/blog/[slug].js */
export function getNewArticle(slug, locale) {
  const a = NEW_BLOG.find(x => x.slug === slug);
  if (!a) return null;
  const loc = (locale === 'en' ? a.en : a.fr);
  return {
    category: loc.category,
    catColor: a.catColor,
    date: locale === 'en' ? a.dateEn : a.date,
    readTime: a.readTime,
    emoji: a.emoji,
    title: loc.title,
    intro: loc.intro,
    sections: loc.sections,
    faq: loc.faq,
    published: a.published,
    modified: a.modified,
  };
}

/** Entrées pour la liste du blog (pages/blog/index.js), localisées. */
export function getNewArticleCards(locale) {
  return NEW_BLOG.map(a => {
    const loc = locale === 'en' ? a.en : a.fr;
    return {
      slug: a.slug,
      category: loc.category,
      catColor: a.catColor,
      date: locale === 'en' ? a.dateEn : a.date,
      readTime: a.readTime,
      title: loc.title,
      excerpt: loc.excerpt,
      emoji: a.emoji,
      featured: a.featured,
    };
  });
}

export const NEW_BLOG_SLUGS = NEW_BLOG.map(a => a.slug);
