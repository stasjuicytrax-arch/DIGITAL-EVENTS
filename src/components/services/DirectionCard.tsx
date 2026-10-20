import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { nav } from '@/content/nav'
import { useIsTouch, useReducedMotion } from '@/lib/hooks'
import { useTilt } from '@/lib/motion'
import { pad2 } from '@/lib/tech'
import { cn } from '@/lib/utils'

/**
 * Карточка направления в каталоге: фото на всю площадь (--r-lg), снизу поверх — стеклянная панель
 * с моно-номером, названием, описанием и строкой «9 позиций» + кнопка-круг ↗.
 * Hover (desktop): фото медленно зумится и листает 3 лучших кадра, панель приподнимается и показывает
 * «Подробнее», лаймовые HUD-уголки, tilt ≤ 4°. reduced-motion и тач — без листания и tilt.
 */
export function DirectionCard({ to, n, title, summary, count, frames, more }: {
  to: string; n: number; title: string; summary: string; count: number; frames: string[]; more: string
}) {
  const tilt = useTilt<HTMLAnchorElement>(4)
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [i, setI] = useState(0)
  const shots = frames.slice(0, 3)

  useEffect(() => {
    if (!hover || touch || reduced || shots.length < 2) { setI(0); return }
    const id = window.setInterval(() => setI((v) => (v + 1) % shots.length), 1600)
    return () => window.clearInterval(id)
  }, [hover, touch, reduced, shots.length])

  return (
    <Link
      ref={tilt}
      to={to}
      data-cursor="open"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="dir-card hud-card group/d relative block h-[460px] overflow-hidden rounded-lg bg-ink-2 transition-transform duration-(--t-base) ease-soft"
    >
      <div className="absolute inset-0 transition-transform duration-[2400ms] ease-out-expo group-hover/d:scale-[1.06]">
        {shots.map((id, k) =>
          k === 0 || hover ? (
            <Media
              key={id}
              id={id}
              alt=""
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className={cn('absolute inset-0 transition-opacity duration-(--t-slow) ease-soft', k === i ? 'opacity-100' : 'opacity-0')}
            />
          ) : null,
        )}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--de-void)_70%,transparent),transparent_55%)]" />

      <span aria-hidden="true" className="hud-corner hud-corner--tl" />
      <span aria-hidden="true" className="hud-corner hud-corner--tr" />
      <span aria-hidden="true" className="hud-corner hud-corner--bl" />
      <span aria-hidden="true" className="hud-corner hud-corner--br" />

      <div className="glass absolute inset-x-3 bottom-3 rounded-md p-5 transition-transform duration-(--t-base) ease-out-expo group-hover/d:-translate-y-2">
        <p className="text-label tabular-nums text-mute-2 transition-colors duration-(--t-fast) group-hover/d:text-lime">{pad2(n)}</p>
        <h2 className="text-h3 mt-2 text-white">{title}</h2>
        <p className="text-small mt-2 line-clamp-2 text-white/75">{summary}</p>
        {/* «Подробнее» раскрывается на наведении */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--t-base) ease-out-expo group-hover/d:grid-rows-[1fr] group-focus-visible/d:grid-rows-[1fr]">
          <span className="text-label overflow-hidden text-white"><span className="link-underline mt-3 inline-block">{more}</span></span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-micro text-mute-2">{count ? nav.positions(count) : ''}</span>
          <span className="grid size-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] transition-[background-color,color,rotate] duration-(--t-base) ease-out-expo group-hover/d:rotate-45 group-hover/d:bg-lime group-hover/d:text-ink">
            <ArrowUpRight strokeWidth={1.5} className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
