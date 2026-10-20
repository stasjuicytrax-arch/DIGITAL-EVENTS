import { useEffect, useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { contactsPage } from '@/content/company'
import { catalog } from '@/content/catalog'
import { site } from '@/content/site'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const field = 'w-full rounded-md bg-ink-2 px-5 py-4 text-white shadow-[inset_0_0_0_1px_var(--de-line-strong)] transition-shadow duration-(--t-fast) ease-soft placeholder:text-mute hover:shadow-[inset_0_0_0_1px_var(--de-mute)] focus-visible:shadow-[inset_0_0_0_1px_var(--de-lime)] focus-visible:outline-none'

/** Форма заявки. Бэкенд не выбран (TZ §11.1) — пока собираем письмо в почтовом клиенте */
export function ContactForm({ title, text, compact }: { title?: string; text?: string; compact?: boolean }) {
  const id = useId()
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')
  const [picked, setPicked] = useState<string[]>([])
  const f = contactsPage.form
  // кнопка CTA-баннера на странице услуги передаёт её название: /contacts?interest=…#form
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('interest')
    if (v && catalog.some((c) => c.title === v)) setPicked((p) => (p.includes(v) ? p : [...p, v]))
  }, [])
  const toggle = (title: string) => setPicked((p) => (p.includes(title) ? p.filter((x) => x !== title) : [...p, title]))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    if (!name || !phone) return setStatus('error')
    const body = [
      `${f.name.label}: ${name}`,
      `${f.phone.label}: ${phone}`,
      picked.length ? `${f.interest}: ${picked.join(', ')}` : '',
      `${f.message.label} ${String(data.get('message') ?? '').trim()}`,
    ].filter(Boolean).join('\n')
    window.location.href = `mailto:${site.contacts.email}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`
    setStatus('done')
  }

  return (
    <form id="form" noValidate onSubmit={onSubmit} aria-describedby={`${id}-status`} className="scroll-mt-32">
      <div className="text-center">
        <h2 className="text-h2 mx-auto max-w-[22ch]">{title ?? f.title}</h2>
        <p className="text-body-l mx-auto mt-4 max-w-[40ch] text-mute-2">{text ?? f.text}</p>
      </div>
      <div className="mt-12 grid gap-gutter md:grid-cols-2">
        <label className="block">
          <span className="text-micro mb-3 block text-mute-2">{f.name.label}</span>
          <input name="name" required autoComplete="name" placeholder={f.name.placeholder} aria-invalid={status === 'error' || undefined} className={field} />
        </label>
        <label className="block">
          <span className="text-micro mb-3 block text-mute-2">{f.phone.label}</span>
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder={f.phone.placeholder} aria-invalid={status === 'error' || undefined} className={field} />
        </label>
        {!compact && <fieldset className="md:col-span-2">
          <legend className="text-micro mb-3 block text-mute-2">{f.interest}</legend>
          <div className="flex flex-wrap gap-2">
            {catalog.map((c) => {
              const on = picked.includes(c.title)
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(c.title)}
                  className={cn(
                    'text-small min-h-11 rounded-pill px-4 py-2 transition-[background-color,color,box-shadow] duration-(--t-fast) ease-soft',
                    on ? 'bg-white text-ink' : 'text-mute-2 shadow-[inset_0_0_0_1px_var(--de-line-strong)] hover:text-white hover:shadow-[inset_0_0_0_1px_var(--de-mute)]',
                  )}
                >
                  {c.title}
                </button>
              )
            })}
          </div>
        </fieldset>}
        <label className="block md:col-span-2">
          <span className="text-micro mb-3 block text-mute-2">{f.message.label}</span>
          <textarea name="message" rows={4} placeholder={f.message.placeholder} className={`${field} resize-y`} />
        </label>
      </div>
      <div className="mt-10 flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
        <p className="text-micro max-w-[40ch] text-mute-2">
          {f.consent} <Link to={f.policy.to} className="link-underline text-white">{f.policy.label}</Link>
        </p>
        <Button type="submit" className="w-full justify-between md:w-auto">{f.submit}</Button>
      </div>
      <p id={`${id}-status`} role="status" className="text-small mt-6 min-h-6 text-center text-white md:text-right">
        {status === 'error' ? f.required : status === 'done' ? f.done : ''}
      </p>
    </form>
  )
}

