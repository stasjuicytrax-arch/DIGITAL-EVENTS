import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { contactsPage as t } from '@/content/company'
import { site } from '@/content/site'
import { SectionLabel } from '@/components/SectionLabel'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`
const { lat, lon } = t.geo
// статичная Яндекс-карта вместо тяжёлого виджета (TZ §5.4); тёмный вид — CSS-фильтром, метка — свой лаймовый ✱
const MAP_SRC = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&z=16&size=650,450&l=map&lang=ru_RU`
const MAP_OPEN = `https://yandex.ru/maps/?pt=${lon},${lat}&z=17&l=map`
const MAP_ROUTE = `https://yandex.ru/maps/?rtext=~${lat},${lon}`

const field = 'w-full rounded-md bg-ink-2 px-5 py-4 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] transition-shadow duration-(--t-fast) ease-soft placeholder:text-mute hover:shadow-[inset_0_0_0_1px_var(--de-mute)] focus-visible:shadow-[inset_0_0_0_1px_var(--de-lime)] focus-visible:outline-none'

/** Форма заявки. Бэкенд не выбран (TZ §11.1) — пока собираем письмо в почтовом клиенте */
function ContactForm() {
  const id = useId()
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')
  const f = t.form

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    if (!name || !phone) return setStatus('error')
    const body = [`${f.name.label}: ${name}`, `${f.phone.label}: ${phone}`, `${f.message.label} ${String(data.get('message') ?? '').trim()}`].join('\n')
    window.location.href = `mailto:${site.contacts.email}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`
    setStatus('done')
  }

  return (
    <form id="form" noValidate onSubmit={onSubmit} aria-describedby={`${id}-status`} className="scroll-mt-32">
      <h2 className="text-h2">{f.title}</h2>
      <p className="text-body-l mt-4 text-mute-2">{f.text}</p>
      <div className="mt-10 grid gap-gutter md:grid-cols-2">
        <label className="block">
          <span className="text-micro mb-3 block text-mute-2">{f.name.label}</span>
          <input name="name" required autoComplete="name" placeholder={f.name.placeholder} aria-invalid={status === 'error' || undefined} className={field} />
        </label>
        <label className="block">
          <span className="text-micro mb-3 block text-mute-2">{f.phone.label}</span>
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder={f.phone.placeholder} aria-invalid={status === 'error' || undefined} className={field} />
        </label>
        <label className="block md:col-span-2">
          <span className="text-micro mb-3 block text-mute-2">{f.message.label}</span>
          <textarea name="message" rows={4} placeholder={f.message.placeholder} className={`${field} resize-y`} />
        </label>
      </div>
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="text-micro max-w-[44ch] text-mute-2">
          {f.consent} <Link to={f.policy.to} className="link-underline text-white">{f.policy.label}</Link>
        </p>
        <Button type="submit">{f.submit}</Button>
      </div>
      <p id={`${id}-status`} role="status" className="text-small mt-6 min-h-6 text-white">
        {status === 'error' ? f.required : status === 'done' ? f.done : ''}
      </p>
    </form>
  )
}

/** Контакты /contacts (TZ §5.4): телефоны, почта, адрес, соцсети, реквизиты, статичная карта, форма */
export function Component() {
  const c = site.contacts
  return (
    <main className="pb-24 pt-32">
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDescription} />
        <link rel="canonical" href={`${site.url}/contacts`} />
      </Head>

      <header className="grid grid-cols-4 gap-gutter px-margin pb-16 md:grid-cols-12 md:pb-24">
        <SectionLabel className="col-span-4 md:col-span-3">{t.label}</SectionLabel>
        <h1 className="text-display-xl col-span-4 mt-8 md:col-span-9 md:mt-0">
          <span className="block text-white">{t.title}</span>
          <span className="block text-mute md:pl-[1.2em]">{t.titleMute}</span>
        </h1>
      </header>

      <section aria-label={t.label} className="grid grid-cols-4 gap-gutter px-margin md:grid-cols-12">
        <dl className="col-span-4 grid gap-10 sm:grid-cols-2 md:col-span-5">
          <div className="sm:col-span-2">
            <dt className="text-label text-mute-2">{t.phonesTitle}</dt>
            {c.phones.map((p) => (
              <dd key={p} className="mt-3"><a href={tel(p)} className="text-h2 tabular-nums text-white transition-colors duration-(--t-fast) hover:text-lime">{p}</a></dd>
            ))}
          </div>
          <div>
            <dt className="text-label text-mute-2">{t.emailTitle}</dt>
            <dd className="mt-3"><a href={`mailto:${c.email}`} className="link-underline text-body-l text-white">{c.email}</a></dd>
          </div>
          <div>
            <dt className="text-label text-mute-2">{t.socialsTitle}</dt>
            {site.socials.map((s) => (
              <dd key={s.href} className="mt-3"><a href={s.href} target="_blank" rel="noreferrer" className="link-underline text-body-l text-white">{s.label}</a></dd>
            ))}
          </div>
          <div className="sm:col-span-2">
            <dt className="text-label text-mute-2">{t.addressTitle}</dt>
            <dd className="text-body-l mt-3 text-white">{c.address}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-label text-mute-2">{t.reqTitle}</dt>
            <dd className="text-small mt-3 space-y-1 text-mute-2">
              {site.requisites.map((r) => <p key={r}>{r}</p>)}
            </dd>
          </div>
        </dl>

        <figure className="col-span-4 mt-12 md:col-span-7 md:mt-0">
          <div className="relative aspect-[13/9] overflow-hidden rounded-lg bg-ink-2">
            <img src={MAP_SRC} alt={t.mapAlt} width={650} height={450} decoding="async" className="size-full object-cover [filter:grayscale(1)_invert(0.92)_contrast(0.9)_brightness(0.9)]" />
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-void/80 shadow-[inset_0_0_0_1px_var(--de-line-strong)]">
              <Asterisk className="size-5 text-lime" />
            </span>
          </div>
          <figcaption className="mt-6 flex flex-wrap gap-6">
            <Button variant="link" href={MAP_OPEN} target="_blank" rel="noreferrer">{t.mapOpen}</Button>
            <Button variant="link" href={MAP_ROUTE} target="_blank" rel="noreferrer">{t.mapRoute}</Button>
          </figcaption>
        </figure>
      </section>

      <section className="grid grid-cols-4 gap-gutter px-margin pt-section md:grid-cols-12">
        <div className="col-span-4 md:col-span-8 md:col-start-5">
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
