// Логотипы клиентов (TZ §10.1, §10.3 блок 8): old-site/logos/clients → public/logos/<slug>.webp + src/content/clients.ts.
// Из пар белая/чёрная версия берётся тёмная (для cream-фона), поля обрезаются, высота приводится к 112px (2× от 56px).
// Запуск: node scripts/build-logos.mjs
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'old-site/logos/clients')
const OUT = path.join(ROOT, 'public/logos')
const H = 112

// название — как на логотипе; файл — тёмная версия из old-site
const CLIENTS = [
  ['lukoil', 'Лукойл', 'clients--lukoil-logo-1068x601-02.png'],
  ['mts-live', 'МТС Live', 'client-35.png'],
  ['lexus', 'Lexus', 'clients--pngwingcom-6-02.png'],
  ['er-telecom', 'ЭР-Телеком', 'client-27.png'],
  ['sibur', 'Сибур Химпром', 'client-31.png'],
  ['permenergosbyt', 'Пермэнергосбыт', 'client-28.png'],
  ['vsk', 'ВСК страховой дом', 'clients--92lqzo-02.png'],
  ['promobot', 'Promobot', 'client-26.png'],
  ['parma', 'ПАРМА', 'client-29.png'],
  ['perm-fair', 'Пермская ярмарка', 'client-34.png'],
  ['perm-direction', 'Пермская дирекция', 'clients--logo-02.png'],
  ['reactor-video', 'Reactor Video', 'client-23.png'],
  ['primavera', 'Primavera Marketing Group', 'client-24.png'],
  ['atom', 'Atom Multimedia Group', 'client-33.png'],
  ['praktika', 'Praktika', 'client-22.png'],
  ['date', 'date:', 'client-30.png'],
  ['top2b', 't@p2b', 'client-25.png'],
  ['meformat', 'Меформат', 'client-32.png'],
  ['gs-team', 'GS team', 'client-20.png'],
  ['golden-lion', 'Golden Lion Wedding Agency', 'client-21.png'],
  ['ze', 'ЗЕ', 'client-19.png'],
  ['bitva-robotov', 'Битва роботов', 'clients--bitva-robotov-log.png'],
]

fs.mkdirSync(OUT, { recursive: true })
const files = fs.readdirSync(SRC)
const out = []
for (const [slug, name, hint] of CLIENTS) {
  // имена в old-site могут быть с префиксом раздела
  const file = files.find((f) => f === hint || f.endsWith(hint.replace(/^clients--/, '')))
  if (!file) { console.warn('нет файла', hint); continue }
  const img = sharp(path.join(SRC, file)).trim({ threshold: 10 })
  const buf = await img.resize({ height: H, fit: 'inside', withoutEnlargement: false }).webp({ quality: 92, alphaQuality: 100 }).toBuffer({ resolveWithObject: true })
  fs.writeFileSync(path.join(OUT, `${slug}.webp`), buf.data)
  out.push({ slug, name, w: buf.info.width, h: buf.info.height })
}

fs.writeFileSync(
  path.join(ROOT, 'src/content/clients.ts'),
  `// Сгенерировано scripts/build-logos.mjs. Клиенты со старого сайта (блок «Компании, с которыми мы работаем»).
export type Client = { slug: string; name: string; w: number; h: number }

export const clients: Client[] = ${JSON.stringify(out, null, 2)}
`,
)
console.log(`логотипов: ${out.length}`)
