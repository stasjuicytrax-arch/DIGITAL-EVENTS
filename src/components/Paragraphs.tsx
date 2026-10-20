import type { Paragraph } from '@/content/services'
import { cn } from '@/lib/utils'

/** Текст со старого сайта: абзацы и подзаголовки (services.ts → Paragraph[]) */
export function Paragraphs({ items, className }: { items: Paragraph[]; className?: string }) {
  return (
    <div className={cn('max-w-[62ch] space-y-5', className)}>
      {items.map((p, i) =>
        typeof p === 'string' ? (
          <p key={i} className="text-body-l text-mute-2">{p}</p>
        ) : (
          <h3 key={i} className="text-h3 pt-6 text-white">{p.heading}</h3>
        ),
      )}
    </div>
  )
}
