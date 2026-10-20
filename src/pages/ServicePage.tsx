import { useParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { directions, getDirection, getItem, type Direction } from '@/content/services'
import { servicePage as t } from '@/content/pages'
import { nav } from '@/content/nav'
import { site } from '@/content/site'
import { getMedia } from '@/components/Media'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionLabel } from '@/components/SectionLabel'
import { DirectionCard } from '@/components/Cards'
import { LiteYouTube } from '@/components/LiteYouTube'
import { Panel } from '@/components/Panel'
import { Button } from '@/components/ui/button'
import { ServiceHero } from '@/components/services/ServiceHero'
import { BentoCard, BentoItems } from '@/components/services/BentoItems'
import { FilmGallery, type Frame } from '@/components/services/FilmGallery'
import { getLenis } from '@/lib/lenis'
import { pad2 } from '@/lib/tech'
import { Component as NotFound } from './NotFound'

const uniq = (ids: (string | undefined)[]) => [...new Set(ids.filter(Boolean) as string[])]

/** 4–5 лучших кадров направления для слайдшоу: обложка, фото направления, затем обложки позиций */
function heroFrames(d: Direction) {
  return uniq([d.cover, ...d.images, ...d.items.map((i) => i.images[0])]).slice(0, 5)
}

/** Плёнка: по 2 фото каждой позиции с её названием в подписи + фото направления, не попавшие в hero; не больше 16 */
function filmFrames(d: Direction, hero: string[]): Frame[] {
  const seen = new Set(hero)
  const out: Frame[] = []
  const push = (id: string, caption: string) => { if (!seen.has(id)) { seen.add(id); out.push({ id, caption }) } }
  d.items.forEach((it) => it.images.slice(0, 2).forEach((id) => push(id, it.title)))
  d.images.forEach((id) => push(id, d.title))
  return out.slice(0, 16)
}

