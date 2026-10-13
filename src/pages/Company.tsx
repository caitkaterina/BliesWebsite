import { useState } from 'react'
import { AlertTriangle, Compass, FileCheck2, Handshake, Layers, ShieldCheck } from 'lucide-react'
import { useLocale } from '../lib/i18n'
import { Badge, CONTACT, Cta, Photo, SectionHead, type Tag } from '../components/ui'
import { CheckList, ImageCopy, Journey, PageHero, PillarGrid, QuoteBand, TextLink, TrackStrip } from '../components/sections'
import LegalBody from '../components/LegalBody'
import { LEGAL_DATES, LEGAL_TEXT } from '../content/legal'
import { LEGAL_DATES_FR, LEGAL_TEXT_FR } from '../content/legal.fr'
import { LEGAL_DATES_AR, LEGAL_TEXT_AR } from '../content/legal.ar'
import { img } from '../lib/images'
import { Link } from '../lib/router'
import WorldMap, { MapLegend } from '../components/WorldMap'
import { KIND_LABEL, MARKETS, type MarketKind } from '../data/markets'
import { CAPABILITIES, CLEARING_NETWORK, CORRIDORS, FUTURE_PLANS, GATEWAYS, INLAND_POINTS, OPERATING_COUNTRIES, SOURCING_MARKET_LIST, WHY_BLIES } from '../content/profile'

const LOGI: { to: string; title: string; body: string; image: string; tag: Tag }[] = [
  { to: '/logistics/road', title: 'Road transport', body: 'Owned road fleet with GPS and route monitoring.', image: img.truckBlue(900, 600), tag: 'owned' },
  { to: '/logistics/mining', title: 'Mining & bulk', body: 'Side-tipper haulage for bulk minerals.', image: img.mining(900, 600), tag: 'owned' },
  { to: '/logistics/cold-chain', title: 'Cold chain', body: 'Multi-temperature refrigerated trucks.', image: img.truckWhite(900, 600), tag: 'owned' },
  { to: '/logistics/project-cargo', title: 'General & project cargo', body: 'Industrial, project and oversized loads.', image: img.warehouse2(900, 600), tag: 'owned' },
  { to: '/logistics/cross-border', title: 'Cross-border Africa', body: 'Regional trucking including routes reaching the DRC.', image: img.truckRoad(900, 600), tag: 'owned' },
  { to: '/logistics/sea', title: 'Sea freight', body: 'FCL, LCL, project and breakbulk through partners.', image: img.ship(900, 600), tag: 'partner' },
  { to: '/logistics/air', title: 'Air freight', body: 'Urgent and high-value cargo through carriers.', image: img.plane(900, 600), tag: 'partner' },
]

