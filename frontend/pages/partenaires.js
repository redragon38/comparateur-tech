import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Send, CheckCircle, AlertCircle, Users2 } from 'lucide-react';

const FORMSPREE_URL = 'https://formspree.io/f/xvzwyejw';



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
        title="Partenaires — Comparateur-Tech"
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
                Des outils de référence qui nous font confiance.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-purple-200">
              <span className="text-5xl mb-4">🤝</span>
              <p className="text-gray-500 text-base font-medium mb-2">Aucun partenaire pour le moment</p>
              <p className="text-gray-400 text-sm mb-6">Soyez le premier à rejoindre notre programme partenaire.</p>
              <a href="#contact"
                className="gradient-purple text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-purple-300/40 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                Devenir partenaire
              </a>
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
