import { useEffect, useState } from 'react';

const STORAGE_KEY = 'comparateur-tech-cookie-consent';

export function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).analytics === true : false;
  } catch {
    return false;
  }
}

export default function CookieConsent({ onChange }) {
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChoice(parsed);
        onChange?.(parsed);
      }
    } catch {
      setChoice(null);
    }
  }, [onChange]);

  const save = (analytics) => {
    const value = {
      necessary: true,
      analytics,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setChoice(value);
    onChange?.(value);
  };

  if (choice) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-purple-100 bg-white p-4 shadow-2xl shadow-purple-200/40 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm font-bold text-gray-900">Gestion des cookies</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Nous utilisons des cookies nécessaires au fonctionnement du site. Les mesures d'audience et trackers ne sont chargés qu'avec votre accord.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => save(false)}
            className="min-h-[44px] rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            className="gradient-purple min-h-[44px] rounded-xl px-4 py-2 text-sm font-bold text-white shadow-md shadow-purple-300/40"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
