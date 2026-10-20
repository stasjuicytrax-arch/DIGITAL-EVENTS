import { forwardRef, type ComponentPropsWithoutRef, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useMagnetic } from '@/lib/magnetic'

/*
 * Кнопки DESIGN.md §9:
 *  primary — лаймовая пилюля, справа круг с ↗ (на hover поворот 45° и заливка ink), magnetic
 *  glass   — liquid glass пилюля поверх фото и 3D
 *  ghost   — рамка line-strong, на hover заливка white «вытекает» из точки курсора
 *  link    — подчёркивание 1px, на hover линия уезжает вправо и возвращается слева
 */
const buttonVariants = cva(
  'group/btn relative inline-flex shrink-0 select-none items-center whitespace-nowrap font-sans font-medium text-[15px] leading-none transition-[transform,background-color,color,box-shadow] duration-(--t-fast) ease-soft active:scale-[0.98] focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'rounded-pill bg-lime text-ink hover:bg-lime-hot',
        glass: 'glass rounded-pill text-white',
        ghost: 'btn-ghost rounded-pill text-white',
        link: 'link-underline h-auto gap-2 rounded-none p-0 text-white',
      },
      size: {
        default: 'h-14 gap-4 pl-6 pr-2',
        compact: 'h-11 gap-3 pl-4 pr-1.5 text-[14px]',
      },
    },
    compoundVariants: [
      { variant: 'ghost', size: 'default', className: 'pr-6' },
      { variant: 'ghost', size: 'compact', className: 'pr-4' },
      { variant: 'link', size: ['default', 'compact'], className: 'h-auto p-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

type Common = VariantProps<typeof buttonVariants> & {
  children: ReactNode
  className?: string
  /** круг со стрелкой ↗ справа (по умолчанию у primary и glass) */
  arrow?: boolean
  magnetic?: boolean
}
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>
export type ButtonProps = AsLink | AsButton

function Arrow({ variant, size }: { variant: Common['variant']; size: Common['size'] }) {
  if (variant === 'link') return <ArrowUpRight strokeWidth={1.5} className="size-4 transition-transform duration-(--t-base) ease-out-expo group-hover/btn:rotate-45" aria-hidden="true" />
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid place-items-center rounded-full transition-[background-color,color,rotate] duration-(--t-base) ease-out-expo group-hover/btn:rotate-45',
        size === 'compact' ? 'size-8' : 'size-10',
        variant === 'primary' && 'bg-ink/10 text-ink group-hover/btn:bg-ink group-hover/btn:text-lime',
        variant === 'glass' && 'bg-white/10 text-white group-hover/btn:bg-white group-hover/btn:text-ink',
      )}
    >
      <ArrowUpRight strokeWidth={1.5} className={size === 'compact' ? 'size-4' : 'size-5'} />
    </span>
  )
}

/** Для ghost: точка, из которой «вытекает» заливка */
const trackFill = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--fx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--fy', `${e.clientY - r.top}px`)
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, _ref) {
  const { variant = 'primary', size = 'default', arrow, magnetic, className, children, ...rest } = props
  const withArrow = arrow ?? (variant === 'primary' || variant === 'glass')
  const mag = useMagnetic<HTMLElement>(80, 0.3)
  const cls = cn(buttonVariants({ variant, size }), !withArrow && variant !== 'link' && 'pr-6', className)
  const magRef = (magnetic ?? variant === 'primary') ? mag : undefined
  const content = (
    <>
      <span className="relative z-[1]">{children}</span>
      {withArrow && <span className="relative z-[1]"><Arrow variant={variant} size={size} /></span>}
    </>
  )
  const ghost = variant === 'ghost' ? { onPointerEnter: trackFill, onPointerLeave: trackFill } : {}

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...a } = rest as AsLink
    const internal = href.startsWith('/') && !href.startsWith('//')
    if (internal) return <Link ref={magRef as never} to={href} className={cls} {...ghost} {...a}>{content}</Link>
    return <a ref={magRef as never} href={href} className={cls} {...ghost} {...a}>{content}</a>
  }
  const b = rest as AsButton
  return <button ref={magRef as never} type={b.type ?? 'button'} className={cls} {...ghost} {...b}>{content}</button>
})
