import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Send, CheckCircle, AlertCircle, Users2, Youtube, PlayCircle, ExternalLink, Check, ArrowRight } from 'lucide-react';
import { PARTNERS } from '../lib/partners';

const FORMSPREE_URL = 'https://formspree.io/f/xvzwyejw';

function PartnerCard({ partner }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white border border-red-100 shadow-sm hover:shadow-2xl hover:shadow-red-100/70 hover:-translate-y-1 transition-all duration-300">
      <Link
        href={partner.detailUrl}
        aria-label={`Voir la fiche détaillée de ${partner.name}`}
        className="absolute inset-0 z-0"
      />

      <div className="relative h-44 bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(circle at top right, #ef4444, transparent 34%), radial-gradient(circle at bottom left, #a855f7, transparent 30%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />

        <div className="absolute left-5 top-5 inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold">
          <Youtube className="w-4 h-4 text-red-400" />
          {partner.badge}
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-20 h-20 rounded-full bg-white/95 text-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <PlayCircle className="w-11 h-11" />
          </span>
        </div>
      </div>

      <div className="relative z-10 p-5 sm:p-6 pt-0">
        <div className="-mt-9 mb-4 flex items-end justify-between gap-3">
          <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl bg-white border border-red-100 shadow-lg flex items-center justify-center overflow-hidden">
            <img
              src={partner.logo}
              alt={`Logo ${partner.name}`}
              width={80}
              height={80}
              className="w-full h-full object-contain p-2"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold">
            <Check className="w-3.5 h-3.5" />
            Vérifié
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500 mb-2">{partner.label}</p>
          <h3 className="text-2xl font-black text-gray-950 mb-2 group-hover:text-red-600 transition-colors">{partner.name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{partner.description}</p>
        </div>

        <div className="mb-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-3">
            <PlayCircle className="w-4 h-4 text-red-500" />
            {partner.videoLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            {partner.strengths.map((strength) => (
              <span key={strength} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
                {strength}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={partner.detailUrl}
            className="h-11 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
          >
            Voir la fiche
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={partner.videoUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="h-11 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Voir la vidéo
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function PartenairesPage() {
  const [form, setForm] = useState({ prenom: '', email: '', entreprise: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    if (!form.entreprise.trim()) e.entreprise = true;
    if (!form.message.trim()) e.message = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.prenom,
          email: form.email,
          entreprise: form.entreprise,
          message: form.message,
          _replyto: form.email,
          _subject: '[Comparateur-Tech] Demande partenariat – ' + form.entreprise,
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ prenom: '', email: '', entreprise: '', message: '' });
      } else throw new Error();
    } catch { setStatus('error'); }
  };

  const inputClass = (field) =>
    'w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400 transition-all text-base ' +
    (errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200');

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Partenaires, Comparateur-Tech"
        description="Découvrez nos partenaires et rejoignez le programme partenaire Comparateur-Tech."
        canonical="https://comparateur-tech.com/partenaires"
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="py-14 sm:py-24 bg-gradient-to-b from-purple-50 to-white border-b border-purple-100">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block bg-white border border-purple-200 text-gray-600 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-5 shadow-sm">
              🤝 Programme Partenaires
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-900 leading-tight">
              Développez votre visibilité<br />
              <span className="gradient-text">avec Comparateur-Tech</span>
            </h1>
            <p className="text-gray-600 text-base sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Rejoignez les outils qui font confiance à notre plateforme pour toucher des milliers
              d'utilisateurs qualifiés en quête de la meilleure solution tech.
            </p>
            <a href="#contact"
              className="gradient-purple text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-purple-300/40 hover:-translate-y-0.5 hover:shadow-purple-400/50 transition-all text-base inline-flex items-center justify-center gap-2">
              <Users2 className="w-5 h-5" /> Devenir partenaire
            </a>
          </div>
        </section>

        {/* Nos partenaires */}
        <section className="py-14 sm:py-20 bg-white border-b border-purple-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Nos partenaires</h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
                Des créateurs et médias tech qui collaborent avec Comparateur-Tech.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {PARTNERS.map(partner => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire de contact */}
        <section id="contact" className="py-12 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
                Démarrons ensemble
              </h2>
              <p className="text-gray-500 text-base max-w-md mx-auto">
                Remplissez ce formulaire et nous vous recontactons sous 24h avec une proposition personnalisée.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-purple-100 shadow-sm">
              <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Prénom *</label>
                    <input type="text" name="prenom" value={form.prenom} onChange={handleChange}
                      placeholder="Marie" className={inputClass('prenom')} autoComplete="given-name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Email pro *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="marie@entreprise.com" className={inputClass('email')} autoComplete="email" inputMode="email" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Entreprise / Outil *</label>
                  <input type="text" name="entreprise" value={form.entreprise} onChange={handleChange}
                    placeholder="Nom de votre entreprise ou outil" className={inputClass('entreprise')} />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Votre projet *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    placeholder="Décrivez votre outil, vos objectifs de partenariat, et toute information utile…"
                    className={inputClass('message') + ' resize-none min-h-[110px]'} />
                </div>

                <button type="submit" disabled={status === 'loading'}
                  className="w-full gradient-purple text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-300/50 transition-all disabled:opacity-60 text-base min-h-[52px]">
                  {status === 'loading' ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg> Envoi en cours…
                    </>
                  ) : (
                    <><Send className="w-4 h-4" /> Envoyer ma demande</>
                  )}
                </button>

                {status === 'success' && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-medium">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    Demande envoyée ! Nous vous recontactons sous 24h.
                  </div>
                )}
                {status === 'error' && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Erreur. Écrivez directement à{' '}
                    <a href="mailto:comparateur.tech@gmail.com" className="underline">comparateur.tech@gmail.com</a>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
