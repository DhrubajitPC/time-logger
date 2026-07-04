# Time Pop ⏱️

A delightful time-tracking PWA. Tap a category to start a timer, log entries
manually, and see where your time goes on the Stats tab. Now with **Google
sign-in** and **cloud sync** across all your devices, powered by Firebase.

- **Frontend:** React 18 + TypeScript + Vite
- **Auth:** Firebase Authentication (Google provider)
- **Database:** Cloud Firestore (offline-first, real-time sync)
- **PWA:** installable, offline-capable (vite-plugin-pwa / Workbox)
- **Hosting:** Firebase Hosting

---

## 1. Prerequisites

- Node.js 20+ and npm
- A Google account (for the Firebase console)
- Firebase CLI: `npm install -g firebase-tools`

## 2. Create the Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project**.
2. **Authentication** → **Get started** → **Sign-in method** → enable **Google**.
   Set a support email and save.
3. **Firestore Database** → **Create database** → start in **production mode**
   (the security rules in this repo lock data to each user) → pick a region.
4. **Project settings** (gear icon) → **Your apps** → **Web app** (`</>`) →
   register the app. Copy the `firebaseConfig` values.

## 3. Configure the app

Copy the example env file and paste your config values:

```bash
cp .env.example .env
```

Fill in `.env` from the `firebaseConfig` object:

| firebaseConfig key   | .env variable                       |
| -------------------- | ----------------------------------- |
| `apiKey`             | `VITE_FIREBASE_API_KEY`             |
| `authDomain`         | `VITE_FIREBASE_AUTH_DOMAIN`         |
| `projectId`          | `VITE_FIREBASE_PROJECT_ID`          |
| `storageBucket`      | `VITE_FIREBASE_STORAGE_BUCKET`      |
| `messagingSenderId`  | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId`              | `VITE_FIREBASE_APP_ID`              |

> These values are **not secrets** — they ship in every web app's client bundle.
> Access is enforced by Firestore Security Rules + Auth, not by hiding them.
> `.env` is gitignored anyway so your project id doesn't land in source control.

## 4. Run locally

```bash
npm install
npm run dev
```

Open the printed URL, click **Continue with Google**, and you're in. Any data
from the old local-only version (localStorage key `candypop_tracker_v1`) is
migrated into your account automatically on first sign-in.

> **Localhost auth:** `localhost` is authorized for Google sign-in by default.
> When you deploy, add your Hosting domain under **Authentication → Settings →
> Authorized domains**.

## 5. Deploy

```bash
firebase login
firebase use --add          # select your project, alias it "default"
npm run deploy              # builds, then `firebase deploy`
```

`npm run deploy` runs `npm run build && firebase deploy`, which publishes the
`dist/` folder to Hosting **and** deploys the Firestore security rules from
`firestore.rules`.

To deploy only part of it:

```bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

---

## Scripts

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start the Vite dev server                 |
| `npm run build`     | Typecheck + production build to `dist/`   |
| `npm run preview`   | Preview the production build locally      |
| `npm run lint`      | ESLint                                    |
| `npm run typecheck` | TypeScript, no emit                       |
| `npm test`          | Run the Vitest unit suite                 |
| `npm run test:watch`| Vitest in watch mode                      |
| `npm run deploy`    | Build + `firebase deploy`                 |

Unit tests cover the core pure logic — time/duration formatting (`format.ts`)
and the stats/history/today derivations (`derive.ts`) — in
`src/lib/*.test.ts`.

## Data model (Firestore)

```
users/{uid}                      → { activeTimer: {catId,start}|null, seeded: true }
users/{uid}/categories/{catId}   → { name, color, tint }
users/{uid}/entries/{entryId}    → { catId, start, end }   // start/end are epoch ms
```

Security rules restrict every path under `users/{uid}` to the signed-in owner.

## Project layout

```
src/
  lib/
    firebase.ts     Firebase app/auth/firestore init (offline persistence)
    auth.tsx        AuthProvider + useAuth (Google sign-in)
    store.ts        useTracker — Firestore read/write + seed/migration
    derive.ts       stats / history / today derivations
    format.ts       time & duration formatting
    useSettings.ts  local display preferences (clock format, seconds)
  components/       SignIn, Tracker, TrackTab, StatsTab, EntryModal,
                    ManageCategories, AccountMenu, TabBar, EntryRow, ...
  App.tsx           config check → auth gate → app
  main.tsx          React root
legacy/             the original single-file bundle, kept for reference
```
