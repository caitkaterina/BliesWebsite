import type { ReactNode } from 'react'
import { ArrowRight, Construction, Plane, Ship, Truck } from 'lucide-react'
import logoZa from '../assets/blies-logo.jpg'
import logoGa from '../assets/blies-logo-gabon.jpg'
import logoAe from '../assets/blies-logo-uae.jpg'
import { Link } from '../lib/router'
import { useLocale } from '../lib/i18n'

export interface OfficeInfo {
  id: 'fourways' | 'sandton' | 'dxb' | 'lbv'
  name: string
  company?: string
  lines: string[]
  emails: string[]
}
export interface CountryOffices {
  country: string
  offices: OfficeInfo[]
}

export const CONTACT = {
  company: 'BLIES (PTY) LTD',
  phone: '+27 63 240 0693',
  phoneHref: 'tel:+27632400693',
  director: {
    name: 'Chantelle Mavoula',
    role: 'Director',
    emails: ['mavoula@blies.co.za', 'mcmavoula@outlook.co.za'],
  },
  countries: [
    {
      country: 'South Africa',
      offices: [
        {
          id: 'fourways',
          name: 'Fourways',
          company: 'BLIES (Pty) Ltd',
          lines: ['1 Prism Business Park', 'Ruby Close', 'Fourways 2055', 'Johannesburg, South Africa'],
          emails: [],
        },
        {
          id: 'sandton',
          name: 'Atrium on 5th, Sandton',
          company: 'Atrium on 5th',
          lines: ['Atrium on 5th', 'Sandton, Johannesburg', 'South Africa'],
          emails: ['dediguelaclaudia@gmail.com'],
        },
      ],
    },
    {
      country: 'United Arab Emirates',
      offices: [{ id: 'dxb', name: 'Dubai Office', lines: ['8th Floor, Trade Centre', 'Sheikh Zayed Road', 'Dubai, UAE'], emails: [] }],
    },
    {
      country: 'Gabon',
      offices: [{ id: 'lbv', name: 'Gabon Office', lines: ['Bel Air, Carrefour Machete', 'Gabon'], emails: [] }],
    },
  ] as CountryOffices[],
}

export const ALL_OFFICES = CONTACT.countries.flatMap((c) => c.offices)

/** Director phone and both emails as tel: / mailto: links. */
export function DirectorContact({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const link = dark ? 'text-white underline-offset-2 hover:underline' : 'text-royal underline-offset-2 hover:underline'
  return (
    <div className={`space-y-1.5 ${className}`}>
      <a href={CONTACT.phoneHref} dir="ltr" className={`block font-semibold ${link}`}>{CONTACT.phone}</a>
      {CONTACT.director.emails.map((e) => (
        <a key={e} href={`mailto:${e}`} dir="ltr" className={`block [overflow-wrap:anywhere] ${link}`}>{e}</a>
      ))}
    </div>
  )
}

/** Office emails only. Emails wrap so they never truncate on mobile. */
export function OfficeEmails({ o, className = '', dark = false }: { o: OfficeInfo; className?: string; dark?: boolean }) {
  const link = dark ? 'text-white underline-offset-2 hover:underline' : 'text-royal underline-offset-2 hover:underline'
  if (o.emails.length === 0) return null
  return (
    <div className={`space-y-1.5 ${className}`}>
      {o.emails.map((e) => (
        <a key={e} href={`mailto:${e}`} dir="ltr" className={`block [overflow-wrap:anywhere] ${link}`}>{e}</a>
      ))}
    </div>
  )
}

/** One locale-aware mapping: en = South Africa, fr = Gabon, ar = UAE. All three files share the same 1600x800 canvas and artwork bounds. */
const LOGOS = {
  en: { src: logoZa, alt: 'BLIES (Pty) Ltd, South Africa' },
  fr: { src: logoGa, alt: 'BLIES (Pty) Ltd, Gabon' },
  ar: { src: logoAe, alt: 'BLIES (Pty) Ltd, UAE' },
} as const

/** Supplied logo, cropped to its artwork bounds (source JPEG has large white margins). Do not redesign. */
export function Logo({ className = 'w-36' }: { className?: string }) {
  const { locale, tr } = useLocale()
  const logo = LOGOS[locale]
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ aspectRatio: '1480 / 430' }}
      dir="ltr"
    >
      <img
        key={locale}
        src={logo.src}
        alt={tr(logo.alt)}
        className="absolute max-w-none"
        style={{ width: `${(1600 / 1480) * 100}%`, insetInlineStart: `${(-95 / 1480) * 100}%`, top: `${(-185 / 430) * 100}%` }}
      />
    </span>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return <ArrowRight aria-hidden className={`size-4 shrink-0 rtl:-scale-x-100 ${className}`} />
}

