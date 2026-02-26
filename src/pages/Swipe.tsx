import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardStack } from '@/components/cards/CardStack'
import { Button } from '@/components/ui/Button'
import { useLocation } from '@/hooks/useLocation'
import { usePlaces } from '@/hooks/usePlaces'
import { useAppStore } from '@/store'

export function Swipe() {
  const navigate = useNavigate()
  const { filters, addSwipeResult, resetSwipes, setRestaurants } = useAppStore()
  const { location, retry } = useLocation()

  const lat = location.status === 'granted' ? location.lat : null
  const lng = location.status === 'granted' ? location.lng : null

  const { data: restaurants, isLoading, error } = usePlaces({ lat, lng, filters })

  const [deck, setDeck] = useState<typeof restaurants>()
  const initialized = deck !== undefined

  // Initialize deck when data arrives
  if (restaurants && !initialized) {
    setDeck(restaurants)
    setRestaurants(restaurants)
    resetSwipes()
  }

  const handleSwipe = (restaurantId: string, liked: boolean) => {
    addSwipeResult({ restaurantId, liked })
    setDeck((prev) => prev?.filter((r) => r.id !== restaurantId))
  }

  const handleDone = () => {
    navigate('/bracket')
  }

  // ─── Loading / error states ────────────────────────────────────────────────

  if (location.status === 'loading' || location.status === 'idle') {
    return <StatusScreen message="finding your location..." />
  }

  if (location.status === 'denied') {
    return (
      <StatusScreen message="location access denied">
        <Button onClick={retry} variant="secondary">retry</Button>
      </StatusScreen>
    )
  }

  if (isLoading) {
    return <StatusScreen message="fetching restaurants..." />
  }

  if (error || !deck) {
    return (
      <StatusScreen message="could not load restaurants">
        <Button onClick={() => navigate('/')} variant="secondary">back</Button>
      </StatusScreen>
    )
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="border-b border-rule px-4 py-4 flex items-center justify-between pt-safe-top">
        <button onClick={() => navigate('/')} className="font-mono text-label text-muted">
          ← back
        </button>
        <p className="font-mono text-label text-muted">
          {deck.length} left
        </p>
      </div>

      {/* Card area */}
      <div className="flex-1 relative overflow-hidden">
        {deck.length > 0 ? (
          <CardStack restaurants={deck} onSwipe={handleSwipe} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
            <p className="font-display uppercase text-h2 text-ink text-center">
              done swiping
            </p>
            <Button onClick={handleDone} fullWidth>
              see results
            </Button>
          </div>
        )}
      </div>

      {/* Swipe hint */}
      {deck.length > 0 && (
        <div className="border-t border-rule px-4 py-3 pb-safe-bottom">
          <div className="flex justify-between font-mono text-micro text-muted">
            <span>← no</span>
            <span>yes →</span>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusScreen({
  message,
  children,
}: {
  message: string
  children?: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center gap-6 px-4">
      <p className="font-mono text-label text-muted">{message}</p>
      {children}
    </div>
  )
}
