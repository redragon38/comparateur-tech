import '../styles/globals.css'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import AIChatbot from '../components/AIChatbot'

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
        {/* Préconnexions DNS critiques */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://comparateur-tech.com" />
      </Head>
      <Component {...pageProps} />
      <AIChatbot />
    </>
  )
}
