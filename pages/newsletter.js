import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { CheckCircle, Mail, Zap, Shield, Star, Gift, AlertCircle } from 'lucide-react';
import { useT } from '../lib/i18n';

const FORMSPREE_URL = 'https://formspree.io/f/xvzwyejw';

const PERK_ICONS = [
  { icon: <Zap className="w-5 h-5 text-yellow-500" />, bg: 'bg-yellow-50 border-yellow-100' },
  { icon: <Gift className="w-5 h-5 text-pink-500" />, bg: 'bg-pink-50 border-pink-100' },
  { icon: <Star className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50 border-purple-100' },
  { icon: <Shield className="w-5 h-5 text-green-600" />, bg: 'bg-green-50 border-green-100' },
];

const CONTENT = {
  fr: {
    seoTitle: 'Newsletter outils IA, VPN et hébergement',
    seoDescription: 'Rejoignez 2 800+ créateurs et entrepreneurs. Recevez chaque semaine la sélection des meilleurs outils, offres exclusives et tendances du digital.',
    badge: 'Newsletter gratuite · 1 email/semaine max',
    h1a: 'Restez à la pointe', h1b: 'chaque semaine',
    introBefore: 'Rejoignez ', introBold: (c) => `${c}+ créateurs`, introAfter: ' qui reçoivent chaque semaine les meilleurs outils, offres et guides.',
    footnote: '✅ Gratuit · 1 email/semaine max · Désinscription en 1 clic',
    perksTitle: 'Ce que vous recevez chaque semaine',
    perks: [
      { title: 'Nouveaux outils en avant-première', desc: 'Soyez le premier informé des meilleures sorties avant tout le monde.' },
      { title: 'Offres exclusives & réductions', desc: 'Des codes promo négociés uniquement pour nos abonnés.' },
      { title: 'Sélection hebdomadaire experte', desc: 'Un condensé des meilleurs outils de la semaine, triés sur le volet.' },
      { title: 'Zéro spam, désinscription facile', desc: '1 email par semaine max. Vous pouvez partir en 1 clic à tout moment.' },
    ],
    previousTitle: 'Numéros précédents',
    previous: [
      { num: '#42', date: '18 fév. 2025', subject: '🛡️ Les 5 meilleurs VPN de 2025 selon nos tests', preview: 'NordVPN vs ExpressVPN, ProtonVPN en chute libre ?' },
      { num: '#41', date: '11 fév. 2025', subject: '🌐 Hébergement : o2switch détrône-t-il Kinsta ?', preview: 'Benchmark de vitesse sur 6 hébergeurs français...' },
      { num: '#40', date: '4 fév. 2025', subject: '🤖 Top 3 outils IA pour créateurs cette semaine', preview: 'ClickUp AI vs Notion AI vs un nouvel entrant...' },
    ],
    ctaTitle: 'Prêt à rejoindre la communauté ?',
    ctaText: (c) => `${c}+ entrepreneurs et créateurs nous font déjà confiance.`,
    emailPlaceholder: 'votre@email.com', emailAria: 'Adresse email',
    sending: 'Envoi…', subscribe: "Je m'inscris →",
    successMsg: 'Bienvenue ! Vérifiez votre boîte mail 🎉',
    errorMsg: 'Erreur. Réessayez ou écrivez à comparateur.tech@gmail.com',
  },
  en: {
    seoTitle: 'Newsletter, AI, VPN and hosting tools',
    seoDescription: 'Join 2,800+ creators and entrepreneurs. Every week, get our selection of the best tools, exclusive offers and digital trends.',
    badge: 'Free newsletter · Max 1 email/week',
    h1a: 'Stay ahead', h1b: 'every week',
    introBefore: 'Join ', introBold: (c) => `${c}+ creators`, introAfter: ' who get the best tools, offers and guides every week.',
    footnote: '✅ Free · Max 1 email/week · Unsubscribe in 1 click',
    perksTitle: 'What you get every week',
    perks: [
      { title: 'New tools before everyone else', desc: 'Be the first to hear about the best releases before anyone else.' },
      { title: 'Exclusive offers & discounts', desc: 'Promo codes negotiated exclusively for our subscribers.' },
      { title: 'Expert weekly selection', desc: 'A digest of the best tools of the week, hand-picked.' },
      { title: 'Zero spam, easy unsubscribe', desc: 'Max 1 email per week. You can leave in 1 click anytime.' },
    ],
    previousTitle: 'Previous issues',
    previous: [
      { num: '#42', date: 'Feb 18, 2025', subject: '🛡️ The 5 best VPNs of 2025 according to our tests', preview: 'NordVPN vs ExpressVPN, is ProtonVPN falling behind?' },
      { num: '#41', date: 'Feb 11, 2025', subject: '🌐 Hosting: is o2switch dethroning Kinsta?', preview: 'Speed benchmark across 6 French web hosts...' },
      { num: '#40', date: 'Feb 4, 2025', subject: '🤖 Top 3 AI tools for creators this week', preview: 'ClickUp AI vs Notion AI vs a new challenger...' },
    ],
    ctaTitle: 'Ready to join the community?',
    ctaText: (c) => `${c}+ entrepreneurs and creators already trust us.`,
    emailPlaceholder: 'your@email.com', emailAria: 'Email address',
    sending: 'Sending…', subscribe: 'Subscribe →',
    successMsg: 'Welcome! Check your inbox 🎉',
    errorMsg: 'Something went wrong. Try again or email comparateur.tech@gmail.com',
  },
};

function NewsletterForm({ t }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, _subject: '[Comparateur-Tech] Nouvelle inscription newsletter' }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setEmail('');
    } catch { setStatus('error'); }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-3 font-bold text-xl py-4 text-white">
        <CheckCircle className="w-7 h-7" /> {t.successMsg}
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email" required value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          aria-label={t.emailAria}
          className="flex-1 bg-white/15 border border-white/30 rounded-xl px-5 py-4 text-white placeholder-purple-200 focus:outline-none focus:border-white focus:bg-white/25 transition-all"
        />
        <button type="submit" disabled={status === 'loading'}
          className="bg-white text-purple-700 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap disabled:opacity-60">
          {status === 'loading' ? t.sending : t.subscribe}
        </button>
      </form>
      {status === 'error' && (
        <div className="flex items-center justify-center gap-2 text-red-200 text-sm mt-3">
          <AlertCircle className="w-4 h-4" /> {t.errorMsg}
        </div>
      )}
    </div>
  );
}

