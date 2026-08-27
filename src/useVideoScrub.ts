import { useEffect, useRef, useState } from 'react'
import MP4Box from 'mp4box'
import type { MP4File, MP4Sample, MP4VideoTrack } from 'mp4box'

const LERP_TAU = 8
const SNAP = 0.002
const LRU_MAX = 24
const LEAD = 24
const WATCHDOG = 60000

interface BankFrame {
  ts: number // microseconds
  blob: Blob
}

/* Survives route changes: coming back to the scene reuses the decoded bank
   instead of re-fetching and re-decoding the whole clip. */
const bankCache = new Map<string, BankFrame[]>()

export function useVideoScrub(videoSrc: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canvasLive, setCanvasLive] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!video || !canvas || !container) return

    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const bank: BankFrame[] = []
    const lru = new Map<number, ImageBitmap | null>()
    let current = 0
    let target = 0
    let ready = false
    let reverted = false
    let painted = false
    let building = false
    let dur = 0
    let disposed = false
    let raf = 0
    let last = performance.now()
    let span = Math.max(1, container.offsetHeight - window.innerHeight)

    const measure = () => {
      span = Math.max(1, container.offsetHeight - window.innerHeight)
    }
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)

    const onMeta = () => {
      dur = video.duration || 0
    }
    video.addEventListener('loadedmetadata', onMeta)
    if (video.readyState >= 1) onMeta()

    const getProgress = () =>
      Math.min(1, Math.max(0, window.scrollY / span))

    // binary search on timestamps (compare t*1e6)
    const nearestIndex = (t: number) => {
      const tu = t * 1e6
      let lo = 0
      let hi = bank.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (bank[mid].ts < tu) lo = mid + 1
        else hi = mid
      }
      if (lo > 0 && Math.abs(bank[lo - 1].ts - tu) <= Math.abs(bank[lo].ts - tu)) return lo - 1
      return lo
    }

    const warmLRU = (i: number) => {
      for (let j = i - 1; j <= i + 2; j++) {
        if (j < 0 || j >= bank.length || lru.has(j)) continue
        lru.set(j, null)
        createImageBitmap(bank[j].blob)
          .then((bmp) => {
            if (disposed || !lru.has(j)) {
              bmp.close()
              return
            }
            lru.set(j, bmp)
          })
          .catch(() => {
            lru.delete(j)
          })
      }
      while (lru.size > LRU_MAX) {
        const oldest = lru.keys().next().value as number | undefined
        if (oldest === undefined) break
        const bmp = lru.get(oldest)
        lru.delete(oldest)
        if (bmp) bmp.close()
      }
    }

    const drawFrame = (t: number) => {
      if (!ctx || bank.length === 0) return
      const i = nearestIndex(t)
      warmLRU(i)
      const bmp = lru.get(i)
      if (bmp) {
        ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height)
        if (!painted) {
          painted = true
          setCanvasLive(true)
        }
      }
    }

    const loop = (now: number) => {
      if (disposed) return
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const p = getProgress()
      setScrollProgress(p)
      if (dur > 0) {
        target = p * dur
        if (reducedMotion) {
          current = target
        } else {
          current += (target - current) * (1 - Math.exp(-dt * LERP_TAU))
          if (Math.abs(target - current) < SNAP) current = target
        }
        if (ready && !reverted) {
          drawFrame(current)
        } else if (!video.seeking && Math.abs(video.currentTime - current) > 0.01) {
          video.currentTime = current
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // ---- frame bank (WebCodecs) ----

    // strip the 8-byte box header so the decoder gets the raw codec description
    const getDescription = (file: MP4File, track: MP4VideoTrack): Uint8Array | undefined => {
      const trak = file.getTrackById(track.id)
      for (const entry of trak.mdia.minf.stbl.stsd.entries) {
        const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
        if (box) {
          const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN)
          box.write(stream)
          return new Uint8Array(stream.buffer, 8)
        }
      }
      return undefined
    }

    const extractSamples = (buffer: ArrayBuffer) =>
      new Promise<{ track: MP4VideoTrack; samples: MP4Sample[]; description?: Uint8Array }>(
        (resolve, reject) => {
          const file = MP4Box.createFile()
          let track: MP4VideoTrack | null = null
          const samples: MP4Sample[] = []
          file.onError = (e) => reject(new Error(String(e)))
          file.onReady = (info) => {
            track = info.videoTracks[0] ?? null
            if (!track) {
              reject(new Error('no video track'))
              return
            }
            file.setExtractionOptions(track.id, null, { nbSamples: track.nb_samples })
            file.start()
          }
          file.onSamples = (_id, _user, batch) => {
            samples.push(...batch)
            if (track && samples.length >= track.nb_samples) {
              file.stop()
              file.flush()
              resolve({ track, samples, description: getDescription(file, track) })
            }
          }
          ;(buffer as ArrayBuffer & { fileStart: number }).fileStart = 0
          file.appendBuffer(buffer)
          file.flush()
        },
      )

    const decodeAll = (
      track: MP4VideoTrack,
      samples: MP4Sample[],
      description: Uint8Array | undefined,
      hardwareAcceleration: 'prefer-hardware' | 'prefer-software',
    ) =>
      new Promise<void>((resolve, reject) => {
        const off = document.createElement('canvas')
        off.width = track.video?.width || track.track_width || 1920
        off.height = track.video?.height || track.track_height || 1080
        const offCtx = off.getContext('2d')
        if (!offCtx) {
          reject(new Error('no 2d context'))
          return
        }
        let submitted = 0
        let encodedDone = 0
        let settled = false
        const fail = (e: unknown) => {
          if (!settled) {
            settled = true
            reject(e instanceof Error ? e : new Error(String(e)))
          }
        }
        const decoder = new VideoDecoder({
          output: (frame) => {
            offCtx.drawImage(frame, 0, 0, off.width, off.height)
            const ts = frame.timestamp
            frame.close()
            off.toBlob(
              (blob) => {
                if (blob) bank.push({ ts, blob })
                encodedDone++
              },
              'image/webp',
              0.82,
            )
          },
          error: fail,
        })
        const config: VideoDecoderConfig = { codec: track.codec, hardwareAcceleration }
        if (description) config.description = description
        ;(async () => {
          try {
            decoder.configure(config)
            for (const s of samples) {
              if (disposed) return
              // LEAD throttle: decode must not outrun blob encoding
              while (submitted - encodedDone >= LEAD) {
                await new Promise((r) => setTimeout(r, 15))
              }
              decoder.decode(
                new EncodedVideoChunk({
                  type: s.is_sync ? 'key' : 'delta',
                  timestamp: (s.cts * 1e6) / s.timescale,
                  duration: (s.duration * 1e6) / s.timescale,
                  data: s.data,
                }),
              )
              submitted++
            }
            await decoder.flush()
            while (encodedDone < submitted) {
              await new Promise((r) => setTimeout(r, 15))
            }
            decoder.close()
            if (!settled) {
              settled = true
              resolve()
            }
          } catch (e) {
            fail(e)
          }
        })()
      })

    const buildBank = async () => {
      const cached = bankCache.get(videoSrc)
      if (cached && cached.length > 0) {
        bank.push(...cached)
        ready = true
        return
      }
      // CORS: the CloudFront fetch needs ACAO; <video> stays as fallback if it fails
      const res = await fetch(videoSrc, { mode: 'cors' })
      const buffer = await res.arrayBuffer()
      const { track, samples, description } = await extractSamples(buffer)
      try {
        await decodeAll(track, samples, description, 'prefer-hardware')
      } catch {
        bank.length = 0
        await decodeAll(track, samples, description, 'prefer-software')
      }
      bank.sort((a, b) => a.ts - b.ts)
      if (bank.length === 0) throw new Error('empty frame bank')
      bankCache.set(videoSrc, [...bank])
      ready = true
    }

    const startBuild = () => {
      if (disposed || building || ready || reducedMotion) return
      if (typeof window.VideoDecoder === 'undefined') return
      building = true
      const watchdog = window.setTimeout(() => {
        if (!ready) {
          reverted = true
          setCanvasLive(false)
        }
      }, WATCHDOG)
      buildBank()
        .then(() => {
          window.clearTimeout(watchdog)
        })
        .catch(() => {
          window.clearTimeout(watchdog)
          reverted = true
          setCanvasLive(false)
        })
        .finally(() => {
          building = false
        })
    }

    if (document.readyState === 'complete') startBuild()
    else window.addEventListener('load', startBuild, { once: true })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      window.removeEventListener('load', startBuild)
      video.removeEventListener('loadedmetadata', onMeta)
      for (const bmp of lru.values()) bmp?.close()
      lru.clear()
      bank.length = 0
    }
  }, [videoSrc])

  return { containerRef, videoRef, canvasRef, scrollProgress, canvasLive }
}
