/**
 * Мини-типограф для русских текстов: неразрывные пробелы после коротких слов и предлогов,
 * перед тире и между числом и единицей. Применяется к контенту при сборке (scripts/build-content.mjs)
 * и к строкам в src/content/*.ts.
 */
const NBSP = ' '
const SHORT = /(^|[\s(«"])((?:[а-яёА-ЯЁa-zA-Z]{1,2})|(?:без|для|изо|над|под|при|про|что|как|или|это|все|наш|ваш|его|её|они|мы|вы))\s+/g

export function typograf(input: string): string {
  if (!input) return input
  let s = input.replace(/[ \t]{2,}/g, ' ')
  s = s.replace(/ - /g, ' — ').replace(/(\S) — /g, `$1${NBSP}— `)
  // дважды: соседние короткие слова («и в городе»)
  s = s.replace(SHORT, `$1$2${NBSP}`).replace(SHORT, `$1$2${NBSP}`)
  s = s.replace(/(\d)\s+(м|см|мм|кг|ч|мин|В|Вт|кВт|м²|руб|₽|%|шт)(?=[\s.,;:!?)]|$)/g, `$1${NBSP}$2`)
  s = s.replace(/№\s+(\d)/g, `№${NBSP}$1`)
  return s
}
