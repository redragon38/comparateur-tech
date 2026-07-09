import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ExternalLink, Monitor, PlayCircle, Shield, Sparkles, Youtube, Zap } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO, { buildBreadcrumbSchema } from '../../components/SEO';
import { getPartnerBySlug } from '../../lib/partners';

const partner = getPartnerBySlug('tekno-junk');
const BASE_URL = 'https://comparateur-tech.com';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-4">
      <Icon className="w-5 h-5 text-red-300 mb-2" />
      <p className="text-xs uppercase tracking-[0.18em] text-white/55 font-bold mb-1">{label}</p>
      <p className="text-white font-extrabold text-sm">{value}</p>
    </div>
  );
}

function InfoSection({ title, children }) {
  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
      <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function TeknoJunkPartnerPage() {
  const canonical = `${BASE_URL}${partner.detailUrl}`;
  const thumbnail = `https://img.youtube.com/vi/${partner.videoId}/hqdefault.jpg`;
  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Partenaires', url: '/partenaires' },
      { name: partner.name, url: partner.detailUrl },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: `${partner.name}, partenaire Comparateur-Tech`,
      description: partner.description,
      url: canonical,
      mainEntity: {
        '@type': 'Organization',
        name: partner.name,
        url: partner.channelUrl,
        sameAs: [partner.channelUrl, partner.videoUrl],
        image: `${BASE_URL}${partner.logo}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: partner.videoTitle,
      description: partner.description,
      thumbnailUrl: [thumbnail],
      uploadDate: '2026-05-21',
      embedUrl: partner.embedUrl,
      contentUrl: partner.videoUrl,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Tekno Junk, Partenaire YouTube tech | Comparateur-Tech"
        description="Découvrez la fiche partenaire Tekno Junk : chaîne YouTube tech, vidéo mise en avant, thématiques, points forts et liens officiels."
        canonical={canonical}
        ogImage={thumbnail}
        ogType="profile"
        structuredData={structuredData}
      />
      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 text-white">
          <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at top right, #ef4444, transparent 32%), radial-gradient(circle at bottom left, #8b5cf6, transparent 30%)' }} />
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
            <Link href="/partenaires" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Retour aux partenaires
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold mb-5">
                  <Youtube className="w-4 h-4 text-red-300" />
                  {partner.badge}
                </div>

                <h1 className="text-4xl sm:text-6xl font-black leading-tight mb-5">
                  {partner.name}
                  <span className="block text-red-300">fiche partenaire</span>
                </h1>
                <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-2xl mb-8">
                  {partner.longDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <a
                    href={partner.videoUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-4 rounded-2xl shadow-2xl shadow-red-950/30 transition-all"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Voir la vidéo
                  </a>
                  <a
                    href={partner.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-black px-6 py-4 rounded-2xl transition-all"
                  >
                    <Youtube className="w-5 h-5" />
                    Chaîne YouTube
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatCard icon={PlayCircle} label="Format" value="Vidéo tech" />
                  <StatCard icon={Shield} label="Statut" value="Partenaire vérifié" />
                  <StatCard icon={Sparkles} label="Univers" value="IA, PC, sécurité" />
                </div>
              </div>

              <aside className="bg-white rounded-[2rem] p-6 sm:p-8 border border-white/10 shadow-2xl text-gray-950">
                <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-red-100 shadow-lg flex items-center justify-center overflow-hidden mb-5">
                  <img src={partner.logo} alt={`Logo ${partner.name}`} className="w-full h-full object-contain p-3" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-2">{partner.label}</p>
                <h2 className="text-3xl font-black mb-3">{partner.name}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{partner.description}</p>

                <div className="space-y-3">
                  {partner.quickFacts.map((fact) => (
                    <div key={fact.label} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <span className="text-sm text-gray-500 font-semibold">{fact.label}</span>
                      <span className="text-sm text-gray-950 font-black text-right">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
              <div className="space-y-6">
                <InfoSection title="Présentation">
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    {partner.editorialVerdict}
                  </p>
                </InfoSection>

                <InfoSection title="Vidéo concernée">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 shadow-sm mb-4">
                    <iframe
                      src={partner.embedUrl}
                      title={partner.videoTitle}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={partner.videoUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-5 py-3 rounded-xl transition-all"
                    >
                      Ouvrir sur YouTube
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={partner.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-black px-5 py-3 rounded-xl transition-all"
                    >
                      Voir la chaîne
                      <Youtube className="w-4 h-4 text-red-500" />
                    </a>
                  </div>
                </InfoSection>

                <InfoSection title="Pourquoi cette chaîne est mise en avant">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {partner.highlights.map((highlight, index) => (
                      <div key={highlight} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black mb-3">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed font-semibold">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </InfoSection>
              </div>

              <aside className="lg:sticky lg:top-24 space-y-5">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-xl font-black text-gray-950 mb-4">À retenir</h2>
                  <div className="space-y-3">
                    {partner.strengths.map((strength) => (
                      <div key={strength} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </span>
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-xl font-black text-gray-950 mb-4">Thématiques</h2>
                  <div className="flex flex-wrap gap-2">
                    {partner.topics.map((topic) => (
                      <span key={topic} className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-700 text-xs font-bold">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-xl font-black text-gray-950 mb-4">Idéal pour</h2>
                  <div className="space-y-2">
                    {partner.idealFor.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                        <Zap className="w-4 h-4 text-red-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/partenaires" className="w-full inline-flex items-center justify-center gap-2 rounded-2xl gradient-purple text-white font-black px-5 py-4 shadow-lg shadow-purple-200 hover:-translate-y-0.5 transition-all">
                  Voir tous les partenaires
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
