import { Fragment } from 'react'
import { Link } from 'react-router-dom'

type Crumb = { label: string; to?: string }

/** Хлебные крошки моно-лейблом: `Услуги / Видео и фото зоны` */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки">
      <ol className="text-label flex flex-wrap items-center gap-2 text-mute-2">
        {items.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <li aria-hidden="true" className="text-mute">/</li>}
            <li>
              {c.to ? (
                <Link to={c.to} className="transition-colors duration-(--t-fast) ease-soft hover:text-white">{c.label}</Link>
              ) : (
                <span aria-current="page" className="text-white">{c.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
