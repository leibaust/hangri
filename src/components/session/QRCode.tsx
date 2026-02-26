import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  sessionId: string
}

export function QRCodeDisplay({ sessionId }: QRCodeDisplayProps) {
  const joinUrl = `${window.location.origin}/join/${sessionId}`

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="border-2 border-ink p-4 bg-parchment">
        <QRCodeSVG
          value={joinUrl}
          size={200}
          bgColor="#F5F0E8"
          fgColor="#1A1714"
          level="M"
        />
      </div>
      <div className="text-center">
        <p className="font-mono text-micro text-muted mb-1">session code</p>
        <p className="font-display uppercase text-h1 text-ink tracking-widest">
          {sessionId}
        </p>
        <p className="font-mono text-micro text-muted mt-2 break-all">{joinUrl}</p>
      </div>
    </div>
  )
}
