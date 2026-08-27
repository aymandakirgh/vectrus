import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { DARK, MORPH } from '@/lib/theme'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'

const ITEMS = [
  {
    date: '12 Aug 2026',
    tag: 'Markets',
    title: 'Vectrus opens Singapore trading desk',
    body: 'The fourth desk closes the daily handover gap between Houston and Oslo. Twelve traders at launch, LNG and freight first, power products to follow in 2027.',
  },
  {
    date: '30 Jul 2026',
    tag: 'Upstream',
    title: 'Basin 9 appraisal confirms 120 MMboe',
    body: 'Two appraisal wells came in within four percent of the pre-drill model. Development concept selection begins in Q4, tieback options lead.',
  },
  {
    date: '18 Jun 2026',
    tag: 'Systems',
    title: 'Rotterdam terminal automation completes',
    body: 'The last manual lifting at the Rotterdam terminal ran on 14 June. Berth scheduling, metering, and documentation now run end to end without a clipboard.',
  },
  {
    date: '02 May 2026',
    tag: 'Group',
    title: 'Half-year production up eight percent',
    body: 'Group production averaged 410 kboe/d across the half, with uptime at 94 percent. The board held the dividend and funded two Vectrus+ programs from cash.',
  },
  {
    date: '11 Apr 2026',
    tag: 'Vectrus+',
    title: 'Methane sensing pilot expands to 40 sites',
    body: 'Continuous sensors now cover every operated asset in two basins. Detected-to-repaired median fell from nine days to 36 hours over the pilot.',
  },
  {
    date: '27 Feb 2026',
    tag: 'Group',
    title: 'Nordvik partnership enters its second decade',
    body: 'The logistics partnership with Halder | Nordvik renews through 2036, adding two ice-class carriers and a joint emissions ledger audited by both firms.',
  },
]

export default function News() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <PageShell title="News">
      <section className="px-6 sm:px-8 md:px-20 lg:px-32 pt-40 sm:pt-48 pb-16">
        <Reveal>
          <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: '#1D304590' }}>
            News
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1
            className="font-light uppercase leading-[1.15]"
            style={{ fontSize: 'clamp(2.2rem,5.5vw,5.5rem)', color: DARK }}
          >
            What the group has been doing
          </h1>
        </Reveal>
      </section>

      <section className="px-6 sm:px-8 md:px-12 pb-24 sm:pb-32">
        {ITEMS.map((item, i) => {
          const isOpen = open === i
          return (
            <Reveal key={item.title} delay={Math.min(i, 3) * 70}>
              <article className="border-t" style={{ borderColor: '#1D304526' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full py-8 sm:py-10 grid sm:grid-cols-[140px_110px_1fr_40px] gap-3 sm:gap-8 items-baseline text-left group"
                >
                  <span className="text-sm tabular-nums" style={{ color: '#1D304580' }}>{item.date}</span>
                  <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#1D304566' }}>
                    {item.tag}
                  </span>
                  <h2
                    className="text-xl sm:text-2xl font-light uppercase tracking-wide transition-transform duration-500 group-hover:translate-x-2"
                    style={{ color: DARK }}
                  >
                    {item.title}
                  </h2>
                  <span className="hidden sm:flex justify-end" style={{ color: '#1D304580' }}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                {/* morph, not arrival: the row is already on screen and changing shape */}
                <div
                  className="grid overflow-hidden"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: `grid-template-rows 0.5s ${MORPH}`,
                  }}
                >
                  <div className="min-h-0">
                    <p
                      className="pb-10 sm:pl-[calc(140px+110px+4rem)] max-w-2xl text-base leading-relaxed"
                      style={{ color: '#1D3045B3' }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
        <div className="border-t" style={{ borderColor: '#1D304526' }} />
      </section>
    </PageShell>
  )
}
