export const ENQUIRY_EMAIL = 'mavoula@blies.co.za'

export const ENQUIRY_IDLE = 'Submitting opens your email application with your message ready to send to BLIES.'
export const ENQUIRY_OPENED = 'Your email application should now be open with your message ready. Your message has not been sent until you press Send there. If nothing opened, please email mavoula@blies.co.za directly.'

/** Opens the visitor's email client with the enquiry pre-filled. No success is claimed: the visitor sends it. */
export function openEnquiryEmail(subject: string, fields: [string, string | null | undefined][]) {
  const body = fields.filter(([, v]) => v && String(v).trim()).map(([k, v]) => `${k}: ${String(v).trim()}`).join('\n')
  window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
