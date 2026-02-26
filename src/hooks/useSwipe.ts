import { useRef } from 'react'
import { useMotionValue, useTransform, animate } from 'framer-motion'

const SWIPE_THRESHOLD = 90 // px

export function useSwipe(onSwipe: (liked: boolean) => void) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const overlayOpacity = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    [0.4, 0, 0.4]
  )
  const swipeDirection = useTransform(x, (v) => {
    if (v > SWIPE_THRESHOLD / 2) return 'right'
    if (v < -SWIPE_THRESHOLD / 2) return 'left'
    return null
  })

  const isDragging = useRef(false)

  const handleDragStart = () => {
    isDragging.current = true
  }

  const handleDragEnd = () => {
    isDragging.current = false
    const currentX = x.get()

    if (currentX > SWIPE_THRESHOLD) {
      // Swipe right (like)
      void animate(x, 600, { duration: 0.3 }).then(() => {
        onSwipe(true)
        x.set(0)
      })
    } else if (currentX < -SWIPE_THRESHOLD) {
      // Swipe left (pass)
      void animate(x, -600, { duration: 0.3 }).then(() => {
        onSwipe(false)
        x.set(0)
      })
    } else {
      // Snap back
      void animate(x, 0, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      })
    }
  }

  const triggerSwipe = (liked: boolean) => {
    const target = liked ? 600 : -600
    void animate(x, target, { duration: 0.3 }).then(() => {
      onSwipe(liked)
      x.set(0)
    })
  }

  return {
    x,
    rotate,
    overlayOpacity,
    swipeDirection,
    handleDragStart,
    handleDragEnd,
    triggerSwipe,
  }
}
