import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, ChevronRight, Radar } from 'lucide-react'
import { Arrow, Badge, Cta, Eyebrow, Photo, type Tag } from './ui'
import { useLocale, useReducedMotion } from '../lib/i18n'
import { Link } from '../lib/router'
import { img } from '../lib/images'

export function Breadcrumb({ trail }: { trail: { to?: string; label: string }[] }) {
  const { tr } = useLocale()
  return (
    <nav aria-label={tr('Breadcrumb')} className="text-xs font-medium text-white/70">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/" className="hover:text-white">{tr('Home')}</Link>
        </li>
        {trail.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            <ChevronRight aria-hidden className="size-3 rtl:rotate-180" />
            {c.to && i < trail.length - 1 ? (
              <Link to={c.to} className="hover:text-white">{c.label}</Link>
            ) : (
              <span aria-current="page" className="text-white">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHero({
  image,
  pos,
  eyebrow,
  title,
  intro,
  trail,
  tags,
  children,
  tint = '',
}: {
  image: string
  pos?: string
  eyebrow: string
  title: ReactNode
  intro: string
  trail: { to?: string; label: string }[]
  tags?: Tag[]
  children?: ReactNode
  tint?: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <img src={image} alt="" aria-hidden className="absolute inset-0 -z-20 size-full object-cover" style={{ objectPosition: pos }} />
      <div aria-hidden className={`absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/10 rtl:bg-gradient-to-l ${tint}`} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-navy-950/60 to-transparent" />
      <div className="container-x relative flex min-h-[28rem] flex-col justify-end gap-6 pb-14 pt-12 md:min-h-[34rem]">
        <Breadcrumb trail={trail} />
        <div className="max-w-3xl">
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 className="display mt-5 text-[clamp(2.3rem,6vw,4.6rem)]">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{intro}</p>
          {tags && tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 [&_span]:backdrop-blur-sm">
              {tags.map((t) => (
                <Badge key={t} tag={t} />
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function ImageCopy({
  image,
  alt,
  pos,
  eyebrow,
  title,
  children,
  reverse = false,
  dark = false,
}: {
  image: string
  alt: string
  pos?: string
  eyebrow?: string
  title: string
  children: ReactNode
  reverse?: boolean
  dark?: boolean
}) {
  return (
    <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <Photo src={image} alt={alt} pos={pos} className="aspect-[4/3] w-full" />
      <div>
        {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
        <h2 className={`display mt-4 text-[clamp(1.7rem,3.4vw,2.6rem)] ${dark ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
        <div className={`mt-5 space-y-4 text-[1.05rem] leading-relaxed ${dark ? 'text-white/75' : 'text-slate-body'}`}>{children}</div>
      </div>
    </div>
  )
}

export function CheckList({ items, dark = false, cols = false }: { items: string[]; dark?: boolean; cols?: boolean }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${cols ? 'sm:grid-cols-2' : ''}`}>
      {items.map((i) => (
        <li key={i} className={`flex gap-3 text-[0.98rem] leading-snug ${dark ? 'text-white/85' : 'text-ink'}`}>
          <Check aria-hidden className={`mt-0.5 size-4 shrink-0 ${dark ? 'text-sky' : 'text-royal'}`} strokeWidth={3} />
          {i}
        </li>
      ))}
    </ul>
  )
}

const STEPS = [
  ['source', 'Identify and compare suppliers against your specification.'],
  ['procure', 'Quotations, negotiation of price, quantity and lead time.'],
  ['inspect', 'Specification, quantity and pre-shipment quality checks.'],
  ['document', 'Invoices, packing lists, certificates and permits as required.'],
  ['clear', 'Customs coordination through the clearing-agent network.'],
  ['move', 'Owned road transport; sea and air through freight partners.'],
  ['deliver', 'Final-delivery verification and hand-over.'],
] as const

export function Journey({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const { t, tr } = useLocale()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLOListElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (reduced) return setSeen(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.3 })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [reduced])
  return (
    <ol ref={ref} className="relative grid gap-8 md:grid-cols-7 md:gap-0">
      <span aria-hidden className={`absolute start-[1.1rem] top-2 bottom-2 w-px md:inset-x-[7%] md:bottom-auto md:top-[1.4rem] md:h-px md:w-auto ${dark ? 'bg-white/20' : 'bg-line'}`} />
      <span
        aria-hidden
        className="absolute start-[1.1rem] top-2 bottom-2 w-px origin-top bg-royal transition-transform duration-[1600ms] ease-out md:inset-x-[7%] md:bottom-auto md:top-[1.4rem] md:h-px md:w-auto md:origin-left rtl:md:origin-right"
        style={{ transform: seen ? 'scale(1)' : 'scale(0)' }}
      />
      {STEPS.map(([k, d], i) => (
        <li key={k} className="relative flex gap-4 md:flex-col md:items-center md:gap-4 md:px-2 md:text-center">
          <span
            className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-colors duration-500 ${
              dark ? 'border-sky bg-navy-900 text-sky' : 'border-royal bg-white text-royal'
            }`}
            style={{ transitionDelay: reduced ? '0ms' : `${i * 200}ms` }}
          >
            {i + 1}
          </span>
          <div>
            <p className={`eyebrow !text-[0.8rem] ${dark ? 'text-white' : 'text-navy-900'}`}>{t(`journey.${k}`)}</p>
            {!compact && <p className={`mt-1.5 text-sm leading-snug md:mx-auto md:max-w-[10rem] ${dark ? 'text-white/65' : 'text-slate-body'}`}>{tr(d)}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function QuoteBand() {
  const { t, tr } = useLocale()
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <img src={img.port(1600, 700)} alt="" aria-hidden loading="lazy" className="absolute inset-0 -z-20 size-full object-cover opacity-40" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/50 rtl:bg-gradient-to-l" />
      <div className="container-x grid items-center gap-10 py-20 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Eyebrow dark>{t('cta.quote')}</Eyebrow>
          <h2 className="display mt-5 text-[clamp(2.2rem,5vw,3.8rem)]">{t('quote.band.title')}</h2>
          <p className="mt-5 max-w-xl text-lg text-white/85">{t('quote.band.turnaround')}</p>
          <p className="mt-2 max-w-xl text-sm text-white/60">{t('quote.band.disclaimer')}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Cta to="/quote" variant="light" className="!min-h-14 px-8">
            {t('cta.quote')}
          </Cta>
          <Cta to="/contact" variant="outline-light" className="!min-h-14">
            {tr('Talk to the team')}
          </Cta>
        </div>
      </div>
    </section>
  )
}

export function TrackStrip() {
  const { tr } = useLocale()
  return (
    <section className="border-y border-line bg-mist">
      <div className="container-x flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center bg-navy-900 text-white">
            <Radar aria-hidden className="size-6" />
          </span>
          <div>
            <p className="eyebrow text-royal">{tr('Shipment enquiry')}</p>
            <h2 className="display mt-1 text-2xl text-navy-900">{tr('Need an update on your cargo?')}</h2>
            <p className="mt-1 text-sm text-slate-body">{tr('Submit an enquiry and our team will respond.')}</p>
          </div>
        </div>
        <Cta to="/tracking">{tr('Submit a tracking enquiry')}</Cta>
      </div>
    </section>
  )
}

export function PillarGrid({ items }: { items: { icon: ReactNode; title: string; body: string }[] }) {
  return (
    <ul className="grid divide-line border-y border-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4 rtl:sm:divide-x-reverse">
      {items.map((i) => (
        <li key={i.title} className="p-7">
          <span className="text-royal">{i.icon}</span>
          <h3 className="mt-4 text-base font-bold uppercase tracking-wide text-navy-900 rtl:tracking-normal">{i.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-body">{i.body}</p>
        </li>
      ))}
    </ul>
  )
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 min-h-8 text-[0.95rem] font-semibold text-navy-900 underline-offset-4 transition-colors hover:text-royal hover:underline">
      {children}
      <Arrow />
    </Link>
  )
}
