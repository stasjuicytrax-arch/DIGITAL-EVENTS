// GitHub Pages для неизвестных адресов отдаёт dist/404.html. vite-react-ssg рендерит маршрут «*»
// как /404 (vite.config.ts → includedRoutes) в dist/404/index.html — переносим его на место.
import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve(import.meta.dirname, '..', 'dist')
const src = path.join(DIST, '404', 'index.html')
if (!fs.existsSync(src)) throw new Error('dist/404/index.html не найден — проверьте includedRoutes в vite.config.ts')
fs.renameSync(src, path.join(DIST, '404.html'))
fs.rmSync(path.join(DIST, '404'), { recursive: true, force: true })
console.log('[404] dist/404.html готов')
