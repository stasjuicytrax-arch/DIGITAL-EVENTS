import { useParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { getDirection } from '@/content/services'
import { itemPage as t, servicePage } from '@/content/pages'
import { site } from '@/content/site'
import { getMedia } from '@/components/Media'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionLabel } from '@/components/SectionLabel'
import { ItemCard } from '@/components/Cards'
import { PhotoSlider } from '@/components/PhotoSlider'
import { LiteYouTube } from '@/components/LiteYouTube'
import { Button } from '@/components/ui/button'
import { Component as NotFound } from './NotFound'

/**
 * Карточка позиции /uslugi/<услуга>/<позиция> (TZ §5.3): hero с «Заказать» и «Смотреть видео»,
 * слайдер фото с счётчиком, описание, техтребования и «Дополнительно» таблицей «прибора», видео, похожие позиции.
 */
export function Component() {
  const { dir = '', item = '' } = useParams()
  const d = getDirection(dir)
  const it = d?.items.find((i) => i.slug === item)
  if (!d || !it) return <NotFound />

  const group = d.groups?.find((g) => g.slug === it.group)
  // техтребования группы (Voice/Move Games) дополняют позицию, если у неё своих нет
  const tech = it.techRequirements.length ? it.techRequirements : group?.techRequirements ?? []
  const similar = d.items.filter((x) => x.slug !== it.slug && (!it.group || x.group === it.group)).slice(0, 3)
  const og = it.images[0] && getMedia(it.images[0])
  // лид уже стоит в hero — убираем его из начала описания, чтобы не повторять
  const text = it.text
    .map((p, i) => (i === 0 && typeof p === 'string' && it.lead && p.startsWith(it.lead) ? p.slice(it.lead.length).trim() : p))
    .filter((p) => p !== '')

  return (
    <main className="pb-24 pt-32">
      <Head>
        <title>{`${it.title} — ${d.title} | ${site.name}`}</title>
        <meta name="description" content={it.lead || d.summary} />
        <link rel="canonical" href={`${site.url}/uslugi/${d.slug}/${it.slug}`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>

      {/* 1. hero позиции */}
      <header className="grid grid-cols-4 gap-gutter px-margin pb-16 md:grid-cols-12 md:items-end">
        <div className="col-span-4 md:col-span-8">
          <Breadcrumbs items={[servicePage.crumbsRoot, { label: d.title, to: `/uslugi/${d.slug}` }, { label: it.title }]} />
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="text-micro rounded-pill px-3 py-1.5 text-mute-2 shadow-[inset_0_0_0_1px_var(--de-line-strong)]">{group ? group.title : d.title}</span>
            {it.badge && <span className="text-micro rounded-pill bg-volt px-3 py-1.5 text-ink">{it.badge}</span>}
          </div>
          <h1 className="text-h1 mt-6">{it.title}</h1>
        </div>
        <div className="col-span-4 mt-8 md:col-span-4 md:mt-0">
          {it.lead && <p className="text-body-l text-mute-2">{it.lead}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={t.order.to}>{t.order.label}</Button>
            {it.videos.length > 0 && <Button variant="ghost" href="#video">{t.watch}</Button>}
          </div>
        </div>
      </header>

      {/* 2. слайдер фото */}
      {it.images.length > 0 && <PhotoSlider ids={it.images} alt={(n) => servicePage.photoAlt(it.title, n)} />}

      {/* 3–4. описание + техтребования */}
      <section className="grid grid-cols-4 gap-gutter px-margin pt-section md:grid-cols-12">
        <div className="col-span-4 md:col-span-6">
          <SectionLabel>{t.descriptionTitle}</SectionLabel>
          <h2 className="sr-only">{t.descriptionTitle}</h2>
          {text.length > 0 && <Paragraphs items={text} className="mt-8" />}
        </div>
        {(tech.length > 0 || it.extras.length > 0) && (
          <div className="col-span-4 mt-16 md:col-span-5 md:col-start-8 md:mt-0">
            {tech.length > 0 && (
              <>
                <h2 className="text-label text-mute-2">{t.techTitle}</h2>
                <dl className="mt-6 border-t border-line">
                  {tech.map((r, i) => (
                    <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-line py-4">
                      <dt className="text-micro pt-0.5 text-mute-2">{r.label || '—'}</dt>
                      <dd className="text-small text-white">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
            {it.extras.length > 0 && (
              <>
                <h2 className="text-label mt-12 text-mute-2">{t.extrasTitle}</h2>
                <ul className="mt-6 border-t border-line">
                  {it.extras.map((x) => (
                    <li key={x} className="flex items-center gap-3 border-b border-line py-4 text-small text-white">
                      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-lime" />
                      {x}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      {/* 5. видео */}
      {it.videos.length > 0 && (
        <section id="video" aria-labelledby="item-video-title" className="scroll-mt-32 px-margin pt-section">
          <SectionLabel>{t.videoTitle}</SectionLabel>
          <h2 id="item-video-title" className="sr-only">{t.videoTitle}</h2>
          <ul className="mt-12 grid gap-gutter md:grid-cols-2">
            {it.videos.map((v) => <li key={v}><LiteYouTube url={v} title={it.title} /></li>)}
          </ul>
        </section>
      )}

      {/* 6. похожие позиции */}
      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="px-margin pt-section">
          <SectionLabel>{t.similarTitle}</SectionLabel>
          <h2 id="similar-title" className="sr-only">{t.similarTitle}</h2>
          <ul className="mt-12 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((x) => (
              <li key={x.slug}>
                <ItemCard to={`/uslugi/${d.slug}/${x.slug}`} title={x.title} lead={x.lead} tag={x.tag} cover={x.images[0]} badge={x.badge} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
