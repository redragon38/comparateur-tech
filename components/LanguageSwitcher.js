import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLocale } from '../lib/i18n';

const LANGS = [
  { locale: 'fr', label: 'FR', name: 'Français' },
  { locale: 'en', label: 'EN', name: 'English' },
];

export default function LanguageSwitcher({ className = '' }) {
  const router = useRouter();
  const current = useLocale();

  const rememberLocale = (locale) => {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
  };

  return (
    <nav aria-label={current === 'fr' ? 'Choix de la langue' : 'Language selection'} className={className}>
      <div className="flex items-center rounded-xl border border-purple-100 bg-white overflow-hidden">
        {LANGS.map((lang) => (
          <Link
            key={lang.locale}
            href={router.asPath}
            locale={lang.locale}
            hrefLang={lang.locale}
            onClick={() => rememberLocale(lang.locale)}
            aria-current={current === lang.locale ? 'true' : undefined}
            aria-label={lang.name}
            className={[
              'px-2.5 py-1.5 text-xs font-bold transition-colors duration-150',
              current === lang.locale
                ? 'bg-purple-700 text-white'
                : 'text-gray-500 hover:text-purple-700 hover:bg-purple-50',
            ].join(' ')}
          >
            {lang.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
