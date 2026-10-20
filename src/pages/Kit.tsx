import type { ReactNode } from 'react'
import { Head } from 'vite-react-ssg'
import { kit } from '@/content/kit'
import { Panel } from '@/components/Panel'
import { SectionLabel } from '@/components/SectionLabel'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'

function Block({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-4 gap-gutter border-t border-line px-margin py-24 md:grid-cols-12">
      <div className="col-span-4 md:col-span-3">
        <SectionLabel index={index}>{title}</SectionLabel>
      </div>
      <div className="col-span-4 md:col-span-9">{children}</div>
    </section>
  )
}

// Служебная витрина глобальных элементов (TZ §12, шаг 2). Не индексируется.
export function Component() {
  return (
    <main className="pt-32">
      <Head>
        <title>{kit.title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <header className="px-margin pb-24">
        <h1 className="text-h1 max-w-[16ch]">{kit.title}</h1>
        <p className="text-body-l mt-8 max-w-[62ch] text-mute-2">{kit.intro}</p>
      </header>

      <Block index="01" title={kit.buttons}>
        <div className="flex flex-wrap items-center gap-6">
          <Button href="/#contact">{kit.primary}</Button>
          <Button href="/#contact" size="compact">{kit.compact}</Button>
          <Button variant="ghost">{kit.ghost}</Button>
          <Button variant="link" href="/uslugi" arrow>{kit.link}</Button>
          <Button disabled>{kit.disabled}</Button>
        </div>
      </Block>

      <Block index="02" title={kit.glass}>
        <div className="relative overflow-hidden rounded-lg">
          <Media id="videophoto/lazernyy-koridor-01" alt={kit.photoAlt} sizes="(min-width: 1024px) 70vw, 100vw" className="aspect-[16/9]" />
          <div className="absolute inset-x-6 bottom-6 flex flex-wrap items-center gap-4">
            <Button variant="glass">{kit.glassBtn}</Button>
            <Button variant="glass" size="compact">{kit.compact}</Button>
          </div>
        </div>
      </Block>

      <Block index="03" title={kit.labels}>
        <div className="flex flex-col gap-6">
          <SectionLabel index="04">{kit.labelDark}</SectionLabel>
          <div className="rounded-md bg-cream p-6">
            <SectionLabel index="06" tone="light">{kit.labelLight}</SectionLabel>
          </div>
        </div>
      </Block>

      <section className="border-t border-line py-24">
        <div className="px-margin pb-12"><SectionLabel index="04">{kit.panel}</SectionLabel></div>
        <Panel innerClassName="p-6 md:p-12">
          <p className="text-h3 max-w-[30ch]">{kit.panelText}</p>
        </Panel>
      </section>

      <Block index="05" title={kit.cursor}>
        <div className="grid gap-gutter md:grid-cols-3">
          <a href="/uslugi" data-cursor="open" className="rounded-md bg-ink-2 p-6 text-small text-white">{kit.cursorOpen}</a>
          <div data-cursor="media" className="relative overflow-hidden rounded-md">
            <Media id="interactive/videograffiti-01" alt="" sizes="33vw" className="aspect-[4/3]" />
            <p className="absolute bottom-4 left-4 text-small">{kit.cursorMedia}</p>
          </div>
          <div data-cursor="aim" className="grid place-items-center rounded-md bg-graphite p-6 text-small text-mute-2 shadow-[inset_0_0_0_1px_var(--de-line)]">{kit.cursorAim}</div>
        </div>
      </Block>
      <div className="h-[50vh]" />
    </main>
  )
}
