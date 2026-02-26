import { useQuery } from '@tanstack/react-query'
import { fetchNearbyRestaurants } from '@/lib/places'
import type { Filters } from '@/types'

interface UsePlacesOptions {
  lat: number | null
  lng: number | null
  filters: Filters
  enabled?: boolean
}

export function usePlaces({ lat, lng, filters, enabled = true }: UsePlacesOptions) {
  return useQuery({
    queryKey: ['places', lat, lng, filters],
    queryFn: () => {
      if (lat == null || lng == null) throw new Error('no location')
      return fetchNearbyRestaurants(lat, lng, filters, 10)
    },
    enabled: enabled && lat != null && lng != null,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30,   // 30 minutes
    retry: 2,
  })
}
