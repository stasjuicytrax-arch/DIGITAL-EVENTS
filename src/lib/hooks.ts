import { useEffect, useRef, useState, type RefObject } from 'react'
import { isBrowser } from './utils'

function useMedia(query: string, ssrValue = false) {
  const [matches, setMatches] = useState(ssrValue)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])
  return matches
}

/** prefers-reduced-motion: reduce (DESIGN.md §8.4) */
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

/** Тач-устройство без точного указателя: курсор и Lenis отключаются */
export const useIsTouch = () => useMedia('(hover: none), (pointer: coarse)')

export const prefersReducedMotion = () =>
  isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isTouchDevice = () =>
  isBrowser && window.matchMedia('(hover: none), (pointer: coarse)').matches

/** Элемент в зоне видимости (rootMargin 200px по TZ §6 для тяжёлых сцен) */
export function useInView<T extends Element>(
  rootMargin = '200px',
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, inView]
}
