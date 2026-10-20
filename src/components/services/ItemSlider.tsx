import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { itemPage } from '@/content/pages'
import { pad2 } from '@/lib/tech'
import { cn } from '@/lib/utils'

/**
 * Слайдер фото позиции: большой кадр (--r-lg) с crossfade, перетаскивание мышью и свайп,
 * стрелки liquid glass, моно-счётчик «02 / 06», полоса миниатюр (активная — лаймовая рамка).
 * Стрелки ← → с клавиатуры, когда слайдер в фокусе. Индекс отдаётся наружу — для размытого фона страницы.
 */
export function ItemSlider({ ids, alt, onIndex }: { ids: string[]; alt: (n: number) => string; onIndex?: (i: number) => void }) {
  const [i, setI] = useState(0)
  const n = ids.length
  const start = useRef<number | null>(null)
  const thumbs = useRef<HTMLUListElement>(null)
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n])

  useEffect(() => {
    onIndex?.(i)
    const t = thumbs.current?.children[i] as HTMLElement | undefined
    t?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [i, onIndex])

  return (
    <div
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={alt(i + 1)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      className="rounded-lg focus-visible:outline-offset-4"
    >
      <div
        className="relative aspect-[4/3] cursor-grab touch-pan-y overflow-hidden rounded-lg bg-ink-2 active:cursor-grabbing"
        onPointerDown={(e) => { start.current = e.clientX }}
        onPointerUp={(e) => {
          if (start.current === null) return
          const dx = e.clientX - start.current
          start.current = null
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        }}
        onPointerCancel={() => { start.current = null }}
      >
        {ids.map((id, k) => (
          <Media
            key={id}
            id={id}
            alt={k === i ? alt(k + 1) : ''}
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority={k === 0}
            draggable={false}
            className={cn('absolute inset-0 transition-opacity duration-(--t-base) ease-soft', k === i ? 'opacity-100' : 'opacity-0')}
          />
        ))}
        {n > 1 && (
          <>
            <p className="text-label glass absolute left-4 top-4 rounded-pill px-3 py-2 tabular-nums text-white">
              {pad2(i + 1)} <span className="text-mute-2">/ {pad2(n)}</span>
            </p>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label={itemPage.prev} className="glass grid size-12 place-items-center rounded-full text-white">
                <ArrowLeft strokeWidth={1.5} className="size-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label={itemPage.next} className="glass grid size-12 place-items-center rounded-full text-white">
                <ArrowRight strokeWidth={1.5} className="size-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {n > 1 && (
        <ul ref={thumbs} data-lenis-prevent className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ids.map((id, k) => (
            <li key={id} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={alt(k + 1)}
                aria-current={k === i || undefined}
                className={cn(
                  'block h-16 w-24 overflow-hidden rounded-sm transition-[box-shadow,opacity] duration-(--t-fast) ease-soft md:h-20 md:w-28',
                  k === i ? 'opacity-100 shadow-[0_0_0_2px_var(--de-lime)]' : 'opacity-50 hover:opacity-100',
                )}
              >
                <Media id={id} alt="" sizes="112px" className="size-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
