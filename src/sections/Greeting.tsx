import { Fragment, useRef } from 'react'
import { greeting } from '@/content/home'
import { Asterisk } from '@/components/icons/Asterisk'
import { useVelocityMarquee } from '@/lib/marquee'
import { scrambleTo } from '@/lib/scramble'
import { cn } from '@/lib/utils'

/** Слово с glyph-scramble на hover (300 мс, DESIGN.md §8.2) */
function Word({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  return (
    <span ref={ref} onPointerEnter={() => ref.current && scrambleTo(ref.current, text, 300)} className="whitespace-nowrap">
      {text}
    </span>
  )
}

function Sequence({ outline }: { outline?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-[0.32em] pr-[0.32em]">
      {greeting.words.map((w) => (
        <Fragment key={w}>
          <Word text={w} />
          <span className={outline ? 'greeting-outline-mute' : 'text-mute'}>//</span>
        </Fragment>
      ))}
      <Asterisk className="size-[0.5em] shrink-0 text-lime" strokeWidth={2.6} />
    </span>
  )
}

/**
 * Блок 2 (TZ §5): две строки навстречу друг другу, вторая контурная (stroke 1px).
 * Скорость и наклон (skewX ≤ 6°) зависят от скорости скролла. Вне экрана и при reduced-motion стоит.
 */
export function Greeting() {
  const [section, row] = useVelocityMarquee<HTMLElement>({ speed: 60, skew: true })

  return (
    <section ref={section} aria-label={greeting.label} className="overflow-hidden py-16 md:pb-12 md:pt-24">
      <p className="sr-only">{greeting.words.join(', ')}</p>
      <div aria-hidden="true" className="text-display-xl greeting-text flex flex-col gap-2 text-white">
        {[false, true].map((outline, i) => (
          <div key={i} className="overflow-hidden py-[0.04em]">
            <div ref={row(i)} className={cn('flex w-max', outline && 'greeting-outline')}>
              <Sequence outline={outline} />
              <Sequence outline={outline} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
