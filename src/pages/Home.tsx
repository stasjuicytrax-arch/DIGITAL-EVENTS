import { Hero } from '@/sections/Hero'
import { Greeting } from '@/sections/Greeting'
import { Manifest } from '@/sections/Manifest'
import { Result } from '@/sections/Result'

// Главная (TZ §5): блоки добавляются по шагам TZ §12
// (блок 0 прелоадер и блок 4 лента кадров — ждут промтов data-rain и tilted-grid-hero)
export function Component() {
  return (
    <main className="pb-24">
      <Hero />
      <Greeting />
      <Manifest />
      <Result />
    </main>
  )
}
