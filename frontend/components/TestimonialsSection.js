import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    stars: 5,
    text: "Grâce à Comparateur-Tech, j'ai trouvé le bon hébergeur en 10 minutes. Les comparatifs sont clairs et les avis fiables. Je recommande !",
    name: "Sarah M.",
    role: "Freelance Web Designer",
    initial: "S",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    stars: 5,
    text: "Le meilleur site pour comparer les VPN. J'ai passé des heures ailleurs sans décision — ici en 5 minutes c'était réglé.",
    name: "Thomas K.",
    role: "Développeur & Digital Nomad",
    initial: "T",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    stars: 5,
    text: "J'utilise Comparateur-Tech comme référence avant chaque achat d'outil IA. La sélection est sérieuse et les notes honnêtes.",
    name: "Amélie R.",
    role: "Créatrice de contenu",
    initial: "A",
    gradient: "from-pink-500 to-purple-500",
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            💬 Témoignages
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Ce qu'en disent nos lecteurs</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Des entrepreneurs et créateurs qui ont trouvé les bons outils grâce à Comparateur-Tech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 flex flex-col">
              <Quote className="w-8 h-8 text-purple-200 mb-4 flex-shrink-0" />
              <Stars count={t.stars} />
              <p className="text-gray-600 text-sm leading-relaxed italic flex-1 mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center font-bold text-white text-sm`}>
                  {t.initial}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 px-6 py-3 rounded-full">
            <div className="flex -space-x-2">
              {['from-purple-500 to-pink-500', 'from-blue-500 to-purple-500', 'from-green-500 to-teal-500', 'from-yellow-500 to-orange-500'].map((g, i) => (
                <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                  {['S','T','A','M'][i]}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              <strong className="text-gray-900">12 000+</strong> lecteurs nous font confiance chaque mois
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
