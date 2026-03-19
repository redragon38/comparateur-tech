import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* ── Viewport mobile (dans _document, pas dans _app) ── */}
        
        {/* ── Preconnect fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* display=swap + font-display pour éviter FOIT */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* ── Favicons ── */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ── Meta mobile ── */}
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* ── Google Analytics (chargé en defer pour ne pas bloquer) ── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0LP1TMHQWW" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0LP1TMHQWW');
            `,
          }}
        />
      </Head>
      <body style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        <Main />
        <NextScript />
        {/* Tracking script - No cookie · ~1KB · GDPR friendly */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var s='vjhfzirpbprkfefzxzvi',d='a9153b86-99d3-4442-a674-96c44c6ca186';
  var u='https://'+s+'.supabase.co/functions/v1/collect';
  function h(t){var r=0;for(var i=0;i<t.length;i++){r=((r<<5)-r)+t.charCodeAt(i);r|=0}return Math.abs(r).toString(36)}
  var v=h(navigator.userAgent+(screen.width||'')+(new Date().toDateString()));
  function t(n,e){
    var p={s:d,p:location.pathname,r:document.referrer||'',v:v,sw:screen.width||0,n:n||'pageview'};
    if(e)p.e=e;
    navigator.sendBeacon?navigator.sendBeacon(u,JSON.stringify(p)):
    fetch(u,{method:'POST',body:JSON.stringify(p),keepalive:true});
  }
  t();
  window.litetrack=function(n,e){t(n,e)};
  var pushState=history.pushState;
  history.pushState=function(){pushState.apply(this,arguments);t()};
  window.addEventListener('popstate',function(){t()});
})();
            `,
          }}
        />
      </body>
    </Html>
  )
}
