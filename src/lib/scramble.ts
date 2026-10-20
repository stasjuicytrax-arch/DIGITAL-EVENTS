import { useCallback, useRef } from 'react'
import { prefersReducedMotion } from './hooks'

// Glyph scramble (DESIGN.md §8.2): текст «перебирает» символы ~300 мс и собирается
const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺ0123456789/{}[]<>#%=+*'

export function scrambleTo(el: HTMLElement, text: string, duration = 300) {
  if (prefersReducedMotion()) { el.textContent = text; return () => {} }
  const start = performance.now()
  let raf = 0
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration)
    const settled = Math.floor(p * text.length)
    let out = ''
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      out += i < settled || ch === ' ' || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = out
    if (p < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => { cancelAnimationFrame(raf); el.textContent = text }
}

/** Возвращает ref для элемента с текстом и обработчик запуска (на hover/focus родителя). */
export function useScramble<T extends HTMLElement>(text: string, duration = 300) {
  const ref = useRef<T>(null)
  const stop = useRef<() => void>(() => {})
  const run = useCallback(() => {
    if (!ref.current) return
    stop.current()
    stop.current = scrambleTo(ref.current, text, duration)
  }, [text, duration])
  return [ref, run] as const
}
