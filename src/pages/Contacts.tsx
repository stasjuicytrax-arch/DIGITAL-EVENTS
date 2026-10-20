import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Head } from 'vite-react-ssg'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { contactsPage as t } from '@/content/company'
import { site } from '@/content/site'
import { SectionLabel } from '@/components/SectionLabel'
import { Panel } from '@/components/Panel'
import { ContactForm } from '@/components/ContactForm'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'
import { useInView } from '@/lib/hooks'
import { useTilt } from '@/lib/motion'
import { cn } from '@/lib/utils'

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`
const { lat, lon } = t.geo
// статичная Яндекс-карта вместо тяжёлого виджета (TZ §5.4); тёмный вид — CSS-фильтром, метка — свой лаймовый ✱
// API отдаёт не шире 650px — полосу 1200×320 склеиваем из двух соседних тайлов 600×320 (z16: 1px ≈ 360 / 2^24 градуса долготы)
const HALF = (300 * 360) / 2 ** 24
const tile = (dl: number) => `https://static-maps.yandex.ru/1.x/?ll=${lon + dl},${lat}&z=16&size=600,320&l=map&lang=ru_RU`
const MAP_TILES = [tile(-HALF), tile(HALF)]
const MAP_OPEN = `https://yandex.ru/maps/?pt=${lon},${lat}&z=17&l=map`
const MAP_ROUTE = `https://yandex.ru/maps/?rtext=~${lat},${lon}`
const ADDRESS = site.contacts.address.replace(/^Россия,\s*/, '')
const d = (n: number) => ({ ['--d' as string]: n })


/** Стеклянная карточка контакта: tilt ≤ 4°, на hover — лаймовые уголки-скобки */
function Card({ title, children }: { title: string; children: ReactNode }) {
  const tilt = useTilt<HTMLDivElement>(4)
  return (
    <div ref={tilt} className="hud-card glass relative flex flex-col rounded-md p-6 sm:min-h-48 transition-transform duration-(--t-base) ease-soft">
      <span aria-hidden="true" className="hud-corner hud-corner--tl" />
      <span aria-hidden="true" className="hud-corner hud-corner--tr" />
      <span aria-hidden="true" className="hud-corner hud-corner--bl" />
      <span aria-hidden="true" className="hud-corner hud-corner--br" />
      <h2 className="text-label text-mute-2">{title}</h2>
      <div className="mt-auto pt-5 sm:pt-8">{children}</div>
    </div>
  )
}

