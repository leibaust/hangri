import type { Filters, Restaurant } from '@/types'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
const BASE_URL = 'https://maps.googleapis.com/maps/api/place'

interface PlacesNearbyResult {
  place_id: string
  name: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  types: string[]
  vicinity: string
  opening_hours?: { open_now: boolean }
  photos?: { photo_reference: string }[]
  geometry: { location: { lat: number; lng: number } }
}

interface PlacesNearbyResponse {
  results: PlacesNearbyResult[]
  status: string
  next_page_token?: string
}

// ─── Utility ───────────────────────────────────────────────────────────────────

function getPhotoUrl(photoReference: string): string {
  return `${BASE_URL}/photo?maxwidth=800&photo_reference=${photoReference}&key=${API_KEY}`
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const CUISINE_TYPES = [
  'restaurant',
  'cafe',
  'bakery',
  'bar',
  'meal_takeaway',
  'meal_delivery',
]

function normalizeCuisine(types: string[]): string[] {
  const known = new Set(CUISINE_TYPES)
  return types.filter((t) => !known.has(t)).slice(0, 3)
}

// ─── API ───────────────────────────────────────────────────────────────────────

export async function fetchNearbyRestaurants(
  lat: number,
  lng: number,
  filters: Filters,
  count = 10
): Promise<Restaurant[]> {
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: String(filters.radius),
    type: 'restaurant',
    key: API_KEY,
  })

  if (filters.openNow) params.set('opennow', 'true')

  if (filters.priceLevel.length > 0 && filters.priceLevel.length < 4) {
    params.set('minprice', String(Math.min(...filters.priceLevel) - 1))
    params.set('maxprice', String(Math.max(...filters.priceLevel) - 1))
  }

  if (filters.cuisine.length > 0) {
    // nearbySearch only supports a single keyword; join cuisine for a rough filter
    params.set('keyword', filters.cuisine.join(' '))
  }

  const url = `${BASE_URL}/nearbysearch/json?${params.toString()}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Places API error: ${res.status}`)

  const data: PlacesNearbyResponse = await res.json()

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API status: ${data.status}`)
  }

  const results = data.results
    .filter((r) => (r.rating ?? 0) >= filters.minRating)
    .slice(0, count)

  return results.map((r): Restaurant => ({
    id: r.place_id,
    name: r.name,
    photoUrl: r.photos?.[0]
      ? getPhotoUrl(r.photos[0].photo_reference)
      : 'https://placehold.co/800x600/EDE8DE/8C8278?text=no+photo',
    rating: r.rating ?? 0,
    userRatingsTotal: r.user_ratings_total ?? 0,
    priceLevel: r.price_level ?? 0,
    cuisine: normalizeCuisine(r.types),
    address: r.vicinity,
    isOpenNow: r.opening_hours?.open_now ?? false,
    distance: haversineDistance(lat, lng, r.geometry.location.lat, r.geometry.location.lng),
    location: r.geometry.location,
  }))
}

export function formatPriceLevel(level: number): string {
  return '$'.repeat(Math.min(Math.max(level, 1), 4))
}
