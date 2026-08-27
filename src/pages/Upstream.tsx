import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DARK, VIDEO_URL } from '@/lib/theme'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'
import { CountUp } from '@/components/CountUp'
import { TopoField } from '@/components/TopoField'
import { Magnetic } from '@/components/MagneticButton'

const STATS = [
  { value: 14, label: 'Basins under survey' },
  { value: 380, label: 'Active wells' },
  { value: 2.4, decimals: 1, suffix: ' GW', label: 'Installed capacity' },
  { value: 96, suffix: '%', label: 'Recovery efficiency' },
]

const OPERATIONS = [
  {
    num: '01',
    title: 'Seismic acquisition',
    body: 'Wide-azimuth surveys shot in-house, processed within the week. The subsurface picture stays current, not archival.',
  },
  {
    num: '02',
    title: 'Drilling and completions',
    body: 'Standardised well designs across every basin. A rig crew in Basin 9 reads the same program as one in Basin 2.',
  },
  {
    num: '03',
    title: 'Field development',
    body: 'Tiebacks before new topsides, electrification before expansion. The cheapest barrel is the one that reuses what stands.',
  },
]

export default function Upstream() {
  return (
    <PageShell title="Upstream">
      {/* hero over drifting contours */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <TopoField />
        </div>
        <div className="relative px-6 sm:px-8 md:px-20 lg:px-32 pt-32 pb-24 max-w-5xl">
          <Reveal>
            <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: '#1D304590' }}>
              Vectrus Upstream
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1
              className="font-light uppercase leading-[1.15]"
              style={{ fontSize: 'clamp(2.2rem,5.5vw,5.5rem)', color: DARK }}
            >
              We find energy where the maps end
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: '#1D3045CC' }}>
              Exploration and production across fourteen basins. Every well starts as a question
              about the subsurface. Every answer is logged, audited, and shared across the group.
            </p>
          </Reveal>
        </div>
      </section>

      {/* stats band */}
      <section className="text-white" style={{ backgroundColor: DARK }}>
        <div className="px-6 sm:px-8 md:px-12 py-16 sm:py-24 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="border-l border-white/20 pl-5">
                <div className="font-light leading-none" style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)' }}>
                  <CountUp value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix ?? ''} />
                </div>
                <p className="mt-3 text-xs tracking-[0.2em] uppercase text-white/50">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* operations list */}
      <section className="px-6 sm:px-8 md:px-12 py-20 sm:py-28">
        <Reveal>
          <p className="text-sm tracking-[0.3em] uppercase mb-12" style={{ color: '#1D304590' }}>
            How the work runs
          </p>
        </Reveal>
        <div>
          {OPERATIONS.map((op, i) => (
            <Reveal key={op.num} delay={i * 100}>
              <div className="group border-t py-10 sm:py-12 grid sm:grid-cols-[80px_1fr_1.2fr] gap-4 sm:gap-8 items-baseline" style={{ borderColor: '#1D304526' }}>
                <span className="text-sm" style={{ color: '#1D304566' }}>{op.num}</span>
                <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-wide transition-transform duration-500 group-hover:translate-x-2" style={{ color: DARK }}>
                  {op.title}
                </h2>
                <p className="text-base leading-relaxed" style={{ color: '#1D3045B3' }}>{op.body}</p>
              </div>
            </Reveal>
          ))}
          <div className="border-t" style={{ borderColor: '#1D304526' }} />
        </div>
      </section>

      {/* field band: ambient loop of the flight footage */}
      <section className="relative h-[60vh] overflow-hidden">
        <video
          src={VIDEO_URL}
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end">
          <Reveal className="px-6 sm:px-8 md:px-12 pb-12">
            <p className="text-sm tracking-[0.3em] uppercase" style={{ color: DARK }}>
              Survey flight, northern ridge. August 2026.
            </p>
          </Reveal>
        </div>
      </section>

      {/* next */}
      <section className="px-6 sm:px-8 md:px-12 py-20 sm:py-28 flex items-center justify-between gap-6">
        <Reveal>
          <p className="text-2xl sm:text-4xl font-light uppercase tracking-wide" style={{ color: DARK }}>
            What the wells produce, the desk prices.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <Magnetic>
            <Link
              to="/markets"
              aria-label="Continue to Vectrus Markets"
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
