import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { nav } from '@/content/nav'
import { catalog } from '@/content/catalog'
import { site } from '@/content/site'
import { Asterisk } from '@/components/icons/Asterisk'
import { Button } from '@/components/ui/button'
import { onProgress } from '@/lib/progress'
import { getLenis } from '@/lib/lenis'
import { useScramble } from '@/lib/scramble'
import { cn } from '@/lib/utils'

const EXPO = [0.16, 1, 0.3, 1] as const

function Logo({ className }: { className?: string }) {
  return (
    <Link to={nav.home.to} aria-label={nav.home.label} className={cn('flex items-center gap-2 font-heading text-[15px] font-semibold uppercase tracking-[-0.02em] text-white', className)}>
      <Asterisk className="size-4 text-lime" />
      <span>{site.name}</span>
    </Link>
  )
}

function Burger({ open, onClick, controls }: { open: boolean; onClick: () => void; controls: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? nav.menuClose : nav.menuOpen}
      className="relative grid size-11 place-items-center rounded-full text-white transition-colors duration-(--t-fast) ease-soft hover:bg-white/10"
    >
      <span className={cn('absolute h-px w-5 bg-current transition-transform duration-(--t-base) ease-out-expo', open ? 'rotate-45' : '-translate-y-[4px]')} />
      <span className={cn('absolute h-px w-5 bg-current transition-transform duration-(--t-base) ease-out-expo', open ? '-rotate-45' : 'translate-y-[4px]')} />
    </button>
  )
}

