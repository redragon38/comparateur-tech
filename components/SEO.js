import Head from 'next/head';

const SITE_NAME = 'Comparateur-Tech';
const BASE_URL  = 'https://comparateur-tech.com';

export default function SEO({
  title = `${SITE_NAME} — Les Meilleurs Outils IA, VPN, Cybersécurité & Hébergement Web`,
  description = "Découvrez et comparez les meilleurs outils IA, VPN, cybersécurité, hébergements web et antivirus. Sélection vérifiée et mise à jour par nos experts.",
  canonical = `${BASE_URL}/`,
  ogImage = `${BASE_URL}/og-image.png`,
  ogImageAlt = title,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = null,
  noindex = false,
  nofollow = false,
  author = SITE_NAME,
  structuredData = null,
  datePublished = null,
  dateModified = null,
  articleSection = null,
}) {
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1',
  ].join(',');
  const schemas = structuredData
    ? (Array.isArray(structuredData) ? structuredData : [structuredData])
    : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      {datePublished && <meta property="article:published_time" content={datePublished} />}
      {dateModified  && <meta property="article:modified_time"  content={dateModified}  />}
      {articleSection && <meta property="article:section" content={articleSection} />}

      <link rel="canonical" href={canonical} />
      <meta name="robots"    content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      <meta property="og:type"         content={ogType} />
      <meta property="og:url"          content={canonical} />
      <meta property="og:title"        content={title} />
      <meta property="og:description"  content={description} />
      <meta property="og:image"        content={ogImage} />
      <meta property="og:image:alt"    content={ogImageAlt} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name"    content={SITE_NAME} />
      <meta property="og:locale"       content="fr_FR" />

      <meta name="twitter:card"        content={twitterCard} />
      <meta name="twitter:url"         content={canonical} />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
      <meta name="twitter:image:alt"   content={ogImageAlt} />
      <meta name="twitter:site"        content="@ComparateurTech" />

      <link rel="shortcut icon"   href="/favicon.ico" />
      <link rel="icon" type="image/x-icon"  href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      <meta name="theme-color"             content="#7c3aed" />
      <meta name="msapplication-TileColor" content="#7c3aed" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}

/* ── Helpers Schema.org ─────────────────────────────────────────────── */

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `${BASE_URL}${item.url}` } : {}),
    })),
  };
}

export function buildFAQSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function buildArticleSchema({ title, description, url, datePublished, dateModified, image, section }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE_URL}${url}`,
    datePublished,
    dateModified: dateModified || datePublished,
    image: image || `${BASE_URL}/og-image.png`,
    articleSection: section || 'Guides',
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
        width: 200,
        height: 60,
      },
    },
  };
}

export function buildItemListSchema({ name, description, items }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description ? { description } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/tool/${tool.id}`,
      name: tool.name,
    })),
  };
}

function stripMarkdown(text) {
  return String(text || '')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeForMatch(text) {
  return stripMarkdown(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function normalizeDate(date) {
  if (!date) return '2025-01-01';
  const value = String(date);
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : value;
}

function getSoftwareApplicationCategory(tool) {
  const haystack = normalizeForMatch([
    tool.id,
    tool.name,
    ...(tool.categories || []),
    ...(tool.tags || []),
  ].filter(Boolean).join(' '));

  if (/(vpn|antivirus|cyber|securite|password|mot de passe|auth|siem|pare-feu|firewall|malware|pentest|vulnerabilite)/.test(haystack)) {
    return 'SecurityApplication';
  }
  if (/(api|code|coding|developer|developpeur|copilot|cursor|github|openai|anthropic|cohere)/.test(haystack)) {
    return 'DeveloperApplication';
  }
  if (/(hebergement|hosting|cloud|server|serveur|cdn|webflow|wordpress|netlify|supabase|aws)/.test(haystack)) {
    return 'UtilitiesApplication';
  }
  if (/(image|video|audio|musique|midjourney|dall|runway|sora|suno|elevenlabs|firefly|canva|descript|synthesia|heygen)/.test(haystack)) {
    return 'MultimediaApplication';
  }
  return 'BusinessApplication';
}

function buildOffer(tool) {
  if (typeof tool.priceMonthly === 'number') {
    return {
      '@type': 'Offer',
      price: Math.max(tool.priceMonthly, 0),
      priceCurrency: tool.priceCurrency || 'EUR',
      availability: 'https://schema.org/InStock',
      url: tool.affiliateUrl || tool.website || `${BASE_URL}/tool/${tool.id}`,
    };
  }

  const priceLabel = normalizeForMatch(`${tool.price || ''} ${tool.short || ''} ${tool.highlight || ''}`);
  if (/\b(gratuit|free|open source)\b/.test(priceLabel)) {
    return {
      '@type': 'Offer',
      price: 0,
      priceCurrency: tool.priceCurrency || 'EUR',
      availability: 'https://schema.org/InStock',
      url: tool.affiliateUrl || tool.website || `${BASE_URL}/tool/${tool.id}`,
    };
  }

  return null;
}

export function buildSoftwareSchema(tool) {
  const verdictClean = stripMarkdown(tool.verdict);
  const offer = buildOffer(tool);
  if (!offer) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: stripMarkdown(tool.short || tool.highlight || tool.description),
    applicationCategory: getSoftwareApplicationCategory(tool),
    operatingSystem: 'Web',
    url: `${BASE_URL}/tool/${tool.id}`,
    ...(tool.logo ? { image: `${BASE_URL}${tool.logo}` } : {}),
    ...(tool.website ? { sameAs: tool.website } : {}),
    ...(tool.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.rating.value,
        ratingCount: tool.rating.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(verdictClean && tool.rating && {
      review: {
        '@type': 'Review',
        name: `Avis ${tool.name} par Comparateur-Tech`,
        reviewBody: verdictClean,
        datePublished: normalizeDate(tool.updatedAt || tool.createdAt),
        author: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: BASE_URL,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: tool.rating.value,
          bestRating: 5,
          worstRating: 1,
        },
      },
    }),
    ...(offer ? { offers: offer } : {}),
  };
}
