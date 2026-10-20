// Парсит old-site/services/**/description.md → src/content/services.ts (TZ §5.5, §10.1).
// Также пишет scripts/media-sources.json: id картинки → файл в old-site (вход для build-media.mjs).
// Запуск: npm run content. Результат проверить глазами и закоммитить; дальше правки только в services.ts.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { typograf } from '../src/lib/typograf.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const OLD = path.join(ROOT, 'old-site')
const TODO = '__TODO__'

// ---------- структура сайта (TZ §4) ----------
const DIRECTIONS = [
  {
    slug: 'videophoto', title: 'Видео / фото зоны', src: 'services/videophoto-zones',
    summary: 'Любой праздник не обходится без фотографий. Превращаем привычный процесс в эффектный digital-аттракцион', tags: ['9 зон'],
    items: [['scrollcam-360', 'Scrollcam 360'], ['tvoya-planeta', 'Твоя планета'], ['3d-kaleydoskop', '3D-калейдоскоп'], ['media-cube', 'Media Cube'],
      ['selfie-star', 'Selfie Star'], ['planeta-molodozhenov', 'Планета молодожёнов'], ['selfi-stoyka', 'Селфи стойка'], ['selfi-zerkalo', 'Селфи зеркало'],
      ['lazernyy-koridor', 'Лазерный коридор']],
    tag: 'Фотозона',
  },
  {
    slug: 'interactive', title: 'Интерактивы', src: 'services/interactives',
    summary: 'Digital-активности: незабываемые развлечения с фото и видео, которые гости делают прямо на событии', tags: ['6 форматов'],
    items: [['headtalk', 'Headtalk'], ['live-paint', 'Live Paint'], ['multiface', 'Multiface'], ['randomizer', 'Randomizer'], ['videograffiti', 'Видеограффити'], ['playtronica', 'Playtronica']],
    tag: 'Интерактив',
  },
  {
    slug: 'videogames', title: 'Видеоигры', src: 'services/videogames',
    summary: 'Голосовые, подвижные и VR-игры. Адаптируем любую под ваше событие или разработаем новую', tags: ['voice', 'move', 'VR'],
    groups: [
      { slug: 'voice-games', title: 'Voice Games', subtitle: 'Голосовые игры', src: 'voice-games', tag: 'Voice',
        items: [['bon-voyazh', 'Бон вояж'], ['don-kupidon', 'Дон Купидон'], ['karaorke', 'Karaorke'], ['peretyani-deda', 'Перетяни деда'], ['poprygunchik', 'Попрыгунчик'],
          ['snegurochka', 'Снегурочка'], ['snezhnyy-marafon', 'Снежный марафон'], ['tachki-tyanuchki', 'Тачки-тянучки'], ['toropyzhka', 'Торопыжка']] },
      { slug: 'move-games', title: 'Move Games', subtitle: 'Подвижные игры', src: 'move-games', tag: 'Move',
        items: [['begi-ded-begi', 'Беги, дед, беги!'], ['frirayder', 'Фрирайдер'], ['myshinye-bega', 'Мышиные бега'], ['skeyter', 'Скейтер']] },
    ],
    items: [['vr', 'VR Games', 'vr', 'VR'], ['game-adaptation', 'Game Adaptation', 'game-adaptation', 'Adaptation']],
    tag: 'Игра',
  },
  {
    slug: '3d-mapping', title: '3D-Mapping', src: 'services/3d-mapping',
    summary: 'Проецируем изображение на объём с учётом геометрии: от торта и стола до автомобиля и фасада', tags: ['торт', 'столы', 'авто'],
    items: [['tort', '3D mapping на торт', '3d-mapping-na-tort'], ['stoly', '3D mapping на столы', '3d-mapping-na-stoly'], ['avto', '3D mapping на авто', '3d-mapping-na-avto']],
    tag: 'Mapping',
  },
  {
    slug: 'ar', title: 'AR · дополненная реальность', src: 'services/ar',
    summary: 'Реальная картинка и графика поверх неё на одном экране: для бизнеса и для событий', tags: ['business', 'events'],
    items: [['ar-for-business', 'AR для бизнеса'], ['ar-for-events', 'AR для событий']],
    tag: 'AR',
    // текст страницы AR на старом сайте скопирован с «Видеоигр» (TZ §5.5): берём с /uslugi
    leadOverride: 'Augmented reality, AR — смешанная реальность, когда на экране одновременно видно картинку, которая существует на самом деле, и дополняющее её графическое изображение. Например, во время прямого эфира футбольного матча демонстрируется схема движения мяча (траектория, скорость и др.)',
  },
  {
    slug: 'digital-decor', title: 'Digital Decor', src: 'services/digital-decor',
    summary: 'Динамичные управляемые конструкции и световые сооружения: декор становится персонажем ивента', tags: ['свет', 'LED'], items: [],
  },
  {
    slug: 'installations', title: 'Инсталляции', src: 'services/installations',
    summary: 'Мультимедийные шоу и инсталляции: готовые решения из технических и дизайнерских ресурсов', tags: ['арт'],
    items: [['lyubov-permi', 'Инсталляция «Любовь Перми»']], tag: 'Инсталляция',
    leadOverride: 'Мультимедийные шоу и инсталляции — это готовые решения для воплощения ваших идей с помощью комплекса технических и дизайнерских ресурсов.',
  },
  {
    slug: 'online', title: 'Онлайн-мероприятия', src: 'services/online-events',
    summary: 'Участники взаимодействуют «здесь и сейчас», но на расстоянии', tags: ['online'], items: [],
    leadOverride: 'ONLINE-направления — это способ взаимодействия участников мероприятия «здесь и сейчас», но на расстоянии.',
  },
  {
    slug: 'video-production', title: 'Video Production', src: 'services/video-production',
    summary: 'Видео для событий и продукта: от идеи до готового ролика', tags: ['видео'], items: [],
    leadOverride: '',
  },
  {
    slug: 'new-year', title: 'Новогоднее предложение', src: 'services/by-event-format/new-year', parentTitle: 'По формату события',
    summary: 'Digital-решения под формат и тему: новогоднее предложение и другие подборки', tags: ['new year'], items: [],
    leadOverride: 'Digital-решения для разных форматов и тем мероприятий.',
    picks: ['videogames/begi-ded-begi', 'videogames/snegurochka', 'videogames/snezhnyy-marafon', 'videogames/peretyani-deda'],
  },
]

