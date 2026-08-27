import { useEffect, useRef, useState, type FormEvent } from 'react'
import { DARK, MORPH } from '@/lib/theme'
import { PageShell } from '@/components/PageShell'
import { Reveal } from '@/components/Reveal'
import { Magnetic } from '@/components/MagneticButton'

const OFFICES = [
  { city: 'Oslo', line: 'Strandpromenaden 11, 0252 Oslo', role: 'Group headquarters' },
  { city: 'Geneva', line: 'Quai du Mont-Blanc 4, 1201 Geneva', role: 'Trading' },
  { city: 'Houston', line: '811 Louisiana St, Houston, TX 77002', role: 'Trading, upstream' },
  { city: 'Singapore', line: '12 Marina Blvd, Singapore 018982', role: 'Trading' },
]

/* Two beats, in order, no overlap: the spinner holds long enough to read as
   work (1500ms), the arc closes into a circle (460ms), THEN the check traces
   (500ms). The spin is never stopped: once the arc closes there is nothing
   left to halt. */
const LOADER_MS = 1500
const RING_MS = 460
const TRACE_MS = 500

type Phase = 'idle' | 'loading' | 'ring' | 'check' | 'done'

function SubmitButton({ phase }: { phase: Phase }) {
  const busy = phase !== 'idle'
  return (
    <button
      type="submit"
      disabled={busy}
      className="relative flex items-center justify-center gap-3 h-14 px-10 rounded-full text-white text-sm tracking-[0.25em] uppercase transition-opacity duration-300 disabled:opacity-90 hover:opacity-85"
      style={{ backgroundColor: DARK }}
    >
      <span
        className="transition-opacity duration-200"
        style={{ opacity: phase === 'idle' ? 1 : 0 }}
      >
        Send message
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: busy ? 1 : 0 }}
        aria-hidden={!busy}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          {/* open arc while loading, closes into a full circle on the first beat */}
          <circle
            cx="13"
            cy="13"
            r="10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={Math.PI * 20}
            strokeDashoffset={phase === 'loading' ? Math.PI * 20 * 0.72 : 0}
            style={{
              transformOrigin: '13px 13px',
              animation: phase === 'loading' || phase === 'ring' ? 'spinRing 0.9s linear infinite' : 'none',
              transition: `stroke-dashoffset ${RING_MS}ms cubic-bezier(0.77,0,0.175,1)`,
            }}
          />
          {/* the check waits out the ring in full, then traces */}
          <path
            d="M8.5 13.5 L11.8 16.8 L18 9.8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={14}
            strokeDashoffset={phase === 'check' || phase === 'done' ? 0 : 14}
            style={{ transition: `stroke-dashoffset ${TRACE_MS}ms cubic-bezier(0.77,0,0.175,1)` }}
          />
        </svg>
      </span>
    </button>
  )
}

export default function Contact() {
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (phase !== 'idle') return
    setPhase('loading')
    const later = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms))
    }
    later(() => setPhase('ring'), LOADER_MS)
    later(() => setPhase('check'), LOADER_MS + RING_MS)
    later(() => setPhase('done'), LOADER_MS + RING_MS + TRACE_MS + 300)
  }

  const sent = phase === 'done'

  return (
    <PageShell title="Contact">
      <section className="px-6 sm:px-8 md:px-12 pt-40 sm:pt-48 pb-24 sm:pb-32 grid lg:grid-cols-2 gap-16 lg:gap-24">
        {/* left: the group, the offices */}
        <div>
          <Reveal>
            <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: '#1D304590' }}>
              Contact
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1
              className="font-light uppercase leading-[1.15]"
              style={{ fontSize: 'clamp(2.2rem,4.5vw,4.5rem)', color: DARK }}
            >
              Talk to the group
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 max-w-md text-base sm:text-lg leading-relaxed" style={{ color: '#1D3045CC' }}>
              One inbox reaches every desk. Say what you are working on and the right people answer,
              usually within two working days.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <a
              href="mailto:desk@vectrus.example"
              className="mt-6 inline-block text-lg underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
              style={{ color: DARK }}
            >
              desk@vectrus.example
            </a>
          </Reveal>

          <div className="mt-16 grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {OFFICES.map((o, i) => (
              <Reveal key={o.city} delay={i * 80}>
                <div className="border-l pl-5" style={{ borderColor: '#1D304526' }}>
                  <p className="text-lg font-light uppercase tracking-wide" style={{ color: DARK }}>{o.city}</p>
                  <p className="mt-1 text-sm" style={{ color: '#1D3045B3' }}>{o.line}</p>
                  <p className="mt-1 text-xs tracking-[0.2em] uppercase" style={{ color: '#1D304566' }}>{o.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* right: the form */}
        <Reveal delay={200}>
          <div className="relative">
            <form
              onSubmit={onSubmit}
              className="space-y-10 transition-opacity duration-500"
              style={{ opacity: sent ? 0 : 1, pointerEvents: sent ? 'none' : 'auto' }}
              aria-hidden={sent}
            >
              <Field label="Name" name="name" type="text" autoComplete="name" required />
              <Field label="Email" name="email" type="email" autoComplete="email" required />
              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ color: '#1D304580' }}
                >
                  What are you working on
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full bg-transparent border-b pb-3 text-lg font-light outline-none resize-none transition-colors duration-300 focus:border-[#1D3045]"
                  style={{ borderColor: '#1D304540', color: DARK }}
                />
              </div>
              <Magnetic>
                <SubmitButton phase={phase} />
              </Magnetic>
            </form>

            {/* confirmation swaps in only after both beats have played */}
            <div
              className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
              style={{ opacity: sent ? 1 : 0, pointerEvents: 'none', transitionTimingFunction: MORPH as string }}
              aria-live="polite"
            >
              {sent && (
                <>
                  <p className="text-2xl sm:text-3xl font-light uppercase tracking-wide" style={{ color: DARK }}>
                    Received.
                  </p>
                  <p className="mt-4 max-w-sm text-base leading-relaxed" style={{ color: '#1D3045B3' }}>
                    Your note is with the Oslo desk. Expect an answer within two working days. This
                    is a concept study, so nothing actually left your browser.
                  </p>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  )
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  label: string
  name: string
  type: string
  autoComplete: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs tracking-[0.2em] uppercase mb-3"
        style={{ color: '#1D304580' }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full bg-transparent border-b pb-3 text-lg font-light outline-none transition-colors duration-300 focus:border-[#1D3045]"
        style={{ borderColor: '#1D304540', color: DARK }}
      />
    </div>
  )
}
