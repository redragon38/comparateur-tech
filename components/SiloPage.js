import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import SEO, { buildBreadcrumbSchema, buildFAQSchema, buildWebPageSchema } from './SEO';
import { ArrowRight } from 'lucide-react';
import SeoInternalLinks from './SeoInternalLinks';
import { SILO_SEO_LINK_GROUPS } from '../lib/seo-internal-link-groups';
import { useLocale } from '../lib/i18n';

const SILO_T = {
  fr: { home: 'Accueil', related: 'Comparatifs et guides associés', faqTitle: 'Questions fréquentes' },
  en: { home: 'Home', related: 'Related comparisons and guides', faqTitle: 'Frequently asked questions' },
};

export default function SiloPage({ page }) {
  const t = SILO_T[useLocale()] || SILO_T.fr;
  const seoGroups = SILO_SEO_LINK_GROUPS[page.canonical.replace('/', '')] || [];
  const structuredData = [
    buildBreadcrumbSchema([
      { name: t.home, url: '/' },
      { name: page.title },
    ]),
    buildWebPageSchema({
      name: page.title,
      description: page.description,
      url: page.canonical,
    }),
    buildFAQSchema(page.faq),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={page.metaTitle}
        description={page.description}
        canonical={`https://comparateur-tech.com${page.canonical}`}
        structuredData={structuredData}
      />
      <Header />
      <main>
        <section className="border-b border-purple-100 bg-gradient-to-b from-purple-50 to-white py-14 sm:py-20">
          <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6">
            <span className="mb-6 inline-block rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
              {page.eyebrow}
            </span>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
              {page.title}
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={page.primaryCta.href} className="gradient-purple inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-md shadow-purple-300/40">
                {page.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={page.secondaryCta.href} className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-purple-300 hover:text-purple-700">
                {page.secondaryCta.label}
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
          <section className="grid gap-4 md:grid-cols-3">
            {page.sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-xl font-bold text-gray-900">{section.title}</h2>
                <p className="text-sm leading-relaxed text-gray-600">{section.text}</p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">{t.related}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {page.links.map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50 p-4 font-semibold text-purple-800 transition-colors hover:bg-purple-100">
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          <SeoInternalLinks groups={seoGroups} />

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">{t.faqTitle}</h2>
            <div className="space-y-3">
              {page.faq.map((item) => (
                <div key={item.q} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-2 font-bold text-gray-900">{item.q}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
