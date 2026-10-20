import { useEffect, useRef, type RefObject } from 'react'
import { ScrollTrigger } from './gsap'
import { prefersReducedMotion, useInView } from './hooks'

type Options = {
  /** базовая скорость, px/с */
  speed?: number
  /** наклон skewX от скорости скролла, ≤ 6° (DESIGN §8.2) */
  skew?: boolean
}

/**
 * Scroll-velocity marquee (DESIGN.md §8.2): ряды едут навстречу друг другу (чётные влево, нечётные вправо),
 * ускоряются и наклоняются от скорости скролла. Содержимое ряда должно быть продублировано дважды.
 * Вне экрана и при reduced-motion стоит.
 */
export function useVelocityMarquee<T extends HTMLElement>({ speed = 60, skew = false }: Options = {}) {
  const [section, inView] = useInView<T>('0px')
  const rows = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return
    const els = rows.current.filter(Boolean) as HTMLElement[]
    const offsets = els.map(() => 0)
    let velocity = 0, tilt = 0, raf = 0, last = performance.now()
    const st = ScrollTrigger.create({
      trigger: section.current, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => { velocity = self.getVelocity() },
    })
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000
      last = now
      velocity *= 0.9
      const boost = Math.min(6, Math.abs(velocity) / 400)
      tilt += ((skew ? Math.max(-6, Math.min(6, velocity / 300)) : 0) - tilt) * 0.12
      els.forEach((el, i) => {
        const dir = i % 2 === 0 ? -1 : 1
        const half = el.scrollWidth / 2
        offsets[i] = (offsets[i] + dir * speed * (1 + boost) * dt) % half
        const x = dir < 0 ? offsets[i] : offsets[i] - half
        el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)${skew ? ` skewX(${(i % 2 ? -tilt : tilt).toFixed(2)}deg)` : ''}`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); st.kill() }
  }, [inView, section, speed, skew])

  const rowRef = (i: number) => (el: HTMLElement | null) => { rows.current[i] = el }
  return [section as RefObject<T>, rowRef] as const
}
