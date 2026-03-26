import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Zap, Gift, Star } from 'lucide-react';

const FORMSPREE_URL = 'https://formspree.io/f/xvzwyejw';

const PERKS = [
  { icon: <Zap className="w-4 h-4" />, text: 'Nouveaux outils en avant-première' },
  { icon: <Gift className="w-4 h-4" />, text: 'Offres exclusives & réductions' },
  { icon: <Star className="w-4 h-4" />, text: 'Sélection hebdomadaire experte' },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, _subject: '[Comparateur-Tech] Nouvelle inscription newsletter (section)' }),
      });
      if (res.ok) { setSubmitted(true); setEmail(''); }
      else throw new Error();
    } catch { setError(true); }
    setLoading(false);
  };

  return (
    <section id="newsletter" className="py-20 bg-gray-950">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 bg-gradient-to-br from-purple-900/40 to-violet-900/20 border border-purple-500/20 rounded-3xl p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
                  <Mail className="w-3.5 h-3.5" /> Newsletter gratuite
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Ne ratez aucun<br />bon outil
                </h2>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Chaque semaine, recevez la sélection des meilleurs outils, offres exclusives et guides pratiques — directement dans votre boîte mail.
                </p>
                <div className="space-y-3">
                  {PERKS.map((perk, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
                        {perk.icon}
                      </div>
                      {perk.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Form */}
              <div>
                {!submitted ? (
                  <div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email" required value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                      />
                      <button type="submit" disabled={loading}
                        className="w-full gradient-purple py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-60">
                        {loading ? (
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                        ) : (
                          <><ArrowRight className="w-5 h-5" /> Je m'abonne gratuitement</>
                        )}
                      </button>
                    </form>
                    {error && (
                      <p className="text-red-400 text-xs mt-2 text-center">
                        Erreur. Réessayez ou écrivez à{' '}
                        <a href="mailto:comparateur.tech@gmail.com" className="underline">comparateur.tech@gmail.com</a>
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-3 text-center">
                      ✅ Gratuit · 1 email/semaine max · Désinscription en 1 clic
                    </p>
                    {/* Social proof */}
                    <div className="mt-5 flex items-center justify-center gap-3">
                      <div className="flex -space-x-2">
                        {['from-purple-400 to-pink-400', 'from-blue-400 to-purple-400', 'from-emerald-400 to-teal-400', 'from-orange-400 to-red-400'].map((c, i) => (
                          <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${c} border-2 border-gray-900`} />
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs">2 800+ abonnés nous font confiance</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="text-white font-bold text-xl mb-2">Bienvenue ! 🎉</div>
                    <p className="text-gray-400 text-sm">Vérifiez votre boîte mail pour confirmer votre inscription.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
