import { CheckCircle, Clock, TrendingUp, Award, RefreshCw, Users } from 'lucide-react';
import { useT } from '../lib/i18n';

const STEP_STYLES = [
  { num: '01', icon: '🔍', IconComp: TrendingUp, color: 'from-blue-50 to-indigo-50', border: 'border-blue-100', accent: 'text-blue-600', iconBg: 'bg-blue-50' },
  { num: '02', icon: '🧪', IconComp: Clock, color: 'from-purple-50 to-violet-50', border: 'border-purple-100', accent: 'text-purple-600', iconBg: 'bg-purple-50' },
  { num: '03', icon: '📊', IconComp: Award, color: 'from-pink-50 to-rose-50', border: 'border-pink-100', accent: 'text-pink-600', iconBg: 'bg-pink-50' },
  { num: '04', icon: '✅', IconComp: RefreshCw, color: 'from-emerald-50 to-teal-50', border: 'border-emerald-100', accent: 'text-emerald-600', iconBg: 'bg-emerald-50' },
];

const CONTENT = {
  fr: {
    badge: '🔬 Notre méthode',
    h2Line1: 'Comment on sélectionne',
    h2Line2: 'les meilleurs outils ?',
    intro: "Pas de sélection au hasard. Chaque outil passe par un processus rigoureux en 4 étapes avant d'apparaître sur Comparateur-Tech.",
    steps: [
      { title: 'Veille & découverte', desc: "Notre équipe surveille en permanence les sorties d'outils, les mises à jour majeures et les tendances du marché." },
      { title: 'Tests approfondis', desc: "Chaque outil est installé et testé en conditions réelles pendant plusieurs semaines. On ne recommande que ce qu'on a vraiment utilisé." },
      { title: 'Notation objective', desc: '8 critères objectifs : performance, prix, support, interface, fiabilité, politique remboursement, mises à jour, satisfaction.' },
      { title: 'Publication & suivi', desc: 'On publie uniquement les outils qui passent la barre, et on réévalue tout trimestriellement pour rester à jour.' },
    ],
    criteriaTitle: 'Nos 8 critères de notation',
    criteriaIntro: "Chaque outil reçoit une note de 0 à 10 sur chacun de ces critères. La note finale est pondérée selon l'importance du critère pour vos besoins réels.",
    criteria: [
      'Performance & vitesse', 'Rapport qualité-prix', 'Support client',
      'Facilité de prise en main', 'Fiabilité sur la durée', 'Satisfaction utilisateurs',
      'Fréquence des mises à jour', 'Politique de remboursement',
    ],
    exampleLabel: 'Exemple de notation',
    exampleBars: [
      { label: 'Performance', score: 95 },
      { label: 'Qualité-prix', score: 88 },
      { label: 'Support client', score: 90 },
      { label: 'Interface', score: 92 },
    ],
    statIndependent: 'Tests indépendants',
    statHours: 'Par outil en moyenne',
    statUpdates: 'Mises à jour',
    updatesValue: '4x/an',
  },
  en: {
    badge: '🔬 Our method',
    h2Line1: 'How we select',
    h2Line2: 'the best tools',
    intro: 'No random picks. Every tool goes through a rigorous 4-step process before appearing on Comparateur-Tech.',
    steps: [
      { title: 'Monitoring & discovery', desc: 'Our team continuously tracks new tool releases, major updates and market trends.' },
      { title: 'In-depth testing', desc: 'Every tool is installed and tested in real conditions for several weeks. We only recommend what we have actually used.' },
      { title: 'Objective rating', desc: '8 objective criteria: performance, price, support, interface, reliability, refund policy, update frequency, satisfaction.' },
      { title: 'Publication & follow-up', desc: 'We only publish tools that clear the bar, and we re-evaluate everything quarterly to stay current.' },
    ],
    criteriaTitle: 'Our 8 rating criteria',
    criteriaIntro: 'Every tool receives a score from 0 to 10 on each of these criteria. The final score is weighted by how much the criterion matters for your real needs.',
    criteria: [
      'Performance & speed', 'Value for money', 'Customer support',
      'Ease of use', 'Long-term reliability', 'User satisfaction',
      'Update frequency', 'Refund policy',
    ],
    exampleLabel: 'Sample rating',
    exampleBars: [
      { label: 'Performance', score: 95 },
      { label: 'Value', score: 88 },
      { label: 'Support', score: 90 },
      { label: 'Interface', score: 92 },
    ],
    statIndependent: 'Independent tests',
    statHours: 'Per tool on average',
    statUpdates: 'Updates',
    updatesValue: '4x/year',
  },
};

export default function FeaturesSection() {
  const t = useT(CONTENT);

  return (
    <section id="methode" className="py-20 bg-gradient-to-b from-white to-purple-50/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {t.badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {t.h2Line1}<br />{t.h2Line2}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t.intro}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {STEP_STYLES.map((style, i) => (
            <div key={i} className={`bg-gradient-to-br ${style.color} rounded-2xl p-6 border ${style.border} hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group`}>
              <div className="absolute top-4 right-4 text-5xl font-black opacity-10 group-hover:opacity-20 transition-opacity">
                {style.num}
              </div>
              <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                {style.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{t.steps[i].title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.steps[i].desc}</p>
            </div>
          ))}
        </div>

        {/* Criteria + visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 md:p-12 border border-purple-100 shadow-sm">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.criteriaTitle}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {t.criteriaIntro}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 group-hover:border-purple-500 transition-all">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center text-xl">🛡️</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">NordVPN</div>
                    <div className="text-xs text-gray-400">{t.exampleLabel}</div>
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-purple-600">9.2<span className="text-sm font-normal text-gray-400">/10</span></div>
              </div>
              <div className="space-y-2.5">
                {t.exampleBars.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 flex-shrink-0">{item.label}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right">{item.score}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-green-600">100%</div>
                <div className="text-xs text-gray-500 mt-1">{t.statIndependent}</div>
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-blue-600">40h+</div>
                <div className="text-xs text-gray-500 mt-1">{t.statHours}</div>
              </div>
              <div className="flex-1 bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-purple-600">{t.updatesValue}</div>
                <div className="text-xs text-gray-500 mt-1">{t.statUpdates}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
