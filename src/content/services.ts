import { QC_POINTS } from './profile'
import { img } from '../lib/images'
import type { Tag } from '../components/ui'

export interface ServiceDef {
  path: string
  group: { label: string; to?: string }
  eyebrow: string
  title: string
  intro: string
  image: string
  pos?: string
  cold?: boolean
  tags?: Tag[]
  capsTitle?: string
  caps: string[]
  considerTitle?: string
  considerations: string[]
  split: { title: string; body: string[]; image: string; alt: string; pos?: string; cold?: boolean }
  steps?: { title: string; steps: string[] }
  related: [string, string][]
  quoteService?: string
}

const L = { label: 'Logistics', to: '/logistics' }
const S = { label: 'Services' }
const I = { label: 'Industries', to: '/industries' }

export const SERVICES: ServiceDef[] = [
  {
    path: '/logistics/road', group: L, eyebrow: 'Logistics · Road', title: 'Road transport, on our own fleet.',
    intro: 'BLIES owns its road fleet and coordinates every movement through one point of contact, with GPS and route monitoring across relevant African corridors.',
    image: img.truckBlue(2000, 1100), pos: '60% center', tags: ['owned'], quoteService: 'road',
    caps: ['Owned road fleet across multiple payload classes', 'GPS, fleet tracking and route monitoring', 'One point of contact from loading to delivery', 'Coordination with sea and air legs through partners', 'Documentation support for border movements'],
    considerations: ['Vehicle type depends on cargo, weight and dimensions', 'Route, border and permit requirements vary by corridor', 'Availability is confirmed at quotation', 'Fleet counts and payloads are published only once verified'],
    split: { title: 'Owned assets, clearly distinguished.', body: ['Road transport is the part of the chain BLIES operates itself. Sea and air freight are arranged through external freight and carrier partners and are labelled as such throughout this site.'], image: img.truckRoad(1200, 900), alt: 'Articulated truck passing along a highway' },
    related: [['/logistics/cross-border', 'Cross-border Africa'], ['/technology/gps', 'GPS & fleet tracking'], ['/services/documentation', 'Documentation']],
  },
  {
    path: '/logistics/mining', group: L, eyebrow: 'Logistics · Mining & bulk', title: 'Bulk haulage for mining cargo.',
    intro: 'Side-tipper capability for iron ore, chrome, coal, lithium and other minerals, subject to route, vehicle, contract and operational requirements.',
    image: img.mining(2000, 1100), pos: 'center 55%', tags: ['owned'], quoteService: 'mining',
    caps: ['Side-tipper haulage for bulk minerals', 'Iron ore, chrome, coal, lithium and other minerals', 'Cross-border and in-country movements', 'GPS and route monitoring', 'Coordination with port and rail interfaces where relevant', 'Procurement of mining consumables and PPE alongside transport'],
    considerations: ['Subject to route, vehicle, contract and operational requirements', 'Client names are never shown without permission', 'Volumes and tonnages are not published', 'Safety and site-access requirements are agreed per contract'],
    split: { title: 'Procurement and haulage, together.', body: ['Mining operations rarely need transport alone. BLIES can also source PPE, consumables, spares and equipment, then move them on the same coordinated chain.'], image: img.miningPit(1200, 900), alt: 'Excavators working in an open-pit mining area' },
    related: [['/industries/mining', 'Mining industry'], ['/procurement/categories', 'Procurement categories'], ['/logistics/road', 'Road transport'], ['/logistics/sea', 'Sea freight']],
  },
  {
    path: '/logistics/cold-chain', group: L, eyebrow: 'Logistics · Cold chain', title: 'Cold chain, held at temperature.',
    intro: 'Multi-temperature refrigerated trucks for meat, seafood, dairy, produce, frozen products and other temperature-sensitive cargo.',
    image: img.truckWhite(2000, 1100), cold: true, tags: ['owned'], quoteService: 'cold',
    caps: ['Multi-temperature refrigerated trucks', 'Meat, seafood, dairy and produce', 'Frozen and other perishable products', 'Temperature requirement captured in the quote', 'GPS and route monitoring'],
    considerations: ['Required set-point, loading window and route drive vehicle choice', 'Distinct from FMCG procurement, which covers sourcing of consumer goods', 'Perishable cargo is time-critical: complete specifications speed up quotation'],
    split: { title: 'Cold chain is not FMCG procurement.', body: ['Fast-Moving Consumer Goods (FMCG) is a procurement category: sourcing packaged goods for business supply. Cold chain is a logistics service: moving temperature-sensitive cargo. They can be combined, and they are quoted separately.'], image: img.shelving(1200, 900), alt: 'Tall shelving with cartons in a large storage facility', cold: true },
    related: [['/procurement/categories', 'FMCG procurement'], ['/logistics/road', 'Road transport'], ['/services/documentation', 'Documentation'], ['/services/quality', 'Quality control']],
  },
  {
    path: '/logistics/project-cargo', group: L, eyebrow: 'Logistics · General & project cargo', title: 'General, industrial and project cargo.',
    intro: 'Flatbed, curtain-sider, dropside and box-truck movements for industrial cargo, plus planning for project and oversized loads.',
    image: img.warehouse2(2000, 1100), tags: ['owned'], quoteService: 'project',
    caps: ['Palletised and general industrial cargo', 'Project cargo planning', 'Oversized and heavy-lift coordination', 'Flatbed, curtain-sider, dropside and box-truck options', 'Consolidation and packaging coordination', 'Door-to-door scheduling'],
    considerations: ['Dimensions, weight and securing method decide the vehicle', 'Oversized loads may need permits and escorts', 'Route surveys are planned per project', 'Specialist trailers shown as planned are not yet owned assets'],
    split: { title: 'Planned to the load.', body: ['Send dimensions, weight, origin and destination. We confirm the right vehicle and route, and coordinate paperwork and clearance around it.'], image: img.cranes(1200, 900), alt: 'Cranes on a large construction site' },
    related: [['/logistics/sea', 'Sea freight'], ['/industries/construction', 'Construction & infrastructure'], ['/services/customs', 'Customs & clearing']],
  },
  {
    path: '/logistics/sea', group: L, eyebrow: 'Logistics · Sea freight', title: 'Sea freight, arranged with partners.',
    intro: 'FCL, LCL, project, breakbulk and oversized cargo arranged through external freight and carrier partners. BLIES does not own ships.',
    image: img.ship(2000, 1100), tags: ['partner'], quoteService: 'sea',
    caps: ['Full container load (FCL) and less than container load (LCL)', 'Project, breakbulk and oversized cargo', 'Gateways: Richards Bay, Cape Town, Jebel Ali, Dubai, Singapore', 'Inland legs on BLIES owned road fleet', 'Documentation and clearing coordination', 'One point of contact across the chain'],
    considerations: ['Method depends on cargo, dimensions, weight, urgency, origin, destination and capacity', 'Partner carriers are not named without permission', 'Transit times are quoted per enquiry, never guaranteed on this site', 'BLIES does not own vessels'],
    split: { title: 'Ocean legs through partners. Everything else, one team.', body: ['We coordinate the carrier, the paperwork, the port, the clearance and the inland truck, so a sea shipment has one owner on your side.'], image: img.port(1200, 900), alt: 'Aerial view of a container terminal' },
    related: [['/logistics/road', 'Road transport'], ['/services/customs', 'Customs & clearing'], ['/services/documentation', 'Documentation'], ['/logistics/air', 'Air freight']],
  },
  {
    path: '/logistics/air', group: L, eyebrow: 'Logistics · Air freight', title: 'Air freight, arranged with carriers.',
    intro: 'Time-sensitive, high-value, specialised and urgent cargo arranged through external carrier networks. BLIES does not own aircraft.',
    image: img.plane(2000, 1100), tags: ['partner'], quoteService: 'air',
    caps: ['Urgent and time-sensitive cargo', 'High-value and specialised shipments', 'Airport-to-door road legs on BLIES fleet', 'Documentation including air waybills', 'Clearing coordination at origin and destination', 'Sourcing and air freight on one quote'],
    considerations: ['Depends on size, weight, route, carrier availability and regulation', 'Dangerous goods and restricted items need prior review', 'Carrier partners are not named without permission', 'BLIES does not own aircraft'],
    split: { title: 'When time is the constraint.', body: ['Air is quoted alongside road and sea where relevant, so you can compare modes on cost and time before committing.'], image: img.plane2(1200, 900), alt: 'Cargo airliner parked at an airport' },
    related: [['/logistics/sea', 'Sea freight'], ['/services/documentation', 'Documentation'], ['/services/customs', 'Customs & clearing']],
  },
  {
    path: '/logistics/cross-border', group: L, eyebrow: 'Logistics · Cross-border Africa', title: 'Across borders, on one plan.',
    intro: 'Cross-border trucking in the region, including routes reaching the DRC, with paperwork and clearing coordinated alongside the movement.',
    image: img.truckRoad(2000, 1100), pos: 'center 60%', tags: ['owned'], quoteService: 'road',
    caps: ['Cross-border road transport', 'Operating markets include Zimbabwe and Mozambique', 'Routes reaching the DRC', 'Border documentation coordination', 'Clearing-agent network', 'GPS and route monitoring'],
    considerations: ['Confirmed corridors are agreed at quotation', 'Border processing times vary and are never guaranteed', 'Permits and documents depend on commodity and route', 'Operating markets are not BLIES offices'],
    split: { title: 'Operating markets, labelled honestly.', body: ['Our network map separates BLIES offices from operating markets, sourcing markets and freight gateways, so you can see exactly what we do where.'], image: img.truckPortrait(1200, 900), alt: 'White freight truck on a road' },
    related: [['/logistics/road', 'Road transport'], ['/services/customs', 'Customs & clearing'], ['/services/documentation', 'Documentation'], ['/contact', 'Contact & locations']],
  },
  {
    path: '/services/customs', group: S, eyebrow: 'Services · Customs & clearing', title: 'Clearance, coordinated.',
    intro: 'Customs clearing is coordinated through a clearing-agent network, so documents, duties and releases move in step with your cargo.',
    image: img.port(2000, 1100), tags: ['partner'], quoteService: 'clearing',
    caps: ['Clearing-agent network: South Africa, Gabon, China, UAE and Saudi Arabia', 'Import and export clearance coordination', 'Document checks before arrival', 'Release and delivery coordination', 'Quotes include VAT where applicable'],
    considerations: ['Tax and legal advisers can be coordinated. BLIES is not a tax firm', 'Requirements depend on product, origin, destination and regulation'],
    split: { title: 'Not a tax or legal advisory firm.', body: ['BLIES coordinates clearing through its agent network and can bring in tax or legal advisers where needed. It does not give tax or legal advice itself.'], image: img.docs(1200, 900), alt: 'Clipboard with shipping documents' },
    steps: { title: 'How clearing is coordinated', steps: ['Collect and check documents', 'Brief the clearing agent', 'Submit declarations', 'Respond to queries', 'Obtain release', 'Hand over for delivery'] },
    related: [['/services/documentation', 'Documentation'], ['/logistics/sea', 'Sea freight'], ['/logistics/air', 'Air freight'], ['/services/quality', 'Quality control']],
  },
  {
    path: '/services/documentation', group: S, eyebrow: 'Services · Documentation', title: 'The paperwork. Handled.',
    intro: 'Documentation is treated as a controlled operational process, with the right documents prepared and checked for each shipment.',
    image: img.docs(2000, 1100), quoteService: 'integrated',
    capsTitle: 'Documents we coordinate',
    caps: ['Commercial invoices and packing lists', 'Certificates of origin', 'Bills of lading and air waybills', 'Customs documents and permits', 'Inspection, product, health, phytosanitary and veterinary certificates', 'Dangerous-goods and insurance documents'],
    considerations: ['The exact set depends on product, origin, destination, commodity and regulation', 'BLIES coordinates documents. It is not a legal or tax advisory firm', 'No licences or certifications are implied by this page'],
    split: { title: 'One checked set, before cargo moves.', body: ['Mismatched invoices and missing certificates are the usual cause of delays at the border. Documents are verified against the order and the cargo before they are submitted.'], image: img.warehouse(1200, 900), alt: 'Cartons stacked on warehouse racking' },
    steps: { title: 'Document control', steps: ['Collect from supplier', 'Check against order', 'Prepare shipping set', 'Verify for destination', 'Submit and track', 'Archive'] },
    related: [['/services/customs', 'Customs & clearing'], ['/services/quality', 'Quality control'], ['/logistics/sea', 'Sea freight']],
  },
  {
    path: '/services/quality', group: S, eyebrow: 'Services · Quality control', title: 'We don’t just move goods. We verify them.',
    intro: 'Quality control runs from the first supplier check to final-delivery verification, as part of procurement rather than an afterthought.',
    image: img.factory(2000, 1100), quoteService: 'procurement',
    caps: QC_POINTS,
    considerations: ['Inspection scope is agreed per order', 'Third-party inspection is arranged where required'],
    split: { title: 'Checked before it ships.', body: ['Finding a fault at the supplier is cheaper than finding it at the destination. Inspections happen before export, with findings reported back before cargo moves.'], image: img.gears2(1200, 900), alt: 'Precision metal gears and engineering components' },
    steps: { title: 'Quality control path', steps: ['Supplier and product check', 'Specification and quantity checks', 'Procurement monitoring', 'QC checks', 'Pre-shipment inspection', 'Documentation verification', 'Transport and clearing coordination', 'Final delivery and batch verification'] },
    related: [['/procurement', 'Procurement'], ['/services/documentation', 'Documentation'], ['/procurement/categories', 'Product categories']],
  },
  {
    path: '/technology/gps', group: { label: 'Technology' }, eyebrow: 'Technology · GPS & fleet tracking', title: 'GPS and fleet visibility.',
    intro: 'GPS, fleet tracking and route monitoring exist on the BLIES road fleet. Client-facing online tracking is not currently available. For an update on a shipment, send a shipment enquiry.',
    image: img.truckRoad(2000, 1100), tags: ['owned'], quoteService: 'road',
    capsTitle: 'What we use today',
    caps: ['GPS fitted to the owned road fleet', 'Fleet tracking and route monitoring', 'Operational follow-up by the BLIES team', 'Shipment enquiry route through the website'],
    considerTitle: 'Good to know',
    considerations: ['Online shipment tracking for clients is not currently available', 'Sea and air legs depend on data from our freight partners', 'Request an update at any time through a shipment enquiry'],
    split: { title: 'Ask our team for an update.', body: ['Send a shipment enquiry with your reference and the BLIES team will come back to you with the latest information on your cargo.'], image: img.truckBlue(1200, 900), alt: 'Truck driving on a highway' },
    related: [['/tracking', 'Submit a shipment enquiry'], ['/logistics/road', 'Road transport'], ['/services/documentation', 'Documentation']],
  },
  ...([
    ['mining', 'Mining', img.mining, 'Equipment, consumables, PPE and bulk haulage for mining operations.', ['Side-tipper bulk haulage', 'Machinery, spares and consumables procurement', 'PPE and workwear supply', 'Cross-border movements'], '/logistics/mining'],
    ['oil-gas', 'Oil and gas', img.oil, 'Technical procurement and project logistics for oil and gas operations.', ['Technical and engineering procurement', 'Project and oversized cargo', 'Documentation and clearing coordination', 'Inspection before shipment'], '/logistics/project-cargo'],
    ['construction', 'Construction & infrastructure', img.construction, 'Equipment, materials and project cargo for construction and infrastructure.', ['Equipment and materials sourcing', 'Project and oversized cargo', 'Site delivery scheduling', 'PPE and consumables'], '/logistics/project-cargo'],
    ['manufacturing', 'Manufacturing', img.factory, 'Machinery, spares and inbound supply chains for manufacturers.', ['Machinery and automation sourcing', 'Spares and engineering components', 'Import and export logistics', 'Quality checks before shipment'], '/procurement'],
    ['government', 'Government & public sector', img.cranes, 'Documented, verified procurement and logistics for public-sector requirements.', ['Specification-led sourcing', 'Supplier verification and comparison', 'Controlled documentation', 'Delivery verification'], '/procurement'],
    ['corporations', 'International corporations', img.port, 'A single coordinated route into African markets for international companies.', ['Import and export coordination', 'Clearing-agent network', 'Owned road transport inland', 'Confidential private contracts'], '/logistics'],
  ] as const).map(([slug, name, image, intro, caps, link]): ServiceDef => ({
    path: `/industries/${slug}`, group: I, eyebrow: `Industries · ${name}`, title: name, intro, image: image(2000, 1100), quoteService: 'integrated',
    capsTitle: 'Typical needs', caps: [...caps],
    considerTitle: 'Good to know',
    considerations: ['Client identities are kept confidential', 'Scope, specification and timing are agreed per enquiry', 'Pricing is provided through a quotation'],
    split: { title: 'Procurement and logistics, shaped to the sector.', body: ['Share your specification and timing. We scope sourcing, inspection, documentation, clearance and transport as one coordinated plan.'], image: image(1200, 900), alt: `${name} operations` },
    related: [[link, 'Related service'], ['/procurement', 'Procurement'], ['/logistics', 'Logistics'], ['/quote', 'Request a quote']],
  })),
]

export const byPath = Object.fromEntries(SERVICES.map((s) => [s.path, s]))
