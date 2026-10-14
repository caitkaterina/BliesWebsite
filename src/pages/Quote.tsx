import { resolveCategory } from '../content/categories'
import { useMemo, useRef, useState } from 'react'
import { Check, Info } from 'lucide-react'
import { Breadcrumb } from '../components/sections'
import { Field, inputCls } from './Contact'
import { ENQUIRY_SAVED, useEnquirySubmission } from '../lib/enquiry'
import { useLocale } from '../lib/i18n'

// Service ids and field names mirror the backend's quoteSchema (lib/validation.ts).
const SERVICES: [string, string][] = [
  ['procurement', 'Source a product'], ['equipment', 'Buy equipment'], ['road', 'Move cargo by road'], ['mining', 'Mining logistics'],
  ['cold', 'Refrigerated transport'], ['sea', 'Sea freight'], ['air', 'Air freight'], ['import', 'Import goods'],
  ['export', 'Export goods'], ['clearing', 'Customs clearing'], ['integrated', 'Full supply chain'], ['project', 'Project cargo'],
]
const STEPS = ['Service', 'Route', 'Cargo', 'Requirements', 'Schedule', 'Contact', 'Documents', 'Review']
type V = Record<string, string>
type F = { k: string; label: string; req?: boolean; type?: string; area?: boolean; hint?: string; auto?: string; cold?: boolean }

const FIELDS: Record<number, F[]> = {
  1: [
    { k: 'originCountry', label: 'Origin country', req: true }, { k: 'originCity', label: 'Origin city', req: true },
    { k: 'collection', label: 'Collection location', hint: 'Optional' },
    { k: 'destinationCountry', label: 'Destination country', req: true }, { k: 'destinationCity', label: 'Destination city', req: true },
    { k: 'crossBorder', label: 'Border crossings or routing notes', hint: 'Optional' },
  ],
  2: [
    { k: 'cargo', label: 'Cargo or product description', req: true, area: true, hint: 'Include specification and grade.' },
    { k: 'category', label: 'Product category', hint: 'Optional' },
    { k: 'quantity', label: 'Quantity', req: true, type: 'number' }, { k: 'unit', label: 'Unit of measurement', req: true, hint: 'e.g. tonnes, pallets, containers' },
    { k: 'weight', label: 'Weight (kg)', type: 'number', hint: 'Optional' }, { k: 'dimensions', label: 'Dimensions', hint: 'Optional' },
    { k: 'packaging', label: 'Packaging', hint: 'Optional' },
    { k: 'temperature', label: 'Required temperature range', req: true, cold: true, hint: 'Cold chain only. e.g. −18 °C to −15 °C' },
  ],
  3: [
    { k: 'requirements', label: 'Special requirements', area: true, hint: 'Optional' },
    { k: 'dangerous', label: 'Dangerous goods or restrictions', hint: 'Optional. State if any.' },
  ],
  4: [
    { k: 'date', label: 'Required date', type: 'date', hint: 'Optional' },
    { k: 'urgency', label: 'Urgency', req: true, hint: 'e.g. standard, urgent, flexible' },
  ],
  5: [
    { k: 'company', label: 'Company name', req: true, auto: 'organization' }, { k: 'name', label: 'Contact name', req: true, auto: 'name' },
    { k: 'email', label: 'Email', req: true, type: 'email', auto: 'email' }, { k: 'phone', label: 'Telephone', req: true, type: 'tel', auto: 'tel' },
    { k: 'notes', label: 'Notes', area: true, hint: 'Optional' },
  ],
}

