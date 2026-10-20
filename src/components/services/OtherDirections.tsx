import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { directions, type Direction } from '@/content/services'
import { servicePage as t } from '@/content/pages'
import { nav } from '@/content/nav'
import { Media } from '@/components/Media'
import { SectionLabel } from '@/components/SectionLabel'
import { useIsTouch, useReducedMotion } from '@/lib/hooks'
import { useTilt } from '@/lib/motion'
import { pad2 } from '@/lib/tech'
import { cn } from '@/lib/utils'

const best = (d: Direction) => [...new Set([d.cover, ...d.images, ...d.items.map((i) => i.images[0])].filter(Boolean) as string[])].slice(0, 3)
const countOf = (d: Direction) => (d.picks ? d.picks.length : d.items.length)
const CARD = 'h-[420px] w-[80vw] shrink-0 snap-start md:h-[520px] md:w-[32vw]'

/** Карточка ленты: фото на всю площадь, градиент снизу, номер, название h2 (≤ 2 строк), «15 позиций», круг ↗ */
function Card({ d }: { d: Direction }) {
  const tilt = useTilt<HTMLAnchorElement>(5)
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [i, setI] = useState(0)
  const shots = best(d)
  const n = directions.indexOf(d) + 1
  const count = countOf(d)

  useEffect(() => {
    if (!hover || touch || reduced || shots.length < 2) { setI(0); return }
    const id = window.setInterval(() => setI((v) => (v + 1) % shots.length), 1500)
    return () => window.clearInterval(id)
  }, [hover, touch, reduced, shots.length])

  return (
    <Link
      ref={tilt}
      to={`/uslugi/${d.slug}`}
      draggable={false}
      data-cursor="open"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="hud-card group/o relative block size-full overflow-hidden rounded-lg bg-ink-2 transition-transform duration-(--t-base) ease-soft"
    >
      {shots.map((id, k) =>
        k === 0 || hover ? (
          <Media key={id} id={id} alt="" sizes="(min-width: 768px) 32vw, 80vw" draggable={false}
            className={cn('absolute inset-0 transition-opacity duration-(--t-slow) ease-soft', k === i ? 'opacity-100' : 'opacity-0')} />
        ) : null,
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,var(--de-void)_0%,color-mix(in_srgb,var(--de-void)_55%,transparent)_40%,transparent_70%)]" />
      <span aria-hidden="true" className="hud-corner hud-corner--tl" />
      <span aria-hidden="true" className="hud-corner hud-corner--tr" />
      <span aria-hidden="true" className="hud-corner hud-corner--bl" />
      <span aria-hidden="true" className="hud-corner hud-corner--br" />
      <span className="absolute right-5 top-5 grid size-12 place-items-center rounded-full text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] backdrop-blur-sm transition-[background-color,color,rotate] duration-(--t-base) ease-out-expo group-hover/o:rotate-45 group-hover/o:bg-lime group-hover/o:text-ink">
        <ArrowUpRight strokeWidth={1.5} className="size-5" />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="min-w-0">
          <p className="text-label tabular-nums text-mute-2">{pad2(n)}</p>
          <h3 className="text-h2 mt-3 line-clamp-2 break-words text-white [hyphens:auto]" lang="ru">{d.title}</h3>
          {count > 0 && <p className="text-label mt-3 text-mute-2">{nav.positions(count)}</p>}
        </div>
      </div>
    </Link>
  )
}

/**
 * «Другие направления»: горизонтальная лента всех остальных направлений (drag мышью, свайп, стрелки ← →,
 * моно-счётчик «03 / 09»), последняя карточка — лаймовая «Весь каталог», ниже — навигация
 * «← Предыдущее / Следующее →» с названиями.
 */
