import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Filters, Restaurant, Session, SessionStatus } from '@/types'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateSessionId(): string {
  // 6-char uppercase alphanumeric code, easy to share
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// ─── Session CRUD ──────────────────────────────────────────────────────────────

export async function createSession(
  hostId: string,
  filters: Filters,
  restaurants: Restaurant[]
): Promise<string> {
  const sessionId = generateSessionId()
  await setDoc(doc(db, 'sessions', sessionId), {
    hostId,
    status: 'waiting' as SessionStatus,
    filters,
    restaurants,
    deckSize: restaurants.length,
    createdAt: serverTimestamp(),
    winnerId: null,
    winnerName: null,
  })
  return sessionId
}

export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus
): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), { status })
}

export async function setSessionWinner(
  sessionId: string,
  winnerId: string,
  winnerName: string
): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), {
    winnerId,
    winnerName,
    status: 'done' as SessionStatus,
  })
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const snap = await getDoc(doc(db, 'sessions', sessionId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Session
}

// ─── Participants ──────────────────────────────────────────────────────────────

export async function joinSession(
  sessionId: string,
  participantId: string,
  displayName: string
): Promise<void> {
  await setDoc(
    doc(db, 'participants', sessionId, 'users', participantId),
    {
      displayName,
      joinedAt: serverTimestamp(),
      swipes: {},
      doneSwiping: false,
      doneSwipingAt: null,
    }
  )
}

export async function recordSwipe(
  sessionId: string,
  participantId: string,
  restaurantId: string,
  liked: boolean
): Promise<void> {
  const ref = doc(db, 'participants', sessionId, 'users', participantId)
  await updateDoc(ref, {
    [`swipes.${restaurantId}`]: liked,
  })
}

export async function markDoneSwiping(
  sessionId: string,
  participantId: string
): Promise<void> {
  const ref = doc(db, 'participants', sessionId, 'users', participantId)
  await updateDoc(ref, {
    doneSwiping: true,
    doneSwipingAt: serverTimestamp(),
  })
}

// ─── Polls ─────────────────────────────────────────────────────────────────────

export async function createPollRound(
  sessionId: string,
  roundNumber: number,
  restaurantIds: string[]
): Promise<void> {
  await setDoc(
    doc(db, 'polls', sessionId, 'rounds', String(roundNumber)),
    {
      restaurantIds,
      votes: {},
      status: 'open',
      winnerId: null,
    }
  )
}

export async function castVote(
  sessionId: string,
  roundNumber: number,
  participantId: string,
  restaurantId: string
): Promise<void> {
  const ref = doc(db, 'polls', sessionId, 'rounds', String(roundNumber))
  await updateDoc(ref, {
    [`votes.${participantId}`]: restaurantId,
  })
}

export async function closePollRound(
  sessionId: string,
  roundNumber: number,
  winnerId: string | null
): Promise<void> {
  const ref = doc(db, 'polls', sessionId, 'rounds', String(roundNumber))
  await updateDoc(ref, { status: 'closed', winnerId })
}

// ─── Business Logic ────────────────────────────────────────────────────────────

export function calculateMutualLikes(
  participantSwipes: Record<string, Record<string, boolean>>,
  restaurants: Restaurant[]
): Restaurant[] {
  const participantIds = Object.keys(participantSwipes)
  if (participantIds.length === 0) return []

  const mutual = restaurants.filter((r) =>
    participantIds.every((pid) => participantSwipes[pid]?.[r.id] === true)
  )

  if (mutual.length > 0) return mutual

  // Fallback: majority liked
  const counts = restaurants.map((r) => ({
    restaurant: r,
    count: participantIds.filter((pid) => participantSwipes[pid]?.[r.id] === true).length,
  }))
  const max = Math.max(...counts.map((c) => c.count))
  if (max === 0) return restaurants // last resort: show all
  return counts.filter((c) => c.count === max).map((c) => c.restaurant)
}

export function tallyVotes(
  votes: Record<string, string>
): { winnerId: string | null; tiedIds: string[] } {
  const counts: Record<string, number> = {}
  for (const restaurantId of Object.values(votes)) {
    counts[restaurantId] = (counts[restaurantId] ?? 0) + 1
  }

  const max = Math.max(...Object.values(counts))
  const winners = Object.entries(counts)
    .filter(([, c]) => c === max)
    .map(([id]) => id)

  if (winners.length === 1) return { winnerId: winners[0], tiedIds: [] }
  return { winnerId: null, tiedIds: winners }
}
