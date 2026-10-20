import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { site } from '@/content/site'
import { nav } from '@/content/nav'
import { footer as footerText } from '@/content/footer'
import { Asterisk } from '@/components/icons/Asterisk'
import { getLenis } from '@/lib/lenis'
import { useInView } from '@/lib/hooks'
import { scrambleTo } from '@/lib/scramble'
import { isBrowser } from '@/lib/utils'

const useIsoLayout = isBrowser ? useLayoutEffect : useEffect
const WORDMARK = 'DIGITAL EVENTS'

/** Местное время Перми (UTC+5), обновляется раз в минуту */
function PermClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () => setTime(new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Yekaterinburg' }).format(new Date()))
    fmt()
    const id = window.setInterval(fmt, 15_000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="tabular-nums">
      {footerText.city} {time || '--:--'} UTC+5
    </span>
  )
}

/** Вордмарк на всю ширину: размер подбирается под контейнер, при появлении буквы собираются из глифов */
function Wordmark() {
  const [box, inView] = useInView<HTMLDivElement>('0px')
  const text = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useIsoLayout(() => {
    const el = text.current
    const wrap = box.current
    if (!el || !wrap) return
    const fit = () => {
      el.style.fontSize = '100px'
      el.style.fontSize = `${(100 * wrap.clientWidth) / el.scrollWidth}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    void document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [box])

  useEffect(() => {
    if (!inView || done.current || !text.current) return
    done.current = true
    scrambleTo(text.current, WORDMARK, 1200)
  }, [inView])

  return (
    <div ref={box} className="overflow-hidden" aria-hidden="true">
      <span ref={text} className="inline-block whitespace-nowrap font-heading font-semibold uppercase leading-[0.84] tracking-[-0.055em] text-white">
        {WORDMARK}
      </span>
    </div>
  )
}

/**
 * Блок 11 Футер (TZ §5): вордмарк DIGITAL EVENTS во всю ширину, «Технологии развлечений ✱»,
 * колонки навигация · контакты · соцсети · реквизиты, © с текущим годом, «Наверх», время Перми.
 */
export function Footer() {
  const toTop = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const year = new Date().getFullYear()

  return (
    <footer className="px-margin pb-12 pt-24 md:pt-32">
      <h2 className="sr-only">{site.name}</h2>
      <Wordmark />
      <p className="text-label mt-6 flex items-center gap-2 text-mute-2">
        {site.slogan} <Asterisk className="size-3 text-lime" />
      </p>

      <div className="mt-24 grid grid-cols-2 gap-x-gutter gap-y-12 border-t border-line pt-12 md:grid-cols-12">
        <nav aria-label={footerText.navTitle} className="col-span-1 md:col-span-2">
          <p className="text-micro text-mute">{footerText.navTitle}</p>
          <ul className="mt-6 space-y-3">
            {nav.links.map((l) => (
              <li key={l.to}><Link to={l.to} className="link-underline text-small text-white">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="col-span-1 md:col-span-3">
          <p className="text-micro text-mute">{footerText.contactsTitle}</p>
          <ul className="mt-6 space-y-3 text-small">
            {site.contacts.phones.map((p) => (
              <li key={p}><a href={`tel:${p.replace(/[^\d+]/g, '')}`} className="link-underline tabular-nums text-white">{p}</a></li>
            ))}
            <li><a href={`mailto:${site.contacts.email}`} className="link-underline text-white">{site.contacts.email}</a></li>
            <li className="text-mute-2">{site.contacts.address}</li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2">
          <p className="text-micro text-mute">{footerText.socialsTitle}</p>
          <ul className="mt-6 space-y-3">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-small text-white">
                  {s.label} <ArrowUpRight strokeWidth={1.5} className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-5">
          <p className="text-micro text-mute">{footerText.reqTitle}</p>
          <ul className="mt-6 space-y-2 text-small text-mute-2">
            {site.requisites.map((r) => <li key={r}>{r}</li>)}
            <li><Link to={footerText.policy.to} className="link-underline text-white">{footerText.policy.label}</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
        <p className="text-micro text-mute-2">© {year} {site.name}</p>
        <p className="text-micro text-mute-2"><PermClock /></p>
        <button type="button" onClick={toTop} className="glass inline-flex h-11 items-center gap-2 rounded-pill px-5 text-small text-white">
          {footerText.top} <ArrowUp strokeWidth={1.5} className="size-4" />
        </button>
      </div>
    </footer>
  )
}
