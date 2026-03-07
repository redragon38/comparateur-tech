import Head from 'next/head';

export default function SEO({
  title = 'Thecreamai - Les Meilleurs Tools IA pour Créateurs & Entrepreneurs',
  description = 'Discover une sélection d\'outils IA triés sur le volet pour booster votre productivité, créativité et business. VPN, outils de design, marketing et bien plus.',
  canonical = 'https://thecreamai.com/',
  ogImage = 'https://thecreamai.com/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  nofollow = false,
  keywords = 'IA, Intelligence Artificielle, Tools IA, VPN, Hébergement web, Créateurs, Entrepreneurs',
  author = 'Thecreamai',
  structuredData = null,
}) {
  const fullTitle = title.includes('Thecreamai') ? title : `${title} | Thecreamai`;
  const robotsContent = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  return (
    <Head>
      {/* Titre et description */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Thecreamai" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicon et icônes - ORDRE IMPORTANT */}
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Thème mobile */}
      <meta name="theme-color" content="#7c3aed" />
      <meta name="msapplication-TileColor" content="#7c3aed" />

      {/* Viewport optimisé */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Données structurées JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Preconnect pour améliorer les performances */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    </Head>
  );
}
