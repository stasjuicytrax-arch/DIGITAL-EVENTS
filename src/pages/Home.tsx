import { Hero } from '@/sections/Hero'
import { Greeting } from '@/sections/Greeting'
import { Manifest } from '@/sections/Manifest'

// Главная (TZ §5): блоки добавляются по шагам TZ §12
export function Component() {
  return (
    <main className="pb-24">
      <Hero />
      <Greeting />
      <Manifest />
    </main>
  )
}
