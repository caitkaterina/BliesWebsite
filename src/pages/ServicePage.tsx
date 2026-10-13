import { Badge, Cta, SectionHead } from '../components/ui'
import { CheckList, ImageCopy, PageHero, QuoteBand, TextLink, TrackStrip } from '../components/sections'
import { Link } from '../lib/router'
import type { ServiceDef } from '../content/services'
import { useLocale } from '../lib/i18n'

export default function ServicePage({ s }: { s: ServiceDef }) {
  const { tr } = useLocale()
  const trail = [...(s.group.to ? [{ to: s.group.to, label: tr(s.group.label) }] : [{ label: tr(s.group.label) }]), { label: tr(s.title) }]
  const quote = s.quoteService ? `/quote?service=${s.quoteService}` : '/quote'
  return (
    <>
      <PageHero
        image={s.image}
        pos={s.pos}
        eyebrow={tr(s.eyebrow)}
        title={tr(s.title)}
        intro={tr(s.intro)}
        trail={trail}
        tags={s.tags}
        tint={s.cold ? 'shadow-[inset_0_0_0_9999px_rgba(70,160,220,0.28)]' : ''}
      >
        <Cta to={quote} variant="light">{tr('Request a quote')}</Cta>
        <Cta to="/contact" variant="outline-light" arrow={false}>{tr('Talk to the team')}</Cta>
      </PageHero>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <SectionHead soft eyebrow={tr('Capabilities')} title={tr(s.capsTitle ?? 'What this covers')} />
          <div className="mt-8"><CheckList items={s.caps.map((c) => tr(c))} cols /></div>
        </div>
        <aside className="border-s-4 border-royal bg-mist p-7 lg:self-start" aria-labelledby="consider">
          <h2 id="consider" className="eyebrow text-navy-900">{tr(s.considerTitle ?? 'Good to know')}</h2>
          <ul className="mt-4 space-y-3 text-[0.98rem] leading-snug text-slate-body">
            {s.considerations.map((c) => (
              <li key={c} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 bg-royal" />{tr(c)}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="bg-mist py-20">
        <div className="container-x">
          <ImageCopy image={s.split.image} alt={tr(s.split.alt)} pos={s.split.pos} title={tr(s.split.title)} reverse>
            {s.split.body.map((b) => <p key={b}>{tr(b)}</p>)}
            {s.split.cold && <Badge tag="owned" />}
          </ImageCopy>
        </div>
      </section>

      {s.steps && (
        <section className="bg-navy-950 py-20 text-white">
          <div className="container-x">
            <SectionHead dark soft eyebrow={tr('Process')} title={tr(s.steps.title)} />
            <ol className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {s.steps.steps.map((st, i) => (
                <li key={st} className="flex items-start gap-4 bg-navy-900 p-6">
                  <span className="text-3xl font-extrabold text-sky">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pt-2 text-[1.02rem] font-medium">{tr(st)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-white/60">{tr('Exact steps depend on product, route and regulation.')}</p>
          </div>
        </section>
      )}

      <section className="container-x py-16">
        <p className="eyebrow text-royal">{tr('Related')}</p>
        <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {s.related.map(([to, label]) => (
            <li key={to} className="bg-white p-5 transition-colors hover:bg-mist">
              <Link to={to} className="block text-base font-bold text-navy-900">{tr(label)}</Link>
              <div className="mt-3"><TextLink to={to}>{tr('View')}</TextLink></div>
            </li>
          ))}
        </ul>
      </section>

      <TrackStrip />
      <QuoteBand />
    </>
  )
}
