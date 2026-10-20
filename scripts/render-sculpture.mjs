// Рендер hero-скульптуры (DESIGN.md §7.3) в public/sculpture/*.webp с прозрачным фоном.
// Движок частиц (src/components/three/liquid-engine.ts) пересобирает скульптуру из пикселей этих картинок.
// Запуск: node scripts/render-sculpture.mjs  (нужен Chromium от Playwright; путь — PW_CHROMIUM или стандартный кеш)
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { chromium } from 'playwright'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'sculpture')
fs.mkdirSync(OUT, { recursive: true })

function findChromium() {
  if (process.env.PW_CHROMIUM) return process.env.PW_CHROMIUM
  const base = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), '.cache'), 'ms-playwright')
  const dir = fs.existsSync(base) && fs.readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().pop()
  if (!dir) return undefined
  const exe = ['chrome-win64/chrome.exe', 'chrome-linux/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium'].map((p) => path.join(base, dir, p)).find(fs.existsSync)
  return exe
}

const browser = await chromium.launch({ executablePath: findChromium(), args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage()
// раздаём сцену и three.js с «виртуального» хоста
await page.route('http://sculpture.local/**', (route) => {
  const p = new URL(route.request().url()).pathname
  const file = p.startsWith('/three/') ? path.join(ROOT, 'node_modules', p) : path.join(import.meta.dirname, 'sculpture', p.slice(1))
  if (!fs.existsSync(file)) return route.fulfill({ status: 404 })
  route.fulfill({ body: fs.readFileSync(file), contentType: file.endsWith('.js') ? 'text/javascript' : 'text/html' })
})
page.on('pageerror', (e) => console.error('page error', e.message))

for (const [name, w, h] of [['sculpture-wide', 3200, 1280], ['sculpture-tall', 1440, 1800]]) {
  await page.setViewportSize({ width: Math.min(w, 1600), height: Math.min(h, 1600) })
  await page.goto(`http://sculpture.local/scene.html?w=${w}&h=${h}`)
  await page.waitForFunction(() => window.__done, null, { timeout: 180000 })
  const url = await page.evaluate(() => window.__done)
  const png = Buffer.from(url.split(',')[1], 'base64')
  // обрезаем прозрачные поля и сохраняем webp с альфой
  const trimmed = await sharp(png).trim({ threshold: 1 }).extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
  await sharp(trimmed).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, `${name}.webp`))
  const meta = await sharp(trimmed).metadata()
  console.log(name, `${meta.width}×${meta.height}`, `${(fs.statSync(path.join(OUT, `${name}.webp`)).size / 1024).toFixed(0)} КБ`)
}
await browser.close()
