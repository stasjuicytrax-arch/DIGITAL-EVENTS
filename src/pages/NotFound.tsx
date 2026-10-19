import { Link } from 'react-router-dom'

export function Component() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-8 bg-void px-margin">
      <p className="text-label text-mute-2">
        <span className="text-lime">✱</span> [404]
      </p>
      <h1 className="text-h1">Страница не&nbsp;найдена</h1>
      <Link to="/" className="text-body-l underline underline-offset-4">
        На главную
      </Link>
    </main>
  )
}
