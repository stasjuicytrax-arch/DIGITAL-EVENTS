import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { useTilt } from '@/lib/motion'
import { useScramble } from '@/lib/scramble'
import { nav } from '@/content/nav'
import { cn } from '@/lib/utils'

/** Карточка направления (каталог, «Другие направления»): большое фото, номер, название, число позиций, ↗; tilt + scramble номера */
export function DirectionCard({ to, n, title, count, cover, wide, className }: {
  to: string; n: string; title: string; count: number; cover?: string; wide?: boolean; className?: string
}) {
  const tilt = useTilt<HTMLAnchorElement>(6)
  const [num, run] = useScramble<HTMLSpanElement>(n)
  return (
    <Link
      ref={tilt}
      to={to}
      data-cursor="open"
      onPointerEnter={run}
      onFocus={run}
      className={cn('group/card block overflow-hidden rounded-lg bg-ink-2 transition-transform duration-(--t-base) ease-soft will-change-transform', className)}
    >
      <div className={cn('relative overflow-hidden', wide ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[4/3]')}>
        {cover && <Media id={cover} alt="" sizes={wide ? '100vw' : '(min-width: 768px) 50vw, 100vw'} className="size-full" imgClassName="transition-transform duration-(--t-slow) ease-out-expo group-hover/card:scale-[1.04]" />}
      </div>
      <div className="flex items-end justify-between gap-6 p-6 md:p-8">
        <div>
          <span ref={num} className="text-label tabular-nums text-mute-2 transition-colors duration-(--t-fast) group-hover/card:text-lime">{n}</span>
          <h2 className="text-h2 mt-4 text-white">{title}</h2>
          {count > 0 && <p className="text-micro mt-3 text-mute-2">{nav.positions(count)}</p>}
        </div>
        <ArrowUpRight strokeWidth={1.5} className="size-8 shrink-0 text-white transition-transform duration-(--t-base) ease-out-expo group-hover/card:rotate-45" />
      </div>
    </Link>
  )
}

/** Карточка позиции: фото-обложка, название, первая фраза, тег, ↗ (TZ §5.2 п.2) */
export function ItemCard({ to, title, lead, tag, cover, badge }: {
  to: string; title: string; lead: string; tag: string; cover?: string; badge?: string
}) {
  const tilt = useTilt<HTMLAnchorElement>(5)
  return (
    <Link ref={tilt} to={to} data-cursor="open" className="group/item flex h-full flex-col overflow-hidden rounded-md bg-ink-2 transition-transform duration-(--t-base) ease-soft">
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover && <Media id={cover} alt="" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="size-full" imgClassName="transition-transform duration-(--t-slow) ease-out-expo group-hover/item:scale-[1.04]" />}
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="text-micro rounded-pill bg-void/75 px-3 py-1.5 text-white backdrop-blur-sm">{tag}</span>
          {badge && <span className="text-micro rounded-pill bg-volt px-3 py-1.5 text-ink">{badge}</span>}
        </div>
      </div>
      <div className="flex flex-1 items-start justify-between gap-4 p-6">
        <div>
          <h3 className="text-h3 text-white">{title}</h3>
          {lead && <p className="text-small mt-3 line-clamp-3 text-mute-2">{lead}</p>}
        </div>
        <ArrowUpRight strokeWidth={1.5} className="size-6 shrink-0 text-white transition-transform duration-(--t-base) ease-out-expo group-hover/item:rotate-45" />
      </div>
    </Link>
  )
}
