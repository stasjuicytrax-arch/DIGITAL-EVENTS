import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { ArrowUpRight } from 'lucide-react'
import { aboutPage as t } from '@/content/company'
import { clients } from '@/content/clients'
import { site } from '@/content/site'
import { getMedia, Media } from '@/components/Media'
import { SectionLabel } from '@/components/SectionLabel'
import { Asterisk } from '@/components/icons/Asterisk'
import { CtaBanner } from '@/components/CtaBanner'
import { CodeBackground } from '@/components/ui/code-background'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion, useInView } from '@/lib/hooks'
import { useVelocityMarquee } from '@/lib/marquee'
import { useParallax, useTilt } from '@/lib/motion'
import { cn } from '@/lib/utils'

const BASE = import.meta.env.BASE_URL
const TEAM = 'about/about-01'
// наклонная сетка «Команда в деле»: фото команды + кадры событий
const GRID = [
  'about/about-05', 'portfolio-2019/portfolio-2019-02', 'about/about-03', 'home/home-02',
  'portfolio-2018/portfolio-2018-04', 'about/about-04', 'home/home-06', 'portfolio-2019/portfolio-2019-10',
  'home/home-15', 'about/about-02', 'portfolio-2019/portfolio-2019-07', 'home/home-19',
]
const desktopMotion = () => typeof window !== 'undefined' && window.innerWidth >= 1024 && !prefersReducedMotion()

/** 1. Hero: заголовок и фото команды в маске ~60%, по скроллу маска раскрывается на всю ширину (без pin) */
function Hero() {
  const head = useRef<HTMLDivElement>(null)
  const mask = useRef<HTMLDivElement>(null)
  const parallax = useParallax<HTMLDivElement>(10)
  useEffect(() => {
    if (!desktopMotion() || !mask.current || !head.current) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: mask.current, start: 'top 85%', end: 'top 15%', scrub: 0.6 } })
    tl.fromTo(mask.current, { clipPath: 'inset(0% 20% 0% 20% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
      .to(head.current, { yPercent: -35, opacity: 0.25, ease: 'none' }, 0)
    return () => { tl.scrollTrigger?.kill(); tl.kill() }
  }, [])

  return (
    <section aria-labelledby="about-title" className="pt-32 md:pt-40">
      <div ref={head} className="px-margin">
        <SectionLabel className="fade-up">{t.label}</SectionLabel>
        <h1 id="about-title" className="text-display-xl mt-8">
          <span className="reveal-line"><span className="text-white">{t.title}</span></span>
          <span className="reveal-line" style={{ ['--d' as string]: 1 }}><span className="text-mute">{t.titleMute}</span></span>
        </h1>
      </div>
      <div className="mt-12 px-margin lg:mt-20 lg:px-0">
        <div ref={mask} className="hud-card relative overflow-hidden rounded-lg lg:rounded-none lg:[clip-path:inset(0%_20%_0%_20%_round_32px)]">
          <div ref={parallax} className="scale-[1.1] lg:scale-100">
            <Media id={TEAM} alt={t.teamAlt} sizes="100vw" priority className="aspect-[4/3] lg:aspect-[16/8]" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--de-void)_70%,transparent),transparent_40%)]" />
          <span aria-hidden="true" className="hud-corner hud-corner--tl" style={{ opacity: 1, translate: "0 0" }} />
          <span aria-hidden="true" className="hud-corner hud-corner--tr" style={{ opacity: 1, translate: "0 0" }} />
          <span aria-hidden="true" className="hud-corner hud-corner--bl" style={{ opacity: 1, translate: "0 0" }} />
          <span aria-hidden="true" className="hud-corner hud-corner--br" style={{ opacity: 1, translate: "0 0" }} />
          <p className="text-label absolute bottom-5 left-5 inline-flex flex-wrap items-center gap-x-2 text-white md:bottom-8 md:left-[22%] lg:left-[calc(20%+2rem)]">
            <Asterisk className="size-3 text-lime" />
            {t.hud.map((h, i) => <span key={h} className={i ? 'before:mr-2 before:content-["·"]' : ''}>{h}</span>)}
          </p>
        </div>
      </div>
    </section>
  )
}

/** 2. Манифест на фоне code-background: текст сразу белый (перекраска по скроллу заказчику не нравится) */
function Manifest() {
  const text = useRef<HTMLDivElement>(null)
  return (
    <section aria-labelledby="manifest-title" className="relative isolate overflow-hidden py-section">
      <CodeBackground keepOut={text} className="[mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--de-void),transparent_14%,transparent_86%,var(--de-void))]" />
      <div className="relative grid grid-cols-4 gap-gutter px-margin md:grid-cols-12">
        <SectionLabel className="col-span-4 md:col-span-12">{t.manifestLabel}</SectionLabel>
        <div ref={text} className="col-span-4 mt-10 md:col-span-12">
          <h2 id="manifest-title" className="text-display-xl text-white md:indent-[1.6em]">{t.manifest}</h2>
          <p className="text-label mt-10 text-mute-2 md:ml-auto md:w-fit">{t.manifestNote}</p>
        </div>
      </div>
    </section>
  )
}

