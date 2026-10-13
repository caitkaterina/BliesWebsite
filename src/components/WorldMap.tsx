import { useId, useMemo, type ReactNode } from 'react'
import { MAP_H, MAP_W, africaPath, countryPaths, project, worldPath } from '../data/worldMap'
import { MARKETS, ROUTES, KIND_LABEL, type Market, type MarketKind } from '../data/markets'
import { useLocale, useReducedMotion } from '../lib/i18n'

const PALETTE = {
  dark: {
    land: '#12306a',
    coast: 'rgba(140,196,255,0.38)',
    africaTop: '#2b62c4',
    africaBottom: '#1b4296',
    stroke: '#0a1f4d',
    border: 'rgba(255,255,255,0.28)',
    grid: 'rgba(255,255,255,0.05)',
    route: '#8cc4ff',
    glow: 'rgba(75,163,255,0.28)',
    shadow: '#030b1f',
    halo: '#061433',
    label: '#ffffff',
    sub: 'rgba(255,255,255,0.7)',
    kind: { office: '#ffffff', operating: '#4ba3ff', sourcing: '#dbe9ff', gateway: '#8cc4ff', partner: '#a9bbdd' } as Record<MarketKind, string>,
    fill: { office: '#4b8ff0', operating: '#2f6bd6', sourcing: '#3a64b0', gateway: '#2a5cb8', partner: '#2a5cb8' } as Record<MarketKind, string>,
  },
  light: {
    land: '#e6edf8',
    coast: 'rgba(10,31,77,0.18)',
    africaTop: '#2a68d6',
    africaBottom: '#173f94',
    stroke: '#ffffff',
    border: 'rgba(255,255,255,0.55)',
    grid: 'rgba(10,31,77,0.05)',
    route: '#1a62e6',
    glow: 'rgba(26,98,230,0.14)',
    shadow: '#0a1f4d',
    halo: '#ffffff',
    label: '#0a1f4d',
    sub: '#44506a',
    kind: { office: '#0a1f4d', operating: '#1a62e6', sourcing: '#0a1f4d', gateway: '#1a62e6', partner: '#5b6b8c' } as Record<MarketKind, string>,
    fill: { office: '#0a1f4d', operating: '#1a62e6', sourcing: '#1a62e6', gateway: '#1a62e6', partner: '#1a62e6' } as Record<MarketKind, string>,
  },
}

type Pal = (typeof PALETTE)['dark']

/** One shape per kind, so kinds stay distinguishable without extra colours. */
function Glyph({ kind, r, c, edge, bg, sel }: { kind: MarketKind; r: number; c: string; edge: string; bg: string; sel?: boolean }): ReactNode {
  const sw = sel ? 2.4 : 1.4
  switch (kind) {
    case 'office':
      return (
        <>
          <circle r={r + 3.2} fill="none" stroke={c} strokeWidth={1} opacity={0.55} />
          <circle r={r} fill={c} stroke={edge} strokeWidth={sw} />
        </>
      )
    case 'sourcing':
      return <circle r={r} fill={bg} stroke={c} strokeWidth={sw + 0.8} />
    case 'gateway':
      return <rect x={-r * 0.9} y={-r * 0.9} width={r * 1.8} height={r * 1.8} transform="rotate(45)" fill={c} stroke={edge} strokeWidth={sw} />
    case 'partner':
      return <rect x={-r * 0.8} y={-r * 0.8} width={r * 1.6} height={r * 1.6} fill={bg} stroke={c} strokeWidth={sw + 0.4} />
    default:
      return <circle r={r} fill={c} stroke={edge} strokeWidth={sw} />
  }
}

// Label placement [dx, dy, anchor] in marker-relative units, chosen so neighbouring markers do not collide.
const LABEL: Record<string, [number, number, 'start' | 'end']> = {
  jnb: [-1, 16, 'end'], zw: [1, -6, 'start'], mz: [1, 14, 'start'], cd: [1, 14, 'start'], lbv: [-1, -2, 'end'],
  dxb: [-1, -10, 'end'], om: [1, 12, 'start'], sa: [-1, 14, 'end'], ct: [-1, 6, 'end'], rb: [1, 14, 'start'],
  cn: [1, 4, 'start'], in: [1, 14, 'start'], tr: [1, -6, 'start'], sg: [1, 4, 'start'],
}

interface Props {
  variant?: 'dark' | 'light'
  viewBox?: string
  markers?: Market[]
  kinds?: MarketKind[]
  selected?: string | null
  onSelect?: (id: string) => void
  routes?: boolean
  labels?: boolean
  highlightCountries?: boolean
  className?: string
  title?: string
}

