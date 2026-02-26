import { cn } from '@/lib/cn'
import { formatPriceLevel } from '@/lib/places'
import type { Restaurant } from '@/types'

interface PollOptionProps {
  restaurant: Restaurant
  selected: boolean
  voteCount: number
  totalVotes: number
  onVote: () => void
  disabled: boolean
}

export function PollOption({
  restaurant,
  selected,
  voteCount,
  totalVotes,
  onVote,
  disabled,
}: PollOptionProps) {
  const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0

  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className={cn(
        'w-full text-left border transition-colors relative overflow-hidden',
        selected ? 'border-2 border-ink' : 'border border-rule hover:border-muted',
        'disabled:pointer-events-none'
      )}
      aria-pressed={selected}
    >
      {/* Progress bar behind */}
      <div
        className="absolute inset-y-0 left-0 bg-surface transition-all duration-500"
        style={{ width: `${pct}%` }}
      />

      <div className="relative flex items-center gap-3 px-4 py-4">
        {/* Thumbnail */}
        <div
          className="w-14 h-14 bg-cover bg-center flex-shrink-0 border border-rule"
          style={{ backgroundImage: `url(${restaurant.photoUrl})` }}
        />

        <div className="flex-1 min-w-0">
          <p className="font-display uppercase text-h3 text-ink truncate">
            {restaurant.name}
          </p>
          <p className="font-mono text-micro text-muted mt-0.5">
            {restaurant.rating.toFixed(1)} · {formatPriceLevel(restaurant.priceLevel)}
          </p>
        </div>

        <div className="flex-shrink-0 text-right">
          <p className="font-mono text-label text-ink">{pct}%</p>
          <p className="font-mono text-micro text-muted">{voteCount}</p>
        </div>
      </div>
    </button>
  )
}
