import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { itemPage } from '@/content/pages'

/**
 * Слайдер фото позиции на всю ширину (TZ §5.3 п.2): scroll-snap, перетаскивание мышью, стрелки,
 * моно-счётчик `03 / 13`. На тач-устройствах — нативный свайп.
 */
export function PhotoSlider({ ids, alt }: { ids: string[]; alt: (n: number) => string }) {
  const track = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      const slides = [...el.children] as HTMLElement[]
      const center = el.scrollLeft + el.clientWidth / 2
      let best = 0, dist = Infinity
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center)
        if (d < dist) { dist = d; best = i }
      })
      setIndex(best)
    }
    // перетаскивание мышью
    let down = false, startX = 0, startLeft = 0, moved = false
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft
      el.style.scrollSnapType = 'none'
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) moved = true
      el.scrollLeft = startLeft - dx
    }
    const onUp = () => {
      if (!down) return
      down = false
      el.style.scrollSnapType = ''
      onScroll()
    }
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation() } }
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])

  const go = (d: number) => {
    const el = track.current
    if (!el) return
    const next = Math.max(0, Math.min(ids.length - 1, index + d))
    const s = el.children[next] as HTMLElement
    el.scrollTo({ left: s.offsetLeft - (el.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' })
  }

  return (
    <div>
      <ul
        ref={track}
        data-lenis-prevent
        className="flex cursor-grab snap-x snap-mandatory gap-gutter overflow-x-auto px-margin pb-2 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {ids.map((id, i) => (
          <li key={id} className="w-[86vw] shrink-0 snap-center md:w-[64vw]">
            <Media id={id} alt={alt(i + 1)} sizes="(min-width: 768px) 64vw, 86vw" priority={i === 0} className="aspect-[3/2] rounded-lg" draggable={false} />
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between px-margin">
        <p className="text-label tabular-nums text-mute-2" aria-live="polite">
          <span className="text-white">{String(index + 1).padStart(2, '0')}</span> / {String(ids.length).padStart(2, '0')}
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label={itemPage.prev} className="grid size-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] transition-colors duration-(--t-fast) hover:bg-white hover:text-ink disabled:opacity-30">
            <ArrowLeft strokeWidth={1.5} className="size-5" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={index === ids.length - 1} aria-label={itemPage.next} className="grid size-11 place-items-center rounded-full text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] transition-colors duration-(--t-fast) hover:bg-white hover:text-ink disabled:opacity-30">
            <ArrowRight strokeWidth={1.5} className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
