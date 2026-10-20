import { useState } from 'react'
import { Play } from 'lucide-react'
import { media } from '@/content/pages'
import { cn } from '@/lib/utils'

export const youtubeId = (url: string) => url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1] ?? null

/**
 * Лёгкий YouTube (TZ §5.2–5.3): до клика только превью-картинка, iframe (youtube-nocookie) грузится по клику.
 * Ссылки VK показываются кнопкой-ссылкой.
 */
export function LiteYouTube({ url, title, className }: { url: string; title: string; className?: string }) {
  const id = youtubeId(url)
  const [play, setPlay] = useState(false)
  if (!id) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cn('grid aspect-video place-items-center rounded-md bg-ink-2 text-small text-white', className)}>
        {media.play}
      </a>
    )
  }
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-md bg-ink-2', className)} data-cursor="media">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group/yt absolute inset-0 size-full" aria-label={`${media.play}: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="size-full object-cover opacity-80 transition-[opacity,scale] duration-(--t-base) ease-out-expo group-hover/yt:scale-[1.03] group-hover/yt:opacity-100" />
          <span className="glass absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white">
            <Play strokeWidth={1.5} className="ml-0.5 size-6 fill-current" />
          </span>
        </button>
      )}
    </div>
  )
}
