import { Fragment } from 'react'
import { manifest } from '@/content/home'
import { SectionLabel } from '@/components/SectionLabel'
import { Media } from '@/components/Media'

/**
 * Блок 3 Манифест (TZ §5): ступенчатый текст белым, две капсулы с фото внутри строк.
 * Закрепление и заливка цветом по скроллу убраны по просьбе заказчика — блок просто прокручивается.
 */
export function Manifest() {


  return (
    <section aria-labelledby="manifest-title" className="flex flex-col px-margin pb-16 pt-4 md:pb-20 md:pt-24">
      <div className="grid grid-cols-4 gap-gutter md:grid-cols-12">
        <SectionLabel index={manifest.index} className="col-span-4 mb-12 md:col-span-3 md:mb-0">{manifest.label}</SectionLabel>
        <h2 id="manifest-title" className="sr-only">{manifest.text.filter((t) => typeof t === 'string').join(' ')}</h2>
        <p aria-hidden="true" className="text-h1 col-span-4 text-white md:col-span-12 md:indent-[calc((100%-11*var(--gutter))/12*3+3*var(--gutter))]">
          {manifest.text.map((part, i) =>
            typeof part === 'string' ? (
              <Fragment key={i}>
                {part.split(' ').map((w, j) => (
                  <Fragment key={j}>
                    <span data-word>{w}</span>{' '}
                  </Fragment>
                ))}
              </Fragment>
            ) : (
              <Fragment key={i}>
                <span className="capsule" title={part.alt}>
                  <Media id={part.capsule} alt="" sizes="20vw" className="size-full" />
                </span>{' '}
              </Fragment>
            ),
          )}
        </p>
        <p className="text-label col-span-4 mt-12 text-mute-2 md:col-span-4 md:col-start-9">{manifest.footnote}</p>
        <p className="text-body-l col-span-4 mt-12 max-w-[42ch] text-mute-2 md:col-span-5 md:col-start-8">{manifest.about}</p>
      </div>
    </section>
  )
}
