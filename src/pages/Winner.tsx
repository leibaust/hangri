import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPriceLevel } from '@/lib/places'
import { Button } from '@/components/ui/Button'
import type { Restaurant } from '@/types'

export function Winner() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const winner = state?.winner as Restaurant | undefined

  if (!winner) {
    navigate('/', { replace: true })
    return null
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(winner.name)}&query_place_id=${winner.id}`

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${winner.photoUrl})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(26,23,20,0.55)]" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-end px-4 pb-safe-bottom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="pb-8"
        >
          {/* Winner label */}
          <p className="font-mono text-micro text-amber mb-4 tracking-widest uppercase">
            tonight you're eating
          </p>

          {/* Restaurant name */}
          <h1 className="font-display uppercase text-display text-parchment leading-none mb-2">
            {winner.name}
          </h1>

          {/* Rule */}
          <div className="border-t border-rule my-4" />

          {/* Metadata */}
          <div className="flex items-center gap-3 font-mono text-label text-parchment/80 mb-6">
            <span>{winner.rating.toFixed(1)}</span>
            <span className="text-rule">·</span>
            <span>{formatPriceLevel(winner.priceLevel)}</span>
            <span className="text-rule">·</span>
            <span>{(winner.distance / 1609.34).toFixed(1)} mi</span>
            {winner.cuisine[0] && (
              <>
                <span className="text-rule">·</span>
                <span>{winner.cuisine[0].replace(/_/g, ' ')}</span>
              </>
            )}
          </div>

          {/* Address */}
          <p className="font-mono text-micro text-parchment/60 mb-8">{winner.address}</p>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center font-display uppercase text-h3 tracking-widest bg-amber text-ink px-6 py-3 border-2 border-amber hover:bg-ink hover:text-amber transition-colors"
            >
              get directions
            </a>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/')}
              className="border-parchment text-parchment hover:bg-parchment/10"
            >
              start over
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
