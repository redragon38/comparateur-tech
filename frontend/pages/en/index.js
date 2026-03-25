/**
 * /pages/en/index.js
 *
 * PROBLÈME ORIGINAL : router.replace() côté client = page vide indexée par Google
 * CORRECTION : redirect côté serveur (getServerSideProps) + noindex en fallback
 *
 * Google voit une vraie redirection 302 au lieu d'une page vide.
 */

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: false, // 302 — utiliser permanent: true (301) si l'URL /en n'est plus jamais prévue
    },
  };
}

export default function EnIndex() {
  return null;
}
