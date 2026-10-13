export type MarketKind = 'office' | 'operating' | 'sourcing' | 'gateway' | 'partner'

export interface Market {
  id: string
  name: string
  kind: MarketKind
  lon: number
  lat: number
  country?: string // key into countryPaths for fill
  text: string
}

// Source: BLIES company profile + website developer brief.
export const MARKETS: Market[] = [
  { id: 'jnb', name: 'Johannesburg, South Africa', kind: 'office', lon: 28.0, lat: -26.0, country: 'South Africa', text: 'Johannesburg: two BLIES offices, Fourways and Atrium on 5th, Sandton. The marker is city-level. Procurement, logistics coordination and road transport operations.' },
  { id: 'lbv', name: 'Gabon', kind: 'office', lon: 9.45, lat: 0.4, country: 'Gabon', text: 'BLIES office, Bel Air, Carrefour Machete. Clearing-agent network in Gabon.' },
  { id: 'dxb', name: 'Dubai, United Arab Emirates', kind: 'office', lon: 55.3, lat: 25.2, country: 'United Arab Emirates', text: 'BLIES office, Sheikh Zayed Road. Middle East sourcing and Jebel Ali / Dubai freight gateway.' },
  { id: 'zw', name: 'Zimbabwe', kind: 'operating', lon: 31.0, lat: -17.8, country: 'Zimbabwe', text: 'Operating market for road transport. No BLIES office or asset base is implied.' },
  { id: 'mz', name: 'Mozambique', kind: 'operating', lon: 32.6, lat: -25.9, country: 'Mozambique', text: 'Operating market for road transport. No BLIES office or asset base is implied.' },
  { id: 'cd', name: 'DR Congo', kind: 'operating', lon: 21.8, lat: -4.0, country: 'Dem. Rep. Congo', text: 'Cross-border trucking reaches the DRC, subject to route, vehicle and contract requirements.' },
  { id: 'om', name: 'Oman', kind: 'operating', lon: 58.5, lat: 23.6, country: 'Oman', text: 'Operating market. Services are arranged per enquiry.' },
  { id: 'cn', name: 'China', kind: 'sourcing', lon: 116.4, lat: 35.5, country: 'China', text: 'Sourcing market for machinery and equipment. Clearing-agent network in China.' },
  { id: 'in', name: 'India', kind: 'sourcing', lon: 78.5, lat: 22.0, country: 'India', text: 'Sourcing market for machinery and equipment.' },
  { id: 'tr', name: 'Türkiye', kind: 'sourcing', lon: 35.0, lat: 39.0, country: 'Turkey', text: 'Sourcing market for uniforms and workwear.' },
  { id: 'sg', name: 'Singapore', kind: 'gateway', lon: 103.8, lat: 1.35, text: 'Freight gateway and machinery sourcing market. Sea freight arranged through external partners.' },
  { id: 'sa', name: 'Saudi Arabia', kind: 'partner', lon: 45.0, lat: 24.0, country: 'Saudi Arabia', text: 'Clearing-agent network destination. Not a BLIES office.' },
  { id: 'rb', name: 'Richards Bay', kind: 'gateway', lon: 32.1, lat: -28.8, text: 'Freight gateway. Sea freight arranged through external freight and carrier partners.' },
  { id: 'ct', name: 'Cape Town', kind: 'gateway', lon: 18.4, lat: -33.9, text: 'Freight gateway. Sea freight arranged through external freight and carrier partners.' },
]

export const ROUTES: [string, string][] = [
  ['cn', 'rb'],
  ['in', 'dxb'],
  ['sg', 'rb'],
  ['tr', 'dxb'],
  ['dxb', 'rb'],
  ['rb', 'jnb'],
  ['ct', 'jnb'],
  ['jnb', 'zw'],
  ['jnb', 'mz'],
  ['jnb', 'cd'],
  ['cd', 'lbv'],
]

export const KIND_LABEL: Record<MarketKind, string> = {
  office: 'BLIES office',
  operating: 'Operating market',
  sourcing: 'Sourcing market',
  gateway: 'Freight gateway',
  partner: 'Clearing / partner network',
}
