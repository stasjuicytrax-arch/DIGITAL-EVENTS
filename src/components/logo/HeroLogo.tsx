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

export type LogoVariant = 'mobile' | 'desktop'

// мобильный и десктопный экземпляры взаимоисключающие — одновременно жив максимум один WebGL-контекст
const QUERY: Record<LogoVariant, string> = { mobile: '(max-width: 1023px)', desktop: '(min-width: 1024px)' }

/**
 * Hero: 3D-логотип (three.js / R3F). Пока чанк грузится, без WebGL и на сервере — плоский SVG-знак
 * на том же месте. Рендер на паузе вне экрана; при reduced-motion — статичный кадр.
 * mobile — белый хром над заголовком; desktop — лаймовый хром за текстом, справа от центра, следует за курсором.
 */
export function HeroLogo({ variant, className }: { variant: LogoVariant; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>('200px')
  const reduced = useReducedMotion()
  const touch = useIsTouch()
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(QUERY[variant])
    const update = () => setMounted(mq.matches && hasWebGL())
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [variant])

  return (
    <div ref={ref} className={cn('pointer-events-none', className)} data-cursor="aim">
      {/* плоский знак: SSR, загрузка, фолбэк */}
      <div
        className={cn(
          'absolute inset-0 grid place-items-center transition-opacity duration-(--t-slow) ease-soft',
          variant === 'desktop' && 'justify-items-end pr-[24%]',
          ready && 'opacity-0',
        )}
      >
        <LogoMark className={cn(variant === 'desktop' ? 'h-[64%] text-lime/10' : 'h-[62%] max-h-80 text-white/10')} />
      </div>
      {mounted && (
        <div className={cn('absolute inset-0 opacity-0 transition-opacity duration-(--t-slow) ease-soft', ready && 'opacity-100')}>
          <Suspense fallback={null}>
            <Logo3D variant={variant} active={inView} reduced={reduced} touch={touch} onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
