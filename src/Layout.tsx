import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { getLenis, initSmoothScroll } from '@/lib/lenis'
import { ScrollTrigger } from '@/lib/gsap'
import { initProgress } from '@/lib/progress'
import { site } from '@/content/site'
import { GlassFilter } from '@/components/ui/liquid-glass'
import { Nav } from '@/components/Nav'
import { Cursor } from '@/components/Cursor'
import { ProgressCounter } from '@/components/ProgressCounter'
import { Footer } from '@/sections/Footer'

/** Новая страница открывается сверху; переход по якорю (#…) и «назад/вперёд» не трогаем */
function useScrollToTop() {
  const { pathname, hash } = useLocation()
  const type = useNavigationType()
  // на сервере useLayoutEffect не нужен (и ругается) — там скролла нет
  const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect
  useIso(() => {
    if (hash || type === 'POP') return
    getLenis()?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])
}

export function Layout() {
  useScrollToTop()
  useEffect(() => {
    const stopScroll = initSmoothScroll()
    const stopProgress = initProgress()
    return () => { stopProgress(); stopScroll() }
  }, [])

  return (
    <>
      <Head>
        <html lang="ru" />
        <title>{site.title}</title>
        <meta name="description" content={site.description} />
      </Head>
      <GlassFilter />
      <Nav />
      <Outlet />
      <Footer />
      <ProgressCounter />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
