import { Fragment, useEffect, useRef } from 'react'
import { manifest } from '@/content/home'
import { SectionLabel } from '@/components/SectionLabel'
import { Media } from '@/components/Media'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/hooks'

/**
 * Блок 3 Манифест (TZ §5): ступенчатый текст (h1 вместо display-xl — иначе не помещается в закреплённый экран), word-scrub mute → white синхронно со скроллом,
 * две капсулы с фото внутри строк. Текст закреплён (pin), пока идёт scrub (~120vh).
 * reduced-motion: без pin и scrub, текст сразу белый.
 */
export function Manifest() {
  const section = useRef<HTMLElement>(null)
  const text = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const words = text.current?.querySelectorAll<HTMLElement>('[data-word]')
    if (!section.current || !words?.length) return
    if (prefersReducedMotion()) { words.forEach((w) => w.style.setProperty('color', 'var(--de-white)')); return }
    const white = getComputedStyle(document.documentElement).getPropertyValue('--de-white').trim()
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section.current, start: 'top top', end: '+=120%', scrub: 0.6, pin: true, anticipatePin: 1 },
    })
    tl.to(words, { color: white, ease: 'none', stagger: 0.12, duration: 0.5 })
    return () => { tl.scrollTrigger?.kill(); tl.kill() }
  }, [])

  return (
    <section ref={section} aria-labelledby="manifest-title" className="flex min-h-svh flex-col justify-center px-margin py-24">
      <div className="grid grid-cols-4 gap-gutter md:grid-cols-12">
        <SectionLabel index={manifest.index} className="col-span-4 mb-12 md:col-span-3 md:mb-0">{manifest.label}</SectionLabel>
        <h2 id="manifest-title" className="sr-only">{manifest.text.filter((t) => typeof t === 'string').join(' ')}</h2>
        <p ref={text} aria-hidden="true" className="text-h1 col-span-4 text-mute md:col-span-12 md:indent-[calc((100%-11*var(--gutter))/12*3+3*var(--gutter))]">
          {manifest.text.map((part, i) =>
            typeof part === 'string' ? (
              <Fragment key={i}>
                {part.split(' ').map((w, j) => (
                  <Fragment key={j}>
                    <span data-word>{w}</span>{' '}
                  </Fragment>
                ))}
              </Fragment>
            ) : (
              <Fragment key={i}>
                <span className="capsule" title={part.alt}>
                  <Media id={part.capsule} alt="" sizes="20vw" className="size-full" />
                </span>{' '}
              </Fragment>
            ),
          )}
        </p>
        <p className="text-label col-span-4 mt-12 text-mute-2 md:col-span-4 md:col-start-9">{manifest.footnote}</p>
        <p className="text-body-l col-span-4 mt-12 max-w-[42ch] text-mute-2 md:col-span-5 md:col-start-8">{manifest.about}</p>
      </div>
    </section>
  )
}
