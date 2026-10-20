import { lazy, Suspense, useEffect, useState } from 'react'
import { LogoMark } from './LogoMark'
import { useInView, useIsTouch, useReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const Logo3D = lazy(() => import('./Logo3D'))

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Hero: 3D-логотип (three.js / R3F). Пока чанк грузится, без WebGL и на сервере — плоский SVG-знак
 * на том же месте. Рендер на паузе вне экрана; при reduced-motion — статичный кадр.
 */
export function HeroLogo({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>('200px')
  const reduced = useReducedMotion()
  const touch = useIsTouch()
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => setMounted(hasWebGL()), [])

  return (
    <div ref={ref} className={cn('pointer-events-none', className)} data-cursor="aim">
      {/* плоский знак: SSR, загрузка, фолбэк */}
      <div className={cn('absolute inset-0 grid place-items-center transition-opacity duration-(--t-slow) ease-soft xl:justify-items-start xl:pl-[16%]', ready && 'opacity-0')}>
        <LogoMark className="h-[62%] max-h-80 text-white/10" />
      </div>
      {mounted && (
        <div className={cn('absolute inset-0 opacity-0 transition-opacity duration-(--t-slow) ease-soft', ready && 'opacity-100')}>
          <Suspense fallback={null}>
            <Logo3D active={inView} reduced={reduced} touch={touch} onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
