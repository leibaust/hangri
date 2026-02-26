import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { cn } from '@/lib/cn'
import type { Filters } from '@/types'
import { DEFAULT_FILTERS } from '@/types'

const CUISINE_OPTIONS = [
  { label: 'italian', value: 'italian_restaurant' },
  { label: 'japanese', value: 'japanese_restaurant' },
  { label: 'mexican', value: 'mexican_restaurant' },
  { label: 'chinese', value: 'chinese_restaurant' },
  { label: 'american', value: 'american_restaurant' },
  { label: 'thai', value: 'thai_restaurant' },
  { label: 'indian', value: 'indian_restaurant' },
  { label: 'mediterranean', value: 'mediterranean_restaurant' },
]

const RADIUS_OPTIONS = [
  { label: '0.5 mi', value: 804 },
  { label: '1 mi', value: 1609 },
  { label: '2 mi', value: 3218 },
  { label: '5 mi', value: 8046 },
  { label: '10 mi', value: 16093 },
]

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  filters: Filters
  onApply: (filters: Filters) => void
}

export function FilterSheet({ open, onClose, filters, onApply }: FilterSheetProps) {
  const [draft, setDraft] = useState<Filters>(filters)

  const toggleCuisine = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      cuisine: prev.cuisine.includes(value)
        ? prev.cuisine.filter((c) => c !== value)
        : [...prev.cuisine, value],
    }))
  }

  const togglePrice = (level: number) => {
    setDraft((prev) => ({
      ...prev,
      priceLevel: prev.priceLevel.includes(level)
        ? prev.priceLevel.filter((p) => p !== level)
        : [...prev.priceLevel, level],
    }))
  }

  const handleApply = () => {
    onApply(draft)
    onClose()
  }

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS)
  }

  return (
    <Modal open={open} onClose={onClose} title="filters">
      <div className="space-y-6">
        {/* Radius */}
        <div>
          <p className="font-mono text-label text-muted mb-2">distance</p>
          <div className="flex gap-2 flex-wrap">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDraft((p) => ({ ...p, radius: opt.value }))}
                className={cn(
                  'font-mono text-label px-3 py-1.5 border transition-colors',
                  draft.radius === opt.value
                    ? 'bg-ink text-parchment border-ink'
                    : 'bg-transparent text-ink border-rule hover:border-ink'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <p className="font-mono text-label text-muted mb-2">price</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((level) => (
              <button
                key={level}
                onClick={() => togglePrice(level)}
                className={cn(
                  'font-mono text-label px-3 py-1.5 border transition-colors',
                  draft.priceLevel.includes(level)
                    ? 'bg-ink text-parchment border-ink'
                    : 'bg-transparent text-ink border-rule hover:border-ink'
                )}
              >
                {'$'.repeat(level)}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine */}
        <div>
          <p className="font-mono text-label text-muted mb-2">cuisine</p>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleCuisine(opt.value)}
                className={cn(
                  'font-mono text-label px-3 py-1.5 border transition-colors',
                  draft.cuisine.includes(opt.value)
                    ? 'bg-ink text-parchment border-ink'
                    : 'bg-transparent text-ink border-rule hover:border-ink'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Open Now */}
        <div className="flex items-center justify-between border-y border-rule py-3">
          <p className="font-mono text-label text-ink">open now</p>
          <button
            onClick={() => setDraft((p) => ({ ...p, openNow: !p.openNow }))}
            className={cn(
              'w-10 h-6 border-2 border-ink relative transition-colors',
              draft.openNow ? 'bg-ink' : 'bg-transparent'
            )}
            aria-checked={draft.openNow}
            role="switch"
          >
            <span
              className={cn(
                'absolute top-0.5 w-4 h-4 bg-parchment transition-all',
                draft.openNow ? 'left-[18px]' : 'left-0.5'
              )}
            />
          </button>
        </div>

        {/* Min Rating */}
        <div>
          <p className="font-mono text-label text-muted mb-2">
            min rating — {draft.minRating === 0 ? 'any' : draft.minRating.toFixed(1)}
          </p>
          <input
            type="range"
            min={0}
            max={5}
            step={0.5}
            value={draft.minRating}
            onChange={(e) =>
              setDraft((p) => ({ ...p, minRating: parseFloat(e.target.value) }))
            }
            className="w-full accent-ink"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={handleReset} className="flex-1">
            reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}
