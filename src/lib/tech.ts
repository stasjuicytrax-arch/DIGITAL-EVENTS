import type { TechRow } from '@/content/services'
import { servicePage } from '@/content/pages'

/**
 * Техтребования → короткие моно-чипы для карточек: «3×3×2 М», «220 В», «МОНТАЖ 1,5 Ч».
 * Размер и питание — просто значение, остальное с коротким префиксом из content/pages.ts.
 */
export function techChips(rows: TechRow[], limit = 3): string[] {
  return rows
    .filter((r) => r.value && r.value.length <= 24)
    .map((r) => {
      const v = r.value.replace(/\.$/, '').trim()
      const prefix = servicePage.techShort[r.label]
      return prefix ? `${prefix} ${v}` : v
    })
    .slice(0, limit)
}

/** 2 → «02» */
export const pad2 = (n: number) => String(n).padStart(2, '0')
