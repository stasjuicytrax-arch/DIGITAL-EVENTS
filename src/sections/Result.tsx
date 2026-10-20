import { useRef } from 'react'
import { result } from '@/content/home'
import { SectionLabel } from '@/components/SectionLabel'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'
import { CodeBackground } from '@/components/ui/code-background'

/**
 * Блок 5 Результат / подход (TZ §5): фон graphite + code-background (решётка → сфера глифов вокруг курсора),
 * H2 в keep-out зоне, подзаголовок, два принципа, стикеры liquid glass (±3°), уникальность, CTA ghost.
 * Вход и выход мягкие: фон 240px перетекает из void в graphite, сетка глифов растворяется маской у краёв.
 */
export function Result() {
  const title = useRef<HTMLDivElement>(null)

  return (
    <section aria-labelledby="result-title" className="relative isolate overflow-hidden bg-graphite bg-[linear-gradient(to_bottom,var(--de-void),var(--de-graphite)_240px)]">
      {/* canvas слушает мышь на секции (родителе), поэтому лежит прямо в ней; маска растворяет сетку у краёв */}
      <CodeBackground keepOut={title} className="[mask-image:linear-gradient(to_bottom,transparent,#000_240px,#000_calc(100%-240px),transparent)]" />
      {/* виньетка по бокам, чтобы canvas не «обрезался» (DESIGN §7.5) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--de-graphite),transparent_14%,transparent_86%,var(--de-graphite))] [mask-image:linear-gradient(to_bottom,transparent,#000_240px,#000_calc(100%-240px),transparent)]" />

      <div className="relative px-margin pb-section pt-24 md:pt-32">
        <SectionLabel index={result.index}>{result.label}</SectionLabel>

        <div className="flex min-h-[48svh] flex-col items-center justify-center py-12 text-center md:py-16">
          <div ref={title}>
            <h2 id="result-title" className="text-h2 max-w-[30ch]">
              <span className="block text-white">{result.titleTop}</span>
              <span className="block text-mute">{result.titleBottom}</span>
            </h2>
          </div>
          <p className="text-body-l mt-8 max-w-[44ch] text-mute-2">{result.lead}</p>
        </div>

        <div className="grid grid-cols-4 gap-gutter md:grid-cols-12">
          {result.principles.map((p, i) => (
            <div key={p.n} className={i === 0 ? 'col-span-4 md:col-span-5 md:col-start-2' : 'col-span-4 mt-12 md:col-span-5 md:col-start-8 md:mt-0'}>
              <p className="text-label text-lime">{p.n}</p>
              <p className="text-h3 mt-4 text-white">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-center md:gap-12">
          {result.stickers.map((s, i) => (
            <p
              key={s}
              className={
                'glass text-h3 rounded-pill px-8 py-6 uppercase text-white transition-transform duration-(--t-base) ease-out-expo hover:rotate-0 hover:scale-[1.03] ' +
                (i === 0 ? '-rotate-3 md:translate-y-4' : 'rotate-3 self-end md:self-auto md:-translate-y-4')
              }
            >
              {s}
            </p>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-4 items-end gap-gutter md:grid-cols-12">
          <p className="text-body-l col-span-4 flex items-start gap-3 text-white md:col-span-6 md:col-start-2">
            <Asterisk className="mt-1.5 size-4 shrink-0 text-lime" />
            {result.unique}
          </p>
          <div className="col-span-4 mt-8 md:col-span-4 md:col-start-9 md:mt-0 md:justify-self-end">
            <Button href={result.cta.to} variant="ghost">{result.cta.label}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
