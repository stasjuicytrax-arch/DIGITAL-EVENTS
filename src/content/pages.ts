// Тексты страниц каталога, направления и позиции (TZ §5.1–5.3). Данные — services.ts / catalog.ts
export const catalogPage = {
  label: 'Услуги',
  titleTop: 'Так что мы',
  titleBottom: 'умеем?',
  footnote: '*А умеем мы многое',
  metaTitle: 'Услуги DIGITAL EVENTS — digital-развлечения для событий | Пермь',
  metaDescription:
    'Видео и фото зоны, интерактивы, видеоигры, 3D-mapping, AR, digital decor, инсталляции, онлайн-мероприятия и video production для событий любого формата.',
  // текст со старого сайта
  helpTitle: 'Нужна помощь или остались вопросы?',
  helpText: 'Оставь контакты, и наши менеджеры помогут выбрать и забронировать продукт.',
  helpCta: { label: 'Обсудить задачу', to: '/contacts' },
} as const

export const servicePage = {
  crumbsRoot: { label: 'Услуги', to: '/uslugi' },
  cta: { label: 'Оставить заявку', to: '/contacts' },
  itemsTitle: 'Позиции',
  picksTitle: 'Подборка',
  galleryTitle: 'Галерея',
  videoTitle: 'Видео',
  stripTitle: 'Обсудим ваше событие?',
  stripCta: { label: 'Обсудить задачу', to: '/contacts' },
  othersTitle: 'Другие направления',
  photoAlt: (title: string, n: number) => `${title} — фото ${n}`,
} as const

export const itemPage = {
  order: { label: 'Заказать', to: '/contacts' },
  watch: 'Смотреть видео',
  descriptionTitle: 'Описание',
  techTitle: 'Технические требования',
  extrasTitle: 'Дополнительно',
  videoTitle: 'Видео',
  similarTitle: 'Похожие позиции',
  prev: 'Предыдущее фото',
  next: 'Следующее фото',
} as const

export const media = {
  close: 'Закрыть',
  prev: 'Предыдущее',
  next: 'Следующее',
  play: 'Смотреть видео',
} as const
