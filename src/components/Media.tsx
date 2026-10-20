import type { ImgHTMLAttributes } from 'react'
import media from '@/content/media.json'
import { cn } from '@/lib/utils'

type Entry = { src: string; w: number; h: number; widths: number[]; blur: string }
const all = media as Record<string, Entry>

export const getMedia = (id: string) => all[id]

type Props = {
  id: string
  alt: string
  /** sizes для srcset, по умолчанию на всю ширину вьюпорта */
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes' | 'alt' | 'className'>

/** Фото из public/media: AVIF + WebP srcset 640/1280/1920, blur-плейсхолдер, lazy (TZ §9, §10.1). */
export function Media({ id, alt, sizes = '100vw', priority, className, imgClassName, ...img }: Props) {
  const m = all[id]
  if (!m) return null
  const set = (fmt: string) => m.widths.map((w) => `${m.src}-${w}.${fmt} ${w}w`).join(', ')
  return (
    <picture className={cn('block overflow-hidden', className)} style={{ backgroundImage: `url(${m.blur})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${m.src}-${m.widths[m.widths.length - 1]}.webp`}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' } : {})}
        className={cn('size-full object-cover', imgClassName)}
        {...img}
      />
    </picture>
  )
}
