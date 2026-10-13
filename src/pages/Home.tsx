import { QC_POINTS } from '../content/profile'
import { useState } from 'react'
import {
  ArrowDownToLine, ArrowUpFromLine, ChevronDown, Cog, FileCheck2, Network as NetworkIcon, Package, Pickaxe, Plane, Search, Ship, Snowflake, Truck, MapPin, Info,
} from 'lucide-react'
import WorldMap, { MapLegend } from '../components/WorldMap'
import { Arrow, Badge, CONTACT, Cta, Eyebrow, Photo, SectionHead, type Tag } from '../components/ui'
import { CheckList, Journey, QuoteBand, TextLink } from '../components/sections'
import { KIND_LABEL, MARKETS, type MarketKind } from '../data/markets'
import { useLocale } from '../lib/i18n'
import { Link } from '../lib/router'
import { img } from '../lib/images'

function Hero() {
  const { t, tr } = useLocale()
  return (
    <section className="relative bg-white">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-y-0 end-[-12%] w-[130%] lg:end-[-6%] lg:w-[72%]">
          <WorldMap variant="light" viewBox="150 30 960 480" labels={false} highlightCountries={false} className="h-full opacity-70 lg:opacity-100" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 lg:via-white/75 lg:to-transparent rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="container-x relative grid min-h-[40rem] items-center pb-44 pt-14 lg:min-h-[44rem] lg:grid-cols-[1.05fr_1fr] lg:pb-52">
        <div className="rise">
          <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
          <h1 className="display-soft mt-6 text-[clamp(2.9rem,7.2vw,5.6rem)] text-navy-900">
            {t('hero.title1')}
            <br />
            <span className="text-royal">{t('hero.title2')}</span>
          </h1>
          <p className="mt-7 max-w-lg text-[1.15rem] leading-relaxed text-slate-body">{t('hero.body')}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Cta to="/quote" className="!min-h-14 px-8">{t('cta.quote')}</Cta>
            <Cta to="/logistics" variant="secondary" className="!min-h-14 px-8">{t('cta.services')}</Cta>
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-navy-900">
            {['Procurement', 'Logistics', 'Inspection', 'Documentation', 'Clearing'].map((x) => (
              <li key={x} className="flex items-center gap-2"><span aria-hidden className="size-1.5 bg-royal" />{tr(x)}</li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none relative hidden h-full lg:block" aria-hidden>
          <figure className="absolute start-[2%] top-[58%] w-52 rotate-[-2deg] bg-white p-1.5 shadow-[0_24px_50px_-18px_rgba(10,31,77,0.55)]">
            <Photo src={img.ship(420, 280)} alt="" className="aspect-[3/2]" />
            <figcaption className="flex items-center gap-2 px-1.5 py-1.5 text-xs font-bold text-navy-900"><Ship className="size-3.5 text-royal" />{tr('Sea freight · partners')}</figcaption>
          </figure>
          <figure className="absolute end-[4%] top-[10%] w-48 rotate-[2deg] bg-white p-1.5 shadow-[0_24px_50px_-18px_rgba(10,31,77,0.55)]">
            <Photo src={img.plane(420, 280)} alt="" className="aspect-[3/2]" />
            <figcaption className="flex items-center gap-2 px-1.5 py-1.5 text-xs font-bold text-navy-900"><Plane className="size-3.5 text-royal" />{tr('Air freight · partners')}</figcaption>
          </figure>
          <figure className="absolute end-[10%] top-[66%] w-52 rotate-[-1deg] bg-white p-1.5 shadow-[0_24px_50px_-18px_rgba(10,31,77,0.55)]">
            <Photo src={img.truckBlue(420, 280)} alt="" className="aspect-[3/2]" />
            <figcaption className="flex items-center gap-2 px-1.5 py-1.5 text-xs font-bold text-navy-900"><Truck className="size-3.5 text-royal" />{tr('Road · owned fleet')}</figcaption>
          </figure>
        </div>
      </div>

      <div className="container-x relative z-10 -mt-32 lg:-mt-40">
        <EnquiryPanel />
      </div>
    </section>
  )
}

function EnquiryPanel() {
  const { t, tr } = useLocale()
  const [ref, setRef] = useState('')
  return (
    <div className="grid border border-line bg-white shadow-[0_30px_70px_-30px_rgba(10,31,77,0.45)] md:grid-cols-[1.2fr_1fr]">
      <form onSubmit={(e) => { e.preventDefault(); window.location.hash = '#/' + document.documentElement.lang + '/tracking' }} className="p-6 sm:p-8">
        <h2 className="text-lg font-extrabold text-navy-900">{t('hero.enquiry.title')}</h2>
        <p className="mt-1 text-sm text-slate-body">{t('hero.enquiry.badge')}</p>
        <label htmlFor="hero-ref" className="mt-5 block text-sm font-semibold text-navy-900">{t('hero.enquiry.ref')}</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="hero-ref" value={ref} onChange={(e) => setRef(e.target.value)} autoComplete="off" className="min-h-12 flex-1 rounded-sm border border-slate-300 bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-slate-400 focus:border-royal focus:ring-2 focus:ring-royal/25" />
          <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-sm bg-navy-900 px-6 text-[0.95rem] font-semibold text-white transition-colors duration-200 hover:bg-royal active:bg-royal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal">
            {t('hero.enquiry.submit')}<Arrow />
          </button>
        </div>
        <p className="mt-4 flex gap-2 text-sm leading-relaxed text-slate-body"><Info aria-hidden className="mt-0.5 size-4 shrink-0" />{t('hero.enquiry.note')}</p>
      </form>
      <div className="relative hidden overflow-hidden border-s border-line bg-mist md:block">
        <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 14px, rgba(10,31,77,0.05) 14px 15px)' }} />
        <div className="relative flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
          <MapPin aria-hidden className="size-7 text-royal" />
          <p className="text-sm font-bold text-navy-900">{tr('Speak to the team')}</p>
          <a href={CONTACT.phoneHref} dir="ltr" className="text-sm font-semibold text-royal underline">{CONTACT.phone}</a>
        </div>
      </div>
    </div>
  )
}

function Proof() {
  const { tr } = useLocale()
  const facts = [
    ['2012', 'Established', 'Business Logistics Imports Exports & Suppliers'],
    ['4', 'Office locations', 'Fourways, Sandton, Dubai and Gabon'],
    ['2', 'Equal pillars', 'Procurement & Global Sourcing. Logistics & Transport.'],
    ['1', 'Point of coordination', 'From supplier to final delivery'],
  ]
  return (
    <section className="container-x pt-28 pb-8 lg:pt-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHead soft eyebrow={tr('Who we are')} title={tr('Not a freight forwarder. A procurement and supply-chain partner.')} />
        <div>
          <p className="text-lg leading-relaxed text-slate-body">
            {tr('BLIES connects African businesses with international suppliers and markets. We coordinate product sourcing with inspection, paperwork, transport, clearance and delivery, so you deal with one team rather than five.')}
          </p>
          <dl className="mt-10 grid grid-cols-2 border-t border-line">
            {facts.map(([n, l, d], i) => (
              <div key={l} className={`py-6 ${i % 2 === 0 ? 'pe-6' : 'border-s border-line ps-6'} ${i > 1 ? 'border-t border-line' : ''}`}>
                <dt className="display-soft text-5xl text-royal">{n}</dt>
                <dd className="mt-2 font-bold text-navy-900">{tr(l)}</dd>
                <dd className="mt-0.5 text-sm text-slate-body">{tr(d)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Pillars() {
  const { tr } = useLocale()
  const card = (to: string, image: string, alt: string, eyebrow: string, title: string, body: string, pos?: string) => (
    <Link to={to} className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden bg-navy-900 p-8 text-white lg:min-h-[32rem]">
      <img src={image} alt={tr(alt)} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: pos }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/5" />
      <p className="eyebrow text-sky">{tr(eyebrow)}</p>
      <h3 className="display mt-3 text-3xl sm:text-4xl">{tr(title)}</h3>
      <p className="mt-3 max-w-md text-white/80">{tr(body)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-[gap] group-hover:gap-4 rtl:tracking-normal">{tr('Explore')}<Arrow /></span>
    </Link>
  )
  return (
    <section className="container-x py-24">
      <SectionHead soft eyebrow={tr('You order. We handle the rest.')} title={tr('Two pillars. One supply chain.')} className="mb-12" />
      <div className="grid gap-4 md:grid-cols-2">
        {card('/procurement', img.machinery(1000, 900), 'Large industrial machinery inside a factory hall', 'Pillar 01', 'Procurement & Global Sourcing', 'Supplier identification, verification and comparison; multi-quote negotiation; inspection and export preparation.', '40% center')}
        {card('/logistics', img.truckBlue(1000, 900), 'White and blue articulated truck on an open road', 'Pillar 02', 'Logistics & Transport', 'Owned road transport with sea and air coordinated through partners. GPS and route monitoring.', '60% center')}
      </div>
      <div className="mt-4 grid items-center gap-8 bg-navy-900 p-8 text-white md:grid-cols-[1fr_2.2fr] lg:p-10">
        <div>
          <p className="eyebrow text-sky">{tr('Integrated supply chain')}</p>
          <h3 className="display mt-2 text-2xl">{tr('Together, end to end')}</h3>
          <p className="mt-2 text-sm text-white/70">{tr('Procurement and logistics run as one coordinated process.')}</p>
        </div>
        <Journey dark compact />
      </div>
    </section>
  )
}

const NEEDS = [
  { id: 'procurement', icon: Search, title: 'Source a product', hint: 'Find and compare suppliers' },
  { id: 'equipment', icon: Cog, title: 'Buy equipment', hint: 'Machinery, spares, technical' },
  { id: 'road', icon: Package, title: 'Move cargo', hint: 'General, project, oversized' },
  { id: 'mining', icon: Pickaxe, title: 'Mining logistics', hint: 'Side-tipper bulk haulage' },
  { id: 'cold', icon: Snowflake, title: 'Refrigerated transport', hint: 'Multi-temperature cold chain' },
  { id: 'sea', icon: Ship, title: 'Sea freight', hint: 'FCL, LCL, breakbulk' },
  { id: 'air', icon: Plane, title: 'Air freight', hint: 'Time-sensitive cargo' },
  { id: 'import', icon: ArrowDownToLine, title: 'Import goods', hint: 'Into Africa and the region' },
  { id: 'export', icon: ArrowUpFromLine, title: 'Export goods', hint: 'Out of Africa to markets' },
  { id: 'clearing', icon: FileCheck2, title: 'Customs clearing', hint: 'Clearing-agent network' },
  { id: 'integrated', icon: NetworkIcon, title: 'Full supply chain', hint: 'Source to delivery, one team' },
]

function Navigator() {
  const { tr } = useLocale()
  return (
    <section className="bg-mist py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead soft eyebrow={tr('Start here')} title={tr('What are you looking for?')} body={tr('Choose what you need. We pre-fill your quote and route you to the right team.')} />
        </div>
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
          {NEEDS.map((n, i) => (
            <li key={n.id} className="bg-white">
              <Link to={`/quote?service=${n.id}`} className="group flex h-full min-h-36 flex-col justify-between gap-6 p-6 transition-colors hover:bg-navy-900 hover:text-white">
                <div className="flex items-start justify-between">
                  <n.icon aria-hidden className="size-7 text-royal transition-colors group-hover:text-sky" strokeWidth={1.7} />
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white/50">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-[1.05rem] font-bold">{tr(n.title)}</h3>
                    <p className="mt-0.5 text-sm text-slate-body group-hover:text-white/70">{tr(n.hint)}</p>
                  </div>
                  <Arrow className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HowItWorks() {
  const { tr } = useLocale()
  return (
    <section className="container-x py-24">
      <SectionHead soft eyebrow={tr('How it works')} title={tr('Source. Procure. Inspect. Document. Clear. Move. Deliver.')} className="mb-14" />
      <Journey />
    </section>
  )
}

const CATS = [
  { to: '/procurement/categories/machinery', title: 'Machinery & equipment', body: 'Industrial and technical equipment sourced to specification.', image: img.machinery(900, 700), span: 'lg:col-span-7 lg:row-span-2', h: 'min-h-[22rem] lg:min-h-full' },
  { to: '/procurement/categories/spares', title: 'Spares & engineering components', body: 'Replacement and engineering parts.', image: img.gears(700, 500), span: 'lg:col-span-5', h: 'min-h-[14rem]' },
  { to: '/procurement/categories/technical', title: 'Mechanical, electrical, hydraulic, pneumatic & automation', body: 'Technical product families.', image: img.electrical(700, 500), span: 'lg:col-span-5', h: 'min-h-[14rem]' },
  { to: '/procurement/categories/ppe', title: 'PPE & safety supplies', body: 'Protective equipment for sites and operations.', image: img.ppe(700, 500), span: 'lg:col-span-4', h: 'min-h-[14rem]' },
  { to: '/procurement/categories/consumables', title: 'Industrial consumables, uniforms & workwear', body: 'Recurring operational supply.', image: img.ppeWorker(700, 500), span: 'lg:col-span-4', h: 'min-h-[14rem]' },
  { to: '/procurement/categories/fmcg', title: 'Fast-Moving Consumer Goods (FMCG)', body: 'Packaged consumer goods and bulk supply for business.', image: img.fmcg(700, 500), span: 'lg:col-span-4', h: 'min-h-[14rem]', badge: true },
]

function Categories() {
  const { tr } = useLocale()
  return (
    <section className="bg-navy-950 py-24 text-white">
      <div className="container-x">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHead dark soft eyebrow={tr('Procurement categories')} title={tr('Sourced to your specification.')} body={tr('Supplier identification, specification matching and quotation comparison, coordinated with inspection, documentation and delivery.')} />
          <Cta to="/procurement/categories" variant="outline-light">{tr('All categories')}</Cta>
        </div>
        <div className="grid gap-3 lg:grid-cols-12">
          {CATS.map((c) => (
            <Link key={c.title} to={c.to} className={`group relative isolate flex flex-col justify-end overflow-hidden bg-navy-800 p-6 ${c.span} ${c.h}`}>
              <img src={c.image} alt="" aria-hidden loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/0" />
              {c.badge && <span className="mb-2 w-fit text-xs font-medium text-white/70">{tr('Updated category')}</span>}
              <h3 className="text-xl font-extrabold leading-tight">{tr(c.title)}</h3>
              <p className="mt-1 max-w-sm text-sm text-white/75">{tr(c.body)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

interface Svc { to: string; title: string; body: string; image: string; tag: Tag; pos?: string; cold?: boolean }
const SVCS: Svc[] = [
  { to: '/logistics/road', title: 'Road transport', body: 'BLIES-owned road fleet across relevant African corridors, with GPS and route monitoring.', image: img.truckBlue(1200, 800), tag: 'owned' },
  { to: '/logistics/mining', title: 'Mining & bulk', body: 'Side-tipper capability for iron ore, chrome, coal, lithium and other minerals, subject to route, vehicle and contract requirements.', image: img.mining(1200, 800), tag: 'owned' },
  { to: '/logistics/cold-chain', title: 'Cold chain', body: 'Multi-temperature refrigerated trucks for meat, seafood, dairy, produce and other perishables.', image: img.truckWhite(1200, 800), tag: 'owned', cold: true },
  { to: '/logistics/project-cargo', title: 'General & project cargo', body: 'Industrial, project and oversized cargo, planned to the load.', image: img.warehouse2(1200, 800), tag: 'owned' },
  { to: '/logistics/cross-border', title: 'Cross-border Africa', body: 'Cross-border trucking, including routes reaching the DRC, subject to requirements.', image: img.truckRoad(1200, 800), tag: 'owned' },
  { to: '/logistics/sea', title: 'Sea freight', body: 'FCL, LCL, project, breakbulk and oversized, arranged through external freight and carrier partners. BLIES does not own vessels.', image: img.ship(1200, 800), tag: 'partner' },
  { to: '/logistics/air', title: 'Air freight', body: 'Time-sensitive and high-value cargo arranged through external carrier networks. BLIES does not own aircraft.', image: img.plane(1200, 800), tag: 'partner' },
]

export function ColdTint() {
  return <div aria-hidden className="absolute inset-0 bg-[#7cc8ea]/40 mix-blend-color" />
}

const SVC_ICON = [Truck, Pickaxe, Snowflake, Package, MapPin, Ship, Plane]
const SVC_FACTS: string[][] = [
  ['Owned road fleet', 'GPS and route monitoring', 'One point of coordination'],
  ['Side tippers', 'Iron ore, chrome, coal, lithium and other bulk commodities', 'Subject to route, vehicle and contract requirements'],
  ['Multi-temperature refrigerated trucks', 'Meat, seafood, dairy, fresh produce, frozen food and pharmaceuticals', 'Separate from FMCG procurement'],
  ['Flatbeds, curtain-siders, dropsides and box trucks', 'Destination coordination and final-mile delivery where applicable'],
  ['Southern, Western and Central Africa', 'Can extend into markets such as the DRC', 'Depends on route, cargo and requirements'],
  ['FCL, LCL, containerised, breakbulk, project and oversized', 'Gateways include Richards Bay, Cape Town, Jebel Ali and Singapore', 'Through freight and carrier partners'],
  ['Time-sensitive, high-value, specialised and urgent cargo', 'Through carrier networks', 'Depends on size, weight, route and carrier availability'],
]

function Logistics() {
  const { tr } = useLocale()
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="container-x py-24">
      <SectionHead soft eyebrow={tr('Logistics & transport')} title={tr('Our own trucks. Partner-coordinated sea and air.')} className="mb-12" />
      <ul className="divide-y divide-line border-y border-line">
        {SVCS.map((x, n) => {
          const Icon = SVC_ICON[n]
          const isOpen = open === n
          return (
            <li key={x.title}>
              <h3>
                <button
                  type="button"
                  id={`svc-btn-${n}`}
                  aria-expanded={isOpen}
                  aria-controls={`svc-panel-${n}`}
                  onClick={() => setOpen(isOpen ? null : n)}
                  className={`flex min-h-16 w-full items-center gap-4 px-3 py-4 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-royal ${isOpen ? 'bg-mist' : 'hover:bg-mist/60'}`}
                >
                  <Icon aria-hidden className="size-6 shrink-0 text-royal" />
                  <span className="flex-1">
                    <span className="block text-lg font-bold text-navy-900">{tr(x.title)}</span>
                    <Badge tag={x.tag} className="text-navy-900" />
                  </span>
                  <ChevronDown aria-hidden className={`size-5 shrink-0 text-navy-900 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </h3>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div
                  id={`svc-panel-${n}`}
                  role="region"
                  aria-labelledby={`svc-btn-${n}`}
                  inert={!isOpen}
                  className="overflow-hidden"
                >
                  <div className="grid gap-6 bg-mist px-3 pb-8 pt-2 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-10">
                    <div>
                      <p className="max-w-xl text-slate-body">{tr(x.body)}</p>
                      <ul className="mt-4 space-y-1.5 text-[0.95rem] text-navy-900">
                        {SVC_FACTS[n].map((f) => (
                          <li key={f} className="flex gap-2.5"><span aria-hidden className="mt-2 size-1.5 shrink-0 bg-royal" />{tr(f)}</li>
                        ))}
                      </ul>
                      <div className="mt-6"><Cta to={x.to} variant="primary">{tr('View service')}</Cta></div>
                    </div>
                    <Photo src={x.image} alt={tr(x.title)} className="aspect-[3/2]">
                      {x.cold && <ColdTint />}
                    </Photo>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Network() {
  const { tr } = useLocale()
  const [kind, setKind] = useState<MarketKind | 'all'>('all')
  const [sel, setSel] = useState<string>('jnb')
  const m = MARKETS.find((x) => x.id === sel)!
  const kinds: (MarketKind | 'all')[] = ['all', 'office', 'operating', 'sourcing', 'gateway', 'partner']
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 text-white">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.9fr] lg:items-start">
          <div>
            <SectionHead dark soft eyebrow={tr('Global network')} title={tr('Connected across Africa and the markets that supply it.')} body={tr('Offices, operating markets, sourcing markets and freight gateways are shown separately. BLIES has offices in South Africa (Sandton and Fourways), Dubai and Gabon.')} />
            <div className="mt-8"><MapLegend /></div>
            <div className="mt-6"><Cta to="/network" variant="outline-light">{tr('Full global network')}</Cta></div>
            <div role="group" aria-label={tr('Filter map')} className="mt-8 flex flex-wrap gap-2">
              {kinds.map((k) => (
                <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)} className={`min-h-10 border px-3 text-xs font-bold uppercase tracking-wider transition-colors rtl:tracking-normal ${kind === k ? 'border-white bg-white text-navy-900' : 'border-white/30 text-white/80 hover:border-white'}`}>
                  {k === 'all' ? tr('All') : tr(KIND_LABEL[k]).split(' / ')[0]}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="mt-8 bg-navy-950/60 p-6">
              <p className="eyebrow text-sky">{tr(KIND_LABEL[m.kind])}</p>
              <h3 className="mt-2 text-xl font-extrabold">{tr(m.name)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{tr(m.text)}</p>
            </div>
          </div>
          <div className="relative bg-navy-950/40 p-2">
            <WorldMap viewBox="330 80 520 420" kinds={kind === 'all' ? undefined : [kind]} selected={sel} onSelect={setSel} labels className="aspect-[5/4] sm:aspect-[4/3]" />
            <p className="px-3 pb-2 pt-3 text-xs text-white/55">{tr('Lines illustrate connections between sourcing markets, gateways and offices. They are not tracked shipments. Select a marker for details.')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function QualityControl() {
  const { tr } = useLocale()
  return (
    <section className="bg-mist py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHead soft eyebrow={tr('Quality control & trust')} title={tr("We don’t just move goods. We verify them.")} />
          <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
            {QC_POINTS.map((x, i) => (
              <li key={x} className="flex items-center gap-4 bg-white p-5 last:odd:sm:col-span-2">
                <span className="text-sm font-extrabold text-royal">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-semibold text-navy-900">{tr(x)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Tech() {
  const { tr } = useLocale()
  return (
    <section className="container-x py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="min-w-0">
          <SectionHead soft eyebrow={tr('Technology & tracking')} title={tr('GPS and fleet visibility on our road fleet.')} body={tr('BLIES uses GPS, fleet tracking and route monitoring on its road fleet. To check on your cargo, submit a shipment enquiry and our team will respond.')} />
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta to="/tracking">{tr('Submit a shipment enquiry')}</Cta>
            <Cta to="/technology/gps" variant="secondary">{tr('How monitoring works')}</Cta>
          </div>
        </div>
        <div className="border border-line bg-white p-6 sm:p-8">
          <p className="font-extrabold text-navy-900">{tr('What we use on our road fleet')}</p>
          <div className="mt-5"><CheckList items={[tr('GPS positioning'), tr('Fleet tracking'), tr('Route monitoring')]} /></div>
          <p className="mt-6 text-sm text-slate-body">{tr('For a status update on your cargo, send us your shipment reference and our team will reply.')}</p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <Pillars />
      <Navigator />
      <HowItWorks />
      <Categories />
      <Logistics />
      <Network />
      <QualityControl />
      <Tech />
      <QuoteBand />
    </>
  )
}
