import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { cursorLabels } from '@/content/nav'
import { isTouchDevice, prefersReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

type Mode = 'default' | 'hover' | 'open' | 'media' | 'aim'

/**
 * Курсор DESIGN.md §9 (только desktop, pointer: fine): лаймовая точка 8px + кольцо 36px с инерцией,
 * mix-blend-mode: difference. Состояния по data-cursor на элементе под курсором:
 *  open  — кольцо 64px с подписью «Открыть»;  media — «Смотреть ▶»;  aim — над 3D: кольцо исчезает, точка → прицел.
 * Любая ссылка/кнопка без data-cursor — кольцо 64px без подписи. На touch и при reduced-motion отключён.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    let tx = -100, ty = -100, rx = -100, ry = -100, raf = 0
    const loop = () => {
      rx += (tx - rx) * 0.16
      ry += (ty - ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX; ty = e.clientY
      setVisible(true)
      const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select, label')
      const m = t?.getAttribute('data-cursor') as Mode | null
      setMode(m ?? (t ? (/INPUT|TEXTAREA|SELECT/.test(t.tagName) ? 'default' : 'hover') : 'default'))
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  if (!enabled) return null
  const big = mode === 'hover' || mode === 'open' || mode === 'media'
  return (
    <div aria-hidden="true" className={cn('pointer-events-none fixed inset-0 z-[100] mix-blend-difference transition-opacity duration-(--t-fast)', visible ? 'opacity-100' : 'opacity-0')}>
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className={cn(
            'grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white transition-[width,height,opacity,background-color] duration-(--t-base) ease-out-expo',
            big ? 'size-16' : 'size-9',
            (mode === 'open' || mode === 'media') && 'bg-white',
            mode === 'aim' && 'opacity-0',
          )}
        >
          {(mode === 'open' || mode === 'media') && (
            <span className="text-micro flex items-center gap-1 text-void">
              {cursorLabels[mode]}
              {mode === 'media' && <Play strokeWidth={1.5} className="size-3 fill-current" />}
            </span>
          )}
        </div>
      </div>
      <div ref={dot} className="absolute left-0 top-0">
        {mode === 'aim' ? (
          <svg viewBox="0 0 24 24" className="size-6 -translate-x-1/2 -translate-y-1/2 text-lime" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
          </svg>
        ) : (
          <div className={cn('size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime transition-opacity duration-(--t-fast)', (mode === 'open' || mode === 'media') && 'opacity-0')} />
        )}
      </div>
    </div>
  )
}
