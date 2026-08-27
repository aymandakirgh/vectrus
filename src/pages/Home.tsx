import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowDown, ChevronUp } from 'lucide-react'
import { useVideoScrub } from '@/useVideoScrub'
import { DARK, STAGGER_EASE, VIDEO_URL } from '@/lib/theme'
import { Navbar } from '@/components/Navbar'
import { MobileMenu } from '@/components/MobileMenu'
import { Footer } from '@/components/Footer'
import { Magnetic } from '@/components/MagneticButton'

function Stagger({
  visible,
  delay,
  className = '',
  children,
}: {
  visible: boolean
  delay: number
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s ${STAGGER_EASE} ${delay}ms, transform 0.8s ${STAGGER_EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function SectionOne({ opacity }: { opacity: number }) {
  const visible = opacity > 0.3
  const navigate = useNavigate()
  return (
    <section
      className="absolute inset-0"
      style={{
        opacity,
        transition: 'opacity 0.1s ease-out',
        visibility: opacity === 0 ? 'hidden' : 'visible',
      }}
    >
      <div className="h-full flex items-center px-6 sm:px-8 md:px-20 lg:px-32">
        <div>
          <Stagger visible={visible} delay={0}>
            <h1
              className="font-light uppercase leading-[1.2]"
              style={{ fontSize: 'clamp(2rem,5vw,5rem)', color: DARK }}
            >
              Advancing resources for a cleaner future
            </h1>
          </Stagger>
          <Stagger visible={visible} delay={150}>
            <p className="mt-6 text-sm tracking-[0.3em] uppercase" style={{ color: '#1D304590' }}>
              Sustainable power with purpose
            </p>
          </Stagger>
        </div>
      </div>
      <Stagger visible={visible} delay={300} className="absolute bottom-12 right-6 sm:right-8 md:right-12">
        <Magnetic>
          <button
            aria-label="Explore Vectrus Upstream"
            onClick={() => navigate('/upstream')}
            className="w-12 h-12 rounded-full border flex items-center justify-center hover:opacity-70 pointer-events-auto"
            style={{ borderColor: '#1D304580', color: DARK }}
          >
            <ArrowRight size={18} />
          </button>
        </Magnetic>
      </Stagger>
    </section>
  )
}

function SectionTwo({ opacity, span }: { opacity: number; span: () => number }) {
  const visible = opacity > 0.3
  const jump = (p: number) =>
    window.scrollTo({ top: Math.round(span() * p), behavior: 'smooth' })
  return (
    <section
      className="absolute inset-0"
      style={{
        opacity,
        transition: 'opacity 0.1s ease-out',
        visibility: opacity === 0 ? 'hidden' : 'visible',
      }}
    >
      <div className="h-full flex items-center justify-center px-6 sm:px-8">
        <Stagger visible={visible} delay={0} className="max-w-[900px]">
          <h2
            className="font-extralight tracking-wide leading-[1.3] text-center uppercase"
            style={{ fontSize: 'clamp(1.5rem,4.5vw,4.5rem)', color: DARK }}
          >
            We build lasting partnerships with vision{' '}
            <span style={{ color: '#1D3045CC' }}>and precision</span>{' '}
            <span style={{ color: '#1D304580' }}>across every frontier</span>
          </h2>
        </Stagger>
      </div>
      <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4">
        <Stagger visible={visible} delay={200}>
          <Magnetic>
            <button
              aria-label="Continue to the next section"
              onClick={() => jump(0.85)}
              className="w-12 h-12 rounded-full border flex items-center justify-center pointer-events-auto hover:opacity-70"
              style={{ borderColor: '#1D304566', color: DARK }}
            >
              <ArrowDown size={18} />
            </button>
          </Magnetic>
        </Stagger>
        <Stagger visible={visible} delay={350} className="mt-4">
          <div className="flex items-center gap-2">
            <button aria-label="Go to the opening section" onClick={() => jump(0)} className="w-2 h-2 rounded-full pointer-events-auto" style={{ backgroundColor: DARK }} />
            <button aria-label="Stay on this section" onClick={() => jump(0.45)} className="w-1.5 h-1.5 rounded-full pointer-events-auto" style={{ backgroundColor: '#1D304566' }} />
            <button aria-label="Go to the closing section" onClick={() => jump(0.85)} className="w-1.5 h-1.5 rounded-full pointer-events-auto" style={{ backgroundColor: '#1D304566' }} />
          </div>
        </Stagger>
        <Stagger visible={visible} delay={500} className="mt-2">
          <Magnetic>
            <button
              aria-label="Back to the top"
              onClick={() => jump(0)}
              className="w-10 h-10 rounded-full border flex items-center justify-center pointer-events-auto hover:opacity-70"
              style={{ borderColor: '#1D30454D', color: '#1D3045CC' }}
            >
              <ChevronUp size={16} />
            </button>
          </Magnetic>
        </Stagger>
      </div>
    </section>
  )
}

function SectionThree({ opacity }: { opacity: number }) {
  const visible = opacity > 0.3
  return (
    <section
      className="absolute inset-0"
      style={{
        opacity,
        transition: 'opacity 0.1s ease-out',
        visibility: opacity === 0 ? 'hidden' : 'visible',
      }}
    >
      <div className="h-full flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32">
        <div className="max-w-2xl text-left">
          <Stagger visible={visible} delay={0}>
            <p className="text-white/60 text-lg tracking-wide mb-4">Halder | Nordvik</p>
          </Stagger>
          <Stagger visible={visible} delay={150}>
            <h2
              className="font-light text-white leading-[1.2] uppercase tracking-wide mb-8"
              style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}
            >
              Fueling ambition,
              <br />
              shaping tomorrow.
            </h2>
          </Stagger>
          <Stagger visible={visible} delay={300}>
            <Link to="/contact" className="flex items-center gap-4 pointer-events-auto group w-max">
              <span className="text-sm tracking-[0.3em] text-white/80 uppercase">
                Contact Nordvik
              </span>
              <Magnetic>
                <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-800 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={16} />
                </span>
              </Magnetic>
            </Link>
          </Stagger>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { containerRef, videoRef, canvasRef, scrollProgress: p, canvasLive } = useVideoScrub(VIDEO_URL)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'Vectrus'
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const span = () =>
    (containerRef.current?.offsetHeight ?? window.innerHeight * 5) - window.innerHeight

  const s1 = p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.08)
  const s2 =
    p < 0.32 ? 0 : p < 0.4 ? (p - 0.32) / 0.08 : p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.08)
  const s3 = p < 0.67 ? 0 : p < 0.75 ? (p - 0.67) / 0.08 : 1

  return (
    <>
      <div ref={containerRef} className="relative h-[500vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              canvasLive ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div className="absolute inset-0 pointer-events-none">
            <Navbar isLight={p > 0.55} onOpenMenu={() => setMenuOpen(true)} />
            <SectionOne opacity={s1} />
            <SectionTwo opacity={s2} span={span} />
            <SectionThree opacity={s3} />
          </div>
        </div>
      </div>
      <Footer />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