export default function WorldMap({
  variant = 'dark',
  viewBox = '120 40 980 470',
  markers = MARKETS,
  kinds,
  selected,
  onSelect,
  routes = true,
  labels = false,
  highlightCountries = true,
  className = '',
  title,
}: Props) {
  const { tr } = useLocale()
  const p: Pal = PALETTE[variant]
  const uid = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const shown = useMemo(() => markers.filter((m) => !kinds || kinds.includes(m.kind)), [markers, kinds])
  const byId = useMemo(() => Object.fromEntries(MARKETS.map((m) => [m.id, m])), [])
  const shownIds = new Set(shown.map((m) => m.id))
  const vbW = Number(viewBox.split(' ')[2]) || 980
  const u = Math.min(1.2, Math.max(0.6, vbW / 980))
  const fs = Math.max(9, vbW / 80)

  const arcs = ROUTES.filter(([a, b]) => shownIds.has(a) && shownIds.has(b)).map(([a, b]) => {
    const [x1, y1] = project(byId[a].lon, byId[a].lat)
    const [x2, y2] = project(byId[b].lon, byId[b].lat)
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    const dist = Math.hypot(x2 - x1, y2 - y1)
    return `M${x1} ${y1} Q${mx} ${my - dist * 0.22} ${x2} ${y2}`
  })

  const graticule: string[] = []
  for (let lon = -120; lon <= 180; lon += 30) graticule.push(`M${project(lon, 78)[0]} 0V${MAP_H}`)
  for (let lat = 60; lat >= -40; lat -= 20) graticule.push(`M0 ${project(0, lat)[1]}H${MAP_W}`)
  const [ax, ay] = project(20, 2)

  return (
    <svg viewBox={viewBox} role="img" aria-label={title ?? tr('Map of BLIES offices, operating markets, sourcing markets and freight gateways')} className={`block w-full ${className}`} style={{ direction: 'ltr' }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${uid}af`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.africaTop} />
          <stop offset="1" stopColor={p.africaBottom} />
        </linearGradient>
        <radialGradient id={`${uid}gl`}>
          <stop offset="0" stopColor={p.glow} />
          <stop offset="1" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}sh`} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="7" stdDeviation="8" floodColor={p.shadow} floodOpacity={variant === 'dark' ? 0.55 : 0.22} />
        </filter>
      </defs>
      <ellipse cx={ax} cy={ay} rx={330} ry={250} fill={`url(#${uid}gl)`} />
      <path d={graticule.join('')} stroke={p.grid} strokeWidth={0.8} fill="none" />
      <path d={worldPath} fill={p.land} stroke={p.coast} strokeWidth={0.7} strokeLinejoin="round" />
      <path d={africaPath} fill={`url(#${uid}af)`} stroke={p.coast} strokeWidth={0.8} strokeLinejoin="round" filter={`url(#${uid}sh)`} />
      {highlightCountries &&
        shown
          .filter((m) => m.country && countryPaths[m.country])
          .map((m) => (
            <path key={m.id} d={countryPaths[m.country!]} fill={p.fill[m.kind]} fillOpacity={m.kind === 'office' ? 0.95 : 0.6} stroke={p.border} strokeWidth={0.7} strokeLinejoin="round" />
          ))}
      {routes && (
        <g fill="none" stroke={p.route} strokeLinecap="round">
          {arcs.map((d, i) => (
            <g key={i}>
              <path d={d} strokeWidth={1} strokeOpacity={0.28} />
              <path d={d} strokeWidth={1.8} strokeOpacity={0.95} className={reduced ? undefined : 'route-line'} strokeDasharray={reduced ? '1.5 9' : undefined} style={reduced ? undefined : { animationDelay: `${-(i % 5) * 0.5}s` }} />
            </g>
          ))}
        </g>
      )}
      {shown.map((m) => {
        const [x, y] = project(m.lon, m.lat)
        const sel = selected === m.id
        const c = p.kind[m.kind]
        const r = (m.kind === 'office' ? 6.5 : 4.6) * u
        const [dx, dy, anchor] = LABEL[m.id] ?? [1, 4, 'start']
        const off = (r + 6) * dx
        return (
          <g
            key={m.id}
            transform={`translate(${x} ${y})`}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={`${tr(m.name)}, ${tr(KIND_LABEL[m.kind])}`}
            aria-pressed={onSelect ? sel : undefined}
            onClick={() => onSelect?.(m.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect?.(m.id))}
            className={onSelect ? 'group/marker cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-royal' : undefined}
          >
            <circle r={r + 12 * u} fill="transparent" stroke="transparent" strokeWidth={2} />
            {sel && <circle r={r + 7 * u} fill="none" stroke={c} strokeWidth={1.4} opacity={0.9} />}
            {(m.kind === 'office' || sel) && !reduced && <circle r={r + 2} fill={c} opacity={0.4} className="pulse-ring" />}
            <Glyph kind={m.kind} r={r} c={c} edge={p.stroke} bg={p.halo} sel={sel} />
            {(labels || sel) && (
              <text x={off} y={dy * u} textAnchor={anchor} fontSize={fs} fontWeight={m.kind === 'office' ? 700 : 600} fill={p.label} stroke={p.halo} strokeWidth={3.2} strokeLinejoin="round" paintOrder="stroke" fontFamily="Inter, sans-serif" style={{ direction: 'ltr' }}>
                {tr(m.name).split(/[,،]/)[0]}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function MapLegend({ dark = true, kinds }: { dark?: boolean; kinds?: MarketKind[] }) {
  const { tr } = useLocale()
  const p = PALETTE[dark ? 'dark' : 'light']
  const list = (Object.keys(KIND_LABEL) as MarketKind[]).filter((k) => !kinds || kinds.includes(k))
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium ${dark ? 'text-white/85' : 'text-slate-body'}`}>
      {list.map((k) => (
        <li key={k} className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="-9 -9 18 18" aria-hidden>
            <Glyph kind={k} r={k === 'office' ? 4.4 : 3.6} c={p.kind[k]} edge={p.stroke} bg={p.halo} />
          </svg>
          {tr(KIND_LABEL[k])}
        </li>
      ))}
    </ul>
  )
}
