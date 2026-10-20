import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Линейка с делениями (DESIGN.md §3): короткие деления каждые 8px, длинные каждые 64px, цвет line-strong.
 * Лаймовый бегунок показывает прогресс страницы (CSS-переменная --progress из lib/progress.ts).
 */
export function Ruler({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('ruler relative h-4', className)}>
      <div className="ruler-ticks absolute inset-x-0 bottom-0 h-full" />
      <div className="ruler-runner absolute bottom-0 left-0 h-full w-px bg-lime" />
    </div>
  )
}

type PanelProps = {
  children: ReactNode
  className?: string
  /** класс внутренней поверхности */
  innerClassName?: string
  ruler?: boolean
  as?: 'section' | 'div' | 'header'
  id?: string
  'aria-label'?: string
}

/**
 * Рамка-панель (DESIGN.md §3): скруглённая панель --r-lg с отступом от краёв вьюпорта = margin,
 * над ней линейка. Используется для hero и финального CTA.
 */
export function Panel({ children, className, innerClassName, ruler = true, as: Tag = 'section', ...rest }: PanelProps) {
  return (
    <Tag className={cn('px-margin', className)} {...rest}>
      {ruler && <Ruler className="mb-3" />}
      <div className={cn('relative overflow-hidden rounded-lg bg-graphite shadow-[inset_0_0_0_1px_var(--de-line)]', innerClassName)}>{children}</div>
    </Tag>
  )
}