export function OtherDirections({ current }: { current: string }) {
  const idx = directions.findIndex((x) => x.slug === current)
  const others = directions.filter((x) => x.slug !== current)
  const prev = directions[(idx - 1 + directions.length) % directions.length]
  const next = directions[(idx + 1) % directions.length]
  const track = useRef<HTMLUListElement>(null)
  const [pos, setPos] = useState(0)

  const onScroll = useCallback(() => {
    const el = track.current
    if (!el) return
    const first = el.children[0] as HTMLElement | undefined
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : 1
    setPos(Math.min(others.length - 1, Math.round(el.scrollLeft / step)))
  }, [others.length])

  // перетаскивание мышью (на тач — нативный свайп со scroll-snap)
  useEffect(() => {
    const el = track.current
    if (!el) return
    let down = false, moved = false, sx = 0, sl = 0
    const onDown = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; el.style.scrollSnapType = 'none' }
    const onMove = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; el.scrollLeft = sl - dx }
    const onUp = () => { if (!down) return; down = false; el.style.scrollSnapType = '' }
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])

  const go = (d: number) => {
    const el = track.current
    const target = el?.children[Math.max(0, Math.min(el.children.length - 1, pos + d))] as HTMLElement | undefined
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="others-title" className="pt-24 md:pt-32">
      <div className="flex items-center justify-between gap-6 px-margin">
        <SectionLabel>{t.othersTitle}</SectionLabel>
        <h2 id="others-title" className="sr-only">{t.othersTitle}</h2>
        <div className="flex items-center gap-4">
          <p className="text-label tabular-nums text-white">{pad2(pos + 1)} <span className="text-mute-2">/ {pad2(others.length)}</span></p>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => go(-1)} aria-label={t.prevDir} className="glass grid size-12 place-items-center rounded-full text-white"><ArrowLeft strokeWidth={1.5} className="size-5" /></button>
            <button type="button" onClick={() => go(1)} aria-label={t.nextDir} className="glass grid size-12 place-items-center rounded-full text-white"><ArrowRight strokeWidth={1.5} className="size-5" /></button>
          </div>
        </div>
      </div>

      <ul ref={track} onScroll={onScroll} data-lenis-prevent className="mt-10 flex cursor-grab snap-x snap-mandatory gap-gutter overflow-x-auto scroll-px-[var(--margin)] px-margin pb-2 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden">
        {others.map((d) => <li key={d.slug} className={CARD}><Card d={d} /></li>)}
        <li className={CARD}>
          <Link to="/uslugi" draggable={false} data-cursor="open" className="group/all flex size-full flex-col justify-between rounded-lg bg-lime p-6 text-ink md:p-8">
            <span className="text-label">{t.allLabel}</span>
            <span className="text-display-xl leading-[0.9]">{t.allTitle(directions.length)}</span>
            <span className="flex items-center justify-between">
              <span className="text-h3">{t.allCta}</span>
              <span className="grid size-14 place-items-center rounded-full bg-ink text-lime transition-[rotate] duration-(--t-base) ease-out-expo group-hover/all:rotate-45">
                <ArrowUpRight strokeWidth={1.5} className="size-6" />
              </span>
            </span>
          </Link>
        </li>
      </ul>

      {/* предыдущее / следующее направление */}
      <nav aria-label={t.othersTitle} className="mt-16 grid grid-cols-2 border-t border-line px-margin md:mt-20">
        <Link to={`/uslugi/${prev.slug}`} className="group/p flex flex-col gap-3 py-8 pr-4">
          <span className="text-label inline-flex items-center gap-2 text-mute-2"><ArrowLeft strokeWidth={1.5} className="size-4 transition-transform duration-(--t-base) ease-out-expo group-hover/p:-translate-x-1" />{t.prevDir}</span>
          <span className="text-h3 text-white transition-colors duration-(--t-fast) group-hover/p:text-lime">{prev.title}</span>
        </Link>
        <Link to={`/uslugi/${next.slug}`} className="group/n flex flex-col items-end gap-3 border-l border-line py-8 pl-4 text-right">
          <span className="text-label inline-flex items-center gap-2 text-mute-2">{t.nextDir}<ArrowRight strokeWidth={1.5} className="size-4 transition-transform duration-(--t-base) ease-out-expo group-hover/n:translate-x-1" /></span>
          <span className="text-h3 text-white transition-colors duration-(--t-fast) group-hover/n:text-lime">{next.title}</span>
        </Link>
      </nav>
    </section>
  )
}
