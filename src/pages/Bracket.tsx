import { useNavigate } from 'react-router-dom'
import { BracketView } from '@/components/bracket/BracketView'
import { useAppStore } from '@/store'
import type { Restaurant } from '@/types'

export function Bracket() {
  const navigate = useNavigate()
  const { swipeResults, restaurants } = useAppStore()

  const liked = swipeResults
    .filter((r) => r.liked)
    .map((r) => restaurants.find((rest) => rest.id === r.restaurantId))
    .filter((r): r is Restaurant => r !== undefined)

  // Edge cases
  if (liked.length === 0) {
    const top = restaurants[0]
    if (top) {
      navigate('/winner', { state: { winner: top }, replace: true })
    }
    return null
  }

  if (liked.length === 1) {
    navigate('/winner', { state: { winner: liked[0] }, replace: true })
    return null
  }

  const handleWinner = (winner: Restaurant) => {
    navigate('/winner', { state: { winner } })
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="border-b border-rule px-4 py-4 flex items-center justify-between pt-safe-top">
        <button onClick={() => navigate('/swipe')} className="font-mono text-label text-muted">
          ← back
        </button>
        <p className="font-mono text-label text-muted">
          {liked.length} in bracket
        </p>
      </div>

      {/* Bracket area */}
      <div className="flex-1 overflow-hidden">
        <BracketView restaurants={liked} onWinner={handleWinner} />
      </div>
    </div>
  )
}
