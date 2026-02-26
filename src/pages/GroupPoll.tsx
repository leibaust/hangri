import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/firebase'
import {
  createPollRound,
  castVote,
  closePollRound,
  setSessionWinner,
  calculateMutualLikes,
  tallyVotes,
} from '@/lib/session'
import { useSession, useParticipants, usePollRound } from '@/hooks/useSession'
import { useAppStore } from '@/store'
import { GroupPoll as GroupPollWidget } from '@/components/poll/GroupPoll'

export function GroupPoll() {
  const navigate = useNavigate()
  const { sessionId, restaurants } = useAppStore()
  const { session } = useSession(sessionId)
  const participants = useParticipants(sessionId)
  const uid = auth.currentUser?.uid

  const [roundNumber, setRoundNumber] = useState(0)
  const [initialized, setInitialized] = useState(false)

  const round = usePollRound(sessionId, roundNumber)

  const isHost = uid && session?.hostId === uid

  // Host initializes first round
  useEffect(() => {
    if (!isHost || initialized || !sessionId || participants.length === 0) return

    setInitialized(true)

    // Build swipes map: participantId → {restaurantId: liked}
    const swipesMap: Record<string, Record<string, boolean>> = {}
    for (const p of participants) {
      swipesMap[p.id] = p.swipes
    }

    const options = calculateMutualLikes(swipesMap, restaurants)

    if (options.length === 1) {
      void setSessionWinner(sessionId, options[0].id, options[0].name)
      return
    }

    void createPollRound(sessionId, 0, options.map((r) => r.id))
  }, [isHost, initialized, sessionId, participants, restaurants])

  // Watch for all votes in — tally and decide
  useEffect(() => {
    if (!round || !isHost || !sessionId) return
    if (round.status !== 'open') return

    const totalVotes = Object.keys(round.votes).length
    if (totalVotes < participants.length) return

    // All voted — tally
    const { winnerId, tiedIds } = tallyVotes(round.votes)

    if (winnerId) {
      const winner = restaurants.find((r) => r.id === winnerId)
      void closePollRound(sessionId, roundNumber, winnerId)
      if (winner) {
        void setSessionWinner(sessionId, winner.id, winner.name)
      }
    } else {
      // Tie — another round with tied options
      void closePollRound(sessionId, roundNumber, null)
      const nextRound = roundNumber + 1
      void createPollRound(sessionId, nextRound, tiedIds)
      setRoundNumber(nextRound)
    }
  }, [round, isHost, sessionId, participants, roundNumber, restaurants])

  // Watch for session done
  useEffect(() => {
    if (session?.status === 'done' && session.winnerId) {
      const winner = restaurants.find((r) => r.id === session.winnerId)
      if (winner) {
        navigate('/winner', { state: { winner } })
      }
    }
  }, [session, restaurants, navigate])

  const pollOptions = round
    ? round.restaurantIds
        .map((id) => restaurants.find((r) => r.id === id))
        .filter((r): r is NonNullable<typeof r> => r !== undefined)
    : []

  const handleVote = async (restaurantId: string) => {
    if (!sessionId || !uid) return
    try {
      await castVote(sessionId, roundNumber, uid, restaurantId)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="border-b border-rule px-4 py-4 pt-safe-top">
        <p className="font-mono text-label text-muted">group poll</p>
        {roundNumber > 0 && (
          <p className="font-mono text-micro text-muted">round {roundNumber + 1}</p>
        )}
      </div>

      {/* Poll */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-safe-bottom">
        {pollOptions.length > 0 && round ? (
          <GroupPollWidget
            options={pollOptions}
            votes={round.votes}
            myId={uid ?? ''}
            onVote={handleVote}
            totalParticipants={participants.length}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="font-mono text-label text-muted">calculating results...</p>
          </div>
        )}
      </div>
    </div>
  )
}