export function LogisticsOverview() {
  const { tr } = useLocale()
  return (
    <>
      <PageHero image={img.truckBlue(2000, 1100)} pos="60% center" eyebrow={tr('Pillar 02 · Logistics & Transport')} title={tr('Our own trucks. Partner-coordinated sea and air.')} intro={tr("Road transport runs on BLIES' owned fleet. Sea and air freight are arranged through external freight and carrier partners. BLIES owns no ships or aircraft.")} trail={[{ label: tr('Logistics') }]}>
        <Cta to="/quote?service=road" variant="light">{tr('Request a quote')}</Cta>
      </PageHero>
      <section className="container-x py-20">
        <SectionHead soft eyebrow={tr('Services')} title={tr('Seven ways cargo moves.')} />
        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {LOGI.map((l) => (
            <li key={l.to} className="relative bg-white">
              <Photo src={l.image} alt="" className="aspect-[3/2]" />
              <div className="p-6">
                <Badge tag={l.tag} />
                <h2 className="mt-3 text-lg font-bold text-navy-900"><Link to={l.to} className="after:absolute after:inset-0 hover:text-royal">{tr(l.title)}</Link></h2>
                <p className="mt-2 text-[0.95rem] text-slate-body">{tr(l.body)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <TrackStrip />
      <QuoteBand />
    </>
  )
}

export function IndustriesIndex() {
  const { tr } = useLocale()
  const list = [
    ['mining', 'Mining', img.mining], ['oil-gas', 'Oil and gas', img.oil], ['construction', 'Construction & infrastructure', img.construction],
    ['manufacturing', 'Manufacturing', img.factory], ['government', 'Government & public sector', img.cranes], ['corporations', 'International corporations', img.port],
  ] as const
  return (
    <>
      <PageHero image={img.miningRoad(2000, 1100)} eyebrow={tr('Industries')} title={tr('Built around how your sector buys and ships.')} intro={tr('Six sectors, each served through the same procurement and logistics chain. No client names or case studies are shown.')} trail={[{ label: tr('Industries') }]} />
      <section className="container-x py-20">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map(([id, name, im]) => (
            <li key={id} className="relative isolate overflow-hidden bg-navy-900 text-white">
              <img src={im(900, 700)} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover opacity-60 transition-transform duration-700 hover:scale-105 motion-reduce:transition-none" />
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <div className="flex min-h-72 flex-col justify-end p-6">
                <h2 className="text-xl font-bold"><Link to={`/industries/${id}`} className="after:absolute after:inset-0">{tr(name)}</Link></h2>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <QuoteBand />
    </>
  )
}

export function About() {
  const { tr } = useLocale()
  return (
    <>
      <PageHero image={img.port(2000, 1100)} eyebrow={tr('About BLIES')} title={tr('Procurement and logistics, under one roof.')} intro={tr('Established in 2012, BLIES connects African businesses with international suppliers and markets, with one point of coordination from sourcing to delivery.')} trail={[{ label: tr('About') }]} />
      <section className="container-x pt-20">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <li key={c.title} className="bg-white p-7">
              <span className="text-sm font-extrabold text-royal">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="mt-2 text-lg font-bold text-navy-900">{tr(c.title)}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-body">{tr(c.body)}</p>
              <div className="mt-4"><TextLink to={c.to}>{tr('Learn more')}</TextLink></div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-slate-body">{tr('Clients can use the full chain, from sourcing to delivery, or select individual services.')}</p>
      </section>
      <section className="container-x py-20">
        <ImageCopy image={img.warehouse2(1200, 900)} alt={tr('Warehouse interior with stacked pallets')} eyebrow={tr('Who we are')} title={tr('Business Logistics Imports Exports & Suppliers.')}>
          <p>{tr('BLIES (Pty) Ltd stands for Business Logistics Imports Exports & Suppliers. We were established in 2012 and provide integrated procurement, sourcing, logistics, documentation, clearing coordination and quality control.')}</p>
          <p>{tr('Procurement and logistics are equal pillars. What sets BLIES apart is coordinating them together.')}</p>
          <p>{tr('Registration no. {0}. BLIES has offices in South Africa (Fourways and Atrium on 5th, Sandton), Dubai and Gabon.', 'K2012064897')} <Link to="/contact" className="font-semibold text-royal underline">{tr('Offices and contacts')}</Link></p>
        </ImageCopy>
      </section>
      <section className="bg-navy-950 py-20 text-white">
        <div className="container-x">
          <SectionHead dark soft eyebrow={tr('The BLIES journey')} title={tr('Source. Procure. Inspect. Document. Clear. Move. Deliver.')} />
          <div className="mt-12"><Journey dark /></div>
        </div>
      </section>
      <section className="container-x grid gap-10 py-20 md:grid-cols-2">
        <div><p className="eyebrow text-royal">{tr('Our mission')}</p><p className="mt-3 text-xl font-semibold leading-snug text-navy-900">{tr('To make international procurement, trade and logistics simpler, more transparent and more accessible for businesses operating across Africa and global markets.')}</p></div>
        <div><p className="eyebrow text-royal">{tr('Our vision')}</p><p className="mt-3 text-xl font-semibold leading-snug text-navy-900">{tr('To build an integrated African supply-chain network connecting businesses, suppliers and markets across continents.')}</p></div>
      </section>
      <section className="container-x py-20">
        <SectionHead soft eyebrow={tr('Ownership, clearly')} title={tr('What BLIES owns, and what it coordinates.')} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="bg-mist p-7"><Badge tag="owned" /><p className="mt-4 text-slate-body">{tr('The road transport fleet, with GPS and route monitoring.')}</p></div>
          <div className="bg-mist p-7"><Badge tag="partner" /><p className="mt-4 text-slate-body">{tr('Sea and air freight, and customs clearing, through external partners and agents. BLIES owns no ships or aircraft.')}</p></div>
        </div>
      </section>
      <section className="container-x py-20">
        <SectionHead soft eyebrow={tr('Why BLIES')} title={tr('You get on with business. We manage the chain.')} />
        <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {WHY_BLIES.map(([h, b]) => (
            <li key={h} className="bg-white p-6"><h3 className="font-bold text-navy-900">{tr(h)}</h3><p className="mt-1 text-sm text-slate-body">{tr(b)}</p></li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-6"><TextLink to="/network">{tr('Global network')}</TextLink><TextLink to="/future">{tr('Our future growth plans')}</TextLink></div>
      </section>
      <section className="bg-mist py-16">
        <div className="container-x grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow text-royal">{tr('Leadership')}</p>
            <p className="mt-2 text-lg font-semibold text-navy-900">{tr('Director: {0}', 'Chantelle Mavoula')}</p>
            <p className="mt-1 text-sm text-slate-body">{tr('Registration no. {0}.', 'K2012064897')}</p>
            <p className="mt-3 max-w-2xl text-sm text-slate-body">{tr('Operating countries: Gabon, South Africa, Zimbabwe, Mozambique, UAE and Oman. Inland logistics points: Johannesburg and Mpumalanga. Freight, clearing and destination services in the wider network are delivered through partners and agents.')}</p>
          </div>
          <Cta to="/contact">{tr('Contact the team')}</Cta>
        </div>
      </section>
      <QuoteBand />
    </>
  )
}

const LEGAL = [
  ['privacy', 'Privacy policy'],
  ['terms', 'Terms of use'],
  ['cookies', 'Cookie policy'],
  ['quote-terms', 'Quotation terms'],
] as const

export function Legal({ slug }: { slug: string }) {
  const { tr, locale } = useLocale()
  const texts = locale === 'fr' ? LEGAL_TEXT_FR : locale === 'ar' ? LEGAL_TEXT_AR : LEGAL_TEXT
  const dates = locale === 'fr' ? LEGAL_DATES_FR : locale === 'ar' ? LEGAL_DATES_AR : LEGAL_DATES
  const cur = LEGAL.find(([s]) => s === slug) ?? LEGAL[0]
  return (
    <>
      <section className="bg-navy-950 pb-14 pt-12 text-white">
        <div className="container-x">
          <p className="eyebrow text-sky">{tr('Legal')}</p>
          <h1 className="display mt-4 text-[clamp(2rem,5vw,3.6rem)]">{tr(cur[1])}</h1>
          <p className="mt-5 text-sm text-white/70">{tr('Effective date: {0} · Last updated: {1}', dates.effective, dates.updated)}</p>
        </div>
      </section>
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[14rem_1fr]">
        <nav aria-label={tr('Legal pages')}>
          <ul className="space-y-1 border-s border-line">
            {LEGAL.map(([s, l]) => (
              <li key={s}>
                <Link to={`/legal/${s}`} aria-current={s === cur[0] ? 'page' : undefined} className={`-ms-px block border-s-2 px-4 py-2 text-sm font-medium ${s === cur[0] ? 'border-royal text-royal' : 'border-transparent text-slate-body hover:text-navy-900'}`}>{tr(l)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-3xl space-y-5 text-[1.02rem] leading-relaxed text-slate-body">
          <LegalBody text={texts[cur[0]] ?? LEGAL_TEXT[cur[0]]} />
        </article>
      </div>
    </>
  )
}

export function NotFound() {
  const { tr } = useLocale()
  return (
    <section className="container-x py-32 text-center">
      <Compass aria-hidden className="mx-auto size-10 text-royal" />
      <h1 className="display mt-6 text-4xl text-navy-900">{tr('Page not found')}</h1>
      <div className="mt-8 flex justify-center gap-3"><Cta to="/">{tr('Home')}</Cta><TextLink to="/contact">{tr('Contact')}</TextLink></div>
    </section>
  )
}

export function GlobalNetwork() {
  const { tr } = useLocale()
  const [sel, setSel] = useState<string | null>(null)
  const kinds: MarketKind[] = ['office', 'operating', 'sourcing', 'gateway']
  const list = MARKETS.filter((m) => kinds.includes(m.kind))
  const cur = list.find((m) => m.id === sel)
  const groups: [string, string[], string][] = [
    ['Offices', CONTACT.countries.flatMap((c) => c.offices.map((o) => `${tr(c.country)}: ${tr(o.name)}`)), 'BLIES offices: two in South Africa (Fourways and Atrium on 5th, Sandton), plus Dubai and Gabon.'],
    ['Operating countries', OPERATING_COUNTRIES.map((x) => tr(x)), 'Countries where BLIES operates.'],
    ['Road corridors', [...CORRIDORS, 'Potential extension to the DRC'].map((x) => tr(x)), 'Cross-border road freight on the BLIES fleet. The DRC is a potential extension, not a confirmed route.'],
    ['Sourcing markets', SOURCING_MARKET_LIST.map((x) => tr(x)), 'Places we buy from. They are not BLIES offices.'],
    ['Sea gateways', GATEWAYS.map((x) => tr(x)), 'Sea freight is arranged through external partners.'],
    ['Inland logistics points', INLAND_POINTS.map((x) => tr(x)), 'Inland points served by the BLIES road fleet.'],
    ['Clearing network', CLEARING_NETWORK.map((x) => tr(x)), 'Customs clearing is coordinated through agents and partners.'],
  ]
  return (
    <>
      <PageHero image={img.port(2000, 1100)} eyebrow={tr('Global network')} title={tr('Connected across Africa and the markets that supply it.')} intro={tr('Offices, operating countries, sourcing markets, gateways and clearing networks, shown separately so each is clear.')} trail={[{ to: '/about', label: tr('About') }, { label: tr('Global network') }]}>
        <Cta to="/contact" variant="light">{tr('Offices and contacts')}</Cta>
        <Cta to="/procurement/markets" variant="outline-light">{tr('Sourcing markets')}</Cta>
      </PageHero>
      <section className="bg-navy-950 py-16 text-white">
        <div className="container-x grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <div>
            <WorldMap variant="dark" viewBox="200 60 900 420" markers={list} kinds={kinds} selected={sel} onSelect={setSel} labels className="aspect-[900/420] border border-white/10" />
            <div className="mt-4"><MapLegend kinds={kinds} /></div>
            <p className="mt-3 text-xs text-white/60">{tr('Route lines are illustrative and do not show tracked shipments.')}</p>
          </div>
          <div aria-live="polite" className="self-start bg-white/5 p-6">
            {cur ? (<><p className="eyebrow text-sky">{tr(KIND_LABEL[cur.kind])}</p><h2 className="mt-2 text-xl font-bold">{tr(cur.name)}</h2><p className="mt-2 text-sm leading-relaxed text-white/75">{tr(cur.text)}</p></>) : <p className="text-sm text-white/70">{tr('Select a marker for details.')}</p>}
          </div>
        </div>
      </section>
      <section className="container-x py-20">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
          {groups.map(([h, items, note]) => (
            <li key={h} className="bg-white p-7">
              <h2 className="text-lg font-bold text-navy-900">{tr(h)}</h2>
              <p className="mt-1 text-sm text-slate-body">{tr(note)}</p>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-ink">{items.join(' · ')}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 bg-mist p-5 text-navy-900"><strong>{tr('Partners and agents.')}</strong> {tr('Freight, clearing and destination services in the wider network may be delivered through partners and agents, as required by the shipment.')}</p>
      </section>
      <QuoteBand />
    </>
  )
}

export function OurFuture() {
  const { tr } = useLocale()
  return (
    <>
      <PageHero image={img.warehouse2(2000, 1100)} eyebrow={tr('Our future')} title={tr('Future growth plans.')} intro={tr('These are plans, not current capabilities. None of them should be read as operational today.')} trail={[{ to: '/about', label: tr('About') }, { label: tr('Our future') }]} tags={['future']} />
      <section className="container-x py-20">
        <SectionHead soft eyebrow={tr('Future growth plans')} title={tr('Where BLIES intends to grow.')} body={tr('Not current capabilities. For what BLIES offers today, see the services pages.')} />
        <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FUTURE_PLANS.map((x, i) => (
            <li key={x} className="flex items-start gap-4 bg-white p-6">
              <span className="text-sm font-extrabold text-royal">{String(i + 1).padStart(2, '0')}</span>
              <span><span className="block font-semibold text-navy-900">{tr(x)}</span><Badge tag="future" label={tr('Future plan')} className="mt-2 text-navy-900" /></span>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-6"><TextLink to="/about">{tr('About BLIES')}</TextLink><TextLink to="/technology/gps">{tr('Current technology')}</TextLink></div>
      </section>
      <QuoteBand />
    </>
  )
}
