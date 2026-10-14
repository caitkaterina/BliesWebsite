import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Menu, Phone, Radar, X, Globe } from 'lucide-react'
import { Arrow, Badge, CONTACT, Cta, Logo, DirectorContact, OfficeEmails } from './ui'
import { LOCALES, useLocale } from '../lib/i18n'
import { Link, hrefFor, useRoute } from '../lib/router'

interface Item {
  to: string
  label: string
  desc?: string
}
interface Group {
  key: string
  to?: string
  items?: Item[]
}

export const NAV: Group[] = [
  {
    key: 'nav.procurement',
    to: '/procurement',
    items: [
      { to: '/procurement', label: 'Procurement overview', desc: 'Supplier identification to export preparation' },
      { to: '/procurement/categories', label: 'Product categories', desc: 'Machinery, spares, PPE, FMCG and more' },
      { to: '/procurement/markets', label: 'Sourcing markets', desc: 'Where suppliers are identified' },
    ],
  },
  {
    key: 'nav.logistics',
    to: '/logistics',
    items: [
      { to: '/logistics/road', label: 'Road transport', desc: 'BLIES owned road fleet' },
      { to: '/logistics/mining', label: 'Mining logistics', desc: 'Side-tipper bulk haulage' },
      { to: '/logistics/cold-chain', label: 'Cold chain', desc: 'Multi-temperature refrigerated' },
      { to: '/logistics/project-cargo', label: 'General & project cargo' },
      { to: '/logistics/sea', label: 'Sea freight', desc: 'Partner-coordinated' },
      { to: '/logistics/air', label: 'Air freight', desc: 'Partner-coordinated' },
      { to: '/logistics/cross-border', label: 'Cross-border Africa' },
    ],
  },
  {
    key: 'nav.services',
    items: [
      { to: '/services/customs', label: 'Customs & clearing' },
      { to: '/services/documentation', label: 'Documentation', desc: 'The paperwork. Handled.' },
      { to: '/services/quality', label: 'Quality control' },
      { to: '/industries', label: 'Industries' },
      { to: '/technology/gps', label: 'GPS & fleet tracking' },
    ],
  },
  {
    key: 'nav.about',
    to: '/about',
    items: [
      { to: '/about', label: 'About BLIES' },
    ],
  },
  { key: 'nav.contact', to: '/contact' },
]

function LangSelect({ dark = false }: { dark?: boolean }) {
  const { locale, t } = useLocale()
  const { path } = useRoute()
  return (
    <div role="group" aria-label={t('lang.label')} className={`flex items-center border ${dark ? 'border-white/30' : 'border-line'}`}>
      <Globe aria-hidden className={`mx-2 size-4 ${dark ? 'text-white/70' : 'text-slate-body'}`} />
      {LOCALES.map((l) => (
        <a
          key={l.code}
          href={hrefFor(l.code, path)}
          hrefLang={l.code}
          lang={l.code}
          aria-label={l.native}
          aria-current={l.code === locale ? 'true' : undefined}
          className={`flex min-h-9 min-w-9 items-center justify-center px-1.5 text-xs font-bold transition-colors ${
            l.code === locale
              ? dark
                ? 'bg-white text-navy-900'
                : 'bg-navy-900 text-white'
              : dark
                ? 'text-white/80 hover:bg-white/15'
                : 'text-slate-body hover:bg-mist'
          }`}
        >
          {l.label}
        </a>
      ))}
    </div>
  )
}

