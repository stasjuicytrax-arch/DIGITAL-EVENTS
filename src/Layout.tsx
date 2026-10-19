import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { initSmoothScroll } from '@/lib/lenis'
import { site } from '@/content/site'

export function Layout() {
  useEffect(() => initSmoothScroll(), [])

  return (
    <>
      <Head>
        <html lang="ru" />
        <title>{site.title}</title>
        <meta name="description" content={site.description} />
      </Head>
      <Outlet />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
