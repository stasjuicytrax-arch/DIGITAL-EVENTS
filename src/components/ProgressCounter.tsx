import { useEffect, useRef } from 'react'
import { onProgress } from '@/lib/progress'

/** Моно-счётчик прогресса скролла `023 / 100` в правом нижнем углу (TZ §8, DESIGN.md §8.2). */
export function ProgressCounter() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(
    () =>
      onProgress((p) => {
        if (ref.current) ref.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      }),
    [],
  )
  return (
    <p aria-hidden="true" className="text-micro pointer-events-none fixed bottom-4 right-(--margin) z-20 text-mute-2 tabular-nums mix-blend-difference">
      <span ref={ref} className="text-white">000</span> / 100
    </p>
  )
}