function Dropdown({ g, active }: { g: Group; active: boolean }) {
  const { t, tr } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const out = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', out)
    return () => document.removeEventListener('mousedown', out)
  }, [])
  const linkCls = `relative flex min-h-11 items-center gap-1 px-3 text-[0.92rem] font-semibold transition-colors hover:text-royal ${
    active ? 'text-royal' : 'text-navy-900'
  } after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left rtl:after:origin-right after:bg-royal after:transition-transform ${
    active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
  }`
  if (!g.items)
    return (
      <Link to={g.to!} className={linkCls} aria-current={active ? 'page' : undefined}>
        {t(g.key)}
      </Link>
    )
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)} className={linkCls}>
        {t(g.key)}
        <ChevronDown aria-hidden className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute start-0 top-full z-50 w-72 border border-line bg-white py-2 shadow-[0_24px_48px_-12px_rgba(10,31,77,0.25)]">
          {g.items.map((i) => (
            <Link
              key={i.to + i.label}
              to={i.to}
              onClick={() => setOpen(false)}
              className="group/i block px-5 py-2.5 transition-colors hover:bg-mist"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-navy-900 group-hover/i:text-royal">
                {tr(i.label)}
              </span>
              {i.desc && <span className="mt-0.5 block text-xs text-slate-body">{tr(i.desc)}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

interface DrawerEntry {
  key: string
  label: string
  to?: string
  items?: Item[]
}

function useDrawerEntries(): DrawerEntry[] {
  const { t } = useLocale()
  return [
    { key: 'home', label: t('nav.home'), to: '/' },
    { key: 'about', label: t('nav.aboutblies'), to: '/about' },
    { key: 'procurement', label: t('nav.procurement'), items: NAV[0].items },
    { key: 'logistics', label: t('nav.logistics'), items: [{ to: '/logistics', label: 'Logistics overview' }, ...NAV[1].items!] },
    { key: 'services', label: t('nav.services'), items: NAV[2].items!.filter((i) => i.to !== '/industries') },
    { key: 'network', label: t('nav.network'), to: '/network' },
    { key: 'industries', label: t('nav.industries'), to: '/industries' },
    { key: 'contact', label: t('nav.contactus'), to: '/contact' },
  ]
}

function MobileDrawer({ onClose, menuButton }: { onClose: () => void; menuButton: RefObject<HTMLButtonElement | null> }) {
  const { t, tr, dir } = useLocale()
  const { path } = useRoute()
  const entries = useDrawerEntries()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [expanded, setExpanded] = useState<string | null>(() => entries.find((e) => e.items?.some((i) => i.to === path))?.key ?? null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    closeRef.current?.focus()
    const btn = menuButton.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const f = [...panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')].filter((n) => n.offsetParent !== null)
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      btn?.focus()
    }
  }, [onClose, menuButton])

  const rowCls = 'flex min-h-12 w-full items-center justify-between px-1 text-start text-lg font-semibold text-white transition-colors hover:text-sky'

  return createPortal(
    <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-[49] xl:hidden" dir={dir}>
      <div aria-hidden onClick={onClose} className={`absolute inset-0 bg-navy-950/60 transition-opacity duration-300 motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`} />
      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menu')}
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col overflow-y-auto overscroll-contain bg-navy-950 text-white shadow-[0_0_60px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          shown ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-1 pt-4">
          <span className="eyebrow text-sky">{t('nav.menu')}</span>
          <button ref={closeRef} type="button" aria-label={t('nav.close')} onClick={onClose} className="flex size-11 items-center justify-center rounded-sm bg-white/10 transition-colors hover:bg-white hover:text-navy-900">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <nav aria-label={t('nav.menu')} className="flex-1 px-5 pb-6">
          <ul>
            {entries.map((e) => {
              const isOpen = expanded === e.key
              const current = e.to ? (e.to === '/' ? path === '/' : path === e.to) : !!e.items?.some((i) => i.to === path)
              return (
                <li key={e.key} className="border-b border-white/10">
                  {e.items ? (
                    <>
                      <button type="button" aria-expanded={isOpen} aria-controls={`m-${e.key}`} onClick={() => setExpanded(isOpen ? null : e.key)} className={`${rowCls} ${current ? 'text-sky' : ''}`}>
                        {e.label}
                        <ChevronDown aria-hidden className={`size-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div id={`m-${e.key}`} hidden={!isOpen}>
                        <ul className="pb-3 ps-3">
                          {e.items.map((i) => (
                            <li key={i.to + i.label}>
                              <Link to={i.to} onClick={onClose} aria-current={path === i.to ? 'page' : undefined} className={`flex min-h-11 items-center gap-2 text-base transition-colors hover:text-white ${path === i.to ? 'font-semibold text-white' : 'text-white/75'}`}>
                                {tr(i.label)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link to={e.to!} onClick={onClose} aria-current={current ? 'page' : undefined} className={`${rowCls} ${current ? 'text-sky' : ''}`}>
                      {e.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="space-y-3 px-5 pb-6">
          <Cta to="/quote" onClick={onClose} className="w-full" variant="light">
            {t('cta.quote')}
          </Cta>
          <Cta to="/tracking" onClick={onClose} className="w-full" variant="outline-light">
            {t('nav.enquiry')}
          </Cta>
        </div>
        <div className="space-y-3 border-t border-white/10 px-5 py-5 text-sm text-white/75">
          <p className="eyebrow text-white/50">{t('nav.getintouch')}</p>
          <a href={CONTACT.phoneHref} dir="ltr" className="flex min-h-9 items-center gap-2 hover:text-white">
            <Phone aria-hidden className="size-4" />
            {CONTACT.phone}
          </a>
          {CONTACT.director.emails.map((e) => (
            <a key={e} href={`mailto:${e}`} dir="ltr" className="block [overflow-wrap:anywhere] hover:text-white">{e}</a>
          ))}
          <Link to="/contact" onClick={onClose} className="block font-semibold text-white underline-offset-2 hover:underline">{tr('All offices and contacts')}</Link>
          <LangSelect dark />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function Header() {
  const { t, tr } = useLocale()
  const { path } = useRoute()
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setMobile(false), [])
  useEffect(() => setMobile(false), [path])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const isActive = (g: Group) =>
    g.to ? (g.to === '/' ? path === '/' : path === g.to || path.startsWith(g.to + '/')) || !!g.items?.some((i) => path === i.to) : !!g.items?.some((i) => path === i.to)

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-[0_1px_0_var(--color-line),0_12px_30px_-20px_rgba(10,31,77,0.4)]' : 'border-b border-line'}`}>
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }} className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-[60] focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white">
        {t('cta.skip')}
      </a>
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Link to="/" aria-label={tr('BLIES (Pty) Ltd — home')} className="shrink-0">
          <Logo className="w-32 sm:w-40" />
        </Link>
        <nav aria-label={tr('Primary')} className="hidden items-center whitespace-nowrap xl:flex">
          {NAV.map((g) => (
            <Dropdown key={g.key} g={g} active={isActive(g)} />
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LangSelect />
          </div>
          <Cta to="/quote" className="max-sm:!hidden !min-h-11">
            {t('cta.quote')}
          </Cta>
          <button
            ref={menuBtn}
            type="button"
            aria-label={mobile ? t('nav.close') : t('nav.menu')}
            aria-expanded={mobile}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            onClick={() => setMobile((v) => !v)}
            className="flex size-11 items-center justify-center rounded-sm border border-line text-navy-900 transition-colors hover:bg-mist xl:hidden"
          >
            {mobile ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>
      {mobile && <MobileDrawer onClose={close} menuButton={menuBtn} />}
    </header>
  )
}

export function MobileActionBar() {
  const { t } = useLocale()
  const { path } = useRoute()
  if (path === '/quote') return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto_auto] gap-px border-t border-line bg-line shadow-[0_-10px_30px_-12px_rgba(10,31,77,0.35)] sm:hidden">
      <Link to="/quote" className="flex min-h-14 items-center justify-center gap-2 bg-navy-900 text-sm font-bold text-white">
        {t('cta.quote')}
        <Arrow />
      </Link>
      <a href={CONTACT.phoneHref} className="flex min-h-14 min-w-20 flex-col items-center justify-center gap-0.5 bg-white text-[0.7rem] font-semibold text-navy-900">
        <Phone aria-hidden className="size-4" />
        {t('cta.call')}
      </a>
      <Link to="/tracking" className="flex min-h-14 min-w-20 flex-col items-center justify-center gap-0.5 bg-white text-[0.7rem] font-semibold text-navy-900">
        <Radar aria-hidden className="size-4" />
        {t('cta.track')}
      </Link>
    </div>
  )
}

const FOOT_LINKS = {
  procurement: [
    ['/procurement', 'Overview'],
    ['/procurement/categories', 'Product categories'],
    ['/procurement/markets', 'Sourcing markets'],
    ['/services/quality', 'Quality control'],
  ],
  logistics: [
    ['/logistics/road', 'Road transport'],
    ['/logistics/mining', 'Mining logistics'],
    ['/logistics/cold-chain', 'Cold chain'],
    ['/logistics/sea', 'Sea freight'],
    ['/logistics/air', 'Air freight'],
    ['/logistics/cross-border', 'Cross-border Africa'],
  ],
  company: [
    ['/about', 'About BLIES'],
    ['/network', 'Global network'],
    ['/future', 'Our future'],
    ['/industries', 'Industries'],
    ['/tracking', 'Track a shipment'],
    ['/contact', 'Contact & locations'],
    ['/account', 'My BLIES account'],
  ],
  legal: [
    ['/legal/privacy', 'Privacy'],
    ['/legal/terms', 'Terms'],
    ['/legal/cookies', 'Cookies'],
    ['/legal/quote-terms', 'Quotation terms'],
  ],
}

function FootCol({ title, links }: { title: string; links: string[][] }) {
  const { tr } = useLocale()
  return (
    <div>
      <h3 className="eyebrow text-sky">{title}</h3>
      <ul className="mt-5 space-y-2.5">
        {links.map(([to, l]) => (
          <li key={to}>
            <Link to={to} className="text-[0.95rem] text-white/75 transition-colors hover:text-white">
              {tr(l)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { t, tr, locale } = useLocale()
  return (
    <footer className="bg-navy-950 pb-20 text-white sm:pb-0">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.4fr]">
        <div>
          <span className="inline-block bg-white px-3 py-2">
            <Logo className="w-36" />
          </span>
          <p className="mt-6 text-xl font-bold">{t('footer.tagline')}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">{t('footer.sub')}</p>
          <div className="mt-6">
            <LangSelect dark />
          </div>
        </div>
        <FootCol title={t('footer.procurement')} links={FOOT_LINKS.procurement} />
        <FootCol title={t('footer.logistics')} links={FOOT_LINKS.logistics} />
        <FootCol title={t('footer.company')} links={FOOT_LINKS.company} />
        <div>
          <h3 className="eyebrow text-sky">{t('footer.offices')}</h3>
          <address className="mt-5 space-y-5 text-sm not-italic leading-relaxed text-white/75">
            <div>
              <strong className="block text-white">{CONTACT.director.name}</strong>
              <span className="block">{tr(CONTACT.director.role)}, BLIES (Pty) Ltd</span>
              <DirectorContact dark className="mt-1.5" />
            </div>
            {CONTACT.countries.map((c) => (
              <div key={c.country}>
                <p className="eyebrow text-white/50">{tr(c.country)}</p>
                {c.offices.map((o) => (
                  <div key={o.id} className="mt-2">
                    <strong className="block text-white">{tr(o.name)}</strong>
                    <span className="block">{o.lines.map((l) => tr(l)).join(locale === 'ar' ? '، ' : ', ')}</span>
                    <OfficeEmails o={o} dark className="mt-1.5" />
                  </div>
                ))}
              </div>
            ))}
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>{t('footer.rights')}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOT_LINKS.legal.map(([to, l]) => (
              <li key={to}>
                <Link to={to} className="hover:text-white">
                  {tr(l)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}
