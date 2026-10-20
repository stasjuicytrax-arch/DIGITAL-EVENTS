import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ctaBanner as t } from '@/content/pages'
import { site } from '@/content/site'
import { Panel } from '@/components/Panel'
import { Asterisk } from '@/components/icons/Asterisk'
import { useInView, useReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`

function usePermTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () => setTime(new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Yekaterinburg' }).format(new Date()))
    fmt()
    const id = window.setInterval(fmt, 15_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

/** Круг-кнопка с вращающимся кольцом моно-текста: 20 с на оборот, на hover быстрее; reduced-motion — стоит */
function RingButton({ to, reduced, active }: { to: string; reduced: boolean; active: boolean }) {
  const ring = useRef<SVGGElement>(null)
  const hover = useRef(false)
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    if (reduced || !active) return
    let raf = 0, angle = 0, speed = 18, last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      speed += ((hover.current ? 90 : 18) - speed) * Math.min(1, dt * 4)
      angle = (angle + speed * dt) % 360
      ring.current?.setAttribute('transform', `rotate(${angle} 100 100)`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, active])

  return (
    <Link
      to={to}
      aria-label={t.button}
      data-cursor="open"
      onPointerEnter={() => { hover.current = true }}
      onPointerLeave={() => { hover.current = false }}
      className="group/ring relative grid size-[200px] shrink-0 place-items-center md:size-[240px]"
    >
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full text-mute-2 transition-colors duration-(--t-base) group-hover/ring:text-white">
        <defs><path id={`ring-${id}`} d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" /></defs>
        <g ref={ring}>
          <text className="fill-current font-mono text-[11px] uppercase tracking-[0.18em]">
            <textPath href={`#ring-${id}`} startOffset="0">{t.ring.repeat(2)}</textPath>
          </text>
        </g>
      </svg>
      <span className="grid size-[120px] place-items-center rounded-full bg-lime text-ink transition-[scale,background-color] duration-(--t-base) ease-out-expo group-hover/ring:scale-[1.06] group-hover/ring:bg-lime-hot md:size-[160px]">
        <ArrowUpRight strokeWidth={1.5} className="size-12 transition-transform duration-(--t-base) ease-out-expo group-hover/ring:rotate-45 md:size-14" />
      </span>
    </Link>
  )
}

/**
 * CTA-баннер «Обсудим ваше событие?»: высокая панель с линейкой, graphite + точечная сетка,
 * которую лаймом подсвечивает spotlight за курсором (с инерцией), ступенчатый заголовок display-xl
 * с line-reveal при появлении, круг-кнопка с вращающимся кольцом текста, HUD-строка внизу.
 * На странице услуги — моно-чип с её названием, кнопка ведёт на форму с предзаполненным «Интересует».
 */
export function CtaBanner({ service, className }: { service?: string; className?: string }) {
  const reduced = useReducedMotion()
  const [view, inView] = useInView<HTMLDivElement>('0px')
  const [seen, setSeen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const time = usePermTime()
  const to = service ? `${t.to}?interest=${encodeURIComponent(service)}#form` : `${t.to}#form`
  const phone = site.contacts.phones[0]

  useEffect(() => { if (inView) setSeen(true) }, [inView])

  // spotlight за курсором с инерцией (только пока баннер в кадре)
  useEffect(() => {
    const el = box.current
    if (!el || reduced || !inView) return
    let raf = 0
    const pos = { x: -999, y: -999 }, target = { x: -999, y: -999 }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      if (pos.x < -900) { pos.x = target.x; pos.y = target.y }
    }
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.12
      pos.y += (target.y - pos.y) * 0.12
      el.style.setProperty('--sx', `${pos.x.toFixed(1)}px`)
      el.style.setProperty('--sy', `${pos.y.toFixed(1)}px`)
      raf = requestAnimationFrame(tick)
    }
    el.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => { el.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [reduced, inView])

  return (
    <Panel as="section" aria-label={`${t.titleTop} ${t.titleBottom}`} className={className} innerClassName="isolate">
      <div ref={box} className="cta-banner relative flex min-h-[max(420px,50svh)] flex-col">
        {/* точечная сетка и её лаймовая подсветка вокруг курсора */}
        <div ref={view} aria-hidden="true" className="cta-dots absolute inset-0 -z-10" />
        {!reduced && <div aria-hidden="true" className="cta-dots cta-dots--lit absolute inset-0 -z-10" />}

        <div className="flex flex-1 flex-col items-center gap-10 p-6 text-center md:flex-row md:items-center md:justify-between md:gap-12 md:p-12 md:text-left">
          <div className="flex min-w-0 flex-col items-center md:items-start">
            {service && (
              <p className="text-label inline-flex items-center gap-2 rounded-pill px-3 py-2 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)]">
                <Asterisk className="size-3 text-lime" /> {service}
              </p>
            )}
            <h2 data-in={seen || undefined} className={cn('cta-title text-display-xl lg:text-[clamp(56px,6.4vw,124px)]', service && 'mt-8')}>
              <span className="reveal-line"><span className="text-white">{t.titleTop}</span></span>
              <span className="reveal-line" style={{ ['--d' as string]: 1 }}><span className="text-mute lg:whitespace-nowrap lg:pl-[0.6em]">{t.titleBottom}</span></span>
            </h2>
          </div>
          <RingButton to={to} reduced={reduced} active={inView} />
        </div>

        {/* HUD-строка */}
        <div className="text-label grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line px-6 py-4 text-mute-2 md:grid-cols-3 md:px-12">
          <span className="col-span-2 md:col-span-1">{t.reply}</span>
          <a href={tel(phone)} className="whitespace-nowrap tabular-nums text-white transition-colors duration-(--t-fast) hover:text-lime md:text-center">{phone}</a>
          <span className="text-right tabular-nums">{site.city} · {time || '--:--'} {t.tz}</span>
        </div>
      </div>
    </Panel>
  )
}
