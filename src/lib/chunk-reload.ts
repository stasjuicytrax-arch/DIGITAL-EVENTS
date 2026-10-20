/**
 * После нового деплоя у открытой вкладки старый index: чанков с прежними хешами уже нет,
 * и переход падает с «Failed to fetch dynamically imported module». Лечим одной перезагрузкой
 * на целевой URL. Флаг в sessionStorage не даёт уйти в бесконечный цикл, если сервер действительно лежит.
 */
const KEY = 'de:chunk-reload'
const WINDOW_MS = 15_000

export const isChunkError = (e: unknown) =>
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Unable to preload CSS/i.test(
    String((e as Error)?.message ?? e),
  )

/** true — перезагрузка запущена; false — уже пробовали недавно, показываем страницу ошибки */
export function reloadOnce(url = window.location.href) {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < WINDOW_MS) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    // sessionStorage недоступен (приватный режим) — одна попытка без флага
  }
  window.location.assign(url)
  return true
}

/**
 * Глобальный перехват: Vite сообщает о провале предзагрузки модуля событием vite:preloadError.
 * Ошибку не глушим — она доходит до роутера, тот завершает переход на целевой URL и показывает
 * RouteError, который перезагружает уже нужную страницу. Здесь — страховка для загрузок вне роутера:
 * через секунду, если никто не перезагрузил, перезагружаем текущий адрес.
 */
export function initChunkReload() {
  if (typeof window === 'undefined') return
  window.addEventListener('vite:preloadError', () => {
    window.setTimeout(() => reloadOnce(), 1000)
  })
  // успешная загрузка — флаг больше не нужен
  window.setTimeout(() => {
    try { sessionStorage.removeItem(KEY) } catch { /* ignore */ }
  }, WINDOW_MS)
}
