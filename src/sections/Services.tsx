import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Plus } from 'lucide-react'
import { servicesBlock } from '@/content/home'
import { catalog } from '@/content/catalog'
import { SectionLabel } from '@/components/SectionLabel'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { isTouchDevice, prefersReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

/** Превью за курсором (DESIGN §8.2 «Cursor preview»): инерция и лёгкий поворот от скорости. Только desktop. */
function CursorPreview({ active, list }: { active: number | null; list: typeof catalog }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = box.current
    if (!el || isTouchDevice()) return
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0
    const reduce = prefersReducedMotion()
    const onMove = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY }
    const loop = () => {
      const k = reduce ? 1 : 0.14
      const dx = tx - x
      x += dx * k
      y += (ty - y) * k
      const rot = reduce ? 0 : Math.max(-8, Math.min(8, dx * 0.06))
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot.toFixed(2)}deg)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={box} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block">
      <div className={cn('relative aspect-[4/3] w-[22rem] overflow-hidden rounded-md transition-[opacity,scale] duration-(--t-base) ease-out-expo', active === null ? 'scale-90 opacity-0' : 'scale-100 opacity-100')}>
        {list.map((d, i) =>
          d.cover ? (
            <Media key={d.slug} id={d.cover} alt="" sizes="22rem" className={cn('absolute inset-0 size-full transition-opacity duration-(--t-fast)', active === i ? 'opacity-100' : 'opacity-0')} />
          ) : null,
        )}
      </div>
    </div>
  )
}

/**
 * Блок 9 «Так что мы умеем?» (TZ §5): типографический список 10 направлений.
 * Desktop: hover — строка ink-2, номер лаймовый, выезжают теги, за курсором летит превью.
 * Mobile: превью раскрывается аккордеоном внутри строки.
 */
export function Services() {
  const [hover, setHover] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="services" aria-labelledby="services-title" className="py-section">
      <div className="grid grid-cols-4 gap-gutter px-margin md:grid-cols-12">
        <SectionLabel index={servicesBlock.index} className="col-span-4 md:col-span-3">{servicesBlock.label}</SectionLabel>
        <div className="col-span-4 mt-8 md:col-span-9 md:mt-0">
          <h2 id="services-title" className="text-display-xl">
            <span className="block text-white">{servicesBlock.titleTop}</span>
            <span className="block text-mute md:pl-[1.2em]">{servicesBlock.titleBottom}</span>
          </h2>
          <p className="text-label mt-6 text-mute-2">{servicesBlock.footnote}</p>
        </div>
      </div>

      <ol className="mt-24 border-b border-line" onPointerLeave={() => setHover(null)}>
        {catalog.map((d, i) => {
          const n = String(i + 1).padStart(2, '0')
          const isOpen = open === i
          return (
            <li key={d.slug} className="group/row border-t border-line">
              {/* desktop: вся строка — ссылка */}
              <Link
                to={`/uslugi/${d.slug}`}
                data-cursor="open"
                onPointerEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="hidden items-center gap-gutter px-margin py-8 transition-colors duration-(--t-base) ease-soft hover:bg-ink-2 focus-visible:bg-ink-2 md:grid md:grid-cols-12"
              >
                <span className="text-label col-span-1 text-mute-2 tabular-nums transition-colors duration-(--t-fast) group-hover/row:text-lime">{n}</span>
                <span className="col-span-6">
                  <span className="text-h2 block text-white">{d.title}</span>
                  <span className="text-small mt-3 block max-w-[56ch] text-mute-2">{d.summary}</span>
                </span>
                <span className="col-span-4 flex flex-wrap justify-end gap-2 opacity-0 translate-x-4 transition-[opacity,translate] duration-(--t-base) ease-out-expo group-hover/row:translate-x-0 group-hover/row:opacity-100 group-focus-visible/row:opacity-100">
                  {d.tags.map((t) => (
                    <span key={t} className="text-micro rounded-pill px-3 py-1.5 text-mute-2 shadow-[inset_0_0_0_1px_var(--de-line-strong)]">{t}</span>
                  ))}
                </span>
                <ArrowUpRight strokeWidth={1.5} className="col-span-1 size-8 justify-self-end text-white transition-transform duration-(--t-base) ease-out-expo group-hover/row:rotate-45" />
              </Link>

              {/* mobile: аккордеон */}
              <div className="md:hidden">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`svc-${d.slug}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start gap-4 px-margin py-6 text-left"
                >
                  <span className={cn('text-label mt-2 tabular-nums', isOpen ? 'text-lime' : 'text-mute-2')}>{n}</span>
                  <span className="text-h3 flex-1 text-white">{d.title}</span>
                  <Plus strokeWidth={1.5} className={cn('mt-1 size-6 shrink-0 text-white transition-transform duration-(--t-base) ease-out-expo', isOpen && 'rotate-45')} />
                </button>
                <div id={`svc-${d.slug}`} className={cn('grid transition-[grid-template-rows] duration-(--t-base) ease-out-expo', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                  <div className="overflow-hidden">
                    <div className="px-margin pb-8">
                      {d.cover && <Media id={d.cover} alt={d.title} sizes="100vw" className="aspect-[4/3] rounded-md" />}
                      <p className="text-small mt-4 text-mute-2">{d.summary}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {d.tags.map((t) => (
                          <span key={t} className="text-micro rounded-pill px-3 py-1.5 text-mute-2 shadow-[inset_0_0_0_1px_var(--de-line-strong)]">{t}</span>
                        ))}
                      </div>
                      <Button variant="link" href={`/uslugi/${d.slug}`} arrow className="mt-6" tabIndex={isOpen ? 0 : -1}>{servicesBlock.open}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-16 flex flex-wrap items-center gap-8 px-margin md:justify-end">
        <Button href={servicesBlock.cta.to}>{servicesBlock.cta.label}</Button>
        <Button variant="link" href={servicesBlock.all.to} arrow>{servicesBlock.all.label}</Button>
      </div>

      <CursorPreview active={hover} list={catalog} />
    </section>
  )
}
