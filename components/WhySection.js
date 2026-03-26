import { Shield, Star, RefreshCw, BarChart2 } from 'lucide-react';

const items = [
  {
    icon: <Shield className="w-6 h-6 text-purple-600" />,
    bg: 'bg-purple-50 border-purple-100',
    title: 'Sélection rigoureuse',
    desc: 'Chaque outil est testé manuellement selon des critères précis : performance, rapport qualité-prix, support et fiabilité.',
  },
  {
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    bg: 'bg-yellow-50 border-yellow-100',
    title: 'Avis authentiques',
    desc: 'Les notes sont basées sur des milliers d\'avis réels. Pas de faux témoignages, pas de manipulation.',
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-green-600" />,
    bg: 'bg-green-50 border-green-100',
    title: 'Mis à jour régulièrement',
    desc: 'Notre équipe surveille l\'évolution des outils pour vous garantir une information toujours à jour.',
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-100',
    title: 'Comparatifs détaillés',
    desc: 'Forces, faiblesses, prix — tout est là pour que vous preniez la bonne décision en un coup d\'œil.',
  },
];

const TRUST_STATS = [
  { value: '32+', label: 'Outils vérifiés' },
  { value: '4', label: 'Catégories' },
  { value: '100%', label: 'Indépendant' },
  { value: '12k+', label: 'Lecteurs/mois' },
];

export default function WhySection() {
  return (
    <section id="why" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🤝 Pourquoi nous choisir
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Des recommandations en qui<br />vous pouvez avoir confiance
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Chaque outil est testé et sélectionné pour répondre aux besoins réels des créateurs et entrepreneurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {items.map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${item.bg} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-100 rounded-2xl py-8 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-purple-100">
            {TRUST_STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-purple-700 mb-1">{s.value}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
