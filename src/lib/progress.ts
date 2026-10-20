import { ScrollTrigger } from './gsap'

type Listener = (p: number) => void
const listeners = new Set<Listener>()
let progress = 0
let trigger: ScrollTrigger | null = null

/**
 * Прогресс скролла страницы 0…1 (DESIGN.md §8.2 «Page counter»): один ScrollTrigger на сайт,
 * пишет CSS-переменную --progress на <html> и раздаёт значение подписчикам (счётчик, бегунок линейки).
 */
export function initProgress() {
  trigger?.kill()
  const set = (p: number) => {
    progress = p
    document.documentElement.style.setProperty('--progress', p.toFixed(4))
    listeners.forEach((fn) => fn(p))
  }
  trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => set(self.progress), onRefresh: (self) => set(self.progress) })
  set(trigger.progress)
  return () => { trigger?.kill(); trigger = null }
}

export function onProgress(fn: Listener) {
  listeners.add(fn)
  fn(progress)
  return () => { listeners.delete(fn) }
}
