import { hero } from '@/content/home'
import { Panel } from '@/components/Panel'
import { SectionLabel } from '@/components/SectionLabel'
import { Button } from '@/components/ui/button'

// Главная: пока только рамка hero с текстом (TZ §12, шаг 2). 3D-скульптура и остальные блоки — следующие шаги.
export function Component() {
  return (
    <main className="pb-24 pt-24">
      <Panel innerClassName="flex min-h-[calc(100dvh-8rem)] flex-col justify-between gap-16 p-6 md:p-12">
        <SectionLabel>{hero.label}</SectionLabel>
        <div className="grid grid-cols-4 gap-gutter md:grid-cols-12">
          <h1 className="text-display-xxl col-span-4 md:col-span-12">
            <span className="block text-white">{hero.titleTop}</span>
            <span className="block text-mute">{hero.titleBottom}</span>
          </h1>
          <p className="text-body-l col-span-4 mt-8 max-w-[62ch] text-mute-2 md:col-span-5 md:col-start-8">{hero.lead}</p>
          <div className="col-span-4 mt-8 flex flex-wrap items-center gap-4 md:col-span-5 md:col-start-8">
            <Button href={hero.ctaPrimary.to}>{hero.ctaPrimary.label}</Button>
            <Button href={hero.ctaSecondary.to} variant="glass">{hero.ctaSecondary.label}</Button>
          </div>
        </div>
      </Panel>
    </main>
  )
}
