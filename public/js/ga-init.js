// Bootstrap Google Analytics 4, externalisé pour permettre une CSP sans 'unsafe-inline'.
// Chargé uniquement après consentement analytics (voir pages/_app.js).
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-0LP1TMHQWW', { anonymize_ip: true });