/** Карта-полоса: картинка грузится, только когда блок подъезжает к экрану; до этого — тёмное превью с сеткой */
function MapStrip() {
  const [ref, inView] = useInView<HTMLDivElement>('300px')
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => { if (inView) setLoad(true) }, [inView])
  return (
    <section aria-label={t.mapLabel} className="mx-auto max-w-[880px] px-margin">
      {/* mobile: карта целиком сверху, плашка с адресом под ней; desktop: плашка поверх карты слева */}
      <div ref={ref} className="map-strip relative overflow-hidden rounded-lg bg-ink-2 shadow-[inset_0_0_0_1px_var(--de-line)]">
        <div className="relative h-[260px] overflow-hidden md:h-[320px]">
          {/* desktop: карта с меткой сдвинута вправо, чтобы точку офиса не закрывала плашка с адресом */}
          <div className="absolute inset-0 md:translate-x-[180px]">
          {load && (
            // карта 1200×320 в натуральную величину по центру полосы; на мобиле (260px) уменьшена пропорционально
            <div
              role="img"
              aria-label={t.mapAlt}
              className={cn('absolute left-1/2 top-1/2 flex h-[320px] w-[1200px] -translate-x-1/2 -translate-y-1/2 scale-[0.8125] opacity-0 transition-opacity duration-(--t-slow) ease-soft [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.85)] md:scale-100', ready && 'opacity-100')}
            >
              {MAP_TILES.map((src, i) => (
                <img key={src} src={src} alt="" width={600} height={320} decoding="async" onLoad={i === 1 ? () => setReady(true) : undefined} className="h-full w-1/2" />
              ))}
            </div>
          )}
          {/* метка в точке офиса: центр карты, пульсирующее кольцо */}
          <span aria-hidden="true" className="map-pin absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-void/80 shadow-[inset_0_0_0_1px_var(--de-line-strong)]">
            <Asterisk className="size-5 text-lime" />
          </span>
          </div>
        </div>
        <div className="glass p-5 md:absolute md:left-6 md:top-1/2 md:w-[340px] md:-translate-y-1/2 md:rounded-md">
          <p className="text-label hidden text-mute-2 md:block">{t.addressTitle}</p>
          <p className="text-body-l text-white md:mt-3">{ADDRESS}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 md:mt-4">
            <Button variant="link" href={MAP_OPEN} target="_blank" rel="noreferrer">{t.mapOpen}</Button>
            <Button variant="link" href={MAP_ROUTE} target="_blank" rel="noreferrer">{t.mapRoute}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Контакты /contacts: всё по одной оси, контент ≤ 1200px.
 * Hero по центру → 4 стеклянные карточки контактов → форма в панели с линейкой (880px) → карта-полоса → реквизиты аккордеоном.
 */
export function Component() {
  const c = site.contacts
  const [toast, setToast] = useState(false)
  const timer = useRef(0)
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(c.email) } catch { window.location.href = `mailto:${c.email}`; return }
    setToast(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(false), 2000)
  }

  return (
    <main id="main" className="pb-24">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/contacts`} />
      </Head>

      {/* 1. hero по центру, ~55vh */}
      <header className="flex min-h-[55svh] flex-col items-center justify-end px-margin pb-16 pt-32 text-center md:pb-24">
        <SectionLabel className="fade-up">{t.label}</SectionLabel>
        <h1 className="text-display-xl mt-8">
          <span className="reveal-line"><span className="text-white">{t.title}</span></span>
          <span className="reveal-line" style={d(1)}><span className="text-mute">{t.titleMute}</span></span>
        </h1>
        <p className="text-body-l fade-up mt-8 max-w-[40ch] text-mute-2" style={d(2)}>{t.lead}</p>
      </header>

      {/* 2. четыре карточки контактов */}
      <section aria-label={t.label} className="px-margin">
        <div className="mx-auto grid max-w-[1200px] gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          <Card title={t.phonesTitle}>
            <ul className="space-y-2">
              {c.phones.map((p) => (
                <li key={p}>
                  <a href={tel(p)} aria-label={t.call(p)} className="text-body-l whitespace-nowrap font-heading font-medium tabular-nums tracking-[-0.01em] text-white transition-colors duration-(--t-fast) hover:text-lime">{p}</a>
                </li>
              ))}
            </ul>
          </Card>
          <Card title={t.emailTitle}>
            <button type="button" onClick={copyEmail} title={t.copyHint} className="text-body-l whitespace-nowrap text-left font-heading font-medium tracking-[-0.01em] text-white transition-colors duration-(--t-fast) hover:text-lime">
              {c.email}
            </button>
          </Card>
          <Card title={t.socialsTitle}>
            <ul className="flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-label grid size-12 place-items-center rounded-full text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] transition-colors duration-(--t-fast) hover:bg-white hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
          <Card title={t.addressTitle}>
            <p className="text-body-l font-heading font-medium tracking-[-0.01em] text-white">{ADDRESS}</p>
            <a href={MAP_ROUTE} target="_blank" rel="noreferrer" className="link-underline text-small mt-4 inline-flex items-center gap-1 text-mute-2 hover:text-white">
              {t.route} <ArrowUpRight strokeWidth={1.5} className="size-4" />
            </a>
          </Card>
        </div>
      </section>

      {/* 3. форма — главный элемент, строго по центру */}
      <div className="mx-auto mt-16 max-w-[880px] md:mt-28">
        <Panel as="section" innerClassName="p-6 sm:p-12 md:p-16">
          <ContactForm />
        </Panel>
      </div>

      {/* 4. карта */}
      <div className="mt-16 md:mt-28">
        <MapStrip />
      </div>

      {/* 5. реквизиты — мелко внизу */}
      <div className="mx-auto mt-12 max-w-[1200px] px-margin">
        <details className="group/req">
          <summary className="text-label inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-mute-2 transition-colors duration-(--t-fast) hover:text-white [&::-webkit-details-marker]:hidden">
            {t.reqTitle}
            <ChevronDown strokeWidth={1.5} className="size-4 transition-transform duration-(--t-base) ease-out-expo group-open/req:rotate-180" />
          </summary>
          <ul className="text-micro mt-4 space-y-2 text-mute-2">
            {site.requisites.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </details>
      </div>

      {/* тост «Скопировано ✱» */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'glass text-label pointer-events-none fixed bottom-8 left-1/2 z-50 inline-flex -translate-x-1/2 items-center gap-2 rounded-pill px-5 py-3 text-white transition-[opacity,translate] duration-(--t-base) ease-out-expo',
          toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        {toast && <>{t.copied} <Asterisk className="size-3 text-lime" /></>}
      </div>
    </main>
  )
}
