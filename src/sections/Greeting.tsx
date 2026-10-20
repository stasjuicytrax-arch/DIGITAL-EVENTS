import { Fragment, useEffect, useRef } from 'react'
import { greeting } from '@/content/home'
import { Asterisk } from '@/components/icons/Asterisk'
import { ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion, useInView } from '@/lib/hooks'
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
  const [section, inView] = useInView<HTMLElement>('0px')
  const rows = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return
    const els = rows.current.filter(Boolean) as HTMLDivElement[]
    const offsets = els.map(() => 0)
    let velocity = 0, skew = 0, raf = 0, last = performance.now()
    const st = ScrollTrigger.create({
      trigger: section.current, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => { velocity = self.getVelocity() },
    })
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000
      last = now
      velocity *= 0.9
      const boost = Math.min(6, Math.abs(velocity) / 400)
      skew += (Math.max(-6, Math.min(6, velocity / 300)) - skew) * 0.12
      els.forEach((el, i) => {
        const dir = i === 0 ? -1 : 1
        const half = el.scrollWidth / 2
        offsets[i] = (offsets[i] + dir * (60 + 60 * boost) * dt) % half
        const x = dir < 0 ? offsets[i] : offsets[i] - half
        el.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(i === 0 ? skew : -skew).toFixed(2)}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); st.kill() }
  }, [inView, section])

  return (
    <section ref={section} aria-label={greeting.label} className="overflow-hidden py-24 md:py-32">
      <p className="sr-only">{greeting.words.join(', ')}</p>
      <div aria-hidden="true" className="text-display-xl flex flex-col gap-2 text-white">
        {[false, true].map((outline, i) => (
          <div key={i} className="overflow-hidden py-[0.04em]">
            <div ref={(el) => { rows.current[i] = el }} className={cn('flex w-max', outline && 'greeting-outline')}>
              <Sequence outline={outline} />
              <Sequence outline={outline} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
