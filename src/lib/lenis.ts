import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { isTouchDevice, prefersReducedMotion } from './hooks'

let lenis: Lenis | null = null

/**
 * Плавный скролл (DESIGN.md §8.3): Lenis lerp 0.1, синхронизирован с ScrollTrigger.
 * На тач-устройствах и при reduced-motion остаётся нативный скролл.
 */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion() || isTouchDevice()) return () => {}

  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis
