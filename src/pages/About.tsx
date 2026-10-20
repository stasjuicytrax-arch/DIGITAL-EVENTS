import { Head } from 'vite-react-ssg'
import { aboutPage as t } from '@/content/company'
import { site } from '@/content/site'
import { getMedia, Media } from '@/components/Media'
import { SectionLabel } from '@/components/SectionLabel'
import { Clients } from '@/sections/Clients'
import { CtaBanner } from '@/components/CtaBanner'
import { useParallax } from '@/lib/motion'

const TEAM = { main: 'about/about-01', side: 'about/about-04' }

/**
 * О нас /about (TZ §5.4): тексты старого сайта без дублей, фото команды,
 * «Уникальность», направления из брифа тегами, «Работаем с лучшими» — логотипы клиентов.
 */
export function Component() {
  const parallax = useParallax<HTMLDivElement>(10)
  const og = getMedia(TEAM.main)

  return (
    <main className="pt-32">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/about`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>

      <header className="px-margin pb-16 md:pb-24">
        <SectionLabel>{t.label}</SectionLabel>
        <h1 className="text-display-xl mt-8">
          <span className="block text-white">{t.title}</span>
          <span className="block text-mute">{t.titleMute}</span>
        </h1>
      </header>

      <div className="px-margin">
        <div className="overflow-hidden rounded-lg">
          <div ref={parallax} className="scale-[1.12]">
            <Media id={TEAM.main} alt={t.teamAlt} sizes="100vw" priority className="aspect-[4/3] md:aspect-[21/9]" />
          </div>
        </div>
      </div>

      <section aria-label={t.label} className="grid grid-cols-4 gap-gutter px-margin pt-section md:grid-cols-12 md:items-start">
        <Media id={TEAM.side} alt={t.teamAlt} sizes="(min-width: 768px) 33vw, 100vw" className="col-span-4 aspect-[3/4] rounded-lg md:col-span-4" />
        <div className="col-span-4 mt-12 space-y-6 md:col-span-7 md:col-start-6 md:mt-0">
          {t.intro.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-h3 text-white' : 'text-body-l text-mute-2'}>{p}</p>
          ))}
        </div>
      </section>

      <section aria-labelledby="unique-title" className="grid grid-cols-4 gap-gutter px-margin pt-section md:grid-cols-12">
        <SectionLabel className="col-span-4 md:col-span-3">{t.uniqueLabel}</SectionLabel>
        <div className="col-span-4 mt-8 md:col-span-9 md:mt-0">
          <h2 id="unique-title" className="text-h1">{t.uniqueTitle}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-gutter">
            {t.unique.map((p, i) => <p key={i} className="text-body-l text-mute-2">{p}</p>)}
          </div>
          <h3 className="text-label mt-16 text-mute-2">{t.alsoTitle}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {t.also.map((x) => (
              <li key={x} className="text-small rounded-pill px-4 py-2 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)]">{x}</li>
            ))}
          </ul>
        </div>
      </section>


      <div className="pt-section"><Clients text={t.clients} /></div>

      <CtaBanner className="py-section" />
    </main>
  )
}
