// Тексты главной (TZ §5). Черновик для согласования.
export const hero = {
  label: 'Креативное бюро развлечений · Пермь',
  titleTop: 'Технологии',
  titleBottom: 'развлечений',
  lead: 'Разрабатываем digital-продукты для ваших событий и бизнеса. Первые в Пермском крае внедряем digital-развлечения в события любого формата.',
  ctaPrimary: { label: 'Обсудить задачу', to: '/#contact' },
  ctaSecondary: { label: 'Что мы умеем', to: '/#services' },
  /** слово-призрак за скульптурой (TZ §7, референс e6530….jpg) */
  backdrop: 'DIGITAL',
  /** плашка liquid glass (TZ §5 блок 1): цифр не выдумываем */
  plate: 'Делаем свои продукты сами: от кода до запуска',
  chips: ['DIGITAL-АТТРАКЦИОНЫ', 'AR', '3D-MAPPING', 'ВИДЕОИГРЫ', 'MOTION'],
  scroll: 'Scroll',
  capsuleAlt: 'Гостья в лазерном коридоре на событии DIGITAL EVENTS',
} as const

/** Блок 3: манифест (TZ §5). Капсулы — фото гостей из old-site/common/home (TZ §10.3) */
export const manifest = {
  index: '01',
  label: 'О нас',
  text: [
    'Наполняем события людей',
    { capsule: 'home/home-19', alt: 'Гости поют в микрофоны на событии' },
    'яркими эмоциями, совмещая инновации, программирование,',
    { capsule: 'home/home-06', alt: 'Гостья среди светящихся шаров' },
    'веселье, креатив и творчество',
  ] as const,
  footnote: '*Используя технологии развлечений',
  about: 'Мы — Креативное бюро развлечений DIGITAL EVENTS. Наша цель — внедрить digital-технологии в event-индустрию. Мы прокачаем ваше событие современными технологиями.',
} as const

/** Блок 2: бегущая строка-приветствие со старого сайта */
export const greeting = {
  label: 'Приветствие на разных языках',
  words: ['ПРИВЕТ', 'HALLO', 'BUENOS DÍAS', 'GUTEN TAG', 'OLÁ', 'MERHABA', '你好', 'HYVÄÄ PÄIVÄÄ', 'SZERVUSZ', 'ΓΕΙΆ ΣΑΣ', 'BONJOUR'],
} as const
