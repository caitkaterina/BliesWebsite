import { useState, type FormEvent, type ReactNode } from 'react'
import { MapPin, Info } from 'lucide-react'
import { CONTACT, Cta, OfficeEmails } from '../components/ui'
import { PageHero, QuoteBand } from '../components/sections'
import WorldMap, { MapLegend } from '../components/WorldMap'
import { MARKETS } from '../data/markets'
import { img } from '../lib/images'
import { useLocale } from '../lib/i18n'
import { Link } from '../lib/router'
import { ENQUIRY_IDLE, ENQUIRY_SAVED, useEnquirySubmission } from '../lib/enquiry'

export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-slate-body">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm font-medium text-red-700">{error}</p>}
    </div>
  )
}
export const inputCls = 'min-h-12 w-full border border-slate-400 bg-white px-4 py-3 text-base text-ink placeholder:text-slate-500 focus:border-royal'

export default function Contact() {
  const { locale, tr } = useLocale()
  const [sel, setSel] = useState<string | null>('jnb')
  const [err, setErr] = useState<Record<string, string>>({})
  const submission = useEnquirySubmission()
  const offices = MARKETS.filter((m) => m.kind === 'office')
  const mapId = (id: string) => (id === 'fourways' || id === 'sandton' ? 'jnb' : id)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submission.busy || submission.reference) return
    const f = new FormData(e.currentTarget)
    const n: Record<string, string> = {}
    if (!String(f.get('name') || '').trim()) n.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(String(f.get('email') || ''))) n.email = 'Enter a valid email address.'
    if (!String(f.get('message') || '').trim()) n.message = 'Tell us how we can help.'
    if (!f.get('consent')) n.consent = 'Consent is required.'
    setErr(n)
    if (Object.keys(n).length) return
    await submission.send('/contact', JSON.stringify({ locale, name: String(f.get('name') || '').trim(), email: String(f.get('email') || '').trim(), company: String(f.get('company') || '').trim(), message: String(f.get('message') || '').trim(), consent: true, website: String(f.get('website') || '') }))
  }

  return (
    <>
      <PageHero image={img.port(2000, 1100)} eyebrow={tr('Contact & locations')} title={tr('Talk to the team.')} intro={tr('Offices in South Africa, the United Arab Emirates and Gabon. Operating and sourcing markets are shown separately on the map.')} trail={[{ label: tr('Contact') }]} />

      <section className="container-x pt-20" aria-labelledby="director">
        <div className="bg-navy-900 p-8 text-white md:p-10">
          <p className="eyebrow text-sky">{tr('Company leadership')}</p>
          <h2 id="director" className="mt-4 text-2xl font-bold uppercase tracking-wide rtl:tracking-normal">{CONTACT.director.name}</h2>
          <p className="mt-1 font-semibold text-white/80">{tr(CONTACT.director.role)} — BLIES (Pty) Ltd</p>
          <dl className="mt-6 grid gap-5 text-[0.95rem] sm:grid-cols-3">
            <div><dt className="text-sm text-white/60">{tr('Phone')}</dt><dd className="mt-1"><a href={CONTACT.phoneHref} dir="ltr" className="font-semibold text-white underline-offset-2 hover:underline">{CONTACT.phone}</a></dd></div>
            <div><dt className="text-sm text-white/60">{tr('Email')}</dt><dd className="mt-1"><a href={`mailto:${CONTACT.director.emails[0]}`} dir="ltr" className="font-semibold text-white [overflow-wrap:anywhere] underline-offset-2 hover:underline">{CONTACT.director.emails[0]}</a></dd></div>
            <div><dt className="text-sm text-white/60">{tr('Additional email')}</dt><dd className="mt-1"><a href={`mailto:${CONTACT.director.emails[1]}`} dir="ltr" className="font-semibold text-white [overflow-wrap:anywhere] underline-offset-2 hover:underline">{CONTACT.director.emails[1]}</a></dd></div>
          </dl>
        </div>
      </section>

      <section className="container-x space-y-14 py-20" aria-label={tr('Office directory')}>
        {CONTACT.countries.map((c) => (
          <div key={c.country}>
            <h2 className="border-b border-line pb-3 text-sm font-bold uppercase tracking-[0.14em] text-navy-900 rtl:tracking-normal">
              {c.country === 'South Africa' ? tr('South Africa offices') : tr(c.country)}
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {c.offices.map((o) => (
                <li key={o.id} className="flex flex-col border border-line bg-white p-7">
                  <h3 className="text-xl font-bold text-navy-900">{tr(o.name)}</h3>
                  {o.company && o.company !== o.name && <p className="mt-1 font-semibold text-navy-900">{o.company}</p>}
                  <address className="mt-3 flex gap-3 not-italic leading-relaxed text-slate-body">
                    <MapPin aria-hidden className="mt-1 size-4 shrink-0" />
                    <span>{o.lines.map((l) => <bdi key={l} className="block">{tr(l)}</bdi>)}</span>
                  </address>
                  {o.emails.length > 0 && (
                    <div className="mt-5 border-t border-line pt-5 text-[0.95rem]"><OfficeEmails o={o} /></div>
                  )}
                  <button onClick={() => setSel(mapId(o.id))} className="mt-5 self-start text-sm font-semibold text-royal underline">{tr('Show on map')}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="bg-navy-950 py-16 text-white">
        <div className="container-x">
          <WorldMap variant="dark" markers={offices} kinds={['office']} selected={sel} onSelect={setSel} labels routes={false} highlightCountries className="aspect-[980/470] border border-white/10" title={tr('Map of BLIES office locations: South Africa, UAE and Gabon')} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <MapLegend kinds={['office']} />
            <p className="text-xs text-white/60">{tr('Offices only. Operating and sourcing markets are on the home and procurement pages.')}</p>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="display-soft text-3xl text-navy-900">{tr('Send a message')}</h2>
          <p className="mt-4 text-slate-body">{tr('For pricing, use the quote form so we receive complete specifications.')}</p>
          <div className="mt-6"><Cta to="/quote" variant="secondary">{tr('Request a quote')}</Cta></div>
        </div>
        <form onSubmit={submit} onChange={submission.resetAttempt} noValidate className="space-y-5" aria-describedby="form-note" aria-busy={submission.busy}>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <Field id="c-name" label={tr('Full name')} error={err.name ? tr(err.name) : undefined}>
            <input id="c-name" name="name" autoComplete="name" required maxLength={1000} disabled={submission.busy} aria-invalid={!!err.name} aria-describedby={err.name ? 'c-name-err' : undefined} className={inputCls} />
          </Field>
          <Field id="c-email" label={tr('Email')} error={err.email ? tr(err.email) : undefined}>
            <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} disabled={submission.busy} aria-invalid={!!err.email} aria-describedby={err.email ? 'c-email-err' : undefined} className={inputCls} />
          </Field>
          <Field id="c-co" label={tr('Company (optional)')}><input id="c-co" name="company" autoComplete="organization" maxLength={2000} disabled={submission.busy} className={inputCls} /></Field>
          <Field id="c-msg" label={tr('Message')} error={err.message ? tr(err.message) : undefined}>
            <textarea id="c-msg" name="message" rows={5} required maxLength={5000} disabled={submission.busy} aria-invalid={!!err.message} aria-describedby={err.message ? 'c-msg-err' : undefined} className={inputCls} />
          </Field>
          <div>
            <label className="flex items-start gap-3 text-sm text-navy-900"><input type="checkbox" name="consent" disabled={submission.busy} aria-required aria-invalid={!!err.consent} aria-describedby={err.consent ? 'c-consent-err' : undefined} className="mt-0.5 size-5 accent-[#1a62e6]" />{tr('I agree that BLIES may use these details to respond to this enquiry.')}</label>
            {err.consent && <p id="c-consent-err" role="alert" className="mt-1 text-sm font-medium text-red-700">{tr(err.consent)}</p>}
          </div>
          <button type="submit" disabled={submission.busy || !!submission.reference} className="inline-flex min-h-12 items-center bg-royal px-7 font-semibold text-white hover:bg-royal-dark disabled:opacity-60">{tr(submission.busy ? 'Submitting…' : 'Send message')}</button>
          <p id="form-note" className="flex items-start gap-2 text-sm text-slate-body" role={submission.failure ? 'alert' : 'status'}><Info aria-hidden className="mt-0.5 size-4 shrink-0 text-royal" />{submission.reference ? tr(ENQUIRY_SAVED, submission.reference) : tr(submission.failure || ENQUIRY_IDLE)}</p>
        </form>
      </section>
      <QuoteBand />
    </>
  )
}

export function Track() {
  const { locale, tr } = useLocale()
  const [err, setErr] = useState<Record<string, string>>({})
  const submission = useEnquirySubmission()
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submission.busy || submission.reference) return
    const f = new FormData(e.currentTarget)
    const n: Record<string, string> = {}
    if (!String(f.get('shipment') || '').trim()) n.shipment = 'Enter a shipment reference.'
    if (!String(f.get('company') || '').trim()) n.company = 'Enter your company name.'
    if (!String(f.get('name') || '').trim()) n.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(String(f.get('email') || ''))) n.email = 'Enter a valid email address.'
    if (!/^[+\d\s().-]{6,40}$/.test(String(f.get('phone') || '').trim())) n.phone = 'Enter a valid telephone number.'
    if (!f.get('consent')) n.consent = 'Consent is required.'
    setErr(n)
    if (Object.keys(n).length) return
    await submission.send('/tracking', JSON.stringify({ locale, shipment: String(f.get('shipment') || '').trim(), company: String(f.get('company') || '').trim(), name: String(f.get('name') || '').trim(), email: String(f.get('email') || '').trim(), phone: String(f.get('phone') || '').trim(), notes: String(f.get('notes') || '').trim(), consent: true, website: String(f.get('website') || '') }))
  }
  return (
    <>
      <PageHero image={img.truckRoad(2000, 1100)} eyebrow={tr('Shipment enquiry')} title={tr('Ask us where your cargo is.')} intro={tr('Send us your shipment reference and the team will reply with an update.')} trail={[{ label: tr('Track') }]} />
      <section className="container-x grid gap-8 py-20 lg:grid-cols-2">
        <div className="bg-mist p-8" aria-labelledby="live">
          <h2 id="live" className="text-xl font-bold text-navy-900">{tr('How shipment updates work')}</h2>
          <p className="mt-4 text-slate-body">{tr('Our team confirms the status of your cargo directly. Send your shipment reference and contact details and we will reply by email or phone.')}</p>
          <p className="mt-4 text-slate-body"><Link to="/account" className="font-semibold text-royal underline">{tr('Sign in to view your shipment records')}</Link></p>
          <p className="mt-4 text-slate-body">{tr('Phone:')} <a href={CONTACT.phoneHref} dir="ltr" className="font-semibold text-royal underline">{CONTACT.phone}</a></p>
        </div>
        <form onSubmit={submit} onChange={submission.resetAttempt} noValidate className="space-y-5 border border-line p-8" aria-labelledby="enq" aria-busy={submission.busy}>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <h2 id="enq" className="text-xl font-bold text-navy-900">{tr('Tracking enquiry')}</h2>
          {[['shipment', 'Shipment reference', 'text', ''], ['company', 'Company name', 'text', 'organization'], ['name', 'Contact name', 'text', 'name'], ['email', 'Email', 'email', 'email'], ['phone', 'Telephone', 'tel', 'tel']].map(([k, l, ty, ac]) => (
            <Field key={k} id={`t-${k}`} label={tr(l)} error={err[k] ? tr(err[k]) : undefined}>
              <input id={`t-${k}`} name={k} type={ty} autoComplete={ac || undefined} required maxLength={k === 'email' ? 254 : k === 'phone' ? 40 : 1000} disabled={submission.busy} aria-invalid={!!err[k]} aria-describedby={err[k] ? `t-${k}-err` : undefined} className={inputCls} />
            </Field>
          ))}
          <Field id="t-notes" label={tr('Notes (optional)')}><textarea id="t-notes" name="notes" rows={3} maxLength={2000} disabled={submission.busy} className={inputCls} /></Field>
          <div>
            <label className="flex items-start gap-3 text-sm text-navy-900"><input type="checkbox" name="consent" disabled={submission.busy} aria-required aria-invalid={!!err.consent} aria-describedby={err.consent ? 't-consent-err' : undefined} className="mt-0.5 size-5 accent-[#1a62e6]" />{tr('I agree that BLIES may use these details to respond to this enquiry.')}</label>
            {err.consent && <p id="t-consent-err" role="alert" className="mt-1 text-sm font-medium text-red-700">{tr(err.consent)}</p>}
          </div>
          <button type="submit" disabled={submission.busy || !!submission.reference} className="inline-flex min-h-12 items-center bg-royal px-7 font-semibold text-white hover:bg-royal-dark disabled:opacity-60">{tr(submission.busy ? 'Submitting…' : 'Submit enquiry')}</button>
          <p role={submission.failure ? 'alert' : 'status'} className="flex items-start gap-2 text-sm text-slate-body"><Info aria-hidden className="mt-0.5 size-4 shrink-0 text-royal" />{submission.reference ? tr(ENQUIRY_SAVED, submission.reference) : tr(submission.failure || ENQUIRY_IDLE)}</p>
        </form>
      </section>
      <QuoteBand />
    </>
  )
}
