import { site } from '@/content/site'

// Каркас главной (TZ §12, шаг 1). Блоки 0–11 добавляются на следующих шагах.
export function Component() {
  return (
    <main className="flex min-h-dvh flex-col justify-between bg-void px-margin py-12">
      <p className="text-label text-mute-2">
        <span className="text-lime">✱</span> [{site.descriptor}] · {site.city}
      </p>
      <h1 className="text-display-xxl">
        <span className="block text-white">Технологии</span>
        <span className="block text-mute">развлечений</span>
      </h1>
      <p className="text-micro text-mute-2">{site.name} / setup</p>
    </main>
  )
}
