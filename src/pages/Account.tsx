import { useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { Eyebrow, Cta } from '../components/ui'
import { Field, inputCls } from './Contact'
import { apiRequest, apiUrl, ApiError } from '../lib/api'
import { useLocale } from '../lib/i18n'

type Customer = { id: string; email: string; name: string }
type CustomerRecord = {
  id: string
  kind: string
  status: string
  created: string
  data: Record<string, unknown>
  documents: { id: string; name: string; type: string }[]
}
type Shipment = {
  id: string
  reference: string
  status: string
  created: string
  updated: string
  events: { id: string; status: string; location: string; description: string; created: string }[]
}
type AuthResponse = { user?: Customer; ok?: boolean }
type AuthView = 'login' | 'register' | 'recover' | 'reset'
type InitialSession = { user: Customer | null; recovery: boolean; message: string }

const buttonCls = 'inline-flex min-h-12 items-center justify-center bg-royal px-7 font-semibold text-white hover:bg-royal-dark disabled:cursor-wait disabled:opacity-60'
const textButtonCls = 'min-h-11 text-sm font-semibold text-royal underline-offset-2 hover:underline disabled:opacity-60'
const dataLabels: Record<string, string> = {
  name: 'Full name', email: 'Email', company: 'Company', phone: 'Telephone',
  service: 'Service', originCountry: 'Origin country', originCity: 'Origin city', collection: 'Collection address',
  destinationCountry: 'Destination country', destinationCity: 'Destination city', crossBorder: 'Cross-border requirements',
  cargo: 'Cargo', category: 'Category', quantity: 'Quantity', unit: 'Unit', weight: 'Weight', dimensions: 'Dimensions',
  packaging: 'Packaging', temperature: 'Temperature', requirements: 'Requirements', dangerous: 'Dangerous goods',
  date: 'Requested date', urgency: 'Urgency', notes: 'Notes', message: 'Message', shipment: 'Shipment reference',
}
const statusLabels: Record<string, string> = {
  received: 'Received', assigned: 'Assigned', reviewing: 'Under review', 'in-review': 'Under review', responded: 'Responded', quoted: 'Quoted', closed: 'Closed',
  pending: 'Pending', processing: 'Processing', collected: 'Collected', in_transit: 'In transit',
  customs: 'Customs', delivered: 'Delivered', delayed: 'Delayed', cancelled: 'Cancelled',
}
const kindLabels: Record<string, string> = { contact: 'Contact enquiry', quote: 'Quotation request', tracking: 'Shipment enquiry' }
const serviceLabels: Record<string, string> = {
  procurement: 'Source a product', equipment: 'Buy equipment', road: 'Move cargo by road', mining: 'Mining logistics',
  cold: 'Refrigerated transport', sea: 'Sea freight', air: 'Air freight', import: 'Import goods',
  export: 'Export goods', clearing: 'Customs clearing', integrated: 'Full supply chain', project: 'Project cargo',
}

function postAuth(body: Record<string, string>) {
  return apiRequest<AuthResponse>('/customer/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

function errorMessage(error: unknown, login = false) {
  if (!(error instanceof ApiError)) return 'The request could not be completed. Please try again.'
  if (error.status === 429) return 'Too many attempts. Please wait before trying again.'
  if (error.status === 401) return login ? 'Email or password is incorrect, or your email has not been confirmed.' : 'Your session has expired. Please sign in again.'
  if (error.status === 403) return 'This action is not permitted. Please sign in again or contact BLIES.'
  if (error.status === 400 || error.status === 422) return 'Check the information entered and try again.'
  if (error.code === 'TIMEOUT') return 'The request timed out. Please try again.'
  if (error.code === 'NETWORK_ERROR') return 'Unable to reach BLIES. Check your connection and try again.'
  if (error.status >= 500) return 'The account service is temporarily unavailable. Please try again later.'
  return 'The request could not be completed. Please try again.'
}

async function initialSession(): Promise<InitialSession> {
  const url = new URL(window.location.href)
  const tokenHash = url.searchParams.get('token_hash')
  const verificationType = url.searchParams.get('type')
  let message = ''
  let recovery = false
  if (tokenHash) {
    // A verification hash is single-use. Remove it from browser history before the network request.
    url.searchParams.delete('token_hash')
    url.searchParams.delete('type')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    if (!verificationType || !['signup', 'email', 'recovery', 'email_change'].includes(verificationType)) {
      return { user: null, recovery: false, message: 'This verification link is invalid or has expired. Request a new email.' }
    }
    try {
      await postAuth({ action: 'verify', token_hash: tokenHash, type: verificationType })
      recovery = verificationType === 'recovery'
      message = recovery ? 'Recovery link verified. Set your new password below.' : 'Your email has been confirmed.'
    } catch (failure) {
      const unavailable = failure instanceof ApiError && (failure.status === 0 || failure.status === 429 || failure.status >= 500)
      return { user: null, recovery: false, message: unavailable ? errorMessage(failure) : 'This verification link is invalid or has expired. Request a new email.' }
    }
  }
  const session = await apiRequest<{ user: Customer | null }>('/customer/session')
  let user = session.user
  // Expired access cookies can be restored with the server-only refresh cookie.
  if (!user) {
    try { user = (await postAuth({ action: 'refresh' })).user || null }
    catch (error) { if (!(error instanceof ApiError) || error.status !== 401) throw error }
  }
  return { user, recovery: recovery && !!user, message }
}

export default function Account() {
  const { locale, tr } = useLocale()
  const [user, setUser] = useState<Customer | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')
  const [view, setView] = useState<AuthView>('login')
  const [pending, setPending] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [records, setRecords] = useState<CustomerRecord[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState('')
  const [reload, setReload] = useState(0)
  const [reference, setReference] = useState('')
  const [filter, setFilter] = useState('')
  const initialization = useRef<Promise<InitialSession> | null>(null)
  const refreshRequest = useRef<Promise<AuthResponse> | null>(null)

  const applySession = useCallback((session: InitialSession) => {
    setUser(session.user)
    setMessage(session.message)
    if (session.recovery) setView('reset')
    setSessionError('')
    setSessionLoading(false)
  }, [])

  useEffect(() => {
    let active = true
    // StrictMode replays effects; share this promise to avoid consuming an email link twice.
    initialization.current ||= initialSession()
    initialization.current.then((session) => { if (active) applySession(session) }).catch((failure) => {
      if (active) { setSessionError(errorMessage(failure)); setSessionLoading(false) }
    })
    return () => { active = false }
  }, [applySession])

  const refreshSession = useCallback(async () => {
    refreshRequest.current ||= postAuth({ action: 'refresh' })
    try { await refreshRequest.current }
    catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) {
        setUser(null); setView('login'); setError('Your session has expired. Please sign in again.')
      }
      throw failure
    } finally { refreshRequest.current = null }
  }, [])

  const protectedRequest = useCallback(async <T,>(path: string): Promise<T> => {
    try { return await apiRequest<T>(path) }
    catch (failure) {
      if (!(failure instanceof ApiError) || failure.status !== 401) throw failure
      await refreshSession()
      return apiRequest<T>(path)
    }
  }, [refreshSession])

  const protectedAuth = async (body: Record<string, string>) => {
    try { return await postAuth(body) }
    catch (failure) {
      if (!(failure instanceof ApiError) || failure.status !== 401) throw failure
      await refreshSession()
      return postAuth(body)
    }
  }

  useEffect(() => {
    if (!user || view === 'reset') return
    let active = true
    setDataLoading(true)
    setDataError('')
    Promise.all([
      protectedRequest<{ records: CustomerRecord[] }>('/customer/records'),
      protectedRequest<{ shipments: Shipment[] }>(`/customer/shipments${filter ? `?reference=${encodeURIComponent(filter)}` : ''}`),
    ]).then(([requests, history]) => {
      if (!Array.isArray(requests.records) || !Array.isArray(history.shipments)) throw new ApiError(200, 'INVALID_RESPONSE')
      if (active) { setRecords(requests.records); setShipments(history.shipments) }
    }).catch((failure) => { if (active) setDataError(errorMessage(failure)) })
      .finally(() => { if (active) setDataLoading(false) })
    return () => { active = false }
  }, [user?.id, view, reload, filter, protectedRequest])

  const chooseView = (next: AuthView) => {
    setView(next); setFields({}); setError(''); setMessage('')
  }

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    const name = String(data.get('name') || '').trim()
    const validation: Record<string, string> = {}
    if (view !== 'reset' && !/^\S+@\S+\.\S+$/.test(email)) validation.email = 'Enter a valid email address.'
    if ((view === 'register' || view === 'reset') && (password.length < 12 || password.length > 128)) validation.password = 'Use a password with 12 to 128 characters.'
    if (view === 'login' && !password) validation.password = 'Enter your password.'
    if (view === 'register' && (!name || name.length > 200)) validation.name = 'Enter your name, up to 200 characters.'
    if ((view === 'register' || view === 'reset') && password !== String(data.get('confirm') || '')) validation.confirm = 'Passwords must match.'
    setFields(validation); setError(''); setMessage('')
    if (Object.keys(validation).length) return
    const action = view === 'reset' ? 'password' : view
    setPending(action)
    try {
      const body = { action, ...(view !== 'reset' ? { email } : {}), ...(view !== 'recover' ? { password } : {}), ...(view === 'register' ? { name } : {}) }
      const response = await (view === 'reset' ? protectedAuth(body) : postAuth(body))
      if (view === 'login') {
        const customer = response.user || (await apiRequest<{ user: Customer | null }>('/customer/session')).user
        if (!customer) throw new ApiError(401, 'SESSION_MISSING')
        setRecords([]); setShipments([]); setUser(customer); setView('login'); form.reset()
      } else if (view === 'register') {
        form.reset()
        setMessage('Registration request received. Check your email for the next step.')
      } else if (view === 'recover') {
        form.reset()
        setMessage('Recovery request received. If an account matches that address, check your email.')
      } else {
        form.reset(); setView('login'); setMessage('Your password has been updated.')
      }
    } catch (failure) { setError(errorMessage(failure, view === 'login')) }
    finally { setPending('') }
  }

  const signOut = async () => {
    if (pending) return
    setPending('logout'); setError(''); setMessage('')
    try {
      await postAuth({ action: 'logout' })
      setUser(null); setRecords([]); setShipments([]); setView('login'); setMessage('You have been signed out.')
    } catch (failure) {
      setError(errorMessage(failure))
      // Logout can clear cookies even when the provider cannot confirm revocation.
      // Recheck local access without rotating a refresh cookie or claiming success.
      try {
        const session = await apiRequest<{ user: Customer | null }>('/customer/session')
        if (!session.user) { setUser(null); setRecords([]); setShipments([]); setView('login') }
      } catch { /* The original logout failure remains visible. */ }
    }
    finally { setPending('') }
  }

  const downloadDocument = async (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    if (pending) return
    setPending(`document:${id}`); setError('')
    try {
      const documentPath = `/customer/documents/${encodeURIComponent(id)}`
      const response = await protectedRequest<{ url: string }>(`${documentPath}?format=json`)
      if (typeof response.url !== 'string') throw new ApiError(200, 'INVALID_RESPONSE')
      const target = new URL(response.url, window.location.origin)
      const localDownload = target.origin === window.location.origin && target.pathname === `/api${documentPath}`
      const privateStorage = target.protocol === 'https:' && /^[a-z0-9-]+\.supabase\.co$/.test(target.hostname) && target.pathname.startsWith('/storage/v1/object/sign/blies-private/')
      if (!localDownload && !privateStorage) throw new ApiError(200, 'INVALID_RESPONSE')
      window.location.assign(target.href)
    } catch (failure) { setError(errorMessage(failure)) }
    finally { setPending('') }
  }

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    const name = String(new FormData(event.currentTarget).get('name') || '').trim()
    if (!name || name.length > 200) { setFields({ profile: 'Enter your name, up to 200 characters.' }); return }
    setPending('profile'); setFields({}); setError(''); setMessage('')
    try {
      const response = await protectedAuth({ action: 'profile', name })
      if (!response.user) throw new ApiError(200, 'INVALID_RESPONSE')
      setUser(response.user); setMessage('Your profile has been updated.')
    } catch (failure) { setError(errorMessage(failure)) }
    finally { setPending('') }
  }

  const retrySession = async () => {
    setSessionLoading(true); setSessionError('')
    try { applySession(await initialSession()) }
    catch (failure) { setSessionError(errorMessage(failure)); setSessionLoading(false) }
  }

  const date = (value: string) => {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(parsed)
  }
  const status = (value: string) => tr(statusLabels[value] || value)
  const authTitle = view === 'register' ? 'Create your account' : view === 'recover' ? 'Recover your account' : view === 'reset' ? 'Set a new password' : 'Sign in'

  return (
    <section className="container-x py-20">
      <Eyebrow>{tr('My BLIES account')}</Eyebrow>
      <h1 className="display-soft mt-4 text-[clamp(2.2rem,5vw,4rem)] text-navy-900">{tr('Your requests and shipments.')}</h1>
      <p className="mt-5 max-w-2xl text-lg text-slate-body">{tr('Sign in to view your own requests, private documents and shipment updates.')}</p>

      {sessionLoading ? <p role="status" className="mt-10 text-slate-body">{tr('Checking your session…')}</p> : sessionError ? (
        <div className="mt-10 space-y-4 border border-line p-8">
          <p role="alert" className="text-red-700">{tr(sessionError)}</p>
          <button type="button" onClick={retrySession} className={buttonCls}>{tr('Try again')}</button>
        </div>
      ) : (
        <>
          {message && <p role="status" className="mt-8 border border-line bg-mist p-4 text-slate-body">{tr(message)}</p>}
          {error && <p role="alert" className="mt-8 border border-red-300 p-4 text-red-700">{tr(error)}</p>}
          {!user || view === 'reset' ? (
            <div className="mt-10 max-w-xl border border-line p-6 sm:p-8">
              <h2 className="text-xl font-bold text-navy-900">{tr(authTitle)}</h2>
              <form key={view} onSubmit={submitAuth} noValidate className="mt-6 space-y-5" aria-label={tr(authTitle)}>
                {view === 'register' && <Field id="a-name" label={tr('Full name')} error={fields.name ? tr(fields.name) : undefined}>
                  <input id="a-name" name="name" autoComplete="name" maxLength={200} required className={inputCls} aria-invalid={!!fields.name} aria-describedby={fields.name ? 'a-name-err' : undefined} />
                </Field>}
                {view !== 'reset' && <Field id="a-email" label={tr('Email')} error={fields.email ? tr(fields.email) : undefined}>
                  <input id="a-email" name="email" type="email" autoComplete="email" maxLength={254} required className={inputCls} aria-invalid={!!fields.email} aria-describedby={fields.email ? 'a-email-err' : undefined} />
                </Field>}
                {view !== 'recover' && <Field id="a-password" label={tr(view === 'reset' ? 'New password' : 'Password')} hint={view !== 'login' ? tr('Use a password with 12 to 128 characters.') : undefined} error={fields.password ? tr(fields.password) : undefined}>
                  <input id="a-password" name="password" type="password" autoComplete={view === 'login' ? 'current-password' : 'new-password'} maxLength={128} required className={inputCls} aria-invalid={!!fields.password} aria-describedby={fields.password ? 'a-password-err' : view !== 'login' ? 'a-password-hint' : undefined} />
                </Field>}
                {(view === 'register' || view === 'reset') && <Field id="a-confirm" label={tr('Confirm password')} error={fields.confirm ? tr(fields.confirm) : undefined}>
                  <input id="a-confirm" name="confirm" type="password" autoComplete="new-password" maxLength={128} required className={inputCls} aria-invalid={!!fields.confirm} aria-describedby={fields.confirm ? 'a-confirm-err' : undefined} />
                </Field>}
                <button type="submit" disabled={!!pending} className={buttonCls}>{tr(pending ? 'Please wait…' : view === 'recover' ? 'Send recovery email' : view === 'reset' ? 'Update password' : authTitle)}</button>
              </form>
              {view !== 'reset' && <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
                {view !== 'login' && <button type="button" disabled={!!pending} className={textButtonCls} onClick={() => chooseView('login')}>{tr('Sign in')}</button>}
                {view !== 'register' && <button type="button" disabled={!!pending} className={textButtonCls} onClick={() => chooseView('register')}>{tr('Create an account')}</button>}
                {view !== 'recover' && <button type="button" disabled={!!pending} className={textButtonCls} onClick={() => chooseView('recover')}>{tr('Forgot your password?')}</button>}
              </div>}
              {view === 'reset' && <button type="button" disabled={!!pending} className={`mt-5 ${textButtonCls}`} onClick={signOut}>{tr('Sign out')}</button>}
            </div>
          ) : (
            <div className="mt-10 space-y-10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
                <div><h2 className="text-xl font-bold text-navy-900">{user.name || user.email}</h2><p className="mt-1 text-sm text-slate-body"><bdi>{user.email}</bdi></p></div>
                <button type="button" disabled={!!pending} onClick={signOut} className={textButtonCls}>{tr(pending === 'logout' ? 'Please wait…' : 'Sign out')}</button>
              </div>

              <section aria-labelledby="account-requests">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 id="account-requests" className="display-soft text-3xl text-navy-900">{tr('Your requests')}</h2>
                  <button type="button" disabled={dataLoading} onClick={() => setReload((value) => value + 1)} className={textButtonCls}>{tr('Refresh records')}</button>
                </div>
                {dataLoading ? <p role="status" className="mt-5 text-slate-body">{tr('Loading your records…')}</p> : dataError ? <p role="alert" className="mt-5 text-red-700">{tr(dataError)}</p> : records.length === 0 ? (
                  <p className="mt-5 text-slate-body">{tr('No requests are linked to your account yet. Submit a new request while signed in.')}</p>
                ) : <ul className="mt-6 space-y-5">{records.map((record) => (
                  <li key={record.id} className="border border-line p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div><h3 className="text-lg font-bold text-navy-900">{tr(kindLabels[record.kind] || record.kind)}</h3><p className="mt-1 text-sm text-slate-body"><bdi>{record.id}</bdi></p></div>
                      <p className="text-sm font-semibold text-royal">{status(record.status)}</p>
                    </div>
                    <p className="mt-3 text-sm text-slate-body"><time dateTime={record.created}>{date(record.created)}</time></p>
                    <details className="mt-5 border-t border-line pt-4"><summary className="cursor-pointer text-sm font-semibold text-navy-900">{tr('View request details')}</summary>
                      <dl className="mt-4 grid gap-4 sm:grid-cols-2">{Object.entries(record.data || {}).filter(([key, value]) => dataLabels[key] && value !== '' && value !== null && value !== undefined).map(([key, value]) => (
                        <div key={key}><dt className="text-sm font-semibold text-navy-900">{tr(dataLabels[key])}</dt><dd className="mt-1 whitespace-pre-wrap text-sm text-slate-body [overflow-wrap:anywhere]">{key === 'service' ? tr(serviceLabels[String(value)] || String(value)) : String(value)}</dd></div>
                      ))}</dl>
                    </details>
                    {record.documents?.length > 0 && <div className="mt-5 border-t border-line pt-4"><h4 className="text-sm font-semibold text-navy-900">{tr('Private documents')}</h4><ul className="mt-2 space-y-2">{record.documents.map((document) => (
                      <li key={document.id}><a href={apiUrl(`/customer/documents/${encodeURIComponent(document.id)}`)} onClick={(event) => downloadDocument(event, document.id)} aria-disabled={!!pending} className="inline-flex min-h-11 items-center text-sm font-semibold text-royal underline-offset-2 hover:underline">{tr(pending === `document:${document.id}` ? 'Please wait…' : 'Download document')}: <bdi className="ms-1 [overflow-wrap:anywhere]">{document.name}</bdi></a></li>
                    ))}</ul></div>}
                  </li>
                ))}</ul>}
                <div className="mt-6 flex flex-wrap gap-3"><Cta to="/quote">{tr('Request a quote')}</Cta><Cta to="/contact" variant="secondary">{tr('Contact BLIES')}</Cta></div>
              </section>

              <section aria-labelledby="account-shipments" className="border-t border-line pt-10">
                <h2 id="account-shipments" className="display-soft text-3xl text-navy-900">{tr('Your shipments')}</h2>
                <form onSubmit={(event) => { event.preventDefault(); setFilter(reference.trim()) }} className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
                  <div className="w-full sm:max-w-sm"><Field id="a-reference" label={tr('Shipment reference (optional)')}><input id="a-reference" value={reference} onChange={(event) => setReference(event.target.value)} maxLength={200} className={inputCls} /></Field></div>
                  <button type="submit" disabled={dataLoading} className={buttonCls}>{tr('Find shipment')}</button>
                  {filter && <button type="button" disabled={dataLoading} onClick={() => { setReference(''); setFilter('') }} className={textButtonCls}>{tr('Show all shipments')}</button>}
                </form>
                {!dataLoading && !dataError && (shipments.length === 0 ? <p className="mt-5 text-slate-body">{tr('No shipments match your account and reference.')}</p> : <ul className="mt-6 space-y-5">{shipments.map((shipment) => (
                  <li key={shipment.id} className="border border-line p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold text-navy-900"><bdi>{shipment.reference}</bdi></h3><p className="text-sm font-semibold text-royal">{status(shipment.status)}</p></div>
                    <p className="mt-3 text-sm text-slate-body">{tr('Last updated')}: <time dateTime={shipment.updated}>{date(shipment.updated)}</time></p>
                    <h4 className="mt-5 text-sm font-semibold text-navy-900">{tr('Shipment history')}</h4>
                    {shipment.events?.length ? <ol className="mt-3 space-y-4 border-s border-line ps-5">{shipment.events.map((event) => <li key={event.id}>
                      <p className="text-sm font-semibold text-navy-900">{status(event.status)}{event.location ? ` · ${event.location}` : ''}</p>
                      <p className="mt-1 text-xs text-slate-body"><time dateTime={event.created}>{date(event.created)}</time></p>
                      {event.description && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-body">{event.description}</p>}
                    </li>)}</ol> : <p className="mt-3 text-sm text-slate-body">{tr('No shipment events have been recorded yet.')}</p>}
                  </li>
                ))}</ul>)}
              </section>

              <section aria-labelledby="account-profile" className="border-t border-line pt-10">
                <h2 id="account-profile" className="display-soft text-3xl text-navy-900">{tr('Your profile')}</h2>
                <form onSubmit={updateProfile} className="mt-6 max-w-xl space-y-5">
                  <Field id="a-profile" label={tr('Full name')} error={fields.profile ? tr(fields.profile) : undefined}><input key={user.name} id="a-profile" name="name" autoComplete="name" defaultValue={user.name} maxLength={200} required className={inputCls} aria-invalid={!!fields.profile} aria-describedby={fields.profile ? 'a-profile-err' : undefined} /></Field>
                  <p className="text-sm text-slate-body">{tr('Your verified email identifies your account. Contact BLIES if you need help with existing requests.')}</p>
                  <button type="submit" disabled={!!pending} className={buttonCls}>{tr(pending === 'profile' ? 'Please wait…' : 'Save profile')}</button>
                </form>
                <button type="button" disabled={!!pending} className={`mt-5 ${textButtonCls}`} onClick={() => chooseView('reset')}>{tr('Change password')}</button>
              </section>
            </div>
          )}
        </>
      )}
    </section>
  )
}
