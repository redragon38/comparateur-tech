import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Star } from 'lucide-react';
import { useT } from '../lib/i18n';

const AVATARS = [
  { initial: 'S', color: 'from-purple-600 to-pink-500' },
  { initial: 'T', color: 'from-blue-600 to-purple-600' },
  { initial: 'A', color: 'from-pink-600 to-purple-600' },
  { initial: 'M', color: 'from-emerald-600 to-teal-500' },
  { initial: 'J', color: 'from-yellow-600 to-orange-500' },
  { initial: 'R', color: 'from-cyan-600 to-blue-500' },
  { initial: 'L', color: 'from-rose-600 to-pink-500' },
  { initial: 'N', color: 'from-violet-600 to-purple-500' },
  { initial: 'C', color: 'from-orange-600 to-red-500' },
];

const CONTENT = {
  fr: {
    seoTitle: "Témoignages, Ce qu'en disent nos lecteurs | Comparateur-Tech",
    seoDescription: 'Découvrez les avis et témoignages de nos lecteurs sur Comparateur-Tech. Des entrepreneurs et créateurs qui ont trouvé les bons outils grâce à nos comparatifs.',
    badge: '💬 Témoignages',
    h1a: 'Ils nous font', h1b: 'confiance',
    intro: 'Des entrepreneurs et créateurs qui ont trouvé les bons outils grâce à Comparateur-Tech.',
    stats: [
      { number: '2 800+', label: 'Abonnés newsletter' },
      { number: '4.9/5', label: 'Note moyenne' },
      { number: '32+', label: 'Outils vérifiés' },
      { number: '4', label: 'Catégories' },
    ],
    ctaTitle: 'Vous aussi, trouvez votre outil idéal',
    ctaText: "Rejoignez des milliers d'utilisateurs satisfaits et découvrez les meilleures solutions pour votre activité.",
    ctaButton: 'Explorer les outils →',
    testimonials: [
      { role: 'Freelance Web Designer', stars: 5, text: "Grâce à Comparateur-Tech, j'ai trouvé le bon hébergeur en 10 minutes. Les comparatifs sont clairs et les avis fiables. Je ne perds plus des heures à chercher !", category: 'Hébergement web' },
      { role: 'Développeur & Digital Nomad', stars: 5, text: "Le meilleur site pour comparer les VPN. J'ai passé des heures ailleurs sans décision, ici en 5 min c'était réglé. NordVPN au final, parfait !", category: 'VPN' },
      { role: 'Créatrice de contenu', stars: 5, text: "J'utilise Comparateur-Tech comme référence avant chaque achat d'outil IA. La sélection est sérieuse et les notes honnêtes. Rien à redire !", category: 'IA' },
      { role: 'Entrepreneur & CEO', stars: 5, text: "J'ai découvert Hostinger ici et c'est devenu mon hébergeur de confiance. Le comparatif avec Kinsta était ultra clair. Merci !", category: 'Hébergement web' },
      { role: 'Marketing Manager', stars: 5, text: "La newsletter hebdomadaire est une pépite. Je reçois exactement les infos dont j'ai besoin sans être noyée. Vraiment top !", category: 'Newsletter' },
      { role: 'Consultant IT', stars: 5, text: "Pour choisir un antivirus entreprise, Comparateur-Tech m'a sauvé la mise. Bitdefender était clairement le meilleur rapport qualité-prix.", category: 'Antivirus' },
      { role: 'Photographe indépendante', stars: 4, text: "Interface intuitive, comparatifs bien faits. J'aurais aimé plus d'outils créatifs mais pour les catégories existantes c'est excellent.", category: 'IA' },
      { role: 'Développeur Full Stack', stars: 5, text: "Proton VPN trouvé en 3 minutes grâce au comparatif. Les badges 'Vérifié' et 'Essai gratuit' aident vraiment à décider rapidement.", category: 'VPN' },
      { role: 'Coach business', stars: 5, text: "Je recommande Comparateur-Tech à tous mes clients qui cherchent des outils. C'est devenu la référence pour moi quand je conseille.", category: 'IA' },
    ],
    names: ['Sarah M.', 'Thomas K.', 'Amélie R.', 'Marc D.', 'Julie F.', 'Romain B.', 'Léa V.', 'Nicolas P.', 'Camille T.'],
  },
  en: {
    seoTitle: 'Testimonials, What our readers say | Comparateur-Tech',
    seoDescription: 'Discover the reviews and testimonials from our readers on Comparateur-Tech. Entrepreneurs and creators who found the right tools thanks to our comparisons.',
    badge: '💬 Testimonials',
    h1a: 'They', h1b: 'trust us',
    intro: 'Entrepreneurs and creators who found the right tools thanks to Comparateur-Tech.',
    stats: [
      { number: '2,800+', label: 'Newsletter subscribers' },
      { number: '4.9/5', label: 'Average rating' },
      { number: '32+', label: 'Verified tools' },
      { number: '4', label: 'Categories' },
    ],
    ctaTitle: 'Find your ideal tool too',
    ctaText: 'Join thousands of satisfied users and discover the best solutions for your business.',
    ctaButton: 'Explore the tools →',
    testimonials: [
      { role: 'Freelance Web Designer', stars: 5, text: 'Thanks to Comparateur-Tech, I found the right web host in 10 minutes. The comparisons are clear and the reviews reliable. I no longer waste hours searching!', category: 'Web hosting' },
      { role: 'Developer & Digital Nomad', stars: 5, text: 'The best site to compare VPNs. I spent hours elsewhere without deciding, here it was settled in 5 minutes. NordVPN in the end, perfect!', category: 'VPN' },
      { role: 'Content creator', stars: 5, text: 'I use Comparateur-Tech as my reference before every AI tool purchase. The selection is serious and the ratings honest. Nothing to complain about!', category: 'AI' },
      { role: 'Entrepreneur & CEO', stars: 5, text: 'I discovered Hostinger here and it became my trusted host. The comparison with Kinsta was crystal clear. Thank you!', category: 'Web hosting' },
      { role: 'Marketing Manager', stars: 5, text: 'The weekly newsletter is a gem. I get exactly the info I need without being overwhelmed. Really great!', category: 'Newsletter' },
      { role: 'IT Consultant', stars: 5, text: 'To choose a business antivirus, Comparateur-Tech saved me. Bitdefender was clearly the best value for money.', category: 'Antivirus' },
      { role: 'Independent Photographer', stars: 4, text: 'Intuitive interface, well-made comparisons. I would have liked more creative tools, but for the existing categories it is excellent.', category: 'AI' },
      { role: 'Full Stack Developer', stars: 5, text: 'Found Proton VPN in 3 minutes thanks to the comparison. The "Verified" and "Free trial" badges really help decide quickly.', category: 'VPN' },
      { role: 'Business coach', stars: 5, text: 'I recommend Comparateur-Tech to all my clients looking for tools. It has become the reference for me when I advise them.', category: 'AI' },
    ],
    names: ['Sarah M.', 'Thomas K.', 'Amélie R.', 'Marc D.', 'Julie F.', 'Romain B.', 'Léa V.', 'Nicolas P.', 'Camille T.'],
  },
};

