import { NextResponse } from 'next/server';

/**
 * Toutes les URLs sans préfixe de langue (locale technique 'default') sont
 * redirigées en 301 vers leur équivalent /fr : les anciennes URLs indexées
 * conservent ainsi leur jus SEO vers la version française.
 */
export function middleware(req) {
  if (req.nextUrl.locale === 'default') {
    const { pathname, search } = req.nextUrl;
    const path = pathname === '/' ? '' : pathname;
    return NextResponse.redirect(new URL(`/fr${path}${search}`, req.url), 301);
  }
  return NextResponse.next();
}

export const config = {
  // La racine '/' est déclarée explicitement : le matcher à lookahead négatif
  // ne la capture pas de façon fiable. Le reste exclut les API, les assets Next
  // et tout chemin contenant un point (fichiers statiques, sitemap.xml, robots.txt,
  // images…) qui ne doivent pas être préfixés.
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
};
