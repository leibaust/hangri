import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/firebase'
import { recordSwipe, markDoneSwiping, updateSessionStatus } from '@/lib/session'
import { useSession, useParticipants } from '@/hooks/useSession'
import { useAppStore } from '@/store'
import { CardStack } from '@/components/cards/CardStack'

export function GroupSwipe() {
  const navigate = useNavigate()
  const { sessionId, restaurants } = useAppStore()
  const { session } = useSession(sessionId)
  const participants = useParticipants(sessionId)
  const uid = auth.currentUser?.uid

  const [deck, setDeck] = useState(restaurants)
  const [done, setDone] = useState(false)

  // Watch for all done → transition to voting
  useEffect(() => {
    if (!session || !uid) return

    if (session.status === 'voting') {
      navigate('/group/poll', { replace: true })
      return
    }

    if (done) {
      const allDone = participants.every((p) => p.doneSwiping)
      if (allDone && session.hostId === uid) {
        void updateSessionStatus(sessionId!, 'voting')
      }
    }
  }, [done, participants, session, uid, sessionId, navigate])

  const handleSwipe = async (restaurantId: string, liked: boolean) => {
    if (!sessionId || !uid) return

    try {
      await recordSwipe(sessionId, uid, restaurantId, liked)
    } catch (e) {
      console.error(e)
    }

    setDeck((prev) => prev.filter((r) => r.id !== restaurantId))

    if (deck.length <= 1) {
      // Last card swiped
      setDone(true)
      try {
        await markDoneSwiping(sessionId!, uid!)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const doneCount = participants.filter((p) => p.doneSwiping).length

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="border-b border-rule px-4 py-4 flex items-center justify-between pt-safe-top">
        <p className="font-mono text-label text-muted">group swipe</p>
        <p className="font-mono text-micro text-muted">
          {doneCount}/{participants.length} done
        </p>
      </div>

      {/* Card area */}
      <div className="flex-1 relative overflow-hidden">
        {deck.length > 0 && !done ? (
          <CardStack restaurants={deck} onSwipe={handleSwipe} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
            <p className="font-display uppercase text-h2 text-ink">done swiping</p>
            <p className="font-mono text-label text-muted text-center">
              waiting for others...
            </p>
            <p className="font-mono text-micro text-muted">
              {doneCount}/{participants.length} finished
            </p>
          </div>
        )}
      </div>

      {!done && deck.length > 0 && (
        <div className="border-t border-rule px-4 py-3 pb-safe-bottom">
          <div className="flex justify-between font-mono text-micro text-muted">
            <span>← no</span>
            <span>{deck.length} left</span>
            <span>yes →</span>
          </div>
        </div>
      )}
    </div>
  )
}
