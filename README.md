# Hangri

A Tinder-style restaurant discovery app. Swipe through nearby restaurants, then let a bracket or group poll pick the winner — solo or with friends.

## Features

- **Solo mode** — swipe 10 nearby restaurants, then a head-to-head bracket narrows it to one winner
- **Group mode** — host creates a session, guests join via QR code or link, everyone swipes independently, then a live group poll decides
- **Real-time sync** — Firestore listeners keep all group participants in sync without polling
- **PWA** — installable on iOS and Android, works offline after first load
- **Filters** — cuisine type, distance radius, price level, open now, minimum rating

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 6 |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Data fetching | TanStack Query |
| Backend / database | Firebase Firestore |
| Auth | Firebase Auth (anonymous + email) |
| Restaurant data | Google Places API |
| QR codes | qrcode.react |
| Hosting | Firebase Hosting |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase project](https://console.firebase.google.com/) with Firestore and Authentication enabled
- A [Google Places API key](https://console.cloud.google.com/) with the Places API enabled

### Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/hangri.git
cd hangri
npm install
```

2. Copy the environment variable template and fill in your keys:

```bash
cp .env.local .env.local.example  # already exists as a reference
```

Edit `.env.local`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GOOGLE_PLACES_API_KEY=...
```

3. Add PWA icons at `public/icons/icon-192.png` and `public/icons/icon-512.png`.

4. Start the dev server:

```bash
npm run dev
```

### Firebase Setup

In the Firebase Console:

- Enable **Firestore** in Native mode
- Enable **Authentication** with Anonymous and Email/Password providers
- Deploy Firestore security rules: `firebase deploy --only firestore:rules`

### Deploying

```bash
npm run build
firebase deploy
```

## Project Structure

```
src/
├── components/
│   ├── cards/        # SwipeCard, CardStack
│   ├── bracket/      # BracketView, HeadToHead
│   ├── poll/         # GroupPoll, PollOption
│   ├── session/      # QRCode, JoinScreen, ParticipantList
│   └── ui/           # Button, Modal, FilterSheet
├── hooks/            # useLocation, usePlaces, useSession, useSwipe
├── lib/              # firebase.ts, places.ts, session.ts, cn.ts
├── pages/            # Home, Swipe, Bracket, GroupLobby, GroupSwipe, GroupPoll, Winner, Join
├── store/            # React context + reducer
└── types/            # Shared TypeScript types
```

## Design

Minimal brutalist — editorial and deconstructed. Inspired by stripped-back food magazines: raw grid structure, exposed layout bones, warm earth tones, no rounded corners, no decorative icons.

- **Typefaces:** Cormorant Garamond (display, uppercase) + IBM Plex Mono (body, lowercase)
- **Palette:** bleached parchment base with warm near-black ink, muted olive and burnt sienna for swipe feedback

## Roadmap

- [x] Project scaffold
- [ ] Solo swipe flow (location → fetch → swipe → bracket → winner)
- [ ] Firebase Auth (anonymous + email)
- [ ] Group session creation + QR code
- [ ] Guest PWA join flow
- [ ] Real-time group swipe + poll
- [ ] Winner screen with directions
- [ ] PWA manifest + service worker
- [ ] Deploy to Firebase Hosting

## License

MIT
