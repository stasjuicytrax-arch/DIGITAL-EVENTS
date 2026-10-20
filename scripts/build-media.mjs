// Медиа-пайплайн (TZ §10.1): old-site → public/media/<раздел>/<slug>-NN-<ширина>.(avif|webp) + src/content/media.json.
// Вход: scripts/media-sources.json (фото направлений и позиций из build-content.mjs) + разделы common/ из SECTIONS.
// Ширины 640 / 1280 / 1920 + нативная ширина исходника, без апскейла; AVIF q64, WebP q84 (чёткость важнее веса), EXIF снимается, для каждого фото blur-плейсхолдер.
// Уже собранные файлы не пересобираются. Запуск: npm run media.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const OLD = path.join(ROOT, 'old-site')
const PUB = path.join(ROOT, 'public', 'media')
const WIDTHS = [640, 1280, 1920]
const MIN_SIDE = 700
const JUNK = /instagram|whatsapp|youtube|telegram|vector|noise|ellipse|background|hand-08|qr-code|logo|flyer|arrow|icon|^group|frame-|rectangle|giphy|scribble|button|path-|svg-|tilda/i

// Разделы вне направлений (TZ §10.3): портфолио, главная, «О нас»
const SECTIONS = [
  ['portfolio-2018', 'common/portfolio-2018'],
  ['portfolio-2019', 'common/portfolio-2019'],
  ['home', 'common/home'],
  ['about', 'common/about'],
]

const jobs = Object.entries(JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'media-sources.json'), 'utf8')))
for (const [section, rel] of SECTIONS) {
  const files = fs.readdirSync(path.join(OLD, rel)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !JUNK.test(f.replace(/^.*?--/, ''))).sort()
  let n = 0
  for (const f of files) {
    const m = await sharp(path.join(OLD, rel, f)).metadata()
    if (Math.max(m.width, m.height) < MIN_SIDE) continue
    jobs.push([`${section}/${section}-${String(++n).padStart(2, '0')}`, path.posix.join(rel, f)])
  }
}

const media = {}
const bySource = new Map() // один исходник — одни файлы, даже если он нужен в двух местах
let built = 0, skipped = 0
const queue = [...jobs]
async function work() {
  while (queue.length) {
    const [id, rel] = queue.shift()
    const input = path.join(OLD, rel)
    if (bySource.has(rel)) { media[id] = await bySource.get(rel); continue }
    const task = (async () => {
      const img = sharp(input, { failOn: 'none' }).rotate()
      const { width, height } = await img.metadata().then((m) => (m.orientation >= 5 ? { width: m.height, height: m.width } : m))
      const widths = WIDTHS.filter((w) => w <= width)
      // нативная ширина исходника, если она заметно больше последней ступени (1680 → 640/1280/1680):
      // иначе на широких экранах браузер растягивает 1280 и картинка мылится
      if (!widths.length || width - widths[widths.length - 1] > 160) widths.push(width)
      const base = `/media/${id}`
      const out = path.join(PUB, id)
      fs.mkdirSync(path.dirname(out), { recursive: true })
      const srcTime = fs.statSync(input).mtimeMs
      for (const w of widths) {
        for (const [fmt, opts] of [['avif', { quality: 64, effort: 4 }], ['webp', { quality: 84, effort: 5 }]]) {
          const file = `${out}-${w}.${fmt}`
          if (fs.existsSync(file) && fs.statSync(file).mtimeMs >= srcTime) { skipped++; continue }
          await sharp(input, { failOn: 'none' }).rotate().resize({ width: w, withoutEnlargement: true })[fmt](opts).toFile(file)
          built++
        }
      }
      const blur = await sharp(input, { failOn: 'none' }).rotate().resize({ width: 16 }).webp({ quality: 40 }).toBuffer()
      return { src: base, w: width, h: Math.round(height), widths, blur: `data:image/webp;base64,${blur.toString('base64')}` }
    })()
    bySource.set(rel, task)
    media[id] = await task
  }
}
await Promise.all(Array.from({ length: Math.max(2, Math.min(6, os.cpus().length - 1)) }, work))

const sorted = Object.fromEntries(Object.keys(media).sort().map((k) => [k, media[k]]))
fs.writeFileSync(path.join(ROOT, 'src/content/media.json'), JSON.stringify(sorted, null, 1))
console.log(`фото: ${Object.keys(sorted).length}, уникальных исходников: ${bySource.size}, файлов собрано: ${built}, пропущено (уже есть): ${skipped}`)
