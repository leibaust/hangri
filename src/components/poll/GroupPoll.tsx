import { PollOption } from './PollOption'
import type { Restaurant } from '@/types'

interface GroupPollProps {
  options: Restaurant[]
  votes: Record<string, string> // participantId → restaurantId
  myId: string
  onVote: (restaurantId: string) => void
  totalParticipants: number
}

export function GroupPoll({ options, votes, myId, onVote, totalParticipants }: GroupPollProps) {
  const myVote = votes[myId] ?? null
  const hasVoted = myVote !== null
  const totalVotes = Object.keys(votes).length

  // Count votes per restaurant
  const voteCounts: Record<string, number> = {}
  for (const restaurantId of Object.values(votes)) {
    voteCounts[restaurantId] = (voteCounts[restaurantId] ?? 0) + 1
  }

  const waitingFor = totalParticipants - totalVotes

  return (
    <div className="flex flex-col gap-3">
      <div className="border-b border-rule pb-3 mb-1">
        <p className="font-mono text-label text-muted">
          {hasVoted
            ? waitingFor > 0
              ? `waiting for ${waitingFor} more vote${waitingFor !== 1 ? 's' : ''}`
              : 'all votes in — tallying...'
            : 'pick one'}
        </p>
      </div>

      {options.map((r) => (
        <PollOption
          key={r.id}
          restaurant={r}
          selected={myVote === r.id}
          voteCount={voteCounts[r.id] ?? 0}
          totalVotes={hasVoted ? totalVotes : 0}
          onVote={() => !hasVoted && onVote(r.id)}
          disabled={hasVoted}
        />
      ))}
    </div>
  )
}
