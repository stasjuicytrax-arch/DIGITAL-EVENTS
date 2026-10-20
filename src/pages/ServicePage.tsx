import { useParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { directions, getDirection, getItem, type Item } from '@/content/services'
import { servicePage as t } from '@/content/pages'
import { site } from '@/content/site'
import { getMedia, Media } from '@/components/Media'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionLabel } from '@/components/SectionLabel'
import { DirectionCard, ItemCard } from '@/components/Cards'
import { Gallery } from '@/components/Gallery'
import { LiteYouTube } from '@/components/LiteYouTube'
import { Panel } from '@/components/Panel'
import { Button } from '@/components/ui/button'
import { useParallax } from '@/lib/motion'
import { Component as NotFound } from './NotFound'

function ItemsGrid({ dir, items }: { dir: string; items: Item[] }) {
  return (
    <ul className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <li key={it.slug}>
          <ItemCard to={`/uslugi/${dir}/${it.slug}`} title={it.title} lead={it.lead} tag={it.tag} cover={it.images[0]} badge={it.badge} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Страница направления /uslugi/<услуга> (TZ §5.2): hero, позиции (у видеоигр — группы Voice / Move,
 * затем VR и Game Adaptation), галерея, видео, CTA-полоса, другие направления.
 * Для направлений без позиций шаг 2 пропускается — галерея главная.
 */
export function Component() {
  const { dir = '' } = useParams()
  const d = getDirection(dir)
  const parallax = useParallax<HTMLDivElement>(12)
  if (!d) return <NotFound />

  const lead = d.lead || d.summary
  const cover = d.cover ?? d.images[0]
  const gallery = d.images.filter((id) => id !== cover)
  const picks = (d.picks ?? []).map((p) => { const [pd, pi] = p.split('/'); return { dir: pd, item: getItem(pd, pi) } }).filter((p) => p.item)
  const ungrouped = d.items.filter((i) => !i.group)
  const videos = [...new Set([...d.videos, ...(d.groups ?? []).flatMap((g) => g.videos)])]
  const idx = directions.findIndex((x) => x.slug === d.slug)
  const others = [1, 2, 3].map((k) => directions[(idx + k) % directions.length])
  const og = cover && getMedia(cover)

  return (
    <main className="pb-24 pt-32">
      <Head>
        <title>{`${d.title} — ${site.name} | ${site.city}`}</title>
        <meta name="description" content={d.summary} />
        <link rel="canonical" href={`${site.url}/uslugi/${d.slug}`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>

      {/* 1. hero направления */}
      <header className="grid grid-cols-4 gap-gutter px-margin md:grid-cols-12 md:items-end">
        <div className="col-span-4 md:col-span-6">
          <Breadcrumbs items={[t.crumbsRoot, { label: d.parentTitle ? `${d.parentTitle} · ${d.title}` : d.title }]} />
          <h1 className="text-h1 mt-8">{d.title}</h1>
          <p className="text-body-l mt-8 max-w-[52ch] text-mute-2">{lead}</p>
          <Button href={t.cta.to} className="mt-10">{t.cta.label}</Button>
        </div>
        {cover && (
          <div className="col-span-4 mt-12 overflow-hidden rounded-lg md:col-span-6 md:mt-0">
            <div ref={parallax} className="scale-[1.15]">
              <Media id={cover} alt={d.title} sizes="(min-width: 768px) 50vw, 100vw" priority className="aspect-[4/3]" />
            </div>
          </div>
        )}
      </header>

      {d.text.length > 0 && (
        <section className="grid grid-cols-4 gap-gutter px-margin pt-24 md:grid-cols-12">
          <Paragraphs items={d.text} className="col-span-4 md:col-span-7 md:col-start-6" />
        </section>
      )}

      {/* 2. позиции */}
      {(d.items.length > 0 || picks.length > 0) && (
        <section aria-labelledby="items-title" className="px-margin pt-section">
          <SectionLabel>{picks.length ? t.picksTitle : t.itemsTitle}</SectionLabel>
          <h2 id="items-title" className="sr-only">{picks.length ? t.picksTitle : t.itemsTitle}</h2>
          {d.groups?.map((g) => (
            <div key={g.slug} className="mt-16">
              <div className="mb-10 grid gap-6 md:grid-cols-12">
                <h3 className="text-h2 md:col-span-5">
                  {g.title} <span className="block text-mute">{g.subtitle}</span>
                </h3>
                {g.lead && <p className="text-body-l text-mute-2 md:col-span-6 md:col-start-7">{g.lead}</p>}
              </div>
              <ItemsGrid dir={d.slug} items={d.items.filter((i) => i.group === g.slug)} />
            </div>
          ))}
          {ungrouped.length > 0 && <div className="mt-16"><ItemsGrid dir={d.slug} items={ungrouped} /></div>}
          {picks.length > 0 && (
            <ul className="mt-16 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
              {picks.map(({ dir: pd, item }) => item && (
                <li key={item.slug}>
                  <ItemCard to={`/uslugi/${pd}/${item.slug}`} title={item.title} lead={item.lead} tag={item.tag} cover={item.images[0]} badge={item.badge} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* 3. галерея */}
      {gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="px-margin pt-section">
          <SectionLabel>{t.galleryTitle}</SectionLabel>
          <h2 id="gallery-title" className="sr-only">{t.galleryTitle}</h2>
          <div className="mt-12">
            <Gallery ids={gallery} alt={(n) => t.photoAlt(d.title, n)} />
          </div>
        </section>
      )}

      {/* 4. видео */}
      {videos.length > 0 && (
        <section aria-labelledby="video-title" className="px-margin pt-section">
          <SectionLabel>{t.videoTitle}</SectionLabel>
          <h2 id="video-title" className="sr-only">{t.videoTitle}</h2>
          <ul className="mt-12 grid gap-gutter md:grid-cols-2">
            {videos.map((v) => <li key={v}><LiteYouTube url={v} title={d.title} /></li>)}
          </ul>
        </section>
      )}

      {/* 5. CTA-полоса */}
      <Panel as="section" className="mt-section" ruler={false} innerClassName="flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-12">
        <h2 className="text-h2">{t.stripTitle}</h2>
        <Button href={t.stripCta.to}>{t.stripCta.label}</Button>
      </Panel>

      {/* 6. другие направления */}
      <section aria-labelledby="others-title" className="pt-section">
        <div className="px-margin"><SectionLabel>{t.othersTitle}</SectionLabel></div>
        <h2 id="others-title" className="sr-only">{t.othersTitle}</h2>
        <ul data-lenis-prevent className="mt-12 flex snap-x snap-mandatory gap-gutter overflow-x-auto px-margin pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {others.map((o) => (
            <li key={o.slug} className="w-[80vw] shrink-0 snap-start md:w-[calc((100vw-2*var(--margin)-2*var(--gutter))/3)]">
              <DirectionCard to={`/uslugi/${o.slug}`} n={String(directions.indexOf(o) + 1).padStart(2, '0')} title={o.title} count={o.picks ? o.picks.length : o.items.length} cover={o.cover ?? o.images[0]} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
