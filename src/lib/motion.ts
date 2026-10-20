import { useEffect, useRef } from 'react'
import { gsap } from './gsap'
import { isTouchDevice, prefersReducedMotion } from './hooks'

/** Tilt 3D (DESIGN §8.2): карточка наклоняется к курсору (≤ 8°). Без притяжения к курсору. */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || isTouchDevice() || prefersReducedMotion()) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.transform = `perspective(1200px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave) }
  }, [max])
  return ref
}

/** Parallax media (DESIGN §8.2): содержимое маски сдвигается на ±amount% по скроллу */
export function useParallax<T extends HTMLElement>(amount = 10) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const tween = gsap.fromTo(el, { yPercent: -amount / 2 }, {
      yPercent: amount / 2, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [amount])
  return ref
}