function MegaMenu({ id, onClose }: { id: string; onClose: () => void }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
      transition={{ duration: 0.42, ease: EXPO }}
      className="absolute left-1/2 bg-ink-2 shadow-[inset_0_0_0_1px_var(--de-line),0_24px_48px_-24px_var(--de-void)] top-[calc(100%+12px)] w-[min(880px,calc(100vw-2*var(--margin)))] -translate-x-1/2 rounded-lg p-6"
    >
      <p className="text-label mb-4 text-mute-2">{nav.megaTitle}</p>
      <ul className="grid grid-cols-2 gap-x-6">
        {catalog.map((d, i) => (
          <li key={d.slug}>
            <Link
              to={`/uslugi/${d.slug}`}
              onClick={onClose}
              className="group/mi flex items-baseline gap-4 border-t border-line py-3 text-white transition-colors duration-(--t-fast) ease-soft hover:text-lime"
            >
              <span className="text-micro w-6 text-mute tabular-nums transition-colors duration-(--t-fast) group-hover/mi:text-lime">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 font-heading text-[20px] font-medium leading-tight tracking-[-0.02em]">{d.title}</span>
              <span className="text-micro text-mute-2">{d.count ? nav.positions(d.count) : ''}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/uslugi" onClick={onClose} className="link-underline mt-6 inline-flex items-center gap-2 text-small text-white">
        {nav.megaAll} <ArrowUpRight strokeWidth={1.5} className="size-4" />
      </Link>
    </motion.div>
  )
}

function OverlayLink({ to, label, index, onClick }: { to: string; label: string; index: number; onClick: () => void }) {
  const [ref, run] = useScramble<HTMLSpanElement>(label)
  return (
    <li className="overflow-hidden">
      <motion.div
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        exit={{ y: '110%' }}
        transition={{ duration: 0.9, ease: EXPO, delay: 0.08 + index * 0.06 }}
      >
      <NavLink
        to={to}
        onClick={onClick}
        onPointerEnter={run}
        onFocus={run}
        className={({ isActive }) => cn('text-display-xl flex items-baseline gap-4 py-1', isActive ? 'text-white' : 'text-mute hover:text-white')}
      >
        <span className="text-label text-mute-2 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        <span ref={ref}>{label}</span>
      </NavLink>
      </motion.div>
    </li>
  )
}

function Overlay({ id, onClose }: { id: string; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  // фокус на первый пункт при открытии, возврат на бургер при закрытии
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    root.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
    return () => prev?.focus({ preventScroll: true })
  }, [])
  return (
    <motion.div
      ref={root}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={nav.menuOpen}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-30 flex flex-col justify-end bg-void px-margin pb-12 pt-32"
    >
      <ul className="flex flex-col">
        {nav.links.map((l, i) => (
          <OverlayLink key={l.to} to={l.to} label={l.label} index={i} onClick={onClose} />
        ))}
      </ul>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <Button href={nav.cta.to} onClick={onClose}>{nav.cta.label}</Button>
        <p className="text-label text-mute-2">{site.slogan} · {site.city}</p>
      </motion.div>
    </motion.div>
  )
}

/**
 * Навбар DESIGN.md §9: фиксированная пилюля liquid glass по центру сверху.
 * Скролл вниз — сжимается до лого + бургер, вверх — раскрывается. На мобиле всегда лого + бургер,
 * меню — полноэкранный оверлей с пунктами display-xl и glyph-scramble.
 */
export function Nav() {
  const [compact, setCompact] = useState(false)
  const [menu, setMenu] = useState(false)
  const [mega, setMega] = useState(false)
  const megaId = useId(), menuId = useId()
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)

  // сжатие по направлению скролла
  useEffect(() => {
    let last = 0
    return onProgress(() => {
      const y = window.scrollY
      if (Math.abs(y - last) < 6) return
      setCompact(y > 160 && y > last)
      last = y
    })
  }, [])

  // закрытие при смене страницы, Escape и клике снаружи
  useEffect(() => { setMenu(false); setMega(false) }, [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); setMega(false) } }
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setMega(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown) }
  }, [])
  useEffect(() => {
    const lenis = getLenis()
    if (menu) { lenis?.stop(); document.documentElement.style.overflow = 'hidden' }
    else { lenis?.start(); document.documentElement.style.overflow = '' }
  }, [menu])
  useEffect(() => { if (compact) setMega(false) }, [compact])

  const expanded = !compact && !menu

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-margin">
        <motion.div
          ref={wrap}
          layout={!reduce}
          transition={{ layout: { duration: 0.6, ease: EXPO } }}
          className="glass glass-nav pointer-events-auto relative flex h-16 items-center gap-2 rounded-pill pl-6 pr-2"
          style={{ borderRadius: 999 }}
        >
          <motion.div layout="position"><Logo /></motion.div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.nav
                key="links"
                aria-label="Основное меню"
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="ml-8 hidden items-center gap-1 lg:flex"
              >
                {nav.links.map((l) =>
                  'mega' in l && l.mega ? (
                    <button
                      key={l.to}
                      type="button"
                      aria-expanded={mega}
                      aria-controls={megaId}
                      onClick={() => setMega((v) => !v)}
                      className={cn('rounded-pill px-4 py-2 text-small transition-colors duration-(--t-fast) ease-soft hover:text-white', mega || pathname.startsWith('/uslugi') && pathname !== '/uslugi/videogames' ? 'text-white' : 'text-mute-2')}
                    >
                      {l.label}
                    </button>
                  ) : (
                    <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('rounded-pill px-4 py-2 text-small transition-colors duration-(--t-fast) ease-soft hover:text-white', isActive ? 'text-white' : 'text-mute-2')}>
                      {l.label}
                    </NavLink>
                  ),
                )}
              </motion.nav>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ delay: 0.2 }} className="ml-6 hidden lg:block">
                <Button href={nav.cta.to} size="compact">{nav.cta.label}</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout="position" className={cn('ml-2', expanded && 'lg:hidden')}>
            <Burger open={menu} onClick={() => setMenu((v) => !v)} controls={menuId} />
          </motion.div>

          <AnimatePresence>{mega && expanded && <MegaMenu id={megaId} onClose={() => setMega(false)} />}</AnimatePresence>
        </motion.div>
      </header>
      <AnimatePresence>{menu && <Overlay id={menuId} onClose={() => setMenu(false)} />}</AnimatePresence>
    </>
  )
}
