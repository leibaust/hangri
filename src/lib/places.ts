import type { Filters, Restaurant } from '@/types'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
const BASE_URL = 'https://places.googleapis.com/v1'

// ─── New Places API (New) response types ───────────────────────────────────────

interface PlaceResult {
  id: string
  displayName: { text: string; languageCode: string }
  formattedAddress: string
  rating?: number
  userRatingCount?: number
  priceLevel?: string // enum: PRICE_LEVEL_FREE | INEXPENSIVE | MODERATE | EXPENSIVE | VERY_EXPENSIVE
  types: string[]
  photos?: { name: string; widthPx: number; heightPx: number }[]
  currentOpeningHours?: { openNow: boolean }
  location: { latitude: number; longitude: number }
}

interface PlacesNearbyResponse {
  places: PlaceResult[]
}

// ─── Utility ───────────────────────────────────────────────────────────────────

function getPhotoUrl(photoName: string): string {
  return `${BASE_URL}/${photoName}/media?maxWidthPx=800&key=${API_KEY}`
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const GENERIC_TYPES = new Set([
  'restaurant',
  'food',
  'point_of_interest',
  'establishment',
  'cafe',
  'bar',
  'meal_takeaway',
  'meal_delivery',
])

function normalizeCuisine(types: string[]): string[] {
  return types.filter((t) => !GENERIC_TYPES.has(t)).slice(0, 3)
}

const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
}

const PRICE_LEVEL_ENUM = [
  'PRICE_LEVEL_FREE',
  'PRICE_LEVEL_INEXPENSIVE',
  'PRICE_LEVEL_MODERATE',
  'PRICE_LEVEL_EXPENSIVE',
  'PRICE_LEVEL_VERY_EXPENSIVE',
]

// ─── API ───────────────────────────────────────────────────────────────────────

export async function fetchNearbyRestaurants(
  lat: number,
  lng: number,
  filters: Filters,
  count = 10
): Promise<Restaurant[]> {
  const body: Record<string, unknown> = {
    maxResultCount: Math.min(count, 20),
    rankPreference: 'DISTANCE',
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: filters.radius,
      },
    },
  }

  // Cuisine filter maps to includedTypes; fall back to generic restaurant
  body.includedTypes = filters.cuisine.length > 0 ? filters.cuisine : ['restaurant']

  if (filters.openNow) {
    body.openNow = true
  }

  // Map numeric price levels [1,2,3,4] to API enum strings
  if (filters.priceLevel.length > 0 && filters.priceLevel.length < 4) {
    body.priceLevels = filters.priceLevel.map((n) => PRICE_LEVEL_ENUM[n]).filter(Boolean)
  }

  const res = await fetch(`${BASE_URL}/places:searchNearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.rating',
        'places.userRatingCount',
        'places.priceLevel',
        'places.types',
        'places.photos',
        'places.currentOpeningHours',
        'places.location',
      ].join(','),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Places API error ${res.status}: ${text}`)
  }

  const data: PlacesNearbyResponse = await res.json()
  const places = data.places ?? []

  return places
    .filter((p) => (p.rating ?? 0) >= filters.minRating)
    .slice(0, count)
    .map((p): Restaurant => ({
      id: p.id,
      name: p.displayName.text,
      photoUrl: p.photos?.[0]
        ? getPhotoUrl(p.photos[0].name)
        : 'https://placehold.co/800x600/EDE8DE/8C8278?text=no+photo',
      rating: p.rating ?? 0,
      userRatingsTotal: p.userRatingCount ?? 0,
      priceLevel: PRICE_LEVEL_MAP[p.priceLevel ?? ''] ?? 0,
      cuisine: normalizeCuisine(p.types),
      address: p.formattedAddress,
      isOpenNow: p.currentOpeningHours?.openNow ?? false,
      distance: haversineDistance(lat, lng, p.location.latitude, p.location.longitude),
      location: { lat: p.location.latitude, lng: p.location.longitude },
    }))
}

export function formatPriceLevel(level: number): string {
  return '$'.repeat(Math.min(Math.max(level, 1), 4))
}
