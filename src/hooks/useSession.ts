import { useState, useEffect } from 'react'
import { doc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Session, Participant, PollRound } from '@/types'

// ─── Session listener ──────────────────────────────────────────────────────────

export function useSession(sessionId: string | null) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setSession(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const unsub = onSnapshot(
      doc(db, 'sessions', sessionId),
      (snap) => {
        if (!snap.exists()) {
          setError('session not found')
          setSession(null)
        } else {
          setSession({ id: snap.id, ...snap.data() } as Session)
          setError(null)
        }
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return unsub
  }, [sessionId])

  return { session, loading, error }
}

// ─── Participants listener ─────────────────────────────────────────────────────

export function useParticipants(sessionId: string | null) {
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    if (!sessionId) return

    const unsub = onSnapshot(
      collection(db, 'participants', sessionId, 'users'),
      (snap) => {
        setParticipants(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Participant)
        )
      }
    )

    return unsub
  }, [sessionId])

  return participants
}

// ─── Poll round listener ───────────────────────────────────────────────────────

export function usePollRound(sessionId: string | null, roundNumber: number) {
  const [round, setRound] = useState<PollRound | null>(null)

  useEffect(() => {
    if (!sessionId) return

    const unsub = onSnapshot(
      doc(db, 'polls', sessionId, 'rounds', String(roundNumber)),
      (snap) => {
        if (snap.exists()) {
          setRound(snap.data() as PollRound)
        } else {
          setRound(null)
        }
      }
    )

    return unsub
  }, [sessionId, roundNumber])

  return round
}
