export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public fields: string[] = [],
    public retryAfter?: number,
  ) {
    super(code)
    this.name = 'ApiError'
  }
}

export type ApiRequestOptions = RequestInit & { timeoutMs?: number; expectedStatus?: number }

/** Public deployment configuration only. Privileged credentials never belong in Vite variables. */
export function apiUrl(path: string) {
  const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')
  return `${base}/${path.replace(/^\/+/, '')}`
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { timeoutMs = 70000, expectedStatus, ...init } = options
  const headers = new Headers(init.headers)
  const method = (init.method || 'GET').toUpperCase()
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) headers.set('X-BLIES-CSRF', '1')
  headers.set('Accept', 'application/json')
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (init.signal?.aborted) controller.abort()
  init.signal?.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(apiUrl(path), {
      ...init,
      method,
      headers,
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })
    if (response.status === 204 && response.ok && (expectedStatus === undefined || expectedStatus === 204)) return undefined as T
    let data: Record<string, unknown> | null = null
    try { data = await response.json() } catch { /* HTML gateways and malformed bodies must not count as success. */ }
    if (!response.ok) {
      const fields = Array.isArray(data?.fields) ? data.fields.filter((field): field is string => typeof field === 'string') : []
      const retry = Number(response.headers.get('Retry-After'))
      throw new ApiError(response.status, typeof data?.code === 'string' ? data.code : `HTTP_${response.status}`, fields, retry > 0 ? retry : undefined)
    }
    if (!data || (expectedStatus !== undefined && response.status !== expectedStatus)) throw new ApiError(response.status, 'INVALID_RESPONSE')
    return data as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(0, controller.signal.aborted ? 'TIMEOUT' : 'NETWORK_ERROR')
  } finally {
    clearTimeout(timer)
    init.signal?.removeEventListener('abort', abort)
  }
}
