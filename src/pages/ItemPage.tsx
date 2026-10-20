import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { Clock, Maximize, Plug, Zap, type LucideIcon } from 'lucide-react'
import { getDirection } from '@/content/services'
import { itemPage as t, servicePage } from '@/content/pages'
import { site } from '@/content/site'
import { getMedia, Media } from '@/components/Media'
import { Paragraphs } from '@/components/Paragraphs'
import { SectionLabel } from '@/components/SectionLabel'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { LiteYouTube } from '@/components/LiteYouTube'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'
import { BentoCard } from '@/components/services/BentoItems'
import { ItemSlider } from '@/components/services/ItemSlider'
import { CtaBanner } from '@/components/CtaBanner'
import { Component as NotFound } from './NotFound'

/** Иконка строки техтребований по её подписи */
const techIcon = (label: string): LucideIcon =>
  /площад|размер/i.test(label) ? Maximize : /питани|электр/i.test(label) ? Zap : /монтаж|время/i.test(label) ? Clock : Plug

/**
 * Карточка позиции /uslugi/<услуга>/<позиция>.
 * Desktop: слева большой слайдер фото (≈60%), справа sticky-панель liquid glass — название, тег, «Заказать»,
 * полный текст, техтребования приборной таблицей с иконками, «Дополнительно» чипами. За панелью — размытая
 * увеличенная копия текущего кадра, чтобы стеклу было что преломлять. Ниже — видео, похожие позиции, CTA.
 * Mobile: слайдер сверху, панель под ним, «Заказать» закреплён внизу экрана.
 */
export function Component() {
  const { dir = '', item = '' } = useParams()
  const d = getDirection(dir)
  const it = d?.items.find((i) => i.slug === item)
  const [frame, setFrame] = useState(0)
  if (!d || !it) return <NotFound />

  const group = d.groups?.find((g) => g.slug === it.group)
  // техтребования группы (Voice/Move Games) дополняют позицию, если у неё своих нет
  const tech = it.techRequirements.length ? it.techRequirements : group?.techRequirements ?? []
  const similar = d.items.filter((x) => x.slug !== it.slug && (!it.group || x.group === it.group)).slice(0, 3)
  const og = it.images[0] && getMedia(it.images[0])
  const order = `${t.order.to}?interest=${encodeURIComponent(d.title)}#form`
  const bg = it.images[frame] ?? it.images[0]

  return (
    <main id="main" className="pb-24 lg:pb-24">
      <Head>
        <title>{`${it.title} — ${d.title} | ${site.name}`}</title>
        <meta name="description" content={it.lead || d.summary} />
        <link rel="canonical" href={`${site.url}/uslugi/${d.slug}/${it.slug}`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>

      <section className="relative isolate overflow-hidden pt-28 md:pt-32">
        {/* размытая копия текущего кадра — фон, который преломляет стекло */}
        {bg && (
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Media key={bg} id={bg} alt="" sizes="640px" className="item-backdrop size-full" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,var(--de-void))]" />
          </div>
        )}

        <div className="grid grid-cols-4 gap-gutter px-margin md:grid-cols-12 lg:items-start">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <Breadcrumbs items={[servicePage.crumbsRoot, { label: d.title, to: `/uslugi/${d.slug}` }, { label: it.title }]} />
            <div className="mt-6">
              {it.images.length > 0 && <ItemSlider ids={it.images} alt={(n) => servicePage.photoAlt(it.title, n)} onIndex={setFrame} />}
            </div>
          </div>

          {/* стеклянная панель */}
          <aside className="glass col-span-4 mt-8 rounded-lg p-6 md:col-span-12 md:p-10 lg:sticky lg:top-28 lg:col-span-5 lg:mt-12 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto" data-lenis-prevent>
            <p className="text-label inline-flex items-center gap-2 rounded-pill px-3 py-2 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)]">
              <Asterisk className="size-3 text-lime" /> {group ? `${d.title} · ${group.title}` : d.title}
            </p>
            {it.badge && <span className="text-micro ml-2 inline-flex rounded-pill bg-volt px-3 py-1.5 text-ink">{it.badge}</span>}
            <h1 className="text-h1 mt-6 text-white">{it.title}</h1>
            <div className="mt-8 hidden flex-col gap-3 lg:flex">
              <Button href={order} className="w-full justify-between">{t.order.label}</Button>
              {it.videos.length > 0 && <Button variant="ghost" href="#video" className="w-full justify-center">{t.watch}</Button>}
            </div>

            {it.text.length > 0 && <Paragraphs items={it.text} className="mt-10" />}

            {tech.length > 0 && (
              <>
                <h2 className="text-label mt-12 text-mute-2">{t.techTitle}</h2>
                <dl className="mt-4 border-t border-line">
                  {tech.map((r, i) => {
                    const Icon = techIcon(r.label)
                    return (
                      <div key={i} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-4">
                        <Icon strokeWidth={1.5} aria-hidden="true" className="size-4 text-lime" />
                        <dt className="text-label text-mute-2">{r.label || t.techTitle}</dt>
                        <dd className="text-body-l text-right font-heading font-medium text-white">{r.value}</dd>
                      </div>
                    )
                  })}
                </dl>
              </>
            )}

            {it.extras.length > 0 && (
              <>
                <h2 className="text-label mt-10 text-mute-2">{t.extrasTitle}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {it.extras.map((x) => (
                    <li key={x} className="text-small rounded-pill px-4 py-2 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)]">{x}</li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>

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

      <CtaBanner service={d.title} className="mt-24 md:mt-32" />

      {/* mobile: «Заказать» всегда под пальцем */}
      <div className="fixed inset-x-0 bottom-0 z-30 p-3 lg:hidden">
        <div className="glass rounded-pill p-1.5">
          <Button href={order} className="w-full justify-between">{t.order.label}</Button>
        </div>
      </div>
    </main>
  )
}