/** 3. Что мы делаем: три высокие карточки, на hover карточка расширяется; mobile — стопка */
function Directions() {
  return (
    <section aria-labelledby="do-title" className="px-margin pt-24 md:pt-32">
      <SectionLabel>{t.doLabel}</SectionLabel>
      <h2 id="do-title" className="sr-only">{t.doLabel}</h2>
      <ul className="mt-12 flex flex-col gap-gutter lg:h-[600px] lg:flex-row">
        {t.directions.map((d) => (
          <li key={d.n} className="group/dir relative h-[440px] overflow-hidden rounded-lg bg-ink-2 transition-[flex-grow] duration-[700ms] ease-out-expo lg:h-auto lg:flex-1 lg:hover:flex-[2.2]">
            <Media id={d.photo} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0" imgClassName="transition-transform duration-(--t-slow) ease-out-expo group-hover/dir:scale-[1.04]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,var(--de-void)_5%,color-mix(in_srgb,var(--de-void)_55%,transparent)_45%,color-mix(in_srgb,var(--de-void)_25%,transparent))]" />
            <span aria-hidden="true" className="pointer-events-none absolute -right-4 -top-10 font-mono text-[clamp(160px,16vw,280px)] font-medium leading-none text-white/10">{d.n}</span>
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-label text-lime">{d.n}</p>
              <h3 className="text-h2 mt-3 text-white">{d.title}</h3>
              <p className="text-body-l mt-4 max-w-[40ch] text-white/80">{d.text}</p>
              <Link to={d.to} className="link-underline text-label mt-6 inline-flex items-center gap-2 text-white">
                {t.more} <ArrowUpRight strokeWidth={1.5} className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 4. Под ключ: этапы стеклянными карточками, лаймовая линия заполняется по скроллу (без pin) */
function Stages() {
  const line = useRef<HTMLDivElement>(null)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prefersReducedMotion() || !line.current || !box.current) return
    const vertical = window.innerWidth < 1024
    const tw = gsap.fromTo(line.current, vertical ? { scaleY: 0 } : { scaleX: 0 }, {
      ...(vertical ? { scaleY: 1 } : { scaleX: 1 }), ease: 'none',
      scrollTrigger: { trigger: box.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
    })
    return () => { tw.scrollTrigger?.kill(); tw.kill() }
  }, [])
  return (
    <section aria-labelledby="stages-title" className="px-margin pt-24 md:pt-32">
      <SectionLabel>{t.stagesLabel}</SectionLabel>
      <h2 id="stages-title" className="text-h1 mt-8 max-w-[14ch]">{t.stagesTitle}</h2>
      <div ref={box} className="relative mt-12 md:mt-16">
        {/* линия прогресса: горизонтальная на desktop, вертикальная на mobile */}
        <div aria-hidden="true" className="absolute left-5 top-0 h-full w-px bg-line-strong lg:left-0 lg:top-1/2 lg:h-px lg:w-full" />
        <div ref={line} aria-hidden="true" className="absolute left-5 top-0 h-full w-px origin-top bg-lime lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:origin-left" />
        <ol className="relative grid gap-4 pl-12 lg:grid-cols-5 lg:gap-gutter lg:pl-0">
          {t.stages.map((s, i) => (
            <li key={s} className="glass flex min-h-32 flex-col justify-between rounded-md p-5 lg:min-h-44">
              <span className="text-label tabular-nums text-lime">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-h3 mt-6 text-white">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** 5. Технологии: две строки чипов навстречу друг другу, скорость от скролла */
function Tech() {
  const [section, row] = useVelocityMarquee<HTMLElement>({ speed: 40 })
  const half = Math.ceil(t.tech.length / 2)
  const rows = [t.tech.slice(0, half), t.tech.slice(half)]
  return (
    <section ref={section} aria-labelledby="tech-title" className="overflow-hidden pt-24 md:pt-32">
      <div className="px-margin"><SectionLabel>{t.techLabel}</SectionLabel></div>
      <h2 id="tech-title" className="sr-only">{t.techLabel}: {t.tech.join(', ')}</h2>
      <div aria-hidden="true" className="mt-12 flex flex-col gap-4">
        {rows.map((list, i) => (
          <div key={i} className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
            <ul ref={row(i)} className="flex w-max gap-3 pr-3">
              {[...list, ...list, ...list, ...list].map((c, j) => (
                <li key={c + j} className="text-h3 shrink-0 rounded-pill px-6 py-3 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)]">{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/** 6. Команда в деле: наклонная сетка фото, колонки едут навстречу друг другу по скроллу */
function TiltedGrid() {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prefersReducedMotion() || !box.current) return
    const cols = gsap.utils.toArray<HTMLElement>(box.current.querySelectorAll('[data-col]'))
    const tweens = cols.map((c, i) => gsap.fromTo(c, { yPercent: i % 2 ? -8 : 8 }, {
      yPercent: i % 2 ? 8 : -8, ease: 'none',
      scrollTrigger: { trigger: box.current, start: 'top bottom', end: 'bottom top', scrub: true },
    }))
    return () => tweens.forEach((tw) => { tw.scrollTrigger?.kill(); tw.kill() })
  }, [])
  const cols = [0, 1, 2, 3].map((c) => GRID.filter((_, i) => i % 4 === c))
  return (
    <section aria-labelledby="team-title" className="relative mt-24 h-[80svh] min-h-[520px] overflow-hidden md:mt-32">
      <div ref={box} aria-hidden="true" className="absolute left-1/2 top-1/2 grid w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] grid-cols-4 gap-3 md:w-[120%] md:gap-gutter">
        {cols.map((list, i) => (
          <div key={i} data-col className="flex flex-col gap-3 md:gap-gutter">
            {list.map((id) => <Media key={id} id={id} alt="" sizes="30vw" className="aspect-[4/5] rounded-md" />)}
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--de-void)_70%,transparent),color-mix(in_srgb,var(--de-void)_30%,transparent)_60%,var(--de-void))]" />
      <div className="absolute inset-0 grid place-items-center px-margin text-center">
        <div>
          <SectionLabel>{t.teamLabel}</SectionLabel>
          <h2 id="team-title" className="text-display-xl mt-6 text-white">{t.teamTitle}</h2>
        </div>
      </div>
    </section>
  )
}

function ClientCell({ c, i, show }: { c: (typeof clients)[number]; i: number; show: boolean }) {
  const tilt = useTilt<HTMLLIElement>(5)
  return (
    <li
      ref={tilt}
      style={{ transitionDelay: `${i * 40}ms` }}
      className={cn('hud-card glass relative grid aspect-[3/2] place-items-center rounded-md p-5 transition-[opacity,translate] duration-(--t-slow) ease-out-expo', show ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')}
    >
      <span aria-hidden="true" className="hud-corner hud-corner--tl" />
      <span aria-hidden="true" className="hud-corner hud-corner--tr" />
      <span aria-hidden="true" className="hud-corner hud-corner--bl" />
      <span aria-hidden="true" className="hud-corner hud-corner--br" />
      <img src={`${BASE}logos/${c.slug}.webp`} alt={c.name} width={c.w} height={c.h} loading="lazy" decoding="async" className="client-logo-dark max-h-12 w-auto max-w-[80%] object-contain" />
    </li>
  )
}

/** 7. Работаем с лучшими: сетка логотипов в стеклянных ячейках, появление каскадом */
function Clients() {
  const [ref, inView] = useInView<HTMLUListElement>('-10% 0px')
  const shown = useRef(false)
  if (inView) shown.current = true
  return (
    <section aria-labelledby="clients-title" className="px-margin pt-24 md:pt-32">
      <SectionLabel>{t.clients.label}</SectionLabel>
      <h2 id="clients-title" className="text-h1 mt-8">
        <span className="text-white">{t.clients.titleTop}</span> <span className="text-mute">{t.clients.titleBottom}</span>
      </h2>
      <ul ref={ref} className="mt-12 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-gutter">
        {clients.map((c, i) => <ClientCell key={c.slug} c={c} i={i} show={shown.current || prefersReducedMotion()} />)}
      </ul>
    </section>
  )
}

/**
 * О нас /about: hero с раскрытием фото команды, манифест на code-background, три направления
 * (расширяются на hover), этапы «под ключ» с линией прогресса, бегущие строки технологий,
 * наклонная сетка «Любим своё дело», сетка клиентов, CTA-баннер.
 */
export function Component() {
  const og = getMedia(TEAM)
  return (
    <main id="main" className="pb-24">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/about`} />
        {og && <meta property="og:image" content={`${site.url}${og.src}-1280.webp`} />}
      </Head>
      <Hero />
      <Manifest />
      <Directions />
      <Stages />
      <Tech />
      <TiltedGrid />
      <Clients />
      <CtaBanner className="mt-24 md:mt-32" />
    </main>
  )
}
