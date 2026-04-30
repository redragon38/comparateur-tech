import '../styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'
import { Space_Grotesk } from 'next/font/google'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import AIChatbot from '../components/AIChatbot'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

// ── Resize : désactive les transitions pendant le redimensionnement ──
function useResizeTransitionGuard() {
  useEffect(() => {
    let t
    const onResize = () => {
      document.body.classList.add('resize-no-transition')
      clearTimeout(t)
      t = setTimeout(() => document.body.classList.remove('resize-no-transition'), 200)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
}

// ── View Transitions API : animation inter-pages ──
function useViewTransitions() {
  const router = useRouter()

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!document.startViewTransition) return

    const handleStart = (url) => {
      // On déclenche la View Transition côté CSS via ::view-transition-*
    }

    router.events.on('routeChangeStart', handleStart)
    return () => router.events.off('routeChangeStart', handleStart)
  }, [router])
}

// ── Scroll to top sur changement de route ──
function useScrollToTop() {
  const router = useRouter()
  useEffect(() => {
    const onRouteChange = () => window.scrollTo({ top: 0, behavior: 'instant' })
    router.events.on('routeChangeComplete', onRouteChange)
    return () => router.events.off('routeChangeComplete', onRouteChange)
  }, [router])
}

// ── Prefetch des pages au survol des liens ──
function useLinkPrefetch() {
  const router = useRouter()
  useEffect(() => {
    const onMouseOver = (e) => {
      const link = e.target.closest('a[href]')
      if (!link) return
      const href = link.getAttribute('href')
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        router.prefetch(href).catch(() => {})
      }
    }
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    return () => document.removeEventListener('mouseover', onMouseOver)
  }, [router])
}

export default function App({ Component, pageProps }) {
  useResizeTransitionGuard()
  useViewTransitions()
  useScrollToTop()
  useLinkPrefetch()

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="dns-prefetch" href="https://comparateur-tech.com" />
      </Head>

      {/* Trackers chargés en lazy/afterInteractive pour ne pas bloquer le LCP */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0LP1TMHQWW"
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0LP1TMHQWW');
        `}
      </Script>
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="6ea0f83b-1027-4e94-972d-f57f04528f2d"
        strategy="lazyOnload"
      />
      <Script
        src="https://taap.it/scripts/tracker.js"
        data-project="pk_aa97ee2d1ea3dcec38ffebbd60e82779"
        data-track-outbound="true"
        data-track-forms="true"
        strategy="lazyOnload"
      />
      <Script id="custom-tracker" strategy="lazyOnload">
        {`
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
        `}
      </Script>

      <div className={`${spaceGrotesk.variable} font-sans`}>
        <Component {...pageProps} />
        <AIChatbot />
      </div>
    </>
  )
}
