import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getSession, joinSession } from '@/lib/session'
import { useAppStore } from '@/store'
import { JoinScreen } from '@/components/session/JoinScreen'

export function Join() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { setSessionId, setDisplayName, setRestaurants } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoin = async (displayName: string) => {
    if (!sessionId) return

    setLoading(true)
    setError(null)

    try {
      // Authenticate anonymously if needed
      if (!auth.currentUser) {
        await signInAnonymously(auth)
      }

      const uid = auth.currentUser!.uid

      // Load session
      const session = await getSession(sessionId)
      if (!session) {
        setError('session not found')
        return
      }

      if (session.status === 'done') {
        setError('session has ended')
        return
      }

      // Join
      await joinSession(sessionId, uid, displayName)

      // Store in app state
      setDisplayName(displayName)
      setSessionId(sessionId)
      setRestaurants(session.restaurants)

      // Route based on session status
      if (session.status === 'swiping') {
        navigate('/group/swipe', { replace: true })
      } else if (session.status === 'voting') {
        navigate('/group/poll', { replace: true })
      } else {
        navigate('/group/lobby', { replace: true })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'failed to join session')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
        <p className="font-mono text-label text-muted">invalid session link</p>
      </div>
    )
  }

  return (
    <JoinScreen
      sessionId={sessionId}
      onJoin={handleJoin}
      loading={loading}
      error={error}
    />
  )
}
