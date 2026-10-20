import { useEffect, useRef } from 'react'
import { hero } from '@/content/home'
import { Panel } from '@/components/Panel'
import { SectionLabel } from '@/components/SectionLabel'
import { Media } from '@/components/Media'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'
import { isTouchDevice } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const d = (n: number) => ({ ['--d' as string]: n })

function Lead({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-body-l fade-up max-w-[40ch] text-mute-2" style={d(1)}>{hero.lead}</p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button href={hero.ctaPrimary.to} className="fade-up" style={d(2)}>{hero.ctaPrimary.label}</Button>
        <Button href={hero.ctaSecondary.to} variant="glass" className="fade-up" style={d(3)}>{hero.ctaSecondary.label}</Button>
      </div>
    </div>
  )
}

/**
 * Блок 1 Hero (TZ §5): панель с линейкой,
 * H1 «ТЕХНОЛОГИИ / [капсула] РАЗВЛЕЧЕНИЙ», лид, CTA, плашка liquid glass, нижняя полоса с чипами,
 * SCROLL и координатами курсора. Скульптура из частиц убрана по решению заказчика (20.10.2026).
 */
export function Hero() {
  const panel = useRef<HTMLDivElement>(null)
  const coords = useRef<HTMLSpanElement>(null)

  // координаты курсора — «приборная» деталь (desktop)
  useEffect(() => {
    const el = panel.current
    if (!el || isTouchDevice()) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = String(Math.max(0, Math.round(e.clientX - r.left))).padStart(4, '0')
      const y = String(Math.max(0, Math.round(e.clientY - r.top))).padStart(4, '0')
      if (coords.current) coords.current.textContent = `X ${x} / Y ${y}`
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Panel as="section" aria-labelledby="hero-title" className="pt-24" innerClassName="isolate flex min-h-[calc(100svh-10rem)] flex-col">
      <div ref={panel} className="relative flex flex-1 flex-col">
        {/* слово-призрак (TZ §7) */}
        <p aria-hidden="true" className="text-display-xxl pointer-events-none absolute inset-x-0 top-[34%] -translate-y-1/2 select-none text-center text-white/[0.04] md:top-[40%] md:scale-[1.6]">
          {hero.backdrop}
        </p>

        <div className="relative p-6 md:p-12">
          <SectionLabel className="fade-up">{hero.label}</SectionLabel>
        </div>

        {/* зона скульптуры: на широких экранах справа лид и кнопки, слева снизу — плашка */}
        <div className="relative min-h-[38svh] flex-1 px-6 md:px-12">
          <Lead className="absolute right-12 top-1/2 hidden w-[min(28rem,32vw)] -translate-y-1/2 xl:block" />
          <p className="glass fade-up absolute bottom-6 left-12 hidden max-w-[24ch] items-start gap-3 rounded-md p-4 text-small text-white md:flex" style={d(4)}>
            <Asterisk className="mt-1 size-3.5 shrink-0 text-lime" />
            {hero.plate}
          </p>
        </div>

        <div className="relative px-6 pt-8 md:px-12">
          <h1 id="hero-title" className="text-display-xl">
            <span className="reveal-line"><span className="text-white">{hero.titleTop}</span></span>
            <span className="reveal-line" style={d(1)}>
              <span className="text-mute md:whitespace-nowrap">
                <span className="capsule mr-[0.14em]" aria-hidden="true">
                  <Media id="videophoto/lazernyy-koridor-01" alt="" sizes="20vw" priority className="size-full" />
                </span>
                {hero.titleBottom}
              </span>
            </span>
          </h1>
          <Lead className="mt-8 md:ml-auto md:max-w-[min(32rem,50%)] xl:hidden" />
        </div>

        {/* нижняя полоса панели: бегущие чипы направлений + SCROLL ↓ + координаты курсора */}
        <div className="relative mt-12 flex items-center gap-6 border-t border-line px-6 py-4 md:px-12">
          <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className="chips-track flex w-max gap-3" aria-hidden="true">
              {[...hero.chips, ...hero.chips, ...hero.chips, ...hero.chips].map((c, i) => (
                <span key={i} className="text-micro shrink-0 rounded-pill px-3 py-1.5 text-mute-2 shadow-[inset_0_0_0_1px_var(--de-line-strong)]">{c}</span>
              ))}
            </div>
            <p className="sr-only">{hero.chips.join(', ')}</p>
          </div>
          <p className="text-micro hidden items-center gap-2 text-mute-2 sm:flex">
            {hero.scroll}
            <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 1v10M2 7l4 4 4-4" /></svg>
          </p>
          <span ref={coords} aria-hidden="true" className={cn('text-micro hidden whitespace-nowrap text-right text-mute tabular-nums lg:inline')}>X 0000 / Y 0000</span>
        </div>
      </div>
    </Panel>
  )
}
