import { useEffect, useRef, type RefObject } from 'react'
import type { EngineOptions, LiquidEngine, Rect } from './liquid-engine'
import { cn } from '@/lib/utils'

type Props = {
  /** широкая картинка (desktop/tablet) и вертикальная (телефон < 640px), PNG/WebP с прозрачным фоном */
  wideSrc: string
  tallSrc: string
  alt: string
  /** элемент, над которым курсор «разжижает» скульптуру (обычно вся панель hero) */
  pointerTarget: RefObject<HTMLElement>
  className?: string
}

const BG: [number, number, number] = [0x12 / 255, 0x12 / 255, 0x12 / 255] // --de-graphite

/**
 * Скульптура из частиц (Liquid Sculpture Hero, prompts/liquid-sculpture-hero.txt), адаптирована под TZ §5 блок 1:
 *  — тема всегда тёмная, своя раскладка, без навбара/шрифтов/переключателя из демо;
 *  — touch: без распада под пальцем, частиц ×0.25; reduced-motion: один статичный кадр;
 *  — нет WebGL2: показывается статичная картинка; вне экрана рендер на паузе (IntersectionObserver).
 */
export function SculptureStage({ wideSrc, tallSrc, alt, pointerTarget, className }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const root = stage.current
    const target = pointerTarget.current
    if (!root || !target) return
    let engine: LiquidEngine | null = null
    let canvas: HTMLCanvasElement | null = null
    let disposed = false
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    let aspect = 2.5
    let mobile = root.clientWidth < 640

    // скульптура вписывается в сцену с полями, по центру верхней части
    // ≥1280: слева от колонки с лидом, над заголовком; уже — по центру над заголовком
    const rectFor = (w: number, h: number): Rect => {
      const wide = w >= 1200
      const maxW = w * (mobile ? 1.05 : wide ? 0.58 : 0.86)
      const maxH = h * (mobile ? 0.5 : wide ? 0.5 : 0.48)
      let rw = maxW
      if (rw / aspect > maxH) rw = maxH * aspect
      const rh = rw / aspect
      const cx = w * (wide ? 0.38 : 0.5)
      const cy = h * (mobile ? 0.3 : wide ? 0.36 : 0.34)
      return { x: cx - rw / 2, y: cy - rh / 2, w: rw, h: rh }
    }
    const layout = () => {
      const w = root.clientWidth, h = root.clientHeight
      const r = rectFor(w, h)
      if (img.current) Object.assign(img.current.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` })
      engine?.resize(w, h, r)
    }

    const load = (src: string) => {
      if (img.current) img.current.src = src
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        if (disposed) return
        aspect = image.naturalWidth / image.naturalHeight || aspect
        layout()
        if (!engine) return
        try {
          engine.onFirstFrame = () => { if (!disposed) root.dataset.gl = 'on' }
          engine.setImage(image)
          layout()
        } catch { root.dataset.gl = 'off' }
      }
      image.src = src
    }

    // движок грузится отдельным чанком (TZ §9: тяжёлое — через dynamic import)
    import('./liquid-engine').then(({ LiquidEngine }) => {
      if (disposed) return
      canvas = document.createElement('canvas')
      canvas.className = 'sculpture-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      root.appendChild(canvas)
      const opts: EngineOptions = {
        interactive: !touch && !reduce,
        strength: 1, radius: 220, density: touch ? 0.25 : 1, dotSize: 1, spread: 1, turbulence: 1,
        returnSpeed: 1.6, streaks: true, restStyle: 'image', ambient: !reduce, ambientIntensity: 0.35,
        speed: 1, intro: !reduce, reducedMotion: reduce, bg: BG, imgBg: null, liquid: 1,
      }
      try {
        engine = new LiquidEngine(canvas, opts, () => { root.dataset.gl = 'off' })
      } catch {
        root.dataset.gl = 'off'
      }
      load(mobile ? tallSrc : wideSrc)
    })

    const ro = new ResizeObserver(() => {
      const m = root.clientWidth < 640
      if (m !== mobile) { mobile = m; load(m ? tallSrc : wideSrc) }
      layout()
    })
    ro.observe(root)
    const io = new IntersectionObserver(([e]) => engine?.setVisible(e.isIntersecting && !document.hidden))
    io.observe(root)
    const onVis = () => engine?.setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)

    const pos = (e: PointerEvent) => {
      const b = root.getBoundingClientRect()
      return [e.clientX - b.left, e.clientY - b.top] as const
    }
    const onMove = (e: PointerEvent) => { const [x, y] = pos(e); engine?.pointer('move', x, y, e.pointerType === 'touch') }
    const onDown = (e: PointerEvent) => { const [x, y] = pos(e); engine?.pointer('down', x, y, e.pointerType === 'touch') }
    const onUp = (e: PointerEvent) => { const [x, y] = pos(e); engine?.pointer('up', x, y, e.pointerType === 'touch') }
    const onLeave = (e: PointerEvent) => { const [x, y] = pos(e); engine?.pointer('leave', x, y, e.pointerType === 'touch') }
    target.addEventListener('pointermove', onMove, { passive: true })
    target.addEventListener('pointerdown', onDown, { passive: true })
    target.addEventListener('pointerup', onUp, { passive: true })
    target.addEventListener('pointercancel', onUp, { passive: true })
    target.addEventListener('pointerleave', onLeave, { passive: true })

    return () => {
      disposed = true
      ro.disconnect(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerdown', onDown)
      target.removeEventListener('pointerup', onUp)
      target.removeEventListener('pointercancel', onUp)
      target.removeEventListener('pointerleave', onLeave)
      engine?.destroy()
      canvas?.remove()
      delete root.dataset.gl
    }
  }, [wideSrc, tallSrc, pointerTarget])

  return (
    <div ref={stage} className={cn('sculpture-stage pointer-events-none absolute inset-0', className)}>
      {/* статичная картинка: видна до первого кадра WebGL и вместо него, если WebGL2 нет */}
      <img ref={img} src={wideSrc} alt="" aria-hidden="true" draggable={false} className="sculpture-fallback absolute max-w-none select-none" />
      <span className="sr-only">{alt}</span>
    </div>
  )
}
