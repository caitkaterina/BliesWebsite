import { useEffect } from 'react'
import { LocaleProvider, useLocale } from './lib/i18n'
import { useRoute } from './lib/router'
import { Layout } from './components/Shell'
import Home from './pages/Home'
import ServicePage from './pages/ServicePage'
import { CategoryDetail, ProcurementCategories, ProcurementOverview, SourcingMarkets } from './pages/Procurement'
import { About, GlobalNetwork, OurFuture, IndustriesIndex, Legal, LogisticsOverview, NotFound } from './pages/Company'
import Contact, { Track } from './pages/Contact'
import Quote from './pages/Quote'
import { byPath } from './content/services'

function Page({ path }: { path: string }) {
  const p = path.replace(/\/$/, '') || '/'
  if (byPath[p]) return <ServicePage s={byPath[p]} />
  if (p.startsWith('/procurement/categories/')) return <CategoryDetail id={p.slice(24)} />
  if (p.startsWith('/legal/')) return <Legal slug={p.slice(7)} />
  switch (p) {
    case '/': return <Home />
    case '/about': return <About />
    case '/network': return <GlobalNetwork />
    case '/future': return <OurFuture />
    case '/procurement': return <ProcurementOverview />
    case '/procurement/categories': return <ProcurementCategories />
    case '/procurement/markets': return <SourcingMarkets />
    case '/logistics': return <LogisticsOverview />
    case '/industries': return <IndustriesIndex />
    case '/tracking': return <Track />
    case '/quote': return <Quote key={window.location.hash} />
    case '/contact': return <Contact />
    default: return <NotFound />
  }
}

function DocumentMeta({ path }: { path: string }) {
  const { locale, t } = useLocale()
  useEffect(() => {
    const id = setTimeout(() => {
      const el = document.querySelector('h1')?.cloneNode(true) as HTMLElement | undefined
      el?.querySelectorAll('br').forEach((b) => b.replaceWith(' '))
      const h1 = el?.textContent?.replace(/\s+/g, ' ').trim()
      document.title = h1 ? `${h1} | BLIES (Pty) Ltd` : 'BLIES (Pty) Ltd'
      let m = document.querySelector('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m) }
      m.setAttribute('content', t('meta.description'))
    }, 50)
    return () => clearTimeout(id)
  }, [locale, path, t])
  return null
}

export default function App() {
  const { locale, path } = useRoute()
  return (
    <LocaleProvider locale={locale}>
      <DocumentMeta path={path} />
      <Layout>
        <Page path={path} />
      </Layout>
    </LocaleProvider>
  )
}
