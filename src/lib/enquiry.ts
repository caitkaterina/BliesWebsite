import { useRef, useState } from 'react'
import { ApiError, apiRequest } from './api'

export const ENQUIRY_IDLE = 'Your enquiry will be securely saved for the BLIES team.'
export const ENQUIRY_SAVED = 'Your enquiry has been saved. Reference: {0}.'

export function enquiryError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'TIMEOUT' || error.code === 'NETWORK_ERROR' || error.code === 'INVALID_RESPONSE') return 'We could not confirm whether your enquiry was saved. Retry with the same details to avoid duplicates.'
    if (error.status === 429) return 'Too many requests. Please wait before trying again.'
    if (error.status === 422 || error.status === 400) return 'Please check your details and documents, then try again.'
    if (error.status === 413) return 'The request is too large. Documents must total no more than 2 MiB.'
    if (error.status === 403) return 'This request is not permitted. Please contact BLIES directly.'
  }
  return 'The service is currently unavailable. Please try again later or contact BLIES directly.'
}

/** Keep the same idempotency key across uncertain retries; a payload edit starts a new attempt. */
export function useEnquirySubmission() {
  const attempt = useRef<string | null>(null)
  const payload = useRef<string | null>(null)
  const sending = useRef(false)
  const [busy, setBusy] = useState(false)
  const [reference, setReference] = useState('')
  const [failure, setFailure] = useState('')
  const resetAttempt = () => {
    if (sending.current) return
    attempt.current = null
    payload.current = null
    setReference('')
    setFailure('')
  }
  const send = async (path: string, body: string | FormData) => {
    if (sending.current || reference) return false
    sending.current = true
    setBusy(true)
    setFailure('')
    try {
      const currentPayload = typeof body === 'string' ? body : JSON.stringify(Array.from(body.entries()).map(([key, value]) => [key, typeof value === 'string' ? value : [value.name, value.size, value.type, value.lastModified]]))
      if (payload.current !== currentPayload) attempt.current = null
      payload.current = currentPayload
      attempt.current ||= crypto.randomUUID()
      const headers: Record<string, string> = { 'Idempotency-Key': attempt.current }
      if (typeof body === 'string') headers['Content-Type'] = 'application/json'
      const data = await apiRequest<{ received?: boolean; reference?: string }>(path, { method: 'POST', headers, body, expectedStatus: 201 })
      if (data.received !== true || typeof data.reference !== 'string' || !/^BLIES-[QCT]-\d{8}-[A-F0-9]{8}$/.test(data.reference)) throw new ApiError(201, 'INVALID_RESPONSE')
      setReference(data.reference)
      attempt.current = null
      payload.current = null
      return true
    } catch (error) {
      setFailure(enquiryError(error))
      return false
    } finally {
      sending.current = false
      setBusy(false)
    }
  }
  return { busy, reference, failure, send, resetAttempt }
}
