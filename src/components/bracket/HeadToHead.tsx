import { formatPriceLevel } from '@/lib/places'
import type { Restaurant } from '@/types'

interface HeadToHeadProps {
  a: Restaurant
  b: Restaurant
  onPick: (winner: Restaurant) => void
  roundLabel: string
}

export function HeadToHead({ a, b, onPick, roundLabel }: HeadToHeadProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Round label */}
      <div className="border-b border-rule px-4 py-3">
        <p className="font-mono text-label text-muted">{roundLabel}</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Option A */}
        <button
          className="flex-1 relative bg-cover bg-center group overflow-hidden border-r border-rule"
          style={{ backgroundImage: `url(${a.photoUrl})` }}
          onClick={() => onPick(a)}
          aria-label={`pick ${a.name}`}
        >
          <div className="absolute inset-0 bg-[rgba(26,23,20,0.45)] group-hover:bg-[rgba(26,23,20,0.25)] transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-rule">
            <h3 className="font-display uppercase text-h2 text-parchment">{a.name}</h3>
            <p className="font-mono text-micro text-parchment/70 mt-1">
              {a.rating.toFixed(1)} · {formatPriceLevel(a.priceLevel)}
            </p>
          </div>
        </button>

        {/* VS divider */}
        <div className="flex items-center justify-center w-12 bg-parchment flex-shrink-0 border-x border-rule">
          <span className="font-display uppercase text-h3 text-muted">vs</span>
        </div>

        {/* Option B */}
        <button
          className="flex-1 relative bg-cover bg-center group overflow-hidden border-l border-rule"
          style={{ backgroundImage: `url(${b.photoUrl})` }}
          onClick={() => onPick(b)}
          aria-label={`pick ${b.name}`}
        >
          <div className="absolute inset-0 bg-[rgba(26,23,20,0.45)] group-hover:bg-[rgba(26,23,20,0.25)] transition-colors" />
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-rule">
            <h3 className="font-display uppercase text-h2 text-parchment">{b.name}</h3>
            <p className="font-mono text-micro text-parchment/70 mt-1">
              {b.rating.toFixed(1)} · {formatPriceLevel(b.priceLevel)}
            </p>
          </div>
        </button>
      </div>

      {/* Tap to pick hint */}
      <div className="border-t border-rule px-4 py-3">
        <p className="font-mono text-micro text-muted text-center">tap to pick</p>
      </div>
    </div>
  )
}
