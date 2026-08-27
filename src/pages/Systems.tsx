import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { DARK } from '@/lib/theme'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'
import { NetworkField } from '@/components/NetworkField'
import { Magnetic } from '@/components/MagneticButton'

const CAPABILITIES = [
  {
    num: '01',
    title: 'Grid integration',
    body: 'Interconnection studies, protection schemes, and the paperwork nobody photographs. Power that arrives is power that was engineered to.',
  },
  {
    num: '02',
    title: 'Storage',
    body: 'Battery and pumped assets sized against real curtailment data from our own desks, not a vendor deck.',
  },
  {
    num: '03',
    title: 'Telemetry and SCADA',
    body: 'Every site reports to one operations room in Oslo. Fifteen-second resolution, five-year retention.',
  },
  {
    num: '04',
    title: 'Pipeline integrity',
    body: 'Inline inspection on a fixed calendar, cathodic protection on live monitoring. Leaks are found in models first.',
  },
  {
    num: '05',
    title: 'Terminal automation',
    body: 'Berth to book without a clipboard. Rotterdam ran its first fully automated lifting in June.',
  },
  {
    num: '06',
    title: 'Forecasting',
    body: 'Weather, load, and price models tuned by the people who bear their errors. The desk and the model share a wall.',
  },
]

export default function Systems() {
  return (
    <PageShell title="Systems">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-90">
          <NetworkField />
        </div>
        <div className="relative px-6 sm:px-8 md:px-20 lg:px-32 pt-32 pb-24 max-w-5xl">
          <Reveal>
            <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: '#1D304590' }}>
              Vectrus Systems
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1
              className="font-light uppercase leading-[1.15]"
              style={{ fontSize: 'clamp(2.2rem,5.5vw,5.5rem)', color: DARK }}
            >
              Infrastructure that keeps its promises
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: '#1D3045CC' }}>
              The group's engineering arm designs, builds, and operates the hardware between a
              resource and its buyer. Quietly, on schedule, for decades at a time.
            </p>
          </Reveal>
        </div>
      </section>

      {/* capability grid */}
      <section className="px-6 sm:px-8 md:px-12 pb-20 sm:pb-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l" style={{ borderColor: '#1D304526' }}>
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.num} delay={(i % 3) * 90}>
              <div
                className="group relative h-full border-r border-b p-8 sm:p-10 transition-colors duration-500 hover:bg-[#1D3045] cursor-default"
                style={{ borderColor: '#1D304526' }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm transition-colors duration-500 group-hover:text-white/50" style={{ color: '#1D304566' }}>
                    {c.num}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="opacity-0 -translate-x-1 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-white"
                    style={{ color: DARK }}
                  />
                </div>
                <h2
                  className="mt-14 text-xl sm:text-2xl font-light uppercase tracking-wide transition-colors duration-500 group-hover:text-white"
                  style={{ color: DARK }}
                >
                  {c.title}
                </h2>
                <p
                  className="mt-4 text-sm leading-relaxed transition-colors duration-500 group-hover:text-white/70"
                  style={{ color: '#1D3045B3' }}
                >
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* delivery record */}
      <section className="text-white" style={{ backgroundColor: DARK }}>
        <div className="px-6 sm:px-8 md:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-wide leading-[1.25]">
              Twenty-two projects delivered in the last decade. Twenty-one on time.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-white/60 leading-relaxed max-w-md">
              The twenty-second was a Baltic interconnector held up by a court, not a contractor. We
              publish the record either way, because a delivery claim you cannot audit is marketing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 sm:px-8 md:px-12 py-20 sm:py-28 flex items-center justify-between gap-6">
        <Reveal>
          <p className="text-2xl sm:text-4xl font-light uppercase tracking-wide" style={{ color: DARK }}>
            And the ideas that outgrow all of this.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <Magnetic>
            <Link
              to="/plus"
              aria-label="Continue to Vectrus+"
              className="w-14 h-14 rounded-full border flex items-center justify-center hover:opacity-70 shrink-0"
              style={{ borderColor: '#1D304580', color: DARK }}
            >
              <ArrowRight size={20} />
            </Link>
          </Magnetic>
        </Reveal>
      </section>
    </PageShell>
  )
}
