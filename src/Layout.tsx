import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { initSmoothScroll } from '@/lib/lenis'
import { initProgress } from '@/lib/progress'
import { site } from '@/content/site'
import { GlassFilter } from '@/components/ui/liquid-glass'
import { Nav } from '@/components/Nav'
import { Cursor } from '@/components/Cursor'
import { ProgressCounter } from '@/components/ProgressCounter'
import { Footer } from '@/sections/Footer'

export function Layout() {
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
