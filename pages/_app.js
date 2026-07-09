import '../styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CookieConsent, { hasAnalyticsConsent } from '../components/CookieConsent'

const AIChatbot = dynamic(() => import('../components/AIChatbot'), { ssr: false })

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
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)
  useResizeTransitionGuard()
  useViewTransitions()
  useScrollToTop()
  useLinkPrefetch()

  useEffect(() => {
    setAnalyticsAllowed(hasAnalyticsConsent())
  }, [])

  const handleCookieChange = useCallback((choice) => {
    setAnalyticsAllowed(choice?.analytics === true)
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="dns-prefetch" href="https://comparateur-tech.com" />
      </Head>

      {analyticsAllowed && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-0LP1TMHQWW"
            strategy="afterInteractive"
          />
          {/* Externalisé (public/js/ga-init.js) : permet une CSP script-src sans 'unsafe-inline'. */}
          <Script src="/js/ga-init.js" strategy="afterInteractive" />
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
          {/* Externalisé (public/js/site-tracker.js) : permet une CSP script-src sans 'unsafe-inline'. */}
          <Script src="/js/site-tracker.js" strategy="lazyOnload" />
        </>
      )}

      <div className="font-sans">
        <Component {...pageProps} />
        <AIChatbot />
        <CookieConsent onChange={handleCookieChange} />
      </div>
    </>
  )
}
