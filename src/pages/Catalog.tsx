import { useRef } from 'react'
import { Head } from 'vite-react-ssg'
import { catalog } from '@/content/catalog'
import { directions } from '@/content/services'
import { catalogPage as t } from '@/content/pages'
import { site } from '@/content/site'
import { SectionLabel } from '@/components/SectionLabel'
import { Panel } from '@/components/Panel'
import { ContactForm } from '@/components/ContactForm'
import { CodeBackground } from '@/components/ui/code-background'
import { DirectionCard } from '@/components/services/DirectionCard'

/** 3 лучших кадра направления: обложка, фото направления, обложки позиций */
function frames(slug: string) {
  const d = directions.find((x) => x.slug === slug)
  return [...new Set([d?.cover, ...(d?.images ?? []), ...(d?.items.map((i) => i.images[0]) ?? [])].filter(Boolean) as string[])].slice(0, 3)
}

/**
 * Каталог /uslugi: hero «ТАК ЧТО МЫ УМЕЕМ?» на фоне code-background, сетка 10 карточек направлений
 * (3 / 2 / 1 колонки) с фото и стеклянной панелью, под сеткой — компактная форма помощи по центру.
 * Список-индекс направлений живёт только на главной.
 */
export function Component() {
  const title = useRef<HTMLDivElement>(null)

  return (
    <main id="main" className="pb-24">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/uslugi`} />
      </Head>

      <section aria-labelledby="catalog-title" className="relative isolate flex min-h-[56svh] flex-col justify-end overflow-hidden bg-[linear-gradient(to_bottom,var(--de-void),var(--de-graphite)_40%,var(--de-void))] pb-12 pt-36 md:pb-16">
        <CodeBackground keepOut={title} className="[mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />
        <div className="relative grid grid-cols-4 gap-gutter px-margin md:grid-cols-12">
          <SectionLabel className="col-span-4 md:col-span-3">{t.label}</SectionLabel>
          <div ref={title} className="col-span-4 mt-8 md:col-span-9 md:mt-0">
            <h1 id="catalog-title" className="text-display-xl">
              <span className="reveal-line"><span className="text-white">{t.titleTop}</span></span>
              <span className="reveal-line" style={{ ['--d' as string]: 1 }}><span className="text-mute md:pl-[1.2em]">{t.titleBottom}</span></span>
            </h1>
            <p className="text-label fade-up mt-6 text-mute-2" style={{ ['--d' as string]: 2 }}>{t.footnote}</p>
          </div>
        </div>
      </section>

      <nav aria-label={t.label} className="px-margin">
        <ul className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((d, i) => (
            <li key={d.slug}>
              <DirectionCard to={`/uslugi/${d.slug}`} n={i + 1} title={d.title} summary={d.summary} count={d.count} frames={frames(d.slug)} more={t.more} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto mt-24 max-w-[880px] md:mt-32">
        <Panel as="section" innerClassName="p-6 sm:p-12">
          <ContactForm title={t.helpTitle} text={t.helpText} compact />
        </Panel>
      </div>
    </main>
  )
}
