// Служебный: контактный лист обложек направлений и позиций для согласования с заказчиком.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { directions } from '../src/content/services.ts'
const media = JSON.parse(fs.readFileSync('src/content/media.json', 'utf8'))
const OUT = process.argv[2]
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ')
const TW = 220, TH = 150, CAP = 40, GAP = 10, LEFT = 300, PER = 7
const file = (id) => path.join('public', media[id].src + '-640.webp')
const rows = []
for (const [n, d] of directions.entries()) {
  const items = d.picks ? d.picks.map((p) => { const [dd, ii] = p.split('/'); return directions.find((x) => x.slug === dd).items.find((x) => x.slug === ii) }) : d.items
  for (let i = 0; i < Math.max(1, items.length); i += PER) rows.push({ d, n, items: items.slice(i, i + PER), first: i === 0, pick: !!d.picks })
}
const H = rows.length * (TH + CAP + GAP) + 20, W = LEFT + PER * (TW + GAP) + 10
const comps = []
let y = 10
for (const r of rows) {
  if (r.first) {
    comps.push({ input: await sharp(file(r.d.cover)).resize(LEFT - 20, TH, { fit: 'cover' }).toBuffer(), left: 10, top: y })
    comps.push({ input: Buffer.from(`<svg width="${LEFT - 20}" height="${CAP}"><text x="0" y="17" font-size="15" font-family="Arial" font-weight="bold" fill="#B6FC46">${String(r.n + 1).padStart(2, '0')} ${esc(r.d.title)}</text><text x="0" y="34" font-size="12" font-family="Arial" fill="#A3A3A8">/uslugi/${r.d.slug} · ${r.pick ? 'подборка' : r.d.items.length + ' поз.'}</text></svg>`), left: 10, top: y + TH })
  }
  let x = LEFT
  for (const it of r.items) {
    comps.push({ input: await sharp(file(it.images[0])).resize(TW, TH, { fit: 'cover' }).toBuffer(), left: x, top: y })
    const g = it.group ? (it.group === 'voice-games' ? 'Voice · ' : 'Move · ') : ''
    comps.push({ input: Buffer.from(`<svg width="${TW}" height="${CAP}"><text x="0" y="17" font-size="13" font-family="Arial" fill="#F5F5F2">${esc(it.title)}</text><text x="0" y="33" font-size="11" font-family="Arial" fill="#76767C">${esc(g)}${it.images.length} фото${it.videos.length ? ' · видео' : ''}</text></svg>`), left: x, top: y + TH })
    x += TW + GAP
  }
  y += TH + CAP + GAP
}
await sharp({ create: { width: W, height: H, channels: 3, background: '#0A0A0B' } }).composite(comps).jpeg({ quality: 82 }).toFile(OUT)
console.log('ok', W, H)
