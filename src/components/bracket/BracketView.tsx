import { useState } from 'react'
import { HeadToHead } from './HeadToHead'
import type { Restaurant } from '@/types'

interface BracketViewProps {
  restaurants: Restaurant[]
  onWinner: (winner: Restaurant) => void
}

export function BracketView({ restaurants, onWinner }: BracketViewProps) {
  const [remaining, setRemaining] = useState<Restaurant[]>(shuffle(restaurants))
  const [round, setRound] = useState(1)
  const [matchupIndex, setMatchupIndex] = useState(0)
  const [winners, setWinners] = useState<Restaurant[]>([])

  const pairs = chunk(remaining, 2)
  const currentPair = pairs[matchupIndex]
  const hasBye = currentPair && currentPair.length === 1

  const handlePick = (winner: Restaurant) => {
    const newWinners = [...winners, winner]

    if (matchupIndex + 1 < pairs.length) {
      setMatchupIndex(matchupIndex + 1)
      setWinners(newWinners)
    } else {
      // Add bye if odd number
      const roundWinners = hasBye ? [...newWinners, remaining[remaining.length - 1]] : newWinners

      if (roundWinners.length === 1) {
        onWinner(roundWinners[0])
        return
      }

      // Next round
      setRemaining(roundWinners)
      setRound(round + 1)
      setMatchupIndex(0)
      setWinners([])
    }
  }

  if (!currentPair) return null

  if (hasBye) {
    // Auto-advance the bye and move on
    const byeRestaurant = currentPair[0]
    const roundWinners = [...winners, byeRestaurant]
    if (roundWinners.length === 1) {
      onWinner(roundWinners[0])
      return null
    }
  }

  const roundLabel = `round ${round} · match ${matchupIndex + 1} of ${pairs.length}`

  return (
    <div className="h-full">
      <HeadToHead
        a={currentPair[0]}
        b={currentPair[1]}
        onPick={handlePick}
        roundLabel={roundLabel}
      />
    </div>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