export default function TemoignagesPage() {
  const t = useT(CONTENT);

  return (
    <div className="min-h-screen">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/temoignages"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-24 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <span className="inline-block bg-purple-900/30 border border-purple-500/30 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {t.badge}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
              {t.h1a}<br />
              <span className="text-gray-900">{t.h1b}</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-lg mx-auto">
              {t.intro}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 pb-24">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {t.stats.map((s, i) => (
              <div key={i} className="gradient-card rounded-2xl p-6 text-center">
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{s.number}</div>
                <div className="text-gray-600 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Grille témoignages */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5 mb-16">
            {t.testimonials.map((item, i) => (
              <div key={i} className="break-inside-avoid gradient-card rounded-2xl p-6 hover:-translate-y-1 hover:border-purple-500/50 transition-all inline-block w-full">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < item.stars ? 'text-gray-900 fill-yellow-400' : 'text-gray-900'}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-5">"{item.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATARS[i].color} flex items-center justify-center font-bold text-gray-900 flex-shrink-0`}>
                      {AVATARS[i].initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.names[i]}</p>
                      <p className="text-gray-600 text-xs">{item.role}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-900/30 border border-purple-500/20 text-gray-600 px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative gradient-card rounded-3xl p-12 text-center border-purple-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3">{t.ctaTitle}</h2>
              <p className="text-gray-900 mb-8 max-w-md mx-auto">{t.ctaText}</p>
              <a href="/outils" className="gradient-purple text-white px-10 py-4 rounded-xl font-bold text-base shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 hover:-translate-y-0.5 transition-all inline-block">
                {t.ctaButton}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
