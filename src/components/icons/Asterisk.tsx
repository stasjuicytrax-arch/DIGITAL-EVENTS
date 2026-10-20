import type { SVGProps } from 'react'

/** Фирменный знак ✱ (DESIGN.md §10): 6 лучей, цвет — currentColor. */
export function Asterisk({ strokeWidth = 2.2, ...props }: SVGProps<SVGSVGElement> & { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    </svg>
  )
}