export default function NewsletterPage() {
  const t = useT(CONTENT);
  const [count] = useState(2847);
  const countLabel = count.toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/newsletter"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-24 text-center overflow-hidden bg-gradient-to-br from-purple-700 via-purple-600 to-violet-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Mail className="w-4 h-4" /> {t.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              {t.h1a}<br />
              <span className="text-purple-200">{t.h1b}</span>
            </h1>
            <p className="text-purple-100 text-xl max-w-lg mx-auto mb-10">
              {t.introBefore}<strong className="text-white">{t.introBold(countLabel)}</strong>{t.introAfter}
            </p>
            <NewsletterForm t={t} />
            <p className="text-purple-200 text-sm mt-5">{t.footnote}</p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-20 max-w-5xl">
          {/* Avantages */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{t.perksTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {t.perks.map((perk, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-200 transition-all shadow-sm">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${PERK_ICONS[i].bg}`}>
                    {PERK_ICONS[i].icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{perk.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Numéros précédents */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{t.previousTitle}</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {t.previous.map((issue, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 hover:border-purple-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer group shadow-sm">
                  <div className="w-14 h-14 rounded-xl gradient-purple flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                    {issue.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">{issue.date}</p>
                    <p className="font-bold text-sm text-gray-900 group-hover:text-purple-700 transition-colors truncate">{issue.subject}</p>
                    <p className="text-gray-400 text-xs mt-1 truncate">{issue.preview}</p>
                  </div>
                  <Mail className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA final */}
          <div className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-violet-700 rounded-3xl p-14 text-center overflow-hidden shadow-2xl shadow-purple-500/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3 text-white">{t.ctaTitle}</h2>
              <p className="text-purple-100 mb-8 max-w-md mx-auto">{t.ctaText(countLabel)}</p>
              <NewsletterForm t={t} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
