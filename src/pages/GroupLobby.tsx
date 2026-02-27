import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/firebase'
import { createSession, updateSessionStatus } from '@/lib/session'
import { fetchNearbyRestaurants } from '@/lib/places'
import { joinSession } from '@/lib/session'
import { useSession, useParticipants } from '@/hooks/useSession'
import { useLocation } from '@/hooks/useLocation'
import { useAppStore } from '@/store'
import { QRCodeDisplay } from '@/components/session/QRCode'
import { ParticipantList } from '@/components/session/ParticipantList'
import { Button } from '@/components/ui/Button'

export function GroupLobby() {
  const navigate = useNavigate()
  const { filters, sessionId, setSessionId, displayName, setDisplayName, setRestaurants } = useAppStore()
  const { location } = useLocation()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { session } = useSession(sessionId)
  const participants = useParticipants(sessionId)

  const uid = auth.currentUser?.uid

  const handleCreateSession = async () => {
    if (!uid) return
    if (location.status !== 'granted') {
      setError('location required to create session')
      return
    }

    setCreating(true)
    setError(null)

    try {
      const restaurants = await fetchNearbyRestaurants(
        location.lat,
        location.lng,
        filters,
        10
      )
      setRestaurants(restaurants)

      if (restaurants.length === 0) {
        setError('no restaurants found nearby — try adjusting filters or increasing radius')
        return
      }

      const name = displayName.trim() || 'host'
      setDisplayName(name)

      const id = await createSession(uid, filters, restaurants)
      setSessionId(id)

      // Host joins as a participant too
      await joinSession(id, uid, name)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to create session')
    } finally {
      setCreating(false)
    }
  }

  const handleStart = async () => {
    if (!sessionId || !uid || session?.hostId !== uid) return
    await updateSessionStatus(sessionId, 'swiping')
    navigate('/group/swipe')
  }

  const isHost = uid && session?.hostId === uid

  // ─── Pre-creation: enter name + create ────────────────────────────────────

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col">
        <div className="border-b-2 border-ink px-4 py-6 pt-safe-top">
          <button onClick={() => navigate('/')} className="font-mono text-label text-muted mb-4 block">
            ← back
          </button>
          <h1 className="font-display uppercase text-h1 text-ink">group session</h1>
        </div>

        <div className="flex-1 px-4 py-8 flex flex-col gap-4">
          <div>
            <label className="block font-mono text-label text-muted mb-2" htmlFor="host-name">
              your name
            </label>
            <input
              id="host-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="enter display name"
              maxLength={24}
              autoFocus
              className="w-full bg-transparent border-b-2 border-ink font-mono text-body text-ink placeholder:text-rule outline-none py-2 focus:border-muted transition-colors"
            />
          </div>

          {error && <p className="font-mono text-label text-sienna">{error}</p>}

          <Button
            fullWidth
            onClick={handleCreateSession}
            disabled={creating || !displayName.trim()}
            className="mt-auto"
          >
            {creating ? 'creating...' : 'create session'}
          </Button>
        </div>
      </div>
    )
  }

  // ─── Lobby: QR + participant list ──────────────────────────────────────────

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <div className="border-b border-rule px-4 py-4 pt-safe-top">
        <p className="font-mono text-label text-muted">session</p>
        <h1 className="font-display uppercase text-h1 text-ink">{sessionId}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <QRCodeDisplay sessionId={sessionId} />

        <div>
          <p className="font-mono text-label text-muted mb-2">participants</p>
          <ParticipantList
            participants={participants}
            hostId={session?.hostId ?? ''}
          />
        </div>
      </div>

      <div className="border-t border-rule px-4 py-4 pb-safe-bottom">
        {isHost ? (
          <Button
            fullWidth
            onClick={handleStart}
            disabled={participants.length < 1}
          >
            start swiping
          </Button>
        ) : (
          <p className="font-mono text-label text-muted text-center">
            waiting for host to start...
          </p>
        )}
      </div>
    </div>
  )
}
