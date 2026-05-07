import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from 'lucide-react';

const SYSTEM_PROMPT = `Tu es l'assistant IA de Comparateur-Tech, une plateforme française qui compare et référence les meilleurs outils tech du web.

Tu es un assistant universel, capable de répondre à n'importe quelle question : tech, culture générale, coding, science, histoire, conseils, traduction, rédaction, maths, etc. Tu n'as aucune restriction de sujet.

Lorsque la question concerne les outils tech, le numérique ou les services en ligne, tu peux aussi orienter vers le site :
- /outils/intelligence-artificielle → Outils IA
- /outils/vpn → VPN
- /outils/hebergement-web → Hébergement web
- /outils/antivirus → Antivirus
- /outils/cybersecurite → Cybersécurité
- /top-10-intelligence-artificielle, /top-10-vpn, /top-10-hebergement-web, /top-10-antivirus, /top-10-cybersecurite → Top 10
- /comparatifs → Comparatifs détaillés
- /blog → Articles et guides

Réponds toujours en français sauf si l'utilisateur écrit dans une autre langue (dans ce cas adapte-toi à sa langue). Sois clair, précis et utile. Adapte la longueur de ta réponse à la complexité de la question.`;

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour ! 👋 Je suis l\'assistant IA de Comparateur-Tech. Posez-moi n\'importe quelle question — tech, culture générale, coding, conseils... Je suis là pour tout !'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNotification(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API error');
      }

      const reply = data.reply || 'Désolé, je n\'ai pas pu répondre. Réessayez !';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Une erreur est survenue. Veuillez réessayer dans un instant.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const QUICK_QUESTIONS = [
    'Meilleur VPN en 2026 ?',
    'Explique-moi c\'est quoi l\'IA',
    'Écris-moi un email pro',
  ];

  return (
    <>
      {/* Floating bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Chat window */}
        {isOpen && (
          <div
            className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-purple-100"
            style={{
              width: '360px',
              height: isMinimized ? 'auto' : '520px',
              maxHeight: '80vh',
              transition: 'height 0.3s ease',
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Assistant Comparateur-Tech</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-purple-200 text-xs">En ligne</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Minimiser"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          msg.role === 'user'
                            ? 'bg-purple-600'
                            : 'bg-white border border-purple-100 shadow-sm'
                        }`}
                      >
                        {msg.role === 'user'
                          ? <User className="w-3.5 h-3.5 text-white" />
                          : <Bot className="w-3.5 h-3.5 text-purple-600" />
                        }
                      </div>
                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-purple-600 text-white rounded-tr-sm'
                            : 'bg-white text-gray-700 rounded-tl-sm shadow-sm border border-gray-100'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-white border border-purple-100 shadow-sm flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick questions (only if 1 message = greeting) */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2 bg-gray-50 flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                        className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-full px-3 py-1.5 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
                  <div className="flex gap-2 items-end">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Posez votre question..."
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                      style={{ maxHeight: '96px' }}
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                      aria-label="Envoyer"
                    >
                      {isLoading
                        ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                        : <Send className="w-4 h-4 text-white" />
                      }
                    </button>
                  </div>
                  <p className="text-center text-gray-300 text-xs mt-2">ia de comparateur-tech</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => { setIsOpen(!isOpen); }}
          className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
        >
          {isOpen
            ? <X className="w-6 h-6 text-white" />
            : <MessageCircle className="w-6 h-6 text-white" />
          }
          {/* Notification dot */}
          {!isOpen && hasNotification && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">1</span>
            </span>
          )}
        </button>
      </div>
    </>
  );
}
