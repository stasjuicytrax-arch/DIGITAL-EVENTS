import type { SVGProps } from 'react'
import { logoSvgPath } from './logo-geometry'

const D = logoSvgPath(100, 0)

/** Знак DIGITAL EVENTS (вектор по old-site, см. logo-geometry.ts). Цвет — currentColor. */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" {...props}>
      <path d={D} />
    </svg>
  )
}
