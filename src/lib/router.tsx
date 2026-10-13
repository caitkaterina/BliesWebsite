import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { useLocale, type Locale } from './i18n'

// Minimal hash router that mirrors the live app's /en /fr /ar locale URL pattern: #/en/logistics/road
// In the Next.js integration, replace with next/link + the existing [locale] segment.
export interface Route {
  locale: Locale
  path: string
}

const parse = (): Route => {
  const raw = window.location.hash.replace(/^#/, '') || '/en'
  const parts = raw.split('?')[0].split('/').filter(Boolean)
  const first = parts[0]
  const locale: Locale = first === 'fr' || first === 'ar' || first === 'en' ? first : 'en'
  const rest = first === 'fr' || first === 'ar' || first === 'en' ? parts.slice(1) : parts
  return { locale, path: '/' + rest.join('/') }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => {
      setRoute(parse())
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export const hrefFor = (locale: Locale, to: string) => `#/${locale}${to === '/' ? '' : to}`

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  children: ReactNode
}
export function Link({ to, children, ...rest }: LinkProps) {
  const { locale } = useLocale()
  return (
    <a href={hrefFor(locale, to)} {...rest}>
      {children}
    </a>
  )
}
