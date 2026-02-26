import { motion, useTransform } from 'framer-motion'
import { useSwipe } from '@/hooks/useSwipe'
import { formatPriceLevel } from '@/lib/places'
import type { Restaurant } from '@/types'

interface SwipeCardProps {
  restaurant: Restaurant
  onSwipe: (liked: boolean) => void
  isTop: boolean
  stackIndex: number // 0 = top, 1, 2
}

export function SwipeCard({ restaurant, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const {
    x,
    rotate,
    swipeDirection,
    handleDragStart,
    handleDragEnd,
  } = useSwipe(onSwipe)

  // Scale/translate for stacked cards
  const scale = isTop ? 1 : 1 - stackIndex * 0.03
  const translateY = isTop ? 0 : stackIndex * -8

  const swipeColor = useTransform(swipeDirection, (dir) => {
    if (dir === 'right') return 'rgba(74,82,64,0.35)'   // olive
    if (dir === 'left') return 'rgba(139,58,42,0.35)'   // sienna
    return 'rgba(0,0,0,0)'
  })

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: translateY,
        zIndex: 10 - stackIndex,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { scale: 1.02 } : undefined}
    >
      {/* Photo background */}
      <div
        className="w-full h-full bg-surface bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${restaurant.photoUrl})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[rgba(26,23,20,0.35)]" />

        {/* Swipe direction tint */}
        {isTop && (
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: swipeColor }}
          />
        )}

        {/* Swipe labels */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-12 left-6 font-display uppercase text-display text-olive border-4 border-olive"
              style={{
                opacity: useTransform(x, [20, 90], [0, 1]),
                rotate: -12,
              }}
            >
              yes
            </motion.div>
            <motion.div
              className="absolute top-12 right-6 font-display uppercase text-display text-sienna border-4 border-sienna"
              style={{
                opacity: useTransform(x, [-20, -90], [0, 1]),
                rotate: 12,
              }}
            >
              no
            </motion.div>
          </>
        )}

        {/* Info block — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-8">
          {/* Rule */}
          <div className="border-t border-rule mb-3" />

          {/* Restaurant name */}
          <h3 className="font-display uppercase text-h1 text-parchment leading-tight mb-2">
            {restaurant.name}
          </h3>

          {/* Metadata */}
          <div className="flex items-center gap-3 font-mono text-micro text-parchment/80">
            <span>{restaurant.rating.toFixed(1)}</span>
            <span className="text-rule">·</span>
            <span>{formatPriceLevel(restaurant.priceLevel)}</span>
            <span className="text-rule">·</span>
            <span>{(restaurant.distance / 1609.34).toFixed(1)} mi</span>
            {restaurant.cuisine[0] && (
              <>
                <span className="text-rule">·</span>
                <span>{restaurant.cuisine[0].replace(/_/g, ' ')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
