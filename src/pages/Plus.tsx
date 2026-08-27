import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DARK, ARRIVE } from '@/lib/theme'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'
import { Marquee } from '@/components/Marquee'
import { Magnetic } from '@/components/MagneticButton'
import { useEffect, useRef, useState } from 'react'

const PROGRAMS = [
  {
    num: '01',
    title: 'Hydrogen pilots',
    stage: 'Two electrolyser sites',
    body: 'Green hydrogen produced beside the wind that powers it, sold to the fertiliser plant next door. Short supply chains or none.',
  },
  {
    num: '02',
    title: 'Carbon capture',
    stage: 'FEED complete',
    body: 'Post-combustion capture at the Rotterdam terminal, storage in a depleted Vectrus field. We drilled it, we know where it holds.',
  },
  {
    num: '03',
    title: 'Methane sensing',
    stage: '40 sites live',
    body: 'Continuous sensors on our own assets first, because the credibility to sell monitoring starts with monitoring yourself.',
  },
]

const MANIFESTO =
  'Vectrus+ backs the ideas the core business is not ready for. Small teams, real budgets, a decade of patience.'

/* Word-level arrival: each word rises on its own delay once the block is on
   screen. One pass, then it is just a paragraph. */
function ManifestoReveal() {
  const ref = useRef<HTMLParagraphElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <p
      ref={ref}
      className="font-light uppercase leading-[1.3] max-w-5xl"
      style={{ fontSize: 'clamp(1.8rem,4.2vw,4rem)', color: DARK }}
    >
      {MANIFESTO.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block"
            style={{
              opacity: on ? 1 : 0,
              transform: on ? 'translateY(0)' : 'translateY(110%)',
              transition: `opacity 0.7s ${ARRIVE} ${i * 28}ms, transform 0.7s ${ARRIVE} ${i * 28}ms`,
            }}
          >
            {word}
          </span>
          {' '}
        </span>
      ))}
    </p>
  )
}

export default function Plus() {
  return (
    <PageShell title="Vectrus+">
      <section className="px-6 sm:px-8 md:px-20 lg:px-32 pt-40 sm:pt-48 pb-20">
        <Reveal>
          <p className="text-sm tracking-[0.3em] uppercase mb-10" style={{ color: '#1D304590' }}>
            Vectrus+
          </p>
        </Reveal>
        <ManifestoReveal />
      </section>

      <Reveal>
        <div className="border-y" style={{ borderColor: '#1D304526' }}>
          <Marquee duration={30} className="py-5">
            {['Hydrogen', 'Capture', 'Storage', 'Sensing', 'Patience'].map((w) => (
              <span
                key={w}
                className="px-10 text-xl sm:text-2xl font-extralight uppercase tracking-[0.3em] whitespace-nowrap"
                style={{ color: '#1D304566' }}
              >
                {w} ·
              </span>
            ))}
          </Marquee>
        </div>
      </Reveal>

      <section className="px-6 sm:px-8 md:px-12 py-20 sm:py-28">
        <div className="grid lg:grid-cols-3 gap-px" style={{ backgroundColor: '#1D304526' }}>
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.num} delay={i * 110} className="h-full">
              <div className="h-full p-8 sm:p-10 flex flex-col" style={{ backgroundColor: '#F4F5F3' }}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm" style={{ color: '#1D304566' }}>{p.num}</span>
                  <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#1D304580' }}>
                    {p.stage}
                  </span>
                </div>
                <h2 className="mt-12 text-2xl font-light uppercase tracking-wide" style={{ color: DARK }}>
                  {p.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: '#1D3045B3' }}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="text-white" style={{ backgroundColor: DARK }}>
        <div className="px-6 sm:px-8 md:px-12 py-16 sm:py-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <Reveal>
            <h2 className="text-2xl sm:text-4xl font-light uppercase tracking-wide">
              Working on something the grid is not ready for?
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <Magnetic>
              <Link
                to="/contact"
                className="flex items-center gap-4 group w-max"
                aria-label="Contact Vectrus+"
              >
                <span className="text-sm tracking-[0.3em] uppercase text-white/80">Pitch the desk</span>
                <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-800 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </PageShell>
  )
}
