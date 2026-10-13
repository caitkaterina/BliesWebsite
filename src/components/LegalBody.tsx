import { Fragment, type ReactNode } from 'react'

const TOKEN = /(\*\*[^*]+\*\*|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\+27 63 240 0693)/g

function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i} className="font-semibold text-navy-900">{inline(part.slice(2, -2))}</strong>
    if (part.includes('@') && /^[^\s@]+@[^\s@]+$/.test(part)) return <a key={i} href={`mailto:${part}`} dir="ltr" className="font-semibold text-royal underline-offset-2 [overflow-wrap:anywhere] hover:underline">{part}</a>
    if (part === '+27 63 240 0693') return <a key={i} href="tel:+27632400693" dir="ltr" className="font-semibold text-royal underline-offset-2 hover:underline">{part}</a>
    return <Fragment key={i}>{part}</Fragment>
  })
}

/** Renders the supplied policy text: ## / ### headings, - and 1. lists, paragraphs with line breaks. */
export default function LegalBody({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  const lines = text.trim().split('\n')
  let i = 0
  let k = 0
  while (i < lines.length) {
    const l = lines[i].trimEnd()
    if (!l.trim()) { i++; continue }
    if (l.startsWith('### ')) { blocks.push(<h3 key={k++} className="!mt-8 text-lg font-bold text-navy-900">{l.slice(4)}</h3>); i++; continue }
    if (l.startsWith('## ')) { blocks.push(<h2 key={k++} className="!mt-12 text-2xl font-bold text-navy-900">{l.slice(3)}</h2>); i++; continue }
    if (l.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) items.push(lines[i++].slice(2))
      blocks.push(<ul key={k++} className="list-disc space-y-2 ps-6 marker:text-navy-900">{items.map((x) => <li key={x}>{inline(x)}</li>)}</ul>)
      continue
    }
    if (/^\d+\. /.test(l)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ''))
      blocks.push(<ol key={k++} className="list-decimal space-y-2 ps-6 marker:font-semibold marker:text-navy-900">{items.map((x) => <li key={x}>{inline(x)}</li>)}</ol>)
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |- |\d+\. )/.test(lines[i])) para.push(lines[i++].trimEnd())
    blocks.push(<p key={k++}>{para.map((x, j) => <Fragment key={j}>{j > 0 && <br />}{inline(x)}</Fragment>)}</p>)
  }
  return <>{blocks}</>
}
