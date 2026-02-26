import { createContext, useContext } from 'react'
import type { Filters, Restaurant, SwipeResult } from '@/types'
import { DEFAULT_FILTERS } from '@/types'

// ─── App State ─────────────────────────────────────────────────────────────────
// Using React context for local state (no Zustand dependency to keep it simple)

export interface AppState {
  // Solo flow
  filters: Filters
  restaurants: Restaurant[]
  swipeResults: SwipeResult[]
  // Session (group)
  sessionId: string | null
  displayName: string
}

export interface AppActions {
  setFilters: (filters: Filters) => void
  setRestaurants: (restaurants: Restaurant[]) => void
  addSwipeResult: (result: SwipeResult) => void
  resetSwipes: () => void
  setSessionId: (id: string | null) => void
  setDisplayName: (name: string) => void
}

export const defaultState: AppState = {
  filters: DEFAULT_FILTERS,
  restaurants: [],
  swipeResults: [],
  sessionId: null,
  displayName: '',
}

export const AppContext = createContext<AppState & AppActions>({
  ...defaultState,
  setFilters: () => {},
  setRestaurants: () => {},
  addSwipeResult: () => {},
  resetSwipes: () => {},
  setSessionId: () => {},
  setDisplayName: () => {},
})

export const useAppStore = () => useContext(AppContext)
