// Навигация (TZ §4): Услуги (мега-меню, видеоигры — внутри) · Портфолио · О нас · Контакты + CTA
export const nav = {
  home: { label: 'DIGITAL EVENTS — на главную', to: '/' },
  links: [
    { label: 'Услуги', to: '/uslugi', mega: true },
    { label: 'Портфолио', to: '/portfolio' },
    { label: 'О нас', to: '/about' },
    { label: 'Контакты', to: '/contacts' },
  ],
  cta: { label: 'Обсудить задачу', to: '/contacts' },
  megaTitle: 'Все направления',
  megaAll: 'Весь каталог',
  megaToggle: 'Показать все направления',
  menuOpen: 'Открыть меню',
  menuClose: 'Закрыть меню',
  positions: (n: number) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'позиция' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'позиции' : 'позиций'}`,
} as const

export const cursorLabels = { open: 'Открыть', media: 'Смотреть' } as const
