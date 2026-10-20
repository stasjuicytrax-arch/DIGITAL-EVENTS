import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge должен знать нашу типографическую шкалу (globals.css), иначе text-label
// считается цветом и выкидывается при соседстве с text-mute-2
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display-xxl', 'display-xl', 'h1', 'h2', 'h3', 'body-l', 'body', 'small', 'label', 'micro'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isBrowser = typeof window !== 'undefined'
