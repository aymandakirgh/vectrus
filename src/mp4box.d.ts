declare module 'mp4box' {
  export interface MP4Sample {
    is_sync: boolean
    cts: number
    dts: number
    duration: number
    timescale: number
    data: Uint8Array
  }

  export interface MP4VideoTrack {
    id: number
    codec: string
    nb_samples: number
    timescale: number
    duration: number
    track_width: number
    track_height: number
    video?: { width: number; height: number }
  }

  export interface MP4Info {
    duration: number
    timescale: number
    videoTracks: MP4VideoTrack[]
  }

  export interface MP4File {
    onReady: ((info: MP4Info) => void) | null
    onError: ((e: string) => void) | null
    onSamples: ((id: number, user: unknown, samples: MP4Sample[]) => void) | null
    appendBuffer(buffer: ArrayBuffer): number
    setExtractionOptions(id: number, user?: unknown, options?: { nbSamples?: number }): void
    start(): void
    stop(): void
    flush(): void
    getTrackById(id: number): any
  }

  const MP4Box: {
    createFile(): MP4File
    DataStream: {
      new (buffer?: ArrayBuffer, byteOffset?: number, endianness?: boolean): { buffer: ArrayBuffer }
      BIG_ENDIAN: boolean
      LITTLE_ENDIAN: boolean
    }
  }

  export default MP4Box
}
