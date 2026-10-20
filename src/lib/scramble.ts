import { useCallback, useRef } from 'react'
import { prefersReducedMotion } from './hooks'

// Glyph scramble (DESIGN.md §8.2): текст «перебирает» символы ~300 мс и собирается
const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺ0123456789/{}[]<>#%=+*'

// одна анимация на элемент: новый запуск отменяет прошлый, слово всегда собирается в исходный текст
const running = new WeakMap<HTMLElement, () => void>()

export function scrambleTo(el: HTMLElement, text: string, duration = 300) {
  running.get(el)?.()
  if (prefersReducedMotion()) { el.textContent = text; return () => {} }
  const start = performance.now()
  let raf = 0
  // страховка: если rAF притормозил (фоновая вкладка, тяжёлый кадр), текст всё равно вернётся
  const guard = window.setTimeout(() => finish(), duration + 120)
  const finish = () => {
    cancelAnimationFrame(raf)
    clearTimeout(guard)
    el.textContent = text
    if (running.get(el) === finish) running.delete(el)
  }
  running.set(el, finish)
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration)
    const settled = Math.floor(p * text.length)
    let out = ''
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      out += i < settled || ch === ' ' || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    if (p >= 1) return finish()
    el.textContent = out
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return finish
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
