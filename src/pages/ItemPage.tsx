import { useParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { getDirection } from '@/content/services'
import { itemPage as t, servicePage } from '@/content/pages'
import { site } from '@/content/site'
import { getMedia } from '@/components/Media'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionLabel } from '@/components/SectionLabel'
import { LiteYouTube } from '@/components/LiteYouTube'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'
import { ServiceHero } from '@/components/services/ServiceHero'
import { BentoCard } from '@/components/services/BentoItems'
import { FilmGallery } from '@/components/services/FilmGallery'
import { pad2 } from '@/lib/tech'
import { Component as NotFound } from './NotFound'

/**
 * Карточка позиции /uslugi/<услуга>/<позиция> в системе страниц услуг: full-bleed hero со слайдшоу её фото
 * и HUD-строкой, описание, техтребования стеклянной «приборной панелью» с моно-лейблами,
 * галерея-плёнка, видео, похожие позиции карточками bento.
 */
export function Component() {
  const { dir = '', item = '' } = useParams()
  const d = getDirection(dir)
  const it = d?.items.find((i) => i.slug === item)
  if (!d || !it) return <NotFound />

  const k = d.items.indexOf(it)
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
    <main id="main" className="pb-24">
      <Head>
        <title>{`${it.title} — ${d.title} | ${site.name}`}</title>
        <meta name="description" content={it.lead || d.summary} />
        <link rel="canonical" href={`${site.url}/uslugi/${d.slug}/${it.slug}`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>

      <ServiceHero
        title={it.title}
        frames={it.images.slice(0, 5)}
        crumbs={[servicePage.crumbsRoot, { label: d.title, to: `/uslugi/${d.slug}` }, { label: it.title }]}
        hud={[`[${pad2(k + 1)} / ${pad2(d.items.length)}]`, servicePage.hudItemKind, group ? group.title : it.tag, site.city]}
        lead={it.lead}
        cta={
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {it.videos.length > 0 && <Button variant="glass" href="#video">{t.watch}</Button>}
            <Button href={t.order.to}>{t.order.label}</Button>
          </div>
        }
        below={it.badge && <span className="text-micro inline-flex rounded-pill bg-volt px-3 py-1.5 text-ink">{it.badge}</span>}
      />

      {/* описание + приборная панель техтребований */}
      <section className="grid grid-cols-4 gap-gutter px-margin pt-24 md:grid-cols-12 md:pt-32">
        <div className="col-span-4 md:col-span-6">
          <SectionLabel>{t.descriptionTitle}</SectionLabel>
          <h2 className="sr-only">{t.descriptionTitle}</h2>
          {text.length > 0 && <Paragraphs items={text} className="mt-8" />}
        </div>
        {(tech.length > 0 || it.extras.length > 0) && (
          <div className="col-span-4 mt-16 md:col-span-5 md:col-start-8 md:mt-0">
            {tech.length > 0 && (
              <div className="glass rounded-md p-2">
                <h2 className="text-label flex items-center gap-2 px-4 pb-2 pt-3 text-mute-2">
                  <Asterisk className="size-3 text-lime" /> {t.techTitle}
                </h2>
                <dl className="grid grid-cols-2 gap-2">
                  {tech.map((r, i) => (
                    <div key={i} className={`rounded-sm bg-void/50 p-4 shadow-[inset_0_0_0_1px_var(--de-line)] ${tech.length % 2 && i === tech.length - 1 ? 'col-span-2' : ''}`}>
                      <dt className="text-micro text-mute-2">{r.label || pad2(i + 1)}</dt>
                      <dd className="text-h3 mt-3 text-white">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
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

      {/* галерея-плёнка */}
      {it.images.length > 1 && (
        <section aria-labelledby="item-gallery-title" className="pt-24 md:pt-32">
          <div className="mb-10 flex items-end justify-between gap-6 px-margin md:mb-12">
            <SectionLabel>{servicePage.galleryTitle}</SectionLabel>
            <p className="text-micro hidden text-mute-2 lg:block">{servicePage.galleryHint}</p>
          </div>
          <h2 id="item-gallery-title" className="sr-only">{servicePage.galleryTitle}</h2>
          <FilmGallery frames={it.images.map((id) => ({ id, caption: it.title }))} alt={(n) => servicePage.photoAlt(it.title, n)} />
        </section>
      )}

      {it.videos.length > 0 && (
        <section id="video" aria-labelledby="item-video-title" className="scroll-mt-32 px-margin pt-24 md:pt-32">
          <SectionLabel>{t.videoTitle}</SectionLabel>
          <h2 id="item-video-title" className="sr-only">{t.videoTitle}</h2>
          <ul className="mt-12 grid gap-gutter md:grid-cols-2">
            {it.videos.map((v) => <li key={v}><LiteYouTube url={v} title={it.title} /></li>)}
          </ul>
        </section>
      )}

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="px-margin pt-24 md:pt-32">
          <SectionLabel>{t.similarTitle}</SectionLabel>
          <h2 id="similar-title" className="sr-only">{t.similarTitle}</h2>
          <ul className="mt-12 grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((x) => (
              <li key={x.slug} className="h-[min(60svh,440px)]">
                <BentoCard item={x} to={`/uslugi/${d.slug}/${x.slug}`} n={d.items.indexOf(x) + 1} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
