import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { ArrowUpRight } from 'lucide-react'
import { portfolioPage as t, type Case } from '@/content/company'
import { site } from '@/content/site'
import { getMedia, Media } from '@/components/Media'
import { SectionLabel } from '@/components/SectionLabel'
import { Gallery } from '@/components/Gallery'
import { CtaBanner } from '@/components/CtaBanner'
import { cn } from '@/lib/utils'

function CaseBlock({ c, n }: { c: Case; n: number }) {
  return (
    <article className="grid grid-cols-4 gap-gutter border-t border-line pt-10 md:grid-cols-12 md:pt-12">
      <header className="col-span-4 md:col-span-5">
        <p className="text-label tabular-nums text-mute-2">{String(n).padStart(2, '0')} · {c.date}</p>
        <h3 className="text-h3 mt-6 max-w-[22ch] text-white">{c.title}</h3>
        {c.place && <p className="text-small mt-4 text-mute-2">{c.place}</p>}
      </header>
      <div className="col-span-4 mt-8 md:col-span-7 md:col-start-6 md:mt-0">
        <p className="text-body-l text-mute-2">{c.text}</p>
        <h4 className="text-label mt-10 text-mute-2">{t.productsTitle}</h4>
        <ul className="mt-4 border-t border-line">
          {c.products.map((p) => (
            <li key={p.label + p.text} className="grid gap-2 border-b border-line py-5 md:grid-cols-[minmax(0,2fr)_minmax(0,5fr)] md:gap-6">
              {p.to ? (
                <Link to={p.to} data-cursor="open" className="group/p text-body-l inline-flex items-start gap-2 self-start text-white">
                  {p.label}
                  <ArrowUpRight strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-mute-2 transition-[rotate,color] duration-(--t-base) ease-out-expo group-hover/p:rotate-45 group-hover/p:text-lime" />
                </Link>
              ) : (
                <p className="text-body-l text-white">{p.label}</p>
              )}
              <p className="text-small text-mute-2">{p.text}</p>
            </li>
          ))}
        </ul>
        {c.note && <p className="text-micro mt-6 text-mute-2">{c.note}</p>}
      </div>
      {c.photos.length === 1 && (
        <Media id={c.photos[0]} alt={t.photoAlt(c.title, 1)} sizes="(min-width: 768px) 66vw, 100vw" className="col-span-4 mt-10 aspect-[16/9] rounded-lg md:col-span-8 md:col-start-5" />
      )}
      {c.photos.length > 1 && (
        <div className="col-span-4 mt-10 md:col-span-12">
          <Gallery ids={c.photos} alt={(i) => t.photoAlt(c.title, i)} />
        </div>
      )}
    </article>
  )
}

/**
 * Портфолио /portfolio (TZ §5.4): вкладки 2018 / 2019, кейсы с текстами старого сайта,
 * продукты ссылаются на свои карточки в каталоге. Обе вкладки в HTML (SEO), неактивная скрыта.
 * Лента Tilted Grid сверху ждёт промта tilted-grid-hero.
 */
export function Component() {
  const [active, setActive] = useState(t.years.length - 1)
  const og = getMedia(t.years[1].cases[0].photos[0])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + t.years.length) % t.years.length
    setActive(next)
    document.getElementById(`tab-${t.years[next].year}`)?.focus()
  }

  return (
    <main className="pb-24 pt-32">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/portfolio`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>

      <header className="grid grid-cols-4 gap-gutter px-margin pb-16 md:grid-cols-12 md:pb-24">
        <SectionLabel className="col-span-4 md:col-span-3">{t.label}</SectionLabel>
        <div className="col-span-4 mt-8 md:col-span-9 md:mt-0">
          <h1 className="text-display-xl">
            <span className="block text-white">{t.title}</span>
            <span className="block text-mute md:pl-[1.2em]">{t.titleMute}</span>
          </h1>
          <p className="text-body-l mt-8 max-w-[44ch] text-mute-2">{t.lead}</p>
        </div>
      </header>

      <div role="tablist" aria-label={t.tabsLabel} onKeyDown={onKey} className="flex gap-2 px-margin">
        {t.years.map((y, i) => (
          <button
            key={y.year}
            id={`tab-${y.year}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`panel-${y.year}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              'text-label h-11 rounded-pill px-6 tabular-nums transition-colors duration-(--t-fast) ease-soft',
              i === active ? 'bg-white text-ink' : 'text-mute-2 shadow-[inset_0_0_0_1px_var(--de-line-strong)] hover:text-white',
            )}
          >
            {y.year}
          </button>
        ))}
      </div>

      {t.years.map((y, i) => (
        <section key={y.year} id={`panel-${y.year}`} role="tabpanel" aria-labelledby={`tab-${y.year}`} hidden={i !== active} className="px-margin pt-16">
          <h2 className="sr-only">{`${t.label} ${y.year}`}</h2>
          <div className="flex flex-col gap-24 md:gap-32">
            {y.cases.map((c, k) => <CaseBlock key={c.title} c={c} n={k + 1} />)}
          </div>
          {y.more.length > 0 && (
            <div className="pt-section">
              <SectionLabel>{t.moreTitle}</SectionLabel>
              <div className="mt-12">
                <Gallery ids={[...y.more]} alt={(n) => t.photoAlt(`${t.label} ${y.year}`, n)} />
              </div>
            </div>
          )}
        </section>
      ))}

      <CtaBanner className="mt-section" />
    </main>
  )
}