/** Чип позиции в hero: скроллит к её карточке */
function ItemChip({ slug, title }: { slug: string; title: string }) {
  const go = (e: React.MouseEvent) => {
    const el = document.getElementById(`item-${slug}`)
    if (!el) return
    e.preventDefault()
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { offset: -120 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  return (
    <a href={`#item-${slug}`} onClick={go} className="text-micro inline-flex min-h-9 items-center rounded-pill bg-void/40 px-3 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] backdrop-blur-sm transition-colors duration-(--t-fast) ease-soft hover:bg-white hover:text-ink">
      {title}
    </a>
  )
}

/**
 * Страница направления /uslugi/<услуга>: full-bleed hero со слайдшоу и HUD, текст, bento позиций
 * (у видеоигр — группами Voice / Move), галерея-плёнка, видео, CTA-полоса, другие направления.
 */
export function Component() {
  const { dir = '' } = useParams()
  const d = getDirection(dir)
  if (!d) return <NotFound />

  const idx = directions.findIndex((x) => x.slug === d.slug)
  const frames = heroFrames(d)
  const film = filmFrames(d, frames)
  const picks = (d.picks ?? []).map((p) => { const [pd, pi] = p.split('/'); return { dir: pd, item: getItem(pd, pi) } }).filter((p) => p.item)
  const ungrouped = d.items.filter((i) => !i.group)
  const videos = [...new Set([...d.videos, ...(d.groups ?? []).flatMap((g) => g.videos)])]
  const others = [1, 2, 3].map((k) => directions[(idx + k) % directions.length])
  const count = picks.length || d.items.length
  const og = frames[0] && getMedia(frames[0])
  const chipItems = d.items.length ? d.items : picks.map((p) => p.item!)
  let n = 0

  return (
    <main id="main" className="pb-24">
      <Head>
        <title>{`${d.title} — ${site.name} | ${site.city}`}</title>
        <meta name="description" content={d.summary} />
        <link rel="canonical" href={`${site.url}/uslugi/${d.slug}`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>

      <ServiceHero
        title={d.title}
        frames={frames}
        crumbs={[t.crumbsRoot, { label: d.parentTitle ? `${d.parentTitle} · ${d.title}` : d.title }]}
        hud={[
          `[${pad2(idx + 1)} / ${pad2(directions.length)}]`,
          t.hudKind,
          ...(count ? [`${pad2(count)} ${nav.positions(count).split(/\s/).slice(1).join(' ')}`] : []),
          site.city,
        ]}
        lead={d.lead || d.summary}
        cta={<Button href={t.cta.to}>{t.cta.label}</Button>}
        below={
          chipItems.length > 0 && (
            <nav aria-label={t.chipsLabel} className="flex flex-wrap gap-2">
              {chipItems.map((it) => <ItemChip key={it.slug} slug={it.slug} title={it.title} />)}
            </nav>
          )
        }
      />

      {/* интро: лейбл слева, первый абзац — крупное утверждение, остальное — обычный текст под ним */}
      {d.text.length > 0 && (
        <section aria-label={t.aboutTitle} className="grid grid-cols-4 gap-gutter border-b border-line px-margin pb-16 pt-16 md:grid-cols-12 md:pb-24 md:pt-24">
          <SectionLabel className="col-span-4 self-start md:col-span-3 md:mt-3">{t.aboutTitle}</SectionLabel>
          <div className="col-span-4 mt-8 md:col-span-9 md:mt-0">
            {typeof d.text[0] === 'string' && <p className="text-h2 max-w-[24ch] text-white">{d.text[0]}</p>}
            {d.text.length > 1 && <Paragraphs items={d.text.slice(1)} className="mt-8 md:mt-10 md:max-w-[56ch]" />}
          </div>
        </section>
      )}

      {/* позиции: bento */}
      {(d.items.length > 0 || picks.length > 0) && (
        <section aria-labelledby="items-title" className="pt-16 md:pt-24">
          <div className="px-margin">
            <SectionLabel>{picks.length ? t.picksTitle : t.itemsTitle}</SectionLabel>
            <h2 id="items-title" className="sr-only">{picks.length ? t.picksTitle : t.itemsTitle}</h2>
          </div>
          {d.groups?.map((g) => {
            const list = d.items.filter((i) => i.group === g.slug)
            const start = n + 1
            n += list.length
            return (
              <div key={g.slug} className="mt-12 md:mt-16">
                <div className="mb-10 grid gap-6 px-margin md:grid-cols-12">
                  <h3 className="text-h2 md:col-span-5">
                    {g.title} <span className="block text-mute">{g.subtitle}</span>
                  </h3>
                  {g.lead && <p className="text-body-l text-mute-2 md:col-span-6 md:col-start-7">{g.lead}</p>}
                </div>
                <BentoItems dir={d.slug} items={list} start={start} />
              </div>
            )
          })}
          {ungrouped.length > 0 && <div className="mt-12 md:mt-16"><BentoItems dir={d.slug} items={ungrouped} start={n + 1} /></div>}
          {picks.length > 0 && (
            <ul className="mt-12 grid grid-cols-1 gap-gutter px-margin sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
              {picks.map(({ dir: pd, item }, k) => item && (
                <li key={item.slug} className="h-[min(68svh,460px)]">
                  <BentoCard item={item} to={`/uslugi/${pd}/${item.slug}`} n={k + 1} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* галерея-плёнка */}
      {film.length > 0 && (
        <section aria-labelledby="gallery-title" className="pt-24 md:pt-32">
          <div className="mb-10 flex items-end justify-between gap-6 px-margin md:mb-12">
            <SectionLabel>{t.galleryTitle}</SectionLabel>
            <p className="text-micro hidden text-mute-2 lg:block">{t.galleryHint}</p>
          </div>
          <h2 id="gallery-title" className="sr-only">{t.galleryTitle}</h2>
          <FilmGallery frames={film} alt={(k) => t.photoAlt(d.title, k)} />
        </section>
      )}

      {videos.length > 0 && (
        <section aria-labelledby="video-title" className="px-margin pt-24 md:pt-32">
          <SectionLabel>{t.videoTitle}</SectionLabel>
          <h2 id="video-title" className="sr-only">{t.videoTitle}</h2>
          <ul className="mt-12 grid gap-gutter md:grid-cols-2">
            {videos.map((v) => <li key={v}><LiteYouTube url={v} title={d.title} /></li>)}
          </ul>
        </section>
      )}

      <Panel as="section" className="mt-24 md:mt-32" ruler={false} innerClassName="flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-12">
        <h2 className="text-h2">{t.stripTitle}</h2>
        <Button href={t.stripCta.to}>{t.stripCta.label}</Button>
      </Panel>

      <section aria-labelledby="others-title" className="pt-24 md:pt-32">
        <div className="px-margin"><SectionLabel>{t.othersTitle}</SectionLabel></div>
        <h2 id="others-title" className="sr-only">{t.othersTitle}</h2>
        <ul data-lenis-prevent className="mt-12 flex snap-x snap-mandatory gap-gutter overflow-x-auto px-margin pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {others.map((o) => (
            <li key={o.slug} className="w-[80vw] shrink-0 snap-start md:w-[calc((100vw-2*var(--margin)-2*var(--gutter))/3)]">
              <DirectionCard to={`/uslugi/${o.slug}`} n={pad2(directions.indexOf(o) + 1)} title={o.title} count={o.picks ? o.picks.length : o.items.length} cover={o.cover ?? o.images[0]} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
