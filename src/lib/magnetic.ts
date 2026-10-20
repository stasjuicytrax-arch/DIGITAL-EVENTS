import { useEffect, useRef } from 'react'
import { isTouchDevice, prefersReducedMotion } from './hooks'

/**
 * Magnetic (DESIGN.md §8.2): элемент тянется за курсором в радиусе `radius` px с силой `strength`.
 * Только transform; на тач-устройствах и при reduced-motion выключено.
 */
export function useMagnetic<T extends HTMLElement>(radius = 80, strength = 0.3) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || isTouchDevice() || prefersReducedMotion()) return
    let raf = 0
    let tx = 0, ty = 0, x = 0, y = 0
    const loop = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      const dx = e.clientX - cx, dy = e.clientY - cy
      const reach = radius + Math.max(r.width, r.height) / 2
      const inside = Math.hypot(dx, dy) < reach
      tx = inside ? dx * strength : 0
      ty = inside ? dy * strength : 0
      kick()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); el.style.translate = '' }
  }, [radius, strength])
  return ref
}
