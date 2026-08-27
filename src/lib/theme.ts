export const DARK = '#1D3045'
export const PAPER = '#F4F5F3'

/* Curve families from the bakai lab harvest: pick by what the element is doing. */
export const ARRIVE = 'cubic-bezier(0.19,1,0.22,1)' // was not on screen
export const MORPH = 'cubic-bezier(0.77,0,0.175,1)' // already on screen, changing
export const LEAVE = 'cubic-bezier(0.32,0.72,0,1)' // dismissal
export const STAGGER_EASE = 'cubic-bezier(0.16,1,0.3,1)' // home scene, per original spec

export const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4'

export interface NavItem {
  label: string
  to: string
}

export const NAV_LINKS: NavItem[] = [
  { label: 'VECTRUS ENERGY', to: '/' },
  { label: 'VECTRUS UPSTREAM', to: '/upstream' },
  { label: 'VECTRUS MARKETS', to: '/markets' },
  { label: 'VECTRUS SYSTEMS', to: '/systems' },
  { label: 'VECTRUS+', to: '/plus' },
]
