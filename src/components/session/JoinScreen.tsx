import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface JoinScreenProps {
  sessionId: string
  onJoin: (displayName: string) => void
  loading: boolean
  error: string | null
}

export function JoinScreen({ sessionId, onJoin, loading, error }: JoinScreenProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onJoin(trimmed)
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="border-b-2 border-ink px-4 py-6">
        <h1 className="font-display uppercase text-display text-ink">hangri</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="border-b border-rule pb-4 mb-6">
          <p className="font-mono text-label text-muted">joining session</p>
          <p className="font-display uppercase text-h1 text-ink">{sessionId}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-label text-muted mb-2" htmlFor="name">
              your name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="enter display name"
              maxLength={24}
              autoFocus
              className="w-full bg-transparent border-b-2 border-ink font-mono text-body text-ink placeholder:text-rule outline-none py-2 focus:border-muted transition-colors"
            />
          </div>

          {error && (
            <p className="font-mono text-label text-sienna">{error}</p>
          )}

          <Button type="submit" fullWidth disabled={!name.trim() || loading}>
            {loading ? 'joining...' : 'join session'}
          </Button>
        </form>
      </div>
    </div>
  )
}
