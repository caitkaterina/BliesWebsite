import type { IncomingMessage, ServerResponse } from 'node:http'
const permitted = /^\/api\/(?:contact|quotes|tracking|health|customer\/(?:auth|session|records|shipments|documents\/[a-f0-9-]{36}))$/
export async function proxyRequest(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Cache-Control', 'private, no-store')
  const incoming = new URL(req.url || '/', 'http://frontend.invalid')
  if (!permitted.test(incoming.pathname) || !['GET', 'POST', 'OPTIONS'].includes(req.method || '')) {
    res.statusCode = 404; res.end(JSON.stringify({ error: 'Not found' })); return
  }
  const configured = process.env.BLIES_BACKEND_URL
  let base: URL
  try {
    base = new URL(configured || '')
    if (base.username || base.password || base.search || base.hash || base.pathname !== '/' || (base.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && base.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(base.hostname)))) throw Error()
  } catch {
    res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: 'Backend connection is not configured', code: 'BACKEND_UNAVAILABLE' })); return
  }
  const chunks: Buffer[] = []; let size = 0
  const parsed = Object.prototype.hasOwnProperty.call(req, 'body') ? (req as IncomingMessage & {body?: unknown}).body : undefined
  if (parsed !== undefined) {
    const bytes = Buffer.isBuffer(parsed) ? parsed : typeof parsed === 'string' ? Buffer.from(parsed) : (req.headers['content-type'] || '').includes('application/json') ? Buffer.from(JSON.stringify(parsed)) : null
    if (!bytes) { res.statusCode = 400; res.end(JSON.stringify({error:'Unsupported request body'})); return }
    size = bytes.length; chunks.push(bytes)
  }
  if (size > 3 * 1024 * 1024) {res.statusCode = 413; res.end(JSON.stringify({error:'Request too large'})); return}
  if (parsed === undefined) for await (const chunk of req) {
    const bytes = Buffer.from(chunk); size += bytes.length
    if (size > 3 * 1024 * 1024) { res.statusCode = 413; res.end(JSON.stringify({ error: 'Request too large' })); return }
    chunks.push(bytes)
  }
  const headers = new Headers()
  for (const name of ['content-type', 'origin', 'idempotency-key', 'x-blies-csrf']) {
    const value = req.headers[name]; if (typeof value === 'string') headers.set(name, value)
  }
  const customerCookies = (req.headers.cookie || '').split(';').map(c => c.trim()).filter(c => /^blies_customer_(?:access|refresh)=/.test(c)).join('; ')
  if (customerCookies) headers.set('cookie', customerCookies)
  try {
    const upstream = await fetch(new URL(incoming.pathname + incoming.search, base), {
      method: req.method, headers, body: ['GET', 'OPTIONS'].includes(req.method || '') ? undefined : new Uint8Array(Buffer.concat(chunks)),
      redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(60000),
    })
    res.statusCode = upstream.status
    for (const name of ['content-type', 'content-disposition', 'location', 'retry-after', 'x-content-type-options', 'referrer-policy', 'access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers', 'vary']) {
      const value = upstream.headers.get(name); if (value) res.setHeader(name, value)
    }
    const cookies = upstream.headers.getSetCookie()
    if (cookies.length) res.setHeader('Set-Cookie', cookies)
    res.end(Buffer.from(await upstream.arrayBuffer()))
  } catch {
    res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: 'Backend connection is unavailable. Retry with the same submission details.', code: 'BACKEND_UNAVAILABLE' }))
  }
}