// Обложки и порядок фото выбраны вручную после просмотра (TZ §10.2). Ключ: id раздела, значение: имя файла в папке old-site.
const COVERS = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'covers.json'), 'utf8'))
// Видео карточек: на старом сайте кнопка «Видео» стояла на карточке, а не в попапе
const ITEM_VIDEOS = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'item-videos.json'), 'utf8'))

// ---------- чистка текста (TZ §5.5) ----------
const SERVICE_LINE = /^(подробнее|видео|назад|заказать|оставить заявку\s*→?|связаться с нами\s*→?|go back\s*→?|close|отправить|что бы увидеть как это работает|отсканируйте qr код)$/i
const FIXES = [
  [/ИНСТАЛЯЦИ/g, 'ИНСТАЛЛЯЦИ'], [/([Ии])нсталяци/g, '$1нсталляци'],
  [/FOR BUISINESS/gi, 'for business'], [/(^|[^а-яё])([Чч])то бы(?![а-яё])/g, '$1$2тобы'], [/(^|\s)C КОТОРЫМИ/g, '$1С КОТОРЫМИ'], [/требование зависят/g, 'требования зависят'], [/Мы создаёт/g, 'Мы создаём'],
  [/мирамогут/g, 'мира могут'], [/отрытый/g, 'открытый'], [/никакихджойстиков/g, 'никаких джойстиков'],
  [/ м2'/g, ' м²'], [/(\d)\s*м2\b/g, '$1 м²'], [/Аugmented/g, 'Augmented'],
  [/(\d)\s*[хx]\s*(\d)\s*[хx]\s*(\d)/g, '$1×$2×$3'], [/(\d)\s*[хx]\s*(\d)/g, '$1×$2'],
  [/\s+–\s+/g, ' — '], [/ - /g, ' — '], [/\s{2,}/g, ' '],
]
const fix = (s) => FIXES.reduce((a, [re, to]) => a.replace(re, to), s).trim()
const isCaps = (s) => /[A-ZА-ЯЁ]/.test(s) && s === s.toUpperCase()
const sentenceCase = (s) => {
  const t = s.toLowerCase().replace(/\s*\|\s*/g, ' · ').replace(/(^|[^a-z])(ar|vr|led|qr|3d|ios)(?![a-z])/g, (m, a, w) => a + w.toUpperCase())
  return t.charAt(0).toUpperCase() + t.slice(1)
}
const norm = (s) => s.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '').replace(/ё/g, 'е')

