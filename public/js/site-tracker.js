// Tracker interne (Supabase), externalisé pour permettre une CSP sans 'unsafe-inline'.
// Chargé uniquement après consentement analytics (voir pages/_app.js).
(function () {
  var s = 'vjhfzirpbprkfefzxzvi', d = 'a9153b86-99d3-4442-a674-96c44c6ca186';
  var u = 'https://' + s + '.supabase.co/functions/v1/collect';
  function h(t) { var r = 0; for (var i = 0; i < t.length; i++) { r = ((r << 5) - r) + t.charCodeAt(i); r |= 0; } return Math.abs(r).toString(36); }
  var v = h(navigator.userAgent + (screen.width || '') + (new Date().toDateString()));
  function t(n, e) {
    var p = { s: d, p: location.pathname, r: document.referrer || '', v: v, sw: screen.width || 0, n: n || 'pageview' };
    if (e) p.e = e;
    navigator.sendBeacon ? navigator.sendBeacon(u, JSON.stringify(p)) :
      fetch(u, { method: 'POST', body: JSON.stringify(p), keepalive: true });
  }
  t();
  window.litetrack = function (n, e) { t(n, e); };
  var pushState = history.pushState;
  history.pushState = function () { pushState.apply(this, arguments); t(); };
  window.addEventListener('popstate', function () { t(); });
})();
