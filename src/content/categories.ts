import { img } from '../lib/images'

export interface Category {
  id: string
  title: string
  short: string
  intro: string
  image: (w: number, h: number) => string
  scope: string[]
  specs: string[]
  related: { to: string; label: string }[]
  fmcg?: boolean
}

export const SOURCING_MARKETS = 'Middle East, China, Singapore, India, Turkey, South Africa and other African markets, depending on the requirement.'

export const TURNAROUND = '72 hours to 5 business days, excluding weekends, subject to complete specifications, supplier availability, cargo requirements and other relevant factors.'

const Q = { to: '/services/quality', label: 'Quality control and inspection' }
const D = { to: '/services/documentation', label: 'Documentation' }
const M = { to: '/procurement/markets', label: 'Sourcing markets' }

export const CATEGORIES: Category[] = [
  {
    id: 'machinery', title: 'Machinery & equipment', short: 'Industrial and technical equipment sourced to specification.', image: img.machinery,
    intro: 'Industrial, construction and project machinery identified against your specification, with supplier quotations compared before you commit.',
    scope: ['Supplier identification and verification', 'Quotation comparison', 'Industrial, technical and project procurement', 'Pre-shipment inspection and export preparation'],
    specs: ['Make, model or technical specification', 'Quantity and delivery destination', 'Power, capacity and standards required', 'Required delivery timing'],
    related: [Q, D, { to: '/logistics/project-cargo', label: 'General & project cargo' }],
  },
  {
    id: 'spares', title: 'Spares & engineering components', short: 'Replacement and engineering parts.', image: img.gears,
    intro: 'Spare parts and engineering components for plant, equipment and fleet, matched to part numbers and specifications.',
    scope: ['Part-number and specification matching', 'Supplier identification', 'Quotation comparison', 'Consolidation and export preparation'],
    specs: ['Part numbers or drawings', 'Equipment make and model', 'Quantities and urgency', 'Destination'],
    related: [Q, M, { to: '/logistics/air', label: 'Air freight (partner-coordinated)' }],
  },
  {
    id: 'technical', title: 'Mechanical, electrical, hydraulic, pneumatic & automation', short: 'Technical product families.', image: img.electrical,
    intro: 'Technical product families, including mechanical, electrical, hydraulic and pneumatic components and automation equipment.',
    scope: ['Mechanical components', 'Electrical components', 'Hydraulic and pneumatic components', 'Automation and controls'],
    specs: ['Technical datasheets or specifications', 'Voltage, pressure or rating requirements', 'Quantities', 'Certificates required, if any'],
    related: [Q, D, M],
  },
  {
    id: 'ppe', title: 'PPE & safety supplies', short: 'Protective equipment for sites and operations.', image: img.ppe,
    intro: 'Personal protective equipment and safety supplies for sites and operations, sourced against your standards and quantities.',
    scope: ['Supplier identification', 'Specification and quantity checks', 'Product certificates where required', 'Consolidated shipments'],
    specs: ['Product type and size ranges', 'Standards required', 'Quantities and packaging', 'Destination and timing'],
    related: [Q, D, { to: '/procurement/categories/consumables', label: 'Uniforms, workwear & consumables' }],
  },
  {
    id: 'consumables', title: 'Industrial consumables, uniforms & workwear', short: 'Recurring operational supply.', image: img.ppeWorker,
    intro: 'Industrial consumables, uniforms and workwear for recurring operational supply.',
    scope: ['Industrial consumables', 'Uniforms and workwear', 'Supplier comparison', 'Consolidation for export'],
    specs: ['Item list and specifications', 'Sizes, branding or colours', 'Quantities and repeat frequency', 'Destination'],
    related: [Q, { to: '/procurement/categories/ppe', label: 'PPE & safety supplies' }, M],
  },
  {
    id: 'fmcg', title: 'Fast-Moving Consumer Goods (FMCG)', short: 'Packaged consumer goods and bulk supply for business.', image: img.fmcg, fmcg: true,
    intro: 'Packaged consumer goods, cartons and palletised products procured for business and bulk supply needs. No retail catalogue, stock or prices are shown here: each requirement is quoted individually.',
    scope: ['Packaged and household goods for business supply', 'Bulk procurement and consolidated shipments', 'Packaging and palletisation requirements', 'Documentation for export and import'],
    specs: ['Products and specifications', 'Quantities and packaging', 'Destination', 'Timing'],
    related: [{ to: '/procurement/categories/food', label: 'Food & perishables (where relevant)' }, { to: '/logistics/cold-chain', label: 'Cold chain transport (separate logistics service)' }, D],
  },
  {
    id: 'food', title: 'Food & perishables', short: 'A specific sourcing area, only where relevant.', image: img.fmcg2,
    intro: 'Food and perishable products are a specific sourcing area handled only where relevant to the requirement. They are separate from the general FMCG category.',
    scope: ['Supplier identification where relevant', 'Health, phytosanitary and veterinary certificates where applicable', 'Temperature requirements recorded in the quote', 'Coordination with cold-chain transport'],
    specs: ['Product and temperature requirement', 'Quantities and packaging', 'Required certificates', 'Destination and shelf-life window'],
    related: [{ to: '/logistics/cold-chain', label: 'Cold chain transport' }, { to: '/procurement/categories/fmcg', label: 'FMCG' }, D],
  },
  {
    id: 'industrial', title: 'Industrial, technical & project procurement', short: 'Specification-led sourcing beyond a fixed list.', image: img.warehouse,
    intro: 'Specification-led sourcing for industrial, technical and project requirements that do not sit in one product family. Tell us what you need.',
    scope: ['Supplier identification', 'Quotation comparison and negotiation', 'Project procurement coordination', 'Consolidation and export preparation'],
    specs: ['Bill of materials or specification', 'Quantities and phasing', 'Destination and project timeline', 'Certificates required'],
    related: [Q, D, M],
  },
]

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id)

const ALIAS: Record<string, string> = { automation: 'technical', other: 'industrial' }
export const resolveCategory = (id: string) => categoryById(ALIAS[id] ?? id)
