import { Asterisk } from '@/components/icons/Asterisk'
import { useScramble } from '@/lib/scramble'
import { cn } from '@/lib/utils'

type Props = {
  /** номер секции: «01» → [01] */
  index?: string
  children: string
  className?: string
  /** тон на светлых секциях (cream) */
  tone?: 'dark' | 'light'
}

/**
 * Лейбл секции DESIGN.md §9: `✱ [03] / НАПРАВЛЕНИЯ`, JetBrains Mono 12px, лайм только у ✱.
 * На hover номер и текст делают glyph-scramble.
 */
export function SectionLabel({ index, children, className, tone = 'dark' }: Props) {
  const text = index ? `[${index}] / ${children}` : children
  const [ref, run] = useScramble<HTMLSpanElement>(text)
  return (
    <p
      onPointerEnter={run}
      className={cn('text-label inline-flex items-center gap-2', tone === 'dark' ? 'text-mute-2' : 'text-ink', className)}
    >
      {/* на cream лайм как цвет запрещён (DESIGN §1.5): знак остаётся ink */}
      <Asterisk className={cn('size-3', tone === 'dark' ? 'text-lime' : 'text-ink')} />
      <span ref={ref} className="tabular-nums">{text}</span>
    </p>
  )
}
