import { useState, useEffect } from 'react'

export type LocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'granted'; lat: number; lng: number }
  | { status: 'denied'; error: string }
  | { status: 'unavailable'; error: string }

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({ status: 'idle' })

  const request = () => {
    if (!navigator.geolocation) {
      setLocation({ status: 'unavailable', error: 'geolocation not supported' })
      return
    }

    setLocation({ status: 'loading' })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: 'granted',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      (err) => {
        if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
          setLocation({ status: 'denied', error: err.message })
        } else {
          setLocation({ status: 'unavailable', error: err.message })
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    )
  }

  useEffect(() => {
    request()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { location, retry: request }
}
