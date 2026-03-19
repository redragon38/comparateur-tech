import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Freelance Web Designer', initial: 'S', color: 'from-purple-600 to-pink-500', stars: 5, text: "Grâce à Comparateur-Tech, j'ai trouvé le bon hébergeur en 10 minutes. Les comparatifs sont clairs et les avis fiables. Je ne perds plus des heures à chercher !", category: 'Hébergement web', tool: 'o2switch' },
  { name: 'Thomas K.', role: 'Développeur & Digital Nomad', initial: 'T', color: 'from-blue-600 to-purple-600', stars: 5, text: "Le meilleur site pour comparer les VPN. J'ai passé des heures ailleurs sans décision — ici en 5 min c'était réglé. NordVPN au final, parfait !", category: 'VPN', tool: 'NordVPN' },
  { name: 'Amélie R.', role: 'Créatrice de contenu', initial: 'A', color: 'from-pink-600 to-purple-600', stars: 5, text: "J'utilise Comparateur-Tech comme référence avant chaque achat d'outil IA. La sélection est sérieuse et les notes honnêtes. Rien à redire !", category: 'IA', tool: 'ClickUp' },
  { name: 'Marc D.', role: 'Entrepreneur & CEO', initial: 'M', color: 'from-emerald-600 to-teal-500', stars: 5, text: "J'ai découvert Hostinger ici et c'est devenu mon hébergeur de confiance. Le comparatif avec Kinsta était ultra clair. Merci !", category: 'Hébergement web', tool: 'Hostinger' },
  { name: 'Julie F.', role: 'Marketing Manager', initial: 'J', color: 'from-yellow-600 to-orange-500', stars: 5, text: "La newsletter hebdomadaire est une pépite. Je reçois exactement les infos dont j'ai besoin sans être noyée. Vraiment top !", category: 'Newsletter', tool: '—' },
  { name: 'Romain B.', role: 'Consultant IT', initial: 'R', color: 'from-cyan-600 to-blue-500', stars: 5, text: "Pour choisir un antivirus entreprise, Comparateur-Tech m'a sauvé la mise. Bitdefender était clairement le meilleur rapport qualité-prix.", category: 'Antivirus', tool: 'Bitdefender' },
  { name: 'Léa V.', role: 'Photographe indépendante', initial: 'L', color: 'from-rose-600 to-pink-500', stars: 4, text: "Interface intuitive, comparatifs bien faits. J'aurais aimé plus d'outils créatifs mais pour les catégories existantes c'est excellent.", category: 'IA', tool: 'ClickUp' },
  { name: 'Nicolas P.', role: 'Développeur Full Stack', initial: 'N', color: 'from-violet-600 to-purple-500', stars: 5, text: "Proton VPN trouvé en 3 minutes grâce au comparatif. Les badges 'Vérifié' et 'Essai gratuit' aident vraiment à décider rapidement.", category: 'VPN', tool: 'Proton VPN' },
  { name: 'Camille T.', role: 'Coach business', initial: 'C', color: 'from-orange-600 to-red-500', stars: 5, text: "Je recommande Comparateur-Tech à tous mes clients qui cherchent des outils. C'est devenu la référence pour moi quand je conseil.", category: 'IA', tool: 'Emergent' },
];

const STATS = [
  { number: '2 800+', label: 'Abonnés newsletter' },
  { number: '4.9/5', label: 'Note moyenne' },
  { number: '32+', label: 'Outils vérifiés' },
  { number: '4', label: 'Catégories' },
];

export default function TemoignagesPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Témoignages — Ce qu'en disent nos lecteurs"
        description="Découvrez les avis et témoignages de nos lecteurs sur Comparateur-Tech. Des entrepreneurs et créateurs qui ont trouvé les bons outils grâce à nos comparatifs."
        canonical="https://comparateur-tech.com/temoignages"
        keywords="avis Comparateur-Tech, témoignages, retours utilisateurs, comparatif outils"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-24 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <span className="inline-block bg-purple-900/30 border border-purple-500/30 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              💬 Témoignages
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
              Ils nous font<br />
              <span className="text-gray-900">confiance</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-lg mx-auto">
              Des entrepreneurs et créateurs qui ont trouvé les bons outils grâce à Comparateur-Tech.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 pb-24">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {STATS.map((s, i) => (
              <div key={i} className="gradient-card rounded-2xl p-6 text-center">
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{s.number}</div>
                <div className="text-gray-600 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Grille témoignages */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5 mb-16">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="break-inside-avoid gradient-card rounded-2xl p-6 hover:-translate-y-1 hover:border-purple-500/50 transition-all inline-block w-full">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.stars ? 'text-gray-900 fill-yellow-400' : 'text-gray-900'}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-5">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-bold text-gray-900 flex-shrink-0`}>
                      {t.initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-gray-600 text-xs">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-900/30 border border-purple-500/20 text-gray-600 px-2 py-0.5 rounded-full">{t.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative gradient-card rounded-3xl p-12 text-center border-purple-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3">Vous aussi, trouvez votre outil idéal</h2>
              <p className="text-gray-900 mb-8 max-w-md mx-auto">Rejoignez des milliers d'utilisateurs satisfaits et découvrez les meilleures solutions pour votre activité.</p>
              <a href="/outils" className="gradient-purple text-white px-10 py-4 rounded-xl font-bold text-base shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 hover:-translate-y-0.5 transition-all inline-block">
                Explorer les outils →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
