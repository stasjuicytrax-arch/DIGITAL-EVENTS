import { useEffect, useState } from 'react'
import { useRouteError } from 'react-router-dom'
import { errorPage as t } from '@/content/pages'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'
import { isChunkError, reloadOnce } from '@/lib/chunk-reload'

/**
 * errorElement корневого маршрута: вместо белого «Unexpected Application Error».
 * Ошибка загрузки чанка после деплоя — тихо перезагружаем один раз на целевой URL,
 * иначе — страница в стиле сайта с кнопкой «Обновить».
 */
export function RouteError() {
  const error = useRouteError()
  const chunk = isChunkError(error)
  const [reloading, setReloading] = useState(chunk)

  useEffect(() => {
    if (chunk && !reloadOnce()) setReloading(false)
  }, [chunk])

  if (reloading) return <main className="min-h-dvh bg-void" />

  return (
    <main id="main" className="flex min-h-dvh flex-col items-start justify-center gap-8 bg-void px-margin">
      <p className="text-label inline-flex items-center gap-2 text-mute-2">
        <Asterisk className="size-3 text-lime" /> {chunk ? t.chunkLabel : t.label}
      </p>
      <h1 className="text-h1 max-w-[16ch]">{chunk ? t.chunkTitle : t.title}</h1>
      <p className="text-body-l max-w-[44ch] text-mute-2">{chunk ? t.chunkText : t.text}</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="button" onClick={() => window.location.reload()}>{t.reload}</Button>
        <Button variant="ghost" href="/">{t.home}</Button>
      </div>
    </main>
  )
}