function readDesc(rel) {
  const f = path.join(OLD, rel, 'description.md')
  if (!fs.existsSync(f)) return { lines: [], videos: [], files: [] }
  const md = fs.readFileSync(f, 'utf8')
  const section = (name) => (md.split(/^## /m).find((s) => s.startsWith(name)) || '').split('\n').slice(1)
  const lines = section('Текст с сайта').map((l) => l.replace(/\s+$/, '').trim()).filter(Boolean)
  const videos = [...new Set(section('Видео').map((l) => l.replace(/^- /, '').trim()).filter(Boolean).map(videoId).filter(Boolean))]
  return { lines, videos }
}
function videoId(u) {
  u = u.replace(/&amp.*$/, '').replace(/&.*$/, '')
  const m = u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : /vk\.com\/video|vkvideo/.test(u) ? u : null
}

/** Склеивает строки, разорванные переносами Tilda, в абзацы; выделяет техтребования и «Дополнительно». */
function parseBody(lines, title, { stopAtCta = false } = {}) {
  const out = { text: [], tech: [], extras: [] }
  let mode = 'text'
  let started = false
  let buf = ''
  const flush = () => { if (buf) { out[mode === 'text' ? 'text' : mode].push(buf.trim()); buf = '' } }
  const nextText = (i) => {
    for (let j = i + 1; j < lines.length; j++) if (!SERVICE_LINE.test(lines[j]) && !lines[j].startsWith('{')) return lines[j]
    return ''
  }
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    if (raw.startsWith('{') || SERVICE_LINE.test(raw)) {
      if (stopAtCta && /оставить заявку|связаться с нами/i.test(raw) && started) { flush(); break }
      continue
    }
    const l = fix(raw)
    if (/^технические требовани[ея]:?$/i.test(l)) { flush(); mode = 'tech'; continue }
    if (/^дополнительно:?$/i.test(l)) { flush(); mode = 'extras'; continue }
    // заголовок позиции в начале (капсом, совпадает с названием или его частью)
    if (!started && isCaps(l) && l.length < 60 && (norm(title).includes(norm(l)) || norm(l).includes(norm(title)) || norm(l).length < 14)) continue
    started = true
    if (mode !== 'text') {
      // перенос строки внутри одного требования
      const arr = out[mode]
      if (arr.length && /^[а-яёa-z]/.test(l)) arr[arr.length - 1] += ' ' + l.replace(/[.;,]$/, '')
      else arr.push(l.replace(/[.;,]$/, ''))
      continue
    }
    // дубль названия направления в начале текста
    if (!out.text.length && !buf && isCaps(l) && norm(title).includes(norm(l))) continue
    if (isCaps(l) && l.length < 50 && !/[.!?]$/.test(l)) { flush(); out.text.push({ heading: sentenceCase(l) }); continue }
    buf = buf ? `${buf} ${l}` : l
    // короткая строка-слоган без точки, за которой идёт новое предложение, — отдельный абзац
    const next = nextText(i)
    if (/[.!?…»")]$/.test(l) || (buf === l && l.length < 70 && /^[А-ЯЁA-Z«"]/.test(next) && !isCaps(next))) flush()
  }
  flush()
  out.tech = out.tech.map((t) => {
    const m = t.match(/^([^—:]{2,40}?)\s*(?:—|:)\s*(.+)$/)
    return m ? { label: m[1].trim(), value: m[2].trim() } : { label: '', value: t }
  })
  return out
}
/** Убирает подзаголовки без текста под ними (подряд идущие и висящие в конце), опционально — в начале. */
const tidy = (arr, { dropLeading = false } = {}) => {
  const out = arr.filter((p, i) => typeof p === 'string' || (i + 1 < arr.length && typeof arr[i + 1] === 'string'))
  while (dropLeading && out.length && typeof out[0] !== 'string') out.shift()
  return out
}
const firstSentence =(p) => (p.match(/^.+?[.!?](?=\s+[А-ЯЁA-Z«"]|$)/) || [p])[0]
const T = (s) => (typeof s === 'string' ? typograf(s) : s.heading ? { heading: typograf(s.heading) } : s)

// ---------- картинки ----------
const JUNK = /instagram|whatsapp|youtube|telegram|vector|noise|ellipse|background|hand-08|qr-code|logo|flyer|arrow|icon|^group|frame-|rectangle|giphy|scribble|button|path-|svg-/i
const sources = {} // id -> old-site relative path
async function imagesFor(rel, section, slug, coverKey) {
  const dir = path.join(OLD, rel)
  if (!fs.existsSync(dir) || COVERS.noImages.includes(coverKey)) return []
  const exclude = COVERS.exclude[coverKey] || []
  const files = fs.readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !JUNK.test(f.replace(/^.*?--/, '')) && !exclude.some((x) => f.includes(x)))
    .map((f) => path.posix.join(rel, f))
    .concat(COVERS.extra[coverKey] || [])
  const ok = []
  for (const f of files) {
    const m = await sharp(path.join(OLD, f)).metadata()
    if (Math.max(m.width, m.height) >= 700) ok.push(f)
  }
  const order = COVERS.order[coverKey] || []
  const rank = (f) => { const i = order.findIndex((x) => path.basename(f).includes(x)); return i < 0 ? 999 : i }
  ok.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
  return ok.map((f, i) => {
    const id = `${section}/${slug}-${String(i + 1).padStart(2, '0')}`
    sources[id] = f
    return id
  })
}

// ---------- сборка ----------
/** "позиция" (в этом направлении) или "направление/позиция" → обложка позиции */
const coverOf = (ref, items) => {
  if (!ref) return undefined
  const [dir, item] = ref.includes('/') ? ref.split('/') : [null, ref]
  const pool = dir ? directions.find((x) => x.slug === dir)?.items ?? [] : items
  return pool.find((i) => i.slug === item)?.images[0]
}
const directions = []
const report = []
for (const d of DIRECTIONS) {
  const desc = readDesc(d.src)
  const body = parseBody(desc.lines, d.title, { stopAtCta: true })
  let lead = d.leadOverride ?? body.text.find((p) => typeof p === 'string') ?? ''
  const text = d.leadOverride !== undefined ? [] : tidy(body.text.filter((p) => p !== lead), { dropLeading: true })
  const sentences = (lead.match(/[.!?](\s|$)/g) || []).length
  const needsText = !lead || (d.leadOverride !== undefined && sentences < 2 && !['ar'].includes(d.slug))
  const items = []
  const mkItem = async (folder, slug, title, group, tag) => {
    const rel = `${d.src}/${folder}`
    const p = readDesc(rel)
    const b = parseBody(p.lines, title)
    // попап без текста (например, «Твоя планета»): берём текст с карточки на странице направления
    if (!b.text.some((x) => typeof x === 'string' && x.length > 20)) {
      const at = desc.lines.findIndex((l) => norm(l) === norm(title))
      if (at >= 0) {
        const end = desc.lines.findIndex((l, j) => j > at && SERVICE_LINE.test(l))
        b.text = parseBody(desc.lines.slice(at + 1, end < 0 ? undefined : end), title).text
      }
    }
    b.text = tidy(b.text)
    const paras = b.text.filter((x) => typeof x === 'string')
    const it = {
      slug, title, group: group || undefined, tag: tag || d.tag,
      lead: paras[0] ? T(firstSentence(paras[0])) : TODO,
      text: b.text.map(T),
      techRequirements: b.tech.map((t) => ({ label: T(t.label), value: T(t.value) })),
      extras: b.extras.map(T),
      videos: [...new Set([...p.videos, ...(ITEM_VIDEOS[slug] || []).map((id) => `https://www.youtube.com/watch?v=${id}`)])],
      images: await imagesFor(rel, d.slug, slug, `${d.slug}/${slug}`),
      badge: slug === 'begi-ded-begi' ? 'Новый год' : undefined,

    }
    report.push(`${d.slug}/${slug}\t${it.images.length} фото\t${it.text.length} абз.\t${it.techRequirements.length} тех\t${it.videos.length} видео${it.lead === TODO ? '\tTODO' : ''}`)
    items.push(it)
  }
  const groups = []
  for (const g of d.groups || []) {
    const gd = readDesc(`${d.src}/${g.src}`)
    const gb = parseBody(gd.lines, g.title + ' ' + g.subtitle, { stopAtCta: true })
    const gt = gb.text.filter((x) => typeof x === 'string')
    const gTech = parseBody(gd.lines.slice(gd.lines.findIndex((l) => /^ТЕХНИЧЕСКИЕ/i.test(l))), '').tech
    groups.push({ slug: g.slug, title: g.title, subtitle: g.subtitle, lead: T(gt[0] || ''), text: gt.slice(1).map(T),
      techRequirements: gd.lines.some((l) => /^ТЕХНИЧЕСКИЕ/i.test(l)) ? gTech.map((t) => ({ label: T(t.label), value: T(t.value) })) : [],
      videos: gd.videos })
    for (const [folder, title] of g.items) await mkItem(`${g.src}/${folder}`, folder, title, g.slug, g.tag)
  }
  for (const [slug, title, folder, tag] of d.items) await mkItem(folder || slug, slug, title, undefined, tag)
  const images = await imagesFor(d.src, d.slug, d.slug, d.slug)
  directions.push({
    slug: d.slug, title: d.title, parentTitle: d.parentTitle, summary: T(d.summary), tags: d.tags,
    lead: needsText ? (lead ? T(lead) + TODO : TODO) : T(lead),
    text: text.map(T),
    groups: groups.length ? groups : undefined,
    items, picks: d.picks,
    videos: desc.videos.filter((v) => !items.some((i) => i.videos.includes(v))),
    images,
    cover: coverOf(COVERS.directionCover[d.slug], items) ?? images[0],
  })
  report.push(`== ${d.slug}\t${images.length} фото\t${items.length} позиций${needsText ? '\tTODO текст' : ''}`)
}

// ---------- запись services.ts ----------
const clean = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v === undefined ? undefined : v)))
let json = JSON.stringify(clean(directions), null, 2)
json = json
  .replace(/"lead": "__TODO__"(,?)/g, '"lead": ""$1 // TODO: текст от клиента')
  .replace(/"lead": "(.+?)__TODO__"(,?)/g, '"lead": "$1"$2 // TODO: текст от клиента (на старом сайте меньше двух предложений)')

