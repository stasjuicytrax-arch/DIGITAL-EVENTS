import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Item } from '@/content/services'
import { Media } from '@/components/Media'
import { useInView, useIsTouch, useReducedMotion } from '@/lib/hooks'
import { useTilt } from '@/lib/motion'
import { useScramble } from '@/lib/scramble'
import { pad2, techChips } from '@/lib/tech'
import { cn } from '@/lib/utils'

export type Size = 'big' | 'wide' | 'small' | 'full'

/**
 * Ритм bento на 4 колонки: первая 2×2, дальше чередуем 1×1 и 2×1 так, чтобы клеток было кратно 4 —
 * вместе с grid-auto-flow: dense сетка закрывается без дыр на 1440/1920.
 */
export function bentoSizes(n: number): Size[] {
  if (!n) return []
  // одна позиция — на всю ширину, две — две широкие в ряд
  if (n === 1) return ['full']
  if (n === 2) return ['wide', 'wide']
  const rest = n - 1
  let wide = (4 - (rest % 4)) % 4
  if (wide + 4 <= rest / 2) wide += 4
  // широкие — каждая третья после большой; если не хватило — добираем с конца
  const sizes: Size[] = ['big', ...Array.from({ length: rest }, () => 'small' as Size)]
  let made = 0
  for (let k = 3; k <= rest && made < wide; k += 3) { sizes[k] = 'wide'; made++ }
  for (let k = rest; k > 0 && made < wide; k--) if (sizes[k] === 'small') { sizes[k] = 'wide'; made++ }
  return sizes
}

const SPAN: Record<Size, string> = {
  big: 'sm:col-span-2 sm:row-span-2',
  wide: 'sm:col-span-2',
  small: '',
  full: 'sm:col-span-2 sm:row-span-2 lg:col-span-4',
}

/**
 * Карточка позиции (desktop): фото «пролистывается» движением мыши по X — все фото позиции как плёнка,
 * HUD-уголки и одна scan-line сверху вниз на наведении, снизу выезжает стеклянная панель с моно-чипами
 * техтребований, tilt ≤ 6°, номер моно, glyph-scramble названия. Карточка целиком — ссылка.
 * Mobile: фото листаются сами, чипы видны сразу.
 */
export function BentoCard({ item, to, n, size = 'small', className }: { item: Item; to: string; n: number; size?: Size; className?: string }) {
  const tilt = useTilt<HTMLAnchorElement>(6)
  const [title, run] = useScramble<HTMLSpanElement>(item.title)
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const [view, inView] = useInView<HTMLDivElement>('0px')
  const [frame, setFrame] = useState(0)
  // остальные кадры подгружаем только после первого наведения (или на тач — когда карточка в кадре)
  const [armed, setArmed] = useState(false)
  const frames = item.images.slice(0, 12)
  const chips = techChips(item.techRequirements)
  const last = useRef(0)

  useEffect(() => {
    if (!touch || reduced || !inView || frames.length < 2) return
    setArmed(true)
    const id = window.setInterval(() => setFrame((f) => (f + 1) % frames.length), 2600)
    return () => window.clearInterval(id)
  }, [touch, reduced, inView, frames.length])

  const onMove = (e: React.PointerEvent) => {
    if (touch || frames.length < 2) return
    const r = e.currentTarget.getBoundingClientRect()
    const k = Math.min(frames.length - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * frames.length)))
    if (k !== last.current) { last.current = k; setFrame(k) }
  }

  return (
    <Link
      ref={tilt}
      to={to}
      id={`item-${item.slug}`}
      data-cursor="open"
      onPointerEnter={() => { setArmed(true); run() }}
      onPointerMove={onMove}
      onPointerLeave={() => { last.current = 0; setFrame(0) }}
      onFocus={run}
      className={cn('bento-card hud-card group/b relative block h-full scroll-mt-32 overflow-hidden rounded-md bg-ink-2 transition-transform duration-(--t-base) ease-soft', className)}
    >
      <div ref={view} className="absolute inset-0">
        {frames.map((id, k) =>
          k === 0 || armed ? (
            <Media
              key={id}
              id={id}
              alt=""
              sizes={size === 'small' ? '(min-width: 1024px) 25vw, 80vw' : '(min-width: 1024px) 50vw, 80vw'}
              className={cn('absolute inset-0 transition-opacity duration-(--t-fast) ease-soft', k === frame ? 'opacity-100' : 'opacity-0')}
              imgClassName="transition-transform duration-(--t-slow) ease-out-expo group-hover/b:scale-[1.04]"
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--de-void)_0%,color-mix(in_srgb,var(--de-void)_40%,transparent)_45%,transparent_75%)]" />
      </div>

      {/* плёнка: сегмент на каждый кадр */}
      {frames.length > 1 && (
        <div aria-hidden="true" className="absolute inset-x-4 top-4 flex gap-1 opacity-100 transition-opacity duration-(--t-fast) lg:opacity-0 lg:group-hover/b:opacity-100">
          {frames.map((id, k) => <span key={id} className={cn('h-0.5 flex-1 rounded-full', k === frame ? 'bg-lime' : 'bg-white/25')} />)}
        </div>
      )}

      <span aria-hidden="true" className="hud-corner hud-corner--tl" />
      <span aria-hidden="true" className="hud-corner hud-corner--tr" />
      <span aria-hidden="true" className="hud-corner hud-corner--bl" />
      <span aria-hidden="true" className="hud-corner hud-corner--br" />
      <span aria-hidden="true" className="bento-scan" />

      <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-label tabular-nums text-mute-2 transition-colors duration-(--t-fast) group-hover/b:text-lime">{pad2(n)}</p>
            <h3 className={cn('mt-3 text-white', size === 'big' || size === 'full' ? 'text-h2' : 'text-h3')}>
              <span ref={title}>{item.title}</span>
            </h3>
            {size !== 'small' && item.lead && <p className="text-small mt-3 line-clamp-2 max-w-[44ch] text-white/75">{item.lead}</p>}
          </div>
          <ArrowUpRight strokeWidth={1.5} className="size-6 shrink-0 text-white transition-transform duration-(--t-base) ease-out-expo group-hover/b:rotate-45" />
        </div>
        {chips.length > 0 && (
          <div className="bento-tech glass mt-4 flex flex-wrap gap-1.5 rounded-sm p-2">
            {chips.map((c) => <span key={c} className="text-micro rounded-pill bg-void/40 px-2.5 py-1 text-white">{c}</span>)}
          </div>
        )}
      </div>
    </Link>
  )
}

/** Позиции направления: bento на desktop, горизонтальный свайп-слайдер на mobile */
export function BentoItems({ dir, items, start = 1 }: { dir: string; items: Item[]; start?: number }) {
  const sizes = bentoSizes(items.length)
  return (
    <ul className="bento-grid flex snap-x snap-mandatory gap-gutter overflow-x-auto px-margin pb-2 [scrollbar-width:none] sm:grid sm:auto-rows-[clamp(240px,20vw,360px)] sm:grid-flow-dense sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden" data-lenis-prevent-touch>
      {items.map((it, k) => (
        <li key={it.slug} className={cn('h-[min(68svh,520px)] w-[80vw] shrink-0 snap-start sm:h-auto sm:w-auto', SPAN[sizes[k]])}>
          <BentoCard item={it} to={`/uslugi/${dir}/${it.slug}`} n={start + k} size={sizes[k]} />
        </li>
      ))}
    </ul>
  )
}
