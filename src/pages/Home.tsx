import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/Button'
import { FilterSheet } from '@/components/ui/FilterSheet'
import { useAppStore } from '@/store'

export function Home() {
  const navigate = useNavigate()
  const { filters, setFilters } = useAppStore()
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSolo = async () => {
    setLoading(true)
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth)
      }
      navigate('/swipe')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleGroup = async () => {
    setLoading(true)
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth)
      }
      navigate('/group/lobby')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="border-b-2 border-ink px-4 pt-safe-top">
        <div className="py-8">
          <h1 className="font-display uppercase text-display text-ink leading-none">
            hangri
          </h1>
          <p className="font-mono text-micro text-muted mt-2">
            swipe. vote. eat.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-end px-4 pb-safe-bottom">
        <div className="py-8 space-y-3">

          {/* Filter hint */}
          <button
            onClick={() => setShowFilters(true)}
            className="w-full flex items-center justify-between border border-rule px-4 py-3 hover:border-muted transition-colors"
          >
            <span className="font-mono text-label text-muted">filters</span>
            <span className="font-mono text-micro text-muted">
              {filters.radius >= 1609
                ? `${(filters.radius / 1609).toFixed(0)} mi`
                : `${(filters.radius / 1609 * 5280).toFixed(0)} ft`}
              {filters.openNow ? ' · open now' : ''}
              {filters.cuisine.length > 0 ? ` · ${filters.cuisine.length} cuisine` : ''}
            </span>
          </button>

          {/* Divider */}
          <div className="border-t border-rule my-2" />

          {/* Solo */}
          <Button fullWidth onClick={handleSolo} disabled={loading}>
            solo
          </Button>

          {/* Group */}
          <Button
            fullWidth
            variant="secondary"
            onClick={handleGroup}
            disabled={loading}
          >
            group
          </Button>
        </div>
      </div>

      <FilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  )
}
