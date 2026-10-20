import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { Media } from '@/components/Media'
import { media as t } from '@/content/pages'
import { getLenis } from '@/lib/lenis'

/** Лайтбокс: стрелки, свайп, Esc, счётчик; фокус возвращается на открывшую картинку */
export function Lightbox({ ids, index, alt, onClose, onIndex }: { ids: string[]; index: number; alt: (n: number) => string; onClose: () => void; onIndex: (i: number) => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  const start = useRef<number | null>(null)
  const go = useCallback((d: number) => onIndex((index + d + ids.length) % ids.length), [index, ids.length, onIndex])

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      prev?.focus()
    }
  }, [go, onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt(index + 1)}
      className="fixed inset-0 z-50 flex flex-col bg-void/95 p-4 md:p-8"
      onPointerDown={(e) => { start.current = e.clientX }}
      onPointerUp={(e) => {
        if (start.current === null) return
        const dx = e.clientX - start.current
        start.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-label tabular-nums text-mute-2">{String(index + 1).padStart(2, '0')} / {String(ids.length).padStart(2, '0')}</p>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label={t.close} className="glass grid size-11 place-items-center rounded-full text-white">
          <X strokeWidth={1.5} className="size-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center py-6">
        <Media key={ids[index]} id={ids[index]} alt={alt(index + 1)} sizes="100vw" className="max-h-full overflow-hidden rounded-md bg-transparent" imgClassName="max-h-[80svh] w-auto object-contain" />
      </div>
      <div className="flex justify-center gap-3">
        <button type="button" onClick={() => go(-1)} aria-label={t.prev} className="glass grid size-11 place-items-center rounded-full text-white"><ArrowLeft strokeWidth={1.5} className="size-5" /></button>
        <button type="button" onClick={() => go(1)} aria-label={t.next} className="glass grid size-11 place-items-center rounded-full text-white"><ArrowRight strokeWidth={1.5} className="size-5" /></button>
      </div>
    </div>,
    document.body,
  )
}

/** Masonry-галерея с лайтбоксом (TZ §5.2 п.3) */
export function Gallery({ ids, alt }: { ids: string[]; alt: (n: number) => string }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <ul className="columns-1 gap-gutter sm:columns-2 lg:columns-3">
        {ids.map((id, i) => (
          <li key={id} className="mb-[var(--gutter)] break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} className="group/g block w-full overflow-hidden rounded-md" data-cursor="media" aria-label={alt(i + 1)}>
              <Media id={id} alt="" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="w-full" imgClassName="h-auto transition-transform duration-(--t-slow) ease-out-expo group-hover/g:scale-[1.03]" />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox ids={ids} index={open} alt={alt} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  )
}
