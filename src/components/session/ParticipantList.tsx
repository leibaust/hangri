import type { Participant } from '@/types'

interface ParticipantListProps {
  participants: Participant[]
  hostId: string
}

export function ParticipantList({ participants, hostId }: ParticipantListProps) {
  return (
    <div className="border border-rule divide-y divide-rule">
      {participants.length === 0 && (
        <p className="font-mono text-label text-muted px-4 py-4">
          waiting for guests...
        </p>
      )}
      {participants.map((p) => (
        <div key={p.id} className="flex items-center justify-between px-4 py-3">
          <span className="font-mono text-label text-ink">{p.displayName}</span>
          <div className="flex items-center gap-2">
            {p.id === hostId && (
              <span className="font-mono text-micro text-muted border border-rule px-2 py-0.5">
                host
              </span>
            )}
            {p.doneSwiping ? (
              <span className="font-mono text-micro text-olive border border-olive px-2 py-0.5">
                done
              </span>
            ) : (
              <span className="font-mono text-micro text-muted border border-rule px-2 py-0.5">
                swiping
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
