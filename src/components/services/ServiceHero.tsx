import { useEffect, useState, type ReactNode } from 'react'
import { Media } from '@/components/Media'
import { Panel } from '@/components/Panel'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Asterisk } from '@/components/icons/Asterisk'
import { useInView, useReducedMotion } from '@/lib/hooks'
import { pad2 } from '@/lib/tech'
import { servicePage as t } from '@/content/pages'
import { cn } from '@/lib/utils'

const FRAME_MS = 6000

type Props = {
  title: string
  /** фото слайдшоу (4–5 лучших) */
  frames: string[]
  /** моно-строка над названием: «[01 / 10] НАПРАВЛЕНИЕ · 09 ПОЗИЦИЙ · ПЕРМЬ» */
  hud: string[]
  crumbs: { label: string; to?: string }[]
  lead?: string
  /** ряд под лидом: чипы позиций, бейджи */
  below?: ReactNode
  cta: ReactNode
}

/** Название по буквам: каждая буква въезжает снизу со сдвигом 30ms (line-reveal) */
function LetterTitle({ text }: { text: string }) {
  let k = 0
  return (
    <h1 className="text-display-xxl max-w-[14ch] text-white" aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {[...word].map((ch) => (
            <span key={k} className="letter-reveal" style={{ ['--d' as string]: k++ }}><span>{ch}</span></span>
          ))}
          {' '}
        </span>
      ))}
    </h1>
  )
}

/**
 * Full-bleed hero страниц услуг: панель с линейкой (как на главной), внутри медленный crossfade-слайдшоу
 * (Ken Burns, 6 с на кадр), градиенты снизу и слева для читаемости, HUD-строка, счётчик кадров с прогрессом,
 * огромное название по буквам внизу слева, лид, чипы, CTA справа снизу.
 * reduced-motion — первый кадр без движения; вне экрана слайдшоу стоит.
 */
export function ServiceHero({ title, frames, hud, crumbs, lead, below, cta }: Props) {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>('0px')
  const [i, setI] = useState(0)
  const n = frames.length

  useEffect(() => {
    if (reduced || !inView || n < 2) return
    const id = window.setInterval(() => setI((v) => (v + 1) % n), FRAME_MS)
    return () => window.clearInterval(id)
  }, [reduced, inView, n])

  return (
    <Panel as="header" className="pt-24" innerClassName="isolate flex min-h-[calc(100svh-8rem)] flex-col">
      <div ref={ref} className="relative flex flex-1 flex-col">
        {/* слайдшоу */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          {frames.map((id, k) => (
            <Media
              key={id}
              id={id}
              alt=""
              sizes="100vw"
              priority={k === 0}
              className={cn('absolute inset-0 transition-opacity duration-[1600ms] ease-soft', k === i ? 'opacity-100' : 'opacity-0')}
              imgClassName={cn(!reduced && k === i && 'hero-kenburns')}
            />
          ))}
          {/* читаемость: тёмный низ и левый край */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--de-graphite)_0%,color-mix(in_srgb,var(--de-graphite)_85%,transparent)_28%,color-mix(in_srgb,var(--de-graphite)_35%,transparent)_58%,transparent_85%),linear-gradient(to_right,color-mix(in_srgb,var(--de-graphite)_75%,transparent),transparent_55%),linear-gradient(to_bottom,color-mix(in_srgb,var(--de-graphite)_60%,transparent),transparent_22%)]" />
        </div>

        {/* HUD сверху */}
        <div className="flex flex-wrap items-start justify-between gap-6 p-6 md:p-10">
          <div className="flex flex-col gap-4">
            <Breadcrumbs items={crumbs} />
            <p className="text-label inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-white">
              <Asterisk className="size-3 text-lime" />
              {hud.map((h, k) => (
                <span key={k} className={k ? 'text-mute-2 before:mr-2 before:content-["·"]' : 'tabular-nums'}>{h}</span>
              ))}
            </p>
          </div>
          {n > 1 && (
            <div className="hidden w-40 sm:block" aria-hidden="true">
              <p className="text-label text-right tabular-nums text-white">
                <span className="text-mute-2">{t.frames} </span>{pad2(i + 1)} <span className="text-mute-2">/ {pad2(n)}</span>
              </p>
              <div className="mt-3 h-px w-full bg-line-strong">
                <div key={reduced ? 'static' : i} className={cn('h-px bg-lime', reduced ? 'w-full' : 'hero-progress')} />
              </div>
            </div>
          )}
        </div>

        {/* название, лид, чипы, CTA */}
        <div className="mt-auto grid grid-cols-4 gap-gutter p-6 pt-16 md:grid-cols-12 md:p-10 md:pt-12">
          <div className="col-span-4 md:col-span-12">
            <LetterTitle text={title} />
          </div>
          {lead && <p className="text-body-l fade-up col-span-4 mt-6 text-white/80 md:col-span-5" style={{ ['--d' as string]: 3 }}>{lead}</p>}
          <div className="fade-up col-span-4 mt-6 flex items-end md:col-span-5 md:col-start-8 md:justify-end" style={{ ['--d' as string]: 4 }}>{cta}</div>
          {below && <div className="fade-up col-span-4 mt-8 md:col-span-9" style={{ ['--d' as string]: 5 }}>{below}</div>}
        </div>
      </div>
    </Panel>
  )
}
