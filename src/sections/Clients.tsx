import { clientsBlock } from '@/content/home'
import { clients, type Client } from '@/content/clients'
import { SectionLabel } from '@/components/SectionLabel'
import { useVelocityMarquee } from '@/lib/marquee'

const BASE = import.meta.env.BASE_URL

function Logo({ c, dup }: { c: Client; dup?: boolean }) {
  return (
    <li className="flex shrink-0 items-center" aria-hidden={dup || undefined}>
      <img
        src={`${BASE}logos/${c.slug}.webp`}
        alt={dup ? '' : c.name}
        width={c.w}
        height={c.h}
        loading="lazy"
        decoding="async"
        // выравнивание по визуальной массе: узкие логотипы выше, широкие ниже
        style={{ height: `calc(var(--logo-h) * ${Math.min(1.5, Math.max(0.7, Math.sqrt(3 / (c.w / c.h)))).toFixed(3)})` }}
        className="client-logo w-auto"
      />
    </li>
  )
}

/**
 * Блок 8 Клиенты (TZ §5): cream-секция, два ряда логотипов навстречу друг другу,
 * монохром --de-ink 60%, на hover — полный цвет и лёгкое увеличение. Скорость от скролла.
 */
export function Clients() {
  const [section, row] = useVelocityMarquee<HTMLElement>({ speed: 40 })
  const half = Math.ceil(clients.length / 2)
  const rows = [clients.slice(0, half), clients.slice(half)]

  return (
    <section ref={section} aria-labelledby="clients-title" className="overflow-hidden bg-cream py-section text-ink [--logo-h:32px] md:[--logo-h:48px]">
      <div className="grid grid-cols-4 gap-gutter px-margin md:grid-cols-12">
        <SectionLabel index={clientsBlock.index} tone="light" className="col-span-4 md:col-span-3">{clientsBlock.label}</SectionLabel>
        <h2 id="clients-title" className="text-h2 col-span-4 mt-8 md:col-span-9 md:mt-0">
          <span className="text-ink">{clientsBlock.titleTop}</span> <span className="text-mute">{clientsBlock.titleBottom}</span>
        </h2>
      </div>

      <div className="mt-24 flex flex-col gap-12 md:gap-16">
        {rows.map((list, i) => (
          <div key={i} className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
            <ul ref={row(i)} className="flex w-max items-center gap-16 pr-16 md:gap-24 md:pr-24">
              {[...list, ...list].map((c, j) => <Logo key={c.slug + j} c={c} dup={j >= list.length} />)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
