import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { ArrowUpRight, Plus } from 'lucide-react'
import { catalog } from '@/content/catalog'
import { directions } from '@/content/services'
import { catalogPage as t } from '@/content/pages'
import { nav } from '@/content/nav'
import { site } from '@/content/site'
import { getMedia, Media } from '@/components/Media'
import { SectionLabel } from '@/components/SectionLabel'
import { Button } from '@/components/ui/button'
import { CodeBackground } from '@/components/ui/code-background'
import { useMedia, useReducedMotion } from '@/lib/hooks'
import { useScramble } from '@/lib/scramble'
import { pad2 } from '@/lib/tech'
import { CtaBanner } from '@/components/CtaBanner'
import { cn } from '@/lib/utils'

const IndexPreviewGL = lazy(() => import('@/components/services/IndexPreviewGL'))

const url = (id: string) => {
  const m = getMedia(id)
  return m ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${m.src}-640.webp` : ''
}

/** Лучшие кадры направления для превью: обложка, фото направления, обложки позиций */
function previewSet(slug: string) {
  const d = directions.find((x) => x.slug === slug)
  const ids = [...new Set([d?.cover, ...(d?.images ?? []), ...(d?.items.map((i) => i.images[0]) ?? [])].filter(Boolean) as string[])]
  return ids.slice(0, 4).map(url).filter(Boolean)
}

function Row({ n, slug, title, count, onEnter }: { n: number; slug: string; title: string; count: number; onEnter: () => void }) {
  const [num, run] = useScramble<HTMLSpanElement>(pad2(n))
  return (
    <li className="index-row border-b border-line">
      <Link
        to={`/uslugi/${slug}`}
        data-cursor="open"
        onPointerEnter={() => { onEnter(); run() }}
        onFocus={() => { onEnter(); run() }}
        className="group/row grid grid-cols-12 items-baseline gap-gutter px-margin py-6 transition-colors duration-(--t-base) ease-soft"
      >
        <span ref={num} className="text-label col-span-1 tabular-nums text-mute-2 transition-colors duration-(--t-fast) group-hover/row:text-lime">{pad2(n)}</span>
        <span className="text-display-xl col-span-9 leading-[0.95]">{title}</span>
        <span className="col-span-2 flex items-center justify-end gap-4 self-center">
          <span className="text-label whitespace-nowrap text-mute-2">{count ? nav.positions(count) : ''}</span>
          <ArrowUpRight strokeWidth={1.5} className="size-8 shrink-0 transition-transform duration-(--t-base) ease-out-expo group-hover/row:rotate-45" />
        </span>
      </Link>
    </li>
  )
}

/** Mobile: строка-аккордеон, внутри фото, описание и ссылка */
function AccordionRow({ n, slug, title, count, summary, cover, open, onToggle }: {
  n: number; slug: string; title: string; count: number; summary: string; cover?: string; open: boolean; onToggle: () => void
}) {
  return (
    <li className="border-b border-line">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-4 px-margin py-6 text-left">
        <span className={cn('text-label mt-2 tabular-nums', open ? 'text-lime' : 'text-mute-2')}>{pad2(n)}</span>
        <span className="text-h2 flex-1">{title}</span>
        <Plus strokeWidth={1.5} className={cn('mt-1 size-6 shrink-0 transition-transform duration-(--t-base) ease-out-expo', open && 'rotate-45')} />
      </button>
      <div className={cn('grid transition-[grid-template-rows] duration-(--t-base) ease-out-expo', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <div className="px-margin pb-8">
            {cover && <Media id={cover} alt="" sizes="100vw" className="aspect-[3/2] rounded-md" />}
            <p className="text-small mt-4 text-mute-2">{summary}</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-micro text-mute-2">{count ? nav.positions(count) : ''}</span>
              <Button variant="link" href={`/uslugi/${slug}`} tabIndex={open ? 0 : -1}>{title}</Button>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

/**
 * Каталог /uslugi: hero «ТАК ЧТО МЫ УМЕЕМ?» на фоне code-background, огромный типографский индекс
 * 10 направлений. Desktop hover: за курсором летит WebGL-превью (кадры направления, liquid + RGB-сдвиг),
 * остальные строки гаснут до --de-mute. Mobile: строки-аккордеоны с фото внутри.
 */
export function Component() {
  const title = useRef<HTMLDivElement>(null)
  const desktop = useMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [gl, setGl] = useState(false)
  const sets = useMemo(() => catalog.map((d) => previewSet(d.slug)), [])
  // WebGL грузим только на desktop и только когда курсор впервые дошёл до индекса
  useEffect(() => { if (active !== null) setGl(true) }, [active])

  return (
    <main id="main" className="pb-24">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/uslugi`} />
      </Head>

      <section aria-labelledby="catalog-title" className="relative isolate flex min-h-[72svh] flex-col justify-end overflow-hidden bg-[linear-gradient(to_bottom,var(--de-void),var(--de-graphite)_40%,var(--de-void))] pb-16 pt-40 md:pb-24">
        <CodeBackground keepOut={title} className="[mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />
        <div className="relative grid grid-cols-4 gap-gutter px-margin md:grid-cols-12">
          <SectionLabel className="col-span-4 md:col-span-3">{t.label}</SectionLabel>
          <div ref={title} className="col-span-4 mt-8 md:col-span-9 md:mt-0">
            <h1 id="catalog-title" className="text-display-xl">
              <span className="reveal-line"><span className="text-white">{t.titleTop}</span></span>
              <span className="reveal-line" style={{ ['--d' as string]: 1 }}><span className="text-mute md:pl-[1.2em]">{t.titleBottom}</span></span>
            </h1>
            <p className="text-label fade-up mt-6 text-mute-2" style={{ ['--d' as string]: 2 }}>{t.footnote}</p>
          </div>
        </div>
      </section>

      {/* индекс направлений */}
      <nav aria-label={t.label}>
        <ul className="index-list hidden border-t border-line lg:block" onPointerLeave={() => setActive(null)}>
            {catalog.map((d, i) => (
              <Row key={d.slug} n={i + 1} slug={d.slug} title={d.title} count={d.count} onEnter={() => desktop && setActive(i)} />
            ))}
          </ul>
          <ul className="border-t border-line lg:hidden">
            {catalog.map((d, i) => (
              <AccordionRow
                key={d.slug}
                n={i + 1}
                slug={d.slug}
                title={d.title}
                count={d.count}
                summary={d.summary}
                cover={d.cover}
                open={open === i}
                onToggle={() => setOpen((v) => (v === i ? null : i))}
              />
            ))}
          </ul>
      </nav>
      {desktop && gl && (
        <Suspense fallback={null}>
          <IndexPreviewGL sets={sets} active={active} reduced={reduced} />
        </Suspense>
      )}

      <CtaBanner className="mt-24 md:mt-32" />
    </main>
  )
}
