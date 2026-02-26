import { Timestamp } from 'firebase/firestore'

// ─── Restaurant ────────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string
  name: string
  photoUrl: string
  rating: number
  userRatingsTotal: number
  priceLevel: number // 1–4
  cuisine: string[]
  address: string
  isOpenNow: boolean
  distance: number // meters
  location: { lat: number; lng: number }
}

// ─── Filters ───────────────────────────────────────────────────────────────────

export interface Filters {
  radius: number // meters; default 1609 (1 mile)
  cuisine: string[] // Google Places types
  priceLevel: number[] // [1,2,3,4]
  openNow: boolean
  minRating: number
}

export const DEFAULT_FILTERS: Filters = {
  radius: 1609,
  cuisine: [],
  priceLevel: [1, 2, 3, 4],
  openNow: false,
  minRating: 0,
}

// ─── Firestore Data ────────────────────────────────────────────────────────────

export type SessionStatus = 'waiting' | 'swiping' | 'voting' | 'done'

export interface Session {
  id: string
  hostId: string
  status: SessionStatus
  filters: Filters
  restaurants: Restaurant[]
  deckSize: number
  createdAt: Timestamp
  winnerId: string | null
  winnerName: string | null
}

export interface Participant {
  id: string
  displayName: string
  joinedAt: Timestamp
  swipes: Record<string, boolean>
  doneSwiping: boolean
  doneSwipingAt: Timestamp | null
}

export interface PollRound {
  restaurantIds: string[]
  votes: Record<string, string> // participantId → restaurantId
  status: 'open' | 'closed'
  winnerId: string | null
}

export interface User {
  id: string
  displayName: string
  email: string | null
  isAnonymous: boolean
  createdAt: Timestamp
  sessionHistory: string[]
}

// ─── UI State ──────────────────────────────────────────────────────────────────

export type SwipeDirection = 'left' | 'right' | null

export interface SwipeResult {
  restaurantId: string
  liked: boolean
}

export type BracketMatchup = [Restaurant, Restaurant]