type Variant = 'primary' | 'secondary' | 'ghost-dark' | 'light' | 'outline-light'
const variants: Record<Variant, string> = {
  primary: 'bg-navy-900 text-white hover:bg-royal active:bg-royal-dark',
  secondary: 'bg-mist text-navy-900 hover:bg-navy-900 hover:text-white active:bg-navy-950',
  'ghost-dark': 'text-navy-900 hover:text-royal',
  light: 'bg-white text-navy-900 hover:bg-sky hover:text-navy-950',
  'outline-light': 'bg-white/10 text-white hover:bg-white hover:text-navy-900',
}

export function Cta({
  to,
  href,
  variant = 'primary',
  children,
  arrow = true,
  className = '',
  onClick,
}: {
  to?: string
  href?: string
  variant?: Variant
  children: ReactNode
  arrow?: boolean
  className?: string
  onClick?: () => void
}) {
  const cls = `inline-flex min-h-12 items-center justify-center gap-2.5 px-6 text-[0.95rem] font-semibold rounded-sm max-w-full py-2 text-center sm:whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${variants[variant]} ${className}`
  const inner = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  )
  if (href) return <a href={href} className={cls} onClick={onClick}>{inner}</a>
  return <Link to={to ?? '/'} className={cls} onClick={onClick}>{inner}</Link>
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${dark ? 'text-sky' : 'text-royal'}`}>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  )
}

export function SectionHead({
  eyebrow,
  title,
  body,
  dark = false,
  soft = false,
  className = '',
}: {
  eyebrow?: string
  title: ReactNode
  body?: ReactNode
  dark?: boolean
  soft?: boolean
  className?: string
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2 className={`${soft ? 'display-soft' : 'display'} mt-4 text-[clamp(1.9rem,4vw,3.1rem)] ${dark ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {body && <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-white/75' : 'text-slate-body'}`}>{body}</p>}
    </div>
  )
}

export type Tag = 'owned' | 'partner' | 'future' | 'office' | 'operating' | 'sourcing' | 'gateway' | 'planned'
const tagLabel: Record<Tag, string> = {
  owned: 'Owned road fleet',
  partner: 'Partner-coordinated',
  future: 'Future development',
  office: 'BLIES office',
  operating: 'Operating market',
  sourcing: 'Sourcing market',
  gateway: 'Freight gateway',
  planned: 'Planned — not owned',
}
export function Badge({ tag, label, className = '' }: { tag: Tag; label?: string; className?: string }) {
  const { t, tr } = useLocale()
  const l = label ?? (tag === 'owned' ? t('owned.label') : tag === 'partner' ? t('partner.label') : tag === 'future' ? t('future.label') : tr(tagLabel[tag]))
  return (
    <span className={`inline-flex items-center text-sm font-medium opacity-75 ${className}`}>
      {l}
    </span>
  )
}

export function Photo({
  src,
  alt,
  className = '',
  pos = 'center',
  tint = false,
  children,
}: {
  src: string
  alt: string
  className?: string
  pos?: string
  tint?: boolean
  children?: ReactNode
}) {
  return (
    <div className={`relative overflow-hidden bg-navy-800 ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="size-full object-cover" style={{ objectPosition: pos }} />
      {tint && <div aria-hidden className="absolute inset-0 bg-navy-900/25 mix-blend-multiply" />}
      {children}
    </div>
  )
}

export function ModeIcon({ mode, className = 'size-5' }: { mode: 'sea' | 'air' | 'road' | 'mine'; className?: string }) {
  const I = mode === 'sea' ? Ship : mode === 'air' ? Plane : mode === 'road' ? Truck : Construction
  return <I aria-hidden className={className} />
}