const ts = `// Сгенерировано scripts/build-content.mjs из old-site/services/**/description.md (TZ §5.5, §10.1).
// Дальше правки вручную только здесь. Тексты — со старого сайта, без переписывания смысла.

export type Paragraph = string | { heading: string }
export type TechRow = { label: string; value: string }

export type Item = {
  slug: string
  title: string
  /** группа внутри направления (Voice Games / Move Games) */
  group?: string
  tag: string
  /** первая фраза описания: карточки, хиты, превью */
  lead: string
  text: Paragraph[]
  techRequirements: TechRow[]
  extras: string[]
  /** YouTube / VK со старого сайта */
  videos: string[]
  /** id из src/content/media.json, первая — обложка */
  images: string[]
  badge?: string
}

export type Group = {
  slug: string
  title: string
  subtitle: string
  lead: string
  text: Paragraph[]
  techRequirements: TechRow[]
  videos: string[]
}

export type Direction = {
  slug: string
  title: string
  /** для «Новогоднего предложения»: раздел «По формату события» */
  parentTitle?: string
  /** строка списка «Так что мы умеем?» (TZ §5, блок 9) */
  summary: string
  tags: string[]
  lead: string
  text: Paragraph[]
  groups?: Group[]
  items: Item[]
  /** подборка позиций из других направлений: "<направление>/<позиция>" */
  picks?: string[]
  videos: string[]
  /** id из src/content/media.json: фото самого направления (галерея) */
  images: string[]
  /** обложка направления (каталог, папки, список услуг); может быть обложкой одной из позиций */
  cover?: string
}

export const directions: Direction[] = ${json}

export const getDirection = (slug: string) => directions.find((d) => d.slug === slug)
export const getItem = (dir: string, item: string) => getDirection(dir)?.items.find((i) => i.slug === item)
export const allItems = () => directions.flatMap((d) => d.items.map((item) => ({ direction: d, item })))
`
fs.writeFileSync(path.join(ROOT, 'src/content/services.ts'), ts)
fs.writeFileSync(path.join(import.meta.dirname, 'media-sources.json'), JSON.stringify(sources, null, 1))
console.log(report.join('\n'))
console.log(`\nнаправлений: ${directions.length}, позиций: ${directions.reduce((a, d) => a + d.items.length, 0)}, картинок: ${Object.keys(sources).length}`)
