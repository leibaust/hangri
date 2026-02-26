import { AnimatePresence } from 'framer-motion'
import { SwipeCard } from './SwipeCard'
import type { Restaurant } from '@/types'

interface CardStackProps {
  restaurants: Restaurant[]
  onSwipe: (restaurantId: string, liked: boolean) => void
}

export function CardStack({ restaurants, onSwipe }: CardStackProps) {
  if (restaurants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-mono text-label text-muted">no more cards</p>
      </div>
    )
  }

  // Show top 3 cards
  const visible = restaurants.slice(0, 3)

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {visible.map((restaurant, index) => (
          <SwipeCard
            key={restaurant.id}
            restaurant={restaurant}
            isTop={index === 0}
            stackIndex={index}
            onSwipe={(liked) => onSwipe(restaurant.id, liked)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
