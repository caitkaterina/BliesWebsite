import { useState } from 'react'
import { Cta, Photo, SectionHead, Badge } from '../components/ui'
import { CheckList, ImageCopy, Journey, PageHero, QuoteBand, TextLink } from '../components/sections'
import WorldMap, { MapLegend } from '../components/WorldMap'
import { KIND_LABEL, MARKETS, type MarketKind } from '../data/markets'
import { img } from '../lib/images'
import { CATEGORIES, SOURCING_MARKETS, TURNAROUND, categoryById } from '../content/categories'
import { Link } from '../lib/router'
import { NotFound } from './Company'
import { useLocale } from '../lib/i18n'

export function ProcurementOverview() {
  const { tr } = useLocale()
  return (
    <>
      <PageHero
        image={img.machinery(2000, 1100)}
        eyebrow={tr("Pillar 01 · Procurement & Global Sourcing")}
        title={tr("Sourcing, verified before it ships.")}
        intro={tr("We identify and compare suppliers, negotiate quotations, inspect product and prepare export, so you buy against a specification rather than a promise.")}
        trail={[{ label: tr('Procurement') }]}
      >
        <Cta to="/quote?service=procurement" variant="light">{tr("Source a product")}</Cta>
        <Cta to="/procurement/categories" variant="outline-light">{tr("Product categories")}</Cta>
      </PageHero>

      <section className="container-x py-20">
        <SectionHead soft eyebrow={tr("How procurement works")} title={tr("One team from supplier to delivery.")} body={tr("Procurement and logistics are equal pillars at BLIES. The sourcing work below is coordinated with documentation, clearance and transport.")} />
        <div className="mt-12"><Journey /></div>
      </section>

      <section className="bg-mist py-20">
        <div className="container-x space-y-20">
          <ImageCopy image={img.gears(1200, 900)} alt={tr("Engineering components and gears")} eyebrow={tr("Technical procurement")} title={tr("Specification first.")}>
            <p>{tr("You give us the specification, quantity, packaging and destination. We identify suppliers, compare quotations and negotiate price, quantity and lead time.")}</p>
            <CheckList items={['Supplier identification and verification', 'Multi-quote comparison', 'Negotiation of price, quantity and lead time', 'Specification and quantity checks'].map((x) => tr(x))} />
          </ImageCopy>
          <ImageCopy image={img.ppeWorker(1200, 900)} alt={tr("Worker wearing protective equipment")} eyebrow={tr("Inspection & export")} title={tr("Checked, then prepared for export.")} reverse>
            <p>{tr("Quality-control checks and pre-shipment inspection happen before cargo moves. Documentation and export preparation follow, ready for clearing and transport.")}</p>
            <TextLink to="/services/quality">{tr("Quality control")}</TextLink>
          </ImageCopy>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-line p-8">
          <div>
            <h2 className="display-soft text-2xl text-navy-900">{tr("Where we source from")}</h2>
            <p className="mt-2 max-w-xl text-slate-body">{tr("Sourcing markets are places we buy from. They are not BLIES offices.")}</p>
          </div>
          <Cta to="/procurement/markets" variant="secondary">{tr("View sourcing markets")}</Cta>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}


export function ProcurementCategories() {
  const { tr } = useLocale()
  return (
    <>
      <PageHero image={img.shelving(2000, 1100)} eyebrow={tr("Procurement · Categories")} title={tr("What we source.")} intro={tr("Eight category areas, each handled through the same verified process. Open a category for its scope and to request a quote.")} trail={[{ to: '/procurement', label: tr('Procurement') }, { label: tr('Categories') }]}>
        <Cta to="/quote?service=procurement" variant="light">{tr("Request a quote")}</Cta>
      </PageHero>
      <section className="container-x py-20">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="bg-white">
              <Link to={`/procurement/categories/${c.id}`} aria-label={tr("{0}: view category", tr(c.title))} className="group block">
                <Photo src={c.image(900, 600)} alt="" className="aspect-[3/2]" />
              </Link>
              <div className="p-6">
                <h2 className="text-lg font-bold text-navy-900"><Link to={`/procurement/categories/${c.id}`} className="hover:text-royal">{tr(c.title)}</Link></h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-body">{tr(c.short)}</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  <TextLink to={`/procurement/categories/${c.id}`}>{tr("View category")}</TextLink>
                  <TextLink to={`/quote?service=procurement&category=${c.id}`}>{tr("Quote this")}</TextLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 border-s-4 border-royal bg-mist p-6 text-slate-body">
          <strong className="text-navy-900">{tr("FMCG is a procurement category; cold chain is a logistics service.")}</strong> {tr("Refrigerated transport for meat, seafood, dairy, produce and frozen product is quoted separately under")}{' '}
          <Link to="/logistics/cold-chain" className="font-semibold text-royal underline">{tr("Cold chain")}</Link>.
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

export function SourcingMarkets() {
  const { tr } = useLocale()
  const [sel, setSel] = useState<string | null>(null)
  const kinds: MarketKind[] = ['sourcing', 'gateway', 'office']
  const list = MARKETS.filter((m) => kinds.includes(m.kind))
  const cur = list.find((m) => m.id === sel)
  return (
    <>
      <PageHero image={img.port(2000, 1100)} eyebrow={tr("Procurement · Sourcing markets")} title={tr("Where we buy from.")} intro={tr("China, India, Türkiye and Singapore, with freight gateways and BLIES offices shown for context.")} trail={[{ to: '/procurement', label: tr('Procurement') }, { label: tr('Sourcing markets') }]} />
      <section className="bg-navy-950 py-20 text-white">
        <div className="container-x grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <WorldMap variant="dark" viewBox="200 60 900 420" markers={list} kinds={kinds} selected={sel} onSelect={setSel} labels className="aspect-[900/420] border border-white/10" />
            <div className="mt-4"><MapLegend kinds={kinds} /></div>
            <p className="mt-3 text-xs text-white/60">{tr("Route lines are illustrative and do not show tracked shipments.")}</p>
          </div>
          <div aria-live="polite">
            <SectionHead dark soft title={cur ? tr(cur.name) : tr('Select a market')} />
            {cur ? (
              <div className="mt-4 space-y-4 text-white/80">
                <Badge tag={cur.kind === 'office' ? 'office' : cur.kind === 'gateway' ? 'gateway' : 'sourcing'} />
                <p>{tr(cur.text)}</p>
              </div>
            ) : (
              <p className="mt-4 text-white/70">{tr("Choose a marker to see how BLIES relates to it.")}</p>
            )}
            <ul className="mt-8 space-y-2 border-t border-white/15 pt-6 text-sm text-white/80">
              {list.map((m) => (
                <li key={m.id}>
                  <button onClick={() => setSel(m.id)} className="flex w-full justify-between py-1 text-start hover:text-sky">
                    <span>{tr(m.name)}</span>
                    <span className="text-white/50">{tr(KIND_LABEL[m.kind])}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="container-x py-12">
        <p className="bg-mist p-5 text-navy-900"><strong>{tr("Markets are not offices.")}</strong> {tr("BLIES has offices in South Africa (Fourways and Atrium on 5th, Sandton), Dubai and Gabon. Sourcing markets and gateways are places we buy from or ship through.")}</p>
      </section>
      <QuoteBand />
    </>
  )
}

export function CategoryDetail({ id }: { id: string }) {
  const { tr } = useLocale()
  const c = categoryById(id)
  if (!c) return <NotFound />
  const others = CATEGORIES.filter((o) => o.id !== c.id)
  return (
    <>
      <PageHero image={c.image(2000, 1100)} eyebrow={tr("Procurement · Category")} title={tr(c.title)} intro={tr(c.intro)} trail={[{ to: '/procurement', label: tr('Procurement') }, { to: '/procurement/categories', label: tr('Categories') }, { label: tr(c.title) }]}>
        <Cta to={`/quote?service=procurement&category=${c.id}`} variant="light">{tr("Request a quote for this category")}</Cta>
        <Cta to="/procurement/categories" variant="outline-light">{tr("All categories")}</Cta>
      </PageHero>
      <section className="container-x grid gap-12 py-20 lg:grid-cols-2">
        <div>
          <SectionHead soft eyebrow={tr("Scope")} title={tr("What we handle")} />
          <div className="mt-6"><CheckList items={c.scope.map((x) => tr(x))} /></div>
          <p className="mt-8 text-slate-body"><strong className="text-navy-900">{tr("Sourcing markets:")}</strong> {tr(SOURCING_MARKETS)} <Link to="/procurement/markets" className="font-semibold text-royal underline">{tr("View sourcing markets")}</Link></p>
        </div>
        <div className="bg-mist p-8">
          <h2 className="text-xl font-bold text-navy-900">{tr("What to include in your quote request")}</h2>
          <div className="mt-5"><CheckList items={c.specs.map((x) => tr(x))} /></div>
          <p className="mt-6 text-sm text-slate-body"><strong className="text-navy-900">{tr("Quotation turnaround:")}</strong> {tr(TURNAROUND)}</p>
          <div className="mt-6"><Cta to={`/quote?service=procurement&category=${c.id}`}>{tr("Request a quote")}</Cta></div>
        </div>
      </section>
      <section className="border-t border-line bg-white py-14">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-navy-900">{tr("Related")}</h2>
            <ul className="mt-4 space-y-2">{c.related.map((r) => <li key={r.to}><TextLink to={r.to}>{tr(r.label)}</TextLink></li>)}</ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900">{tr("Other categories")}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">{others.map((o) => <li key={o.id}><Link to={`/procurement/categories/${o.id}`} className="text-slate-body hover:text-royal hover:underline">{tr(o.title)}</Link></li>)}</ul>
          </div>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}
