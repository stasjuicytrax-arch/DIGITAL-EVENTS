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
  sculptureAlt: 'Хромовая скульптура: скрученный тор-узел с лаймовыми бликами. Под курсором она распадается на частицы и собирается обратно.',
  capsuleAlt: 'Гостья в лазерном коридоре на событии DIGITAL EVENTS',
} as const

/** Блок 2: бегущая строка-приветствие со старого сайта */
export const greeting = {
  label: 'Приветствие на разных языках',
  words: ['ПРИВЕТ', 'HALLO', 'BUENOS DÍAS', 'GUTEN TAG', 'OLÁ', 'MERHABA', '你好', 'HYVÄÄ PÄIVÄÄ', 'SZERVUSZ', 'ΓΕΙΆ ΣΑΣ', 'BONJOUR'],
} as const
