import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useUI } from '../lib/i18n';

export default function Footer() {
  const ui = useUI();
  const f = ui.footer;

  return (
    <footer className="border-t border-purple-100 py-10 sm:py-14 mt-8 sm:mt-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-10">
          {/* Logo + description, occupe 2 colonnes sur mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 flex items-center justify-center">
                <img src="/logo.png" alt="Comparateur-Tech" width={36} height={36} loading="lazy" decoding="async" className="w-9 h-9 object-contain" />
              </div>
              <span className="text-xl font-extrabold text-gray-900">Comparateur-Tech</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              {f.tagline}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="mailto:comparateur.tech@gmail.com" aria-label={f.contactAria} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-purple-100 hover:text-purple-700 flex items-center justify-center text-gray-500 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Outils */}
          <div>
            <h4 className="font-bold mb-3 text-gray-700 text-xs uppercase tracking-wider">{f.toolsTitle}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/outils" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{ui.nav.allTools}</Link></li>
              {ui.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={cat.href} className="text-gray-500 hover:text-purple-700 transition-colors text-sm">
                    {cat.icon} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top 10 */}
          <div>
            <h4 className="font-bold mb-3 text-gray-700 text-xs uppercase tracking-wider">{f.top10Title}</h4>
            <ul className="space-y-2.5">
              {ui.top10Categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/top-10-${cat.slug}`} className="text-gray-500 hover:text-purple-700 transition-colors text-sm">
                    🏆 Top 10 {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <h4 className="font-bold mb-3 text-gray-700 text-xs uppercase tracking-wider">{f.legalTitle}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{f.contact}</Link></li>
              <li><Link href="/partenaires" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{f.partners}</Link></li>
              <li><Link href="/comparatifs" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{f.comparisons}</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{f.blog}</Link></li>
              <li><Link href="/methodologie" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{f.methodology}</Link></li>
              <li><Link href="/mentions-legales" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{f.legalNotice}</Link></li>
              <li><Link href="/cgu" className="text-gray-500 hover:text-purple-700 transition-colors text-sm">{f.terms}</Link></li>
            </ul>
          </div>
        </div>

        {/* Ligne légale mobile, liens horizontaux scroll */}
        <div className="border-t border-purple-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Comparateur-Tech. {f.rights}</p>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            {[
              { label: f.legalNotice, href: '/mentions-legales' },
              { label: f.terms, href: '/cgu' },
              { label: f.contact, href: '/contact' },
            ].map((item, i) => (
              <Link key={i} href={item.href}
                className="text-gray-400 hover:text-purple-700 transition-colors text-xs min-h-[44px] flex items-center">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
