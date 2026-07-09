import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';

const prompts = [
  'Quel outil avez-vous comparé ?',
  'Quelle page vous a aidé à décider ?',
  'Qu’est-ce qui vous a fait gagner du temps ?',
];

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            💬 Retours lecteurs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Témoignages vérifiés à venir</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Cette section est prête pour afficher de vrais retours lorsque vous aurez assez de lecteurs et de clics mensuels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <div key={prompt} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <Quote className="w-8 h-8 text-purple-200 mb-4" />
              <p className="text-gray-800 font-bold mb-2">{prompt}</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Ajoutez ici un vrai retour avec prénom, contexte, outil comparé et date.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/contact" className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-6 py-3 rounded-full text-sm text-gray-700 font-semibold hover:border-purple-300 hover:text-purple-700 transition-colors">
            Envoyer un retour <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
