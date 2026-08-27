import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DARK } from '@/lib/theme'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'
import { Marquee } from '@/components/Marquee'
import { Magnetic } from '@/components/MagneticButton'

interface Contract {
  symbol: string
  name: string
  unit: string
  base: number
  decimals: number
}

const CONTRACTS: Contract[] = [
  { symbol: 'BRN', name: 'Brent Crude', unit: 'USD/bbl', base: 78.4, decimals: 2 },
  { symbol: 'WTI', name: 'WTI Crude', unit: 'USD/bbl', base: 74.1, decimals: 2 },
  { symbol: 'TTF', name: 'Dutch TTF Gas', unit: 'EUR/MWh', base: 31.7, decimals: 2 },
  { symbol: 'JKM', name: 'JKM LNG', unit: 'USD/MMBtu', base: 11.9, decimals: 2 },
  { symbol: 'NEWC', name: 'Newcastle Coal', unit: 'USD/t', base: 136.5, decimals: 1 },
  { symbol: 'EUA', name: 'EU Carbon', unit: 'EUR/t', base: 71.2, decimals: 2 },
]

const DESKS = [
  { city: 'Oslo', tz: 'Europe/Oslo' },
  { city: 'Geneva', tz: 'Europe/Zurich' },
  { city: 'Houston', tz: 'America/Chicago' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
]

/* Deterministic walk: same chart on every visit, so the page never lies twice. */
function walk(seedBase: number, n: number) {
  let seed = Math.floor(seedBase * 1000) | 0
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const out: number[] = []
  let v = 0
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.5) * 2
    out.push(v)
  }
  return out
}

function Sparkline({ base }: { base: number }) {
  const points = useMemo(() => {
    const data = walk(base, 40)
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    return data
      .map((v, i) => `${(i / 39) * 100},${28 - ((v - min) / range) * 24 - 2}`)
      .join(' ')
  }, [base])
  return (
    <svg viewBox="0 0 100 28" className="w-24 h-7" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke={DARK} strokeWidth="1.2" opacity="0.7" />
    </svg>
  )
}

function useTicks() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((t) => t + 1), 2400)
    return () => clearInterval(id)
  }, [])
  return tick
}

function price(c: Contract, tick: number) {
  const drift = Math.sin(tick * 0.7 + c.base) * 0.42 + Math.sin(tick * 0.31 + c.base * 2) * 0.21
  return c.base + drift
}

export default function Markets() {
  const tick = useTicks()

  return (
    <PageShell title="Markets">
      <section className="px-6 sm:px-8 md:px-20 lg:px-32 pt-40 sm:pt-48 pb-16 max-w-5xl">
        <Reveal>
          <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: '#1D304590' }}>
            Vectrus Markets
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h1
            className="font-light uppercase leading-[1.15]"
            style={{ fontSize: 'clamp(2.2rem,5.5vw,5.5rem)', color: DARK }}
          >
            Price is a signal. We listen all day.
          </h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: '#1D3045CC' }}>
            Four desks trade the group's production and third-party flow around the clock. Physical
            first, paper where it hedges something real.
          </p>
        </Reveal>
      </section>

      {/* ticker */}
      <Reveal>
        <div className="border-y" style={{ borderColor: '#1D304526' }}>
          <Marquee duration={40} className="py-4">
            {CONTRACTS.map((c) => {
              const p = price(c, tick)
              const up = p >= c.base
              return (
                <span key={c.symbol} className="flex items-baseline gap-3 px-8 whitespace-nowrap">
                  <span className="text-xs tracking-[0.2em] uppercase font-medium" style={{ color: DARK }}>
                    {c.symbol}
                  </span>
                  <span className="text-sm tabular-nums" style={{ color: up ? DARK : '#1D304580' }}>
                    {p.toFixed(c.decimals)} {up ? '+' : '−'}
                  </span>
                </span>
              )
            })}
          </Marquee>
        </div>
      </Reveal>

      {/* desk table */}
      <section className="px-6 sm:px-8 md:px-12 py-16 sm:py-24">
        <Reveal>
          <p className="text-sm tracking-[0.3em] uppercase mb-10" style={{ color: '#1D304590' }}>
            The board, delayed
          </p>
        </Reveal>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-xs tracking-[0.2em] uppercase" style={{ color: '#1D304580' }}>
                <th className="pb-4 font-medium">Contract</th>
                <th className="pb-4 font-medium">Unit</th>
                <th className="pb-4 font-medium text-right">Last</th>
                <th className="pb-4 font-medium text-right">Session</th>
                <th className="pb-4 font-medium text-right">30 days</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACTS.map((c, i) => {
                const p = price(c, tick)
                const delta = p - c.base
                const up = delta >= 0
                return (
                  <tr key={c.symbol} className="border-t group" style={{ borderColor: '#1D304526' }}>
                    <td className="py-5">
                      <Reveal delay={i * 60}>
                        <div className="flex items-baseline gap-3">
                          <span className="text-sm font-medium tracking-wide" style={{ color: DARK }}>{c.symbol}</span>
                          <span className="text-sm" style={{ color: '#1D304580' }}>{c.name}</span>
                        </div>
                      </Reveal>
                    </td>
                    <td className="py-5 text-sm" style={{ color: '#1D304580' }}>{c.unit}</td>
                    <td className="py-5 text-right text-lg font-light tabular-nums transition-colors duration-500" style={{ color: DARK }}>
                      {p.toFixed(c.decimals)}
                    </td>
                    <td className="py-5 text-right text-sm tabular-nums" style={{ color: up ? DARK : '#1D304580' }}>
                      {up ? '+' : '−'}{Math.abs(delta).toFixed(2)}
                    </td>
                    <td className="py-5">
                      <div className="flex justify-end">
                        <Sparkline base={c.base} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs tracking-wide" style={{ color: '#1D304566' }}>
          Indicative levels for a concept study. Nobody should trade off this page.
        </p>
      </section>

      {/* desks */}
      <section className="text-white" style={{ backgroundColor: DARK }}>
        <div className="px-6 sm:px-8 md:px-12 py-16 sm:py-24">
          <Reveal>
            <p className="text-sm tracking-[0.3em] uppercase mb-12 text-white/50">Four desks, one book</p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {DESKS.map((d, i) => (
              <Reveal key={d.city} delay={i * 90}>
                <div className="border-l border-white/20 pl-5">
                  <LocalTime tz={d.tz} />
                  <p className="mt-2 text-xs tracking-[0.2em] uppercase text-white/50">{d.city}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-8 md:px-12 py-20 sm:py-28 flex items-center justify-between gap-6">
        <Reveal>
          <p className="text-2xl sm:text-4xl font-light uppercase tracking-wide" style={{ color: DARK }}>
            The flow the desk trades, the systems carry.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <Magnetic>
            <Link
              to="/systems"
              aria-label="Continue to Vectrus Systems"
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

function LocalTime({ tz }: { tz: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <p className="text-3xl sm:text-4xl font-light tabular-nums">
      {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz })}
    </p>
  )
}
