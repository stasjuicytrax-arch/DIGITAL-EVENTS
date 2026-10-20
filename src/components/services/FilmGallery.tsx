import { useEffect, useRef, useState } from 'react'
import { Media } from '@/components/Media'
import { Lightbox } from '@/components/Gallery'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useIsTouch, useReducedMotion } from '@/lib/hooks'
import { pad2 } from '@/lib/tech'
import { cn } from '@/lib/utils'

export type Frame = { id: string; caption: string }

// три ширины по ритму при одинаковой высоте ленты (justified, без пустот)
const WIDTHS = ['w-[calc(var(--film-h)*0.8)]', 'w-[calc(var(--film-h)*1.5)]', 'w-[calc(var(--film-h)*1.1)]']

/**
 * Галерея-плёнка. Desktop: секция закрепляется, вертикальный скролл двигает ленту вбок;
 * фото одной высоты трёх ширин, параллакс внутри масок, skew ≤ 4° от скорости, моно-подписи «ПОЗИЦИЯ · 07/24».
 * Mobile / reduced-motion: вертикальная лента в одну колонку с теми же подписями, без pin.
 * Клик — полноэкранный лайтбокс со свайпом и счётчиком.
 */
export function FilmGallery({ frames, alt }: { frames: Frame[]; alt: (n: number) => string }) {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const film = !touch && !reduced
  const total = pad2(frames.length)

  useEffect(() => {
    const el = section.current, tr = track.current
    if (!film || !el || !tr || window.innerWidth < 1024) return
    const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth)
    const skew = gsap.quickTo(tr, 'skewX', { duration: 0.5, ease: 'power3.out' })
    const imgs = gsap.utils.toArray<HTMLElement>(tr.querySelectorAll('[data-parallax]'))
    const tween = gsap.to(tr, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: () => `+=${distance() * 0.6}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (st) => {
          skew(gsap.utils.clamp(-4, 4, st.getVelocity() / -400))
          // параллакс внутри масок: картинка смещается против хода ленты
          imgs.forEach((img) => { img.style.transform = `translateX(${(st.progress - 0.5) * -12}%) scale(1.18)` })
        },
      },
    })
    const settle = ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onLeave: () => skew(0), onLeaveBack: () => skew(0) })
    return () => { tween.scrollTrigger?.kill(); tween.kill(); settle.kill() }
  }, [film])

  return (
    <div ref={section} className={cn(film && 'lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden')}>
      <ul
        ref={track}
        className={cn(
          'flex flex-col gap-gutter px-margin [--film-h:62svh]',
          film && 'lg:w-max lg:flex-row lg:will-change-transform',
        )}
      >
        {frames.map((f, k) => (
          <li key={f.id + k} className={cn('shrink-0', film && WIDTHS[k % 3])}>
            <button
              type="button"
              onClick={() => setOpen(k)}
              data-cursor="media"
              aria-label={alt(k + 1)}
              className={cn('group/f block w-full overflow-hidden rounded-md', film ? 'aspect-[4/3] lg:aspect-auto lg:h-[var(--film-h)]' : 'aspect-[4/3]')}
            >
              <div data-parallax className={cn('size-full', film && 'lg:scale-[1.18]')}>
                <Media id={f.id} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="size-full" imgClassName="transition-transform duration-(--t-slow) ease-out-expo group-hover/f:scale-[1.03]" />
              </div>
            </button>
            <p className="text-label mt-3 flex justify-between gap-4 text-mute-2">
              <span className="truncate">{f.caption}</span>
              <span className="tabular-nums text-white">{pad2(k + 1)}<span className="text-mute-2">/{total}</span></span>
            </p>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox ids={frames.map((f) => f.id)} index={open} alt={alt} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </div>
  )
}
