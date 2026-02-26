import { useReducer } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppContext, defaultState } from '@/store'
import type { AppState, AppActions } from '@/store'
import type { Filters, Restaurant, SwipeResult } from '@/types'

import { Home } from '@/pages/Home'
import { Swipe } from '@/pages/Swipe'
import { Bracket } from '@/pages/Bracket'
import { Winner } from '@/pages/Winner'
import { GroupLobby } from '@/pages/GroupLobby'
import { GroupSwipe } from '@/pages/GroupSwipe'
import { GroupPoll } from '@/pages/GroupPoll'
import { Join } from '@/pages/Join'

// ─── App state reducer ─────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_FILTERS'; payload: Filters }
  | { type: 'SET_RESTAURANTS'; payload: Restaurant[] }
  | { type: 'ADD_SWIPE'; payload: SwipeResult }
  | { type: 'RESET_SWIPES' }
  | { type: 'SET_SESSION_ID'; payload: string | null }
  | { type: 'SET_DISPLAY_NAME'; payload: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    case 'SET_RESTAURANTS':
      return { ...state, restaurants: action.payload }
    case 'ADD_SWIPE':
      return { ...state, swipeResults: [...state.swipeResults, action.payload] }
    case 'RESET_SWIPES':
      return { ...state, swipeResults: [] }
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload }
    case 'SET_DISPLAY_NAME':
      return { ...state, displayName: action.payload }
    default:
      return state
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

// ─── App ───────────────────────────────────────────────────────────────────────

function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState)

  const actions: AppActions = {
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    setRestaurants: (restaurants) => dispatch({ type: 'SET_RESTAURANTS', payload: restaurants }),
    addSwipeResult: (result) => dispatch({ type: 'ADD_SWIPE', payload: result }),
    resetSwipes: () => dispatch({ type: 'RESET_SWIPES' }),
    setSessionId: (id) => dispatch({ type: 'SET_SESSION_ID', payload: id }),
    setDisplayName: (name) => dispatch({ type: 'SET_DISPLAY_NAME', payload: name }),
  }

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swipe" element={<Swipe />} />
            <Route path="/bracket" element={<Bracket />} />
            <Route path="/winner" element={<Winner />} />
            <Route path="/group/lobby" element={<GroupLobby />} />
            <Route path="/group/swipe" element={<GroupSwipe />} />
            <Route path="/group/poll" element={<GroupPoll />} />
            <Route path="/join/:sessionId" element={<Join />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  )
}