export default function Quote() {
  const { locale, tr } = useLocale()
  const qs = useMemo(() => new URLSearchParams(window.location.hash.split('?')[1] || ''), [])
  const initial = qs.get('service')
  const [step, setStep] = useState(0)
  const [v, setV] = useState<V>({ service: SERVICES.some(([id]) => id === initial) ? initial! : '', category: resolveCategory(qs.get('category') || '')?.title ?? qs.get('category') ?? '', quantity: '1' })
  const [consent, setConsent] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [website, setWebsite] = useState('')
  const [err, setErr] = useState<V>({})
  const submission = useEnquirySubmission()
  const head = useRef<HTMLHeadingElement>(null)
  const cold = v.service === 'cold'
  const visible = (n: number) => (FIELDS[n] || []).filter((f) => !f.cold || cold)

  const validate = (target = step): V => {
    const n: V = {}
    if (target === 0 && !SERVICES.some(([id]) => id === v.service)) n.service = tr('Choose a service to continue.')
    visible(target).forEach((f) => {
      const val = (v[f.k] || '').trim()
      if (f.req && !val) n[f.k] = tr('{0} is required.', tr(f.label))
      else if (f.k === 'email' && val && (!/^\S+@\S+\.\S+$/.test(val) || val.length > 254)) n.email = tr('Enter a valid email address.')
      else if (f.k === 'phone' && val && !/^[+\d\s().-]{6,40}$/.test(val)) n.phone = tr('Enter a valid telephone number.')
      else if (f.k === 'quantity' && val && (!Number.isFinite(Number(val)) || Number(val) <= 0 || Number(val) > 1e12)) n.quantity = tr('Quantity must be greater than zero and no more than one trillion.')
      else if (f.k === 'weight' && val && (!Number.isFinite(Number(val)) || Number(val) <= 0 || Number(val) > 1e12)) n.weight = tr('Weight must be greater than zero and no more than one trillion.')
      else if (f.k === 'date' && val && (!/^\d{4}-\d{2}-\d{2}$/.test(val) || Number.isNaN(Date.parse(val)) || new Date(val).toISOString().slice(0, 10) !== val || val < new Date().toISOString().slice(0, 10))) n.date = tr('Choose a valid date that is not in the past.')
      else if (!['email', 'phone', 'date', 'quantity', 'weight'].includes(f.k) && val.length > (f.req ? 1000 : 2000)) n[f.k] = tr('This field is too long. Please shorten it.')
    })
    if (target === 6 && files.length > 3) n.files = tr('Choose no more than three documents.')
    else if (target === 6 && files.some((file) => !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size === 0)) n.files = tr('Choose non-empty PDF, JPG or PNG documents.')
    else if (target === 6 && files.reduce((size, file) => size + file.size, 0) > 2 * 1024 * 1024) n.files = tr('Documents must total no more than 2 MiB.')
    if (target === 7 && !consent) n.consent = tr('Consent is required to submit.')
    return n
  }
  const go = (to: number) => { setStep(to); setTimeout(() => head.current?.focus(), 0) }
  const next = () => { const n = validate(); setErr(n); if (!Object.keys(n).length) go(step + 1) }
  const submit = async () => {
    if (submission.busy || submission.reference) return
    // The final submit validates every step, including fields changed after reviewing a later step.
    for (let i = 0; i < STEPS.length; i++) {
      const n = validate(i)
      if (Object.keys(n).length) { setErr(n); go(i); return }
    }
    setErr({})
    const data = Object.fromEntries(Object.values(FIELDS).flat().map((field) => [field.k, (v[field.k] || '').trim()]))
    const body = new FormData()
    body.set('data', JSON.stringify({ ...data, service: v.service, locale, consent: true, website }))
    files.forEach((file) => body.append('files', file))
    await submission.send('/quotes', body)
  }

  const label = (k: string, translate = true) => (k === 'service' ? (translate ? tr(SERVICES.find(([id]) => id === v.service)?.[1] ?? '') : SERVICES.find(([id]) => id === v.service)?.[1]) : v[k]) || '—'
  const summary: [string, string][] = [
    ['Service', 'service'], ['Origin', 'originCity'], ['Destination', 'destinationCity'], ['Cargo', 'cargo'], ['Quantity', 'quantity'], ['Unit', 'unit'],
    ...(cold ? [['Temperature', 'temperature'] as [string, string]] : []), ['Required date', 'date'], ['Urgency', 'urgency'], ['Company', 'company'], ['Name', 'name'], ['Email', 'email'], ['Telephone', 'phone'],
  ]

  return (
    <>
      <section className="bg-navy-950 pb-12 pt-10 text-white">
        <div className="container-x">
          <Breadcrumb trail={[{ label: tr('Request a quote') }]} />
          <h1 className="display mt-6 text-[clamp(2.2rem,5vw,3.8rem)]">{tr('Request a quote')}</h1>
          <p className="mt-4 max-w-2xl text-white/80">{tr('72 hours to 5 business days, excluding weekends, subject to complete specifications, supplier availability, cargo requirements and other relevant factors.')}</p>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[16rem_1fr]">
        <nav aria-label={tr('Quote steps')}>
          <p className="mb-3 text-sm font-semibold text-navy-900 lg:hidden">{tr('Step {0} of {1}: {2}', step + 1, STEPS.length, tr(STEPS[step]))}</p>
          <div className="mb-4 h-1 bg-line lg:hidden"><div className="h-full bg-royal transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
          <ol className="hidden space-y-1 lg:block">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button onClick={() => i < step && go(i)} disabled={i > step || submission.busy} aria-current={i === step ? 'step' : undefined} className={`flex w-full items-center gap-3 px-3 py-2.5 text-start text-sm font-semibold ${i === step ? 'bg-navy-900 text-white' : i < step ? 'text-navy-900 hover:bg-mist' : 'text-slate-500'}`}>
                  <span className={`flex size-6 items-center justify-center text-xs ${i < step ? 'bg-royal text-white' : 'border border-current'}`}>{i < step ? <Check aria-hidden className="size-3.5" /> : i + 1}</span>
                  {tr(s)}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-2xl" aria-busy={submission.busy}>
          <input name="website" value={website} onChange={(e) => { submission.resetAttempt(); setWebsite(e.target.value) }} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <h2 ref={head} tabIndex={-1} className="text-2xl font-bold text-navy-900 outline-none">{tr(STEPS[step])}</h2>
          {Object.keys(err).length > 0 && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{tr('Please fix the highlighted fields.')}</p>}

          <div className="mt-6 space-y-5">
            {step === 0 && (
              <fieldset aria-describedby={err.service ? 'q-service-err' : undefined}>
                <legend className="sr-only">{tr('Service')}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SERVICES.map(([id, l]) => (
                    <label key={id} className={`flex min-h-14 cursor-pointer items-center gap-3 border px-4 text-[0.98rem] font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-royal ${v.service === id ? 'border-royal bg-royal/5 text-navy-900' : 'border-slate-300 text-ink hover:border-navy-900'}`}>
                      <input type="radio" name="service" value={id} checked={v.service === id} disabled={submission.busy} onChange={() => { submission.resetAttempt(); setV((p) => ({ ...p, service: id })) }} className="size-4 accent-[#1a62e6]" />
                      {tr(l)}
                    </label>
                  ))}
                </div>
                {err.service && <p id="q-service-err" role="alert" className="mt-2 text-sm font-medium text-red-700">{err.service}</p>}
              </fieldset>
            )}
            {visible(step).map((f) => {
              const p = { id: `q-${f.k}`, value: v[f.k] || '', disabled: submission.busy, onChange: (e: { target: { value: string } }) => { submission.resetAttempt(); setV((x) => ({ ...x, [f.k]: e.target.value })) }, 'aria-invalid': !!err[f.k], 'aria-describedby': err[f.k] ? `q-${f.k}-err` : f.hint ? `q-${f.k}-hint` : undefined, 'aria-required': f.req }
              return (
                <Field key={f.k} id={`q-${f.k}`} label={tr(f.label) + (f.req ? ' *' : '')} hint={f.hint ? tr(f.hint) : undefined} error={err[f.k]}>
                  {f.area ? <textarea {...p} rows={4} className={inputCls} /> : <input {...p} dir={locale === 'ar' && (f.type === 'number' || f.type === 'email' || f.type === 'tel' || f.type === 'date') ? 'ltr' : undefined} type={f.type || 'text'} min={f.type === 'number' ? 0 : undefined} autoComplete={f.auto} className={inputCls} />}
                </Field>
              )
            })}
            {step === 6 && (
              <>
                <p className="border border-line bg-mist p-5 text-sm text-slate-body">{tr('Attach up to three PDF, JPG or PNG documents, totalling no more than 2 MiB. Documents are private and checked before being saved.')}</p>
                <Field id="q-files" label={tr('Supporting documents (optional)')} error={err.files}>
                  <input id="q-files" type="file" accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" multiple disabled={submission.busy} onChange={(e) => { submission.resetAttempt(); setFiles(Array.from(e.target.files || [])); setErr({}) }} aria-invalid={!!err.files} aria-describedby={err.files ? 'q-files-err' : undefined} className={inputCls} />
                </Field>
                {files.length > 0 && <p className="text-sm text-slate-body">{tr('Selected documents: {0}', files.map((file) => file.name).join(', '))} <button type="button" onClick={() => { submission.resetAttempt(); setFiles([]); setErr({}) }} className="font-semibold text-royal underline">{tr('Remove documents')}</button></p>}
              </>
            )}
            {step === 7 && (
              <>
                <dl className="border-t border-line">
                  {summary.map(([l, k]) => (
                    <div key={k} className="flex justify-between gap-6 border-b border-line py-3 text-sm"><dt className="text-slate-body">{tr(l)}</dt><dd dir={locale === 'ar' && k === 'email' ? 'ltr' : undefined} className="text-end font-semibold text-navy-900">{label(k)}</dd></div>
                  ))}
                </dl>
                {files.length > 0 && <p className="text-sm text-slate-body">{tr('Selected documents: {0}', files.map((file) => file.name).join(', '))}</p>}
                <div>
                  <label className="flex items-start gap-3 text-sm text-navy-900">
                    <input type="checkbox" checked={consent} disabled={submission.busy} onChange={(e) => { submission.resetAttempt(); setConsent(e.target.checked) }} aria-required aria-invalid={!!err.consent} aria-describedby={err.consent ? 'q-consent-err' : undefined} className="mt-0.5 size-5 accent-[#1a62e6]" />
                    {tr('I agree that BLIES may use these details to respond to this request.')}
                  </label>
                  {err.consent && <p id="q-consent-err" role="alert" className="mt-1 text-sm font-medium text-red-700">{err.consent}</p>}
                </div>
                {submission.reference && (
                  <p role="status" className="border-s-4 border-navy-900 bg-mist p-4 text-sm text-navy-900">{tr(ENQUIRY_SAVED, submission.reference)}</p>
                )}
                {submission.failure && <p role="alert" className="border-s-4 border-red-700 bg-mist p-4 text-sm text-red-700">{tr(submission.failure)}</p>}
              </>
            )}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button onClick={() => go(step - 1)} disabled={step === 0 || submission.busy} className="min-h-12 border border-navy-900 px-6 font-semibold text-navy-900 disabled:opacity-40">{tr('Back')}</button>
            {step < 7 ? (
              <button onClick={next} disabled={submission.busy} className="min-h-12 bg-royal px-8 font-semibold text-white hover:bg-royal-dark">{tr('Continue')}</button>
            ) : (
              <button onClick={submit} disabled={submission.busy || !!submission.reference} className="min-h-12 bg-royal px-8 font-semibold text-white hover:bg-royal-dark disabled:opacity-60">{submission.busy ? tr('Submitting…') : tr('Submit request')}</button>
            )}
          </div>
          <p className="mt-6 flex items-start gap-2 text-xs text-slate-body"><Info aria-hidden className="mt-0.5 size-4 shrink-0" />{tr('Turnaround is an estimate, not a commitment.')}</p>
        </div>
      </div>
    </>
  )
}
