import { Head } from 'vite-react-ssg'
import { catalog } from '@/content/catalog'
import { catalogPage as t } from '@/content/pages'
import { site } from '@/content/site'
import { SectionLabel } from '@/components/SectionLabel'
import { DirectionCard } from '@/components/Cards'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/Panel'

/**
 * Каталог /uslugi (TZ §5.1): hero-полоса, сетка 10 направлений (2 колонки, каждая 3-я на всю ширину),
 * внизу блок помощи с текстом старого сайта (компактная форма появится вместе с блоком 10).
 */
export function Component() {
  return (
    <main className="pb-24 pt-32">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/uslugi`} />
      </Head>

      <header className="grid grid-cols-4 gap-gutter px-margin pb-24 md:grid-cols-12">
        <SectionLabel className="col-span-4 md:col-span-3">{t.label}</SectionLabel>
        <div className="col-span-4 mt-8 md:col-span-9 md:mt-0">
          <h1 className="text-display-xl">
            <span className="block text-white">{t.titleTop}</span>
            <span className="block text-mute md:pl-[1.2em]">{t.titleBottom}</span>
          </h1>
          <p className="text-label mt-6 text-mute-2">{t.footnote}</p>
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-gutter px-margin md:grid-cols-2">
        {catalog.map((d, i) => {
          const wide = i % 3 === 2
          return (
            <li key={d.slug} className={wide ? 'md:col-span-2' : undefined}>
              <DirectionCard to={`/uslugi/${d.slug}`} n={String(i + 1).padStart(2, '0')} title={d.title} count={d.count} cover={d.cover} wide={wide} />
            </li>
          )
        })}
      </ul>

      <Panel as="section" className="mt-section" ruler={false} innerClassName="grid gap-8 p-6 md:grid-cols-12 md:items-end md:p-12">
        <h2 className="text-h2 md:col-span-7">{t.helpTitle}</h2>
        <div className="md:col-span-5">
          <p className="text-body-l text-mute-2">{t.helpText}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button href={t.helpCta.to}>{t.helpCta.label}</Button>
            <Button variant="link" href={`tel:${site.contacts.phones[0].replace(/[^\d+]/g, '')}`}>{site.contacts.phones[0]}</Button>
          </div>
        </div>
      </Panel>
    </main>
  )
}
