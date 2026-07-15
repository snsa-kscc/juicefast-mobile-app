# Juicefast AI — Mobile App 🥤

Juicefast AI is a cross-platform wellness & nutrition app built with **React Native + Expo**. It runs on **iOS, Android, and Web** from a single codebase. This document is the **engineering handover** for the project: what the app does, how it is wired together, which third-party services it depends on, and how to build, run, and ship it.

> **Package:** `juicefast-nutrition-app` · **Version:** `1.1.3`
> **Bundle IDs:** `com.juicefastapp.juicefastnutritionapp` (prod) / `.dev` (dev)
> **Expo owner/project:** `juicefast` · EAS project `6e9c5757-7446-4974-80fa-fadd2ad8ebc4`

---

## 1. What the app does

Juicefast AI helps users track their daily wellness and gives them access to premium content and coaching. Major feature areas:

| Area | Description | Key code |
| --- | --- | --- |
| **Wellness tracking** | Log & view meals, steps, hydration, mindfulness, sleep, and daily notes. A weekly "wellness score" is computed from these. | `components/tracker/`, `convex/*Entry.ts`, `convex/waterIntake.ts` |
| **Home dashboard** | Daily overview, day selector, wellness score card, daily focus. | `components/dashboard/`, `app/(tabs)/index.tsx` |
| **AI health chat** | Chat assistant that answers using the user's *own* tracked data. Powered by Google Gemini via the Vercel AI SDK. | `app/chat/ai.tsx`, `components/ai/AIChat.tsx`, `app/api/chat+api.ts` |
| **AI meal analysis** | Take/upload a photo of a meal → Gemini returns name + macros (calories/protein/carbs/fat), which can be saved as a meal entry. | `app/api/analyze-meal+api.ts`, `components/tracker/MealsTracker.tsx` |
| **Nutritionist chat** | Real-time 1:1 chat between users and nutritionists (separate role), backed by Convex, with push notifications. | `app/nutritionist/`, `app/chat/nutritionist.tsx`, `convex/nutritionistChat.ts` |
| **21-day Challenge** | Guided habit challenge with before/after photos, habit checklist, progress dashboard, order enrollment, and broadcast messages. | `app/challenge/`, `app/(tabs)/challenge.tsx`, `convex/challenge*.ts` |
| **JF Club** | Premium content library (recipes, beauty, workouts, meditation, etc.) gated behind subscription. Content is bundled JSON. | `app/club/`, `components/club/`, `data/jf-*.json` |
| **Store** | WooCommerce-backed store surfaced in-app. | `app/(tabs)/store.tsx` |
| **Onboarding quiz** | Multi-step quiz on first launch that builds a user profile & recommendations. | `app/onboarding.tsx`, `components/onboarding/`, `data/onboarding/quizQuestions.ts` |
| **Referrals** | Each user gets a referral code; installs can be attributed to a referrer. | `convex/userProfile.ts`, `utils/referral*.ts`, `referral/index.html` |
| **Subscriptions / Paywall** | Native purchases via RevenueCat (iOS/Android) and a web subscription flow via WooCommerce. | `providers/RevenueCatProvider.tsx`, `hooks/usePaywall.ts`, `hooks/useWebSubscription.ts` |
| **Push notifications** | Expo push tokens stored per user; used for chat and challenge broadcasts. | `services/messagingService.ts`, `hooks/usePushTokenStorage.ts`, `app/api/push+api.ts` |

---

## 2. Tech stack

**Runtime**

- **React Native** `0.81.5` · **React** `19.1.0` · **Expo SDK** `~54` (New Architecture enabled)
- **TypeScript** `~5.9` (strict mode)
- **Node** ≥ 18 (CI uses Node 22; developed on Node 24). Package manager: **pnpm** (`node-linker=hoisted`).

**Navigation & UI**

- **Expo Router** `~6` (file-based routing, typed routes enabled)
- **NativeWind** `4` (Tailwind CSS for RN) + **Tailwind** `3.4`
- **React Native Reanimated** `~4.1` + **Gesture Handler**, **Bottom Sheet** (`@gorhom/bottom-sheet`)
- **Lucide** icons + custom SVG (`react-native-svg`)
- Fonts: **Lufga** family (18 weights/styles) + SpaceMono, loaded in `app/_layout.tsx`

**Backend & data**

- **Convex** `~1.27` — primary realtime backend/database (`convex/`)
- **Clerk** — authentication & user management (`@clerk/clerk-expo`, `@clerk/backend`)
- **TanStack React Query** `5` — server-state for the WooCommerce/REST surfaces
- **Zod** `4` — schema validation (`schemas/`)

**Third-party integrations**

- **Google Gemini** (`@ai-sdk/google`, `@google/generative-ai`) via **Vercel AI SDK** (`ai`) — AI chat & meal analysis
- **RevenueCat** (`react-native-purchases`) — native subscriptions
- **WooCommerce / WordPress** — store + web subscription (`WP_CK`/`WP_CS`/`EXPO_PUBLIC_WC_URL`)
- **Expo Notifications** + **FCM** (Android `google-services*.json`) — push
- **EAS** (Build / Update / Submit) and **Vercel** (web + API hosting)

---

## 3. Architecture overview

### Provider tree

The app is wrapped (in `app/_layout.tsx`) in this order — this ordering matters:

```
ClerkProvider                       # auth
 └─ ConvexProviderWithClerk         # Convex authed with Clerk JWT
     └─ RevenueCatProvider          # subscriptions (uses Clerk user id)
         └─ GestureHandlerRootView
             └─ LoadingProvider     # global loading overlay
                 └─ QueryProvider   # TanStack React Query
                     └─ AuthenticatedLayout  # routing + notifications
```

`AuthenticatedLayout` also owns three cross-cutting behaviors:

1. **Auth gating & routing** — signed-out users go to `(auth)/sso-signup`; signed-in users with `onboardingCompleted !== true` go to `/onboarding`; otherwise `/(tabs)`.
2. **Push-notification routing** — taps (foreground/background and cold-start) route to the right chat/challenge screen. Recipient is checked against `intendedRecipientId`.
3. **Push token registration** — `usePushTokenStorage` stores the device's Expo push token in Convex for the current user.

### Routing map (`app/`)

Expo Router, file-based. Route groups in parentheses don't affect the URL.

```
app/
├─ _layout.tsx                 # root: providers + auth routing (see above)
├─ (auth)/                     # sign-in, SSO/email signup, forgot-password
├─ (tabs)/                     # main tab bar: index(Home), challenge, store, chat, club
├─ (legal)/                    # terms, privacy, citations
├─ onboarding.tsx              # first-run quiz
├─ meals / steps / hydration / mindfulness / sleep / notes   # tracker detail screens
├─ profile.tsx                 # user profile & account
├─ chat/                       # ai.tsx, nutritionist.tsx, sessions.tsx
├─ nutritionist/               # dashboard.tsx, chat/[sessionId].tsx  (nutritionist role)
├─ challenge/                  # habits, messages, order-entry, progress-dashboard, ...
├─ club/                       # categories/[category]/[subcategory].tsx, content/[id].tsx
├─ api/                        # server routes (run on Vercel, see §6)
│   ├─ chat+api.ts             # AI health chat (Gemini, injects user's Convex data)
│   ├─ analyze-meal+api.ts     # meal photo → macros (Gemini generateObject)
│   ├─ push+api.ts             # authenticated push relay (web)
│   └─ web-subscription+api.ts # WooCommerce web subscription
└─ +not-found.tsx
```

The tab bar (`app/(tabs)/_layout.tsx`) is a custom blurred floating bar. Tabs require sign-in (an alert prompts sign-up/login). A native-tabs variant exists but is currently disabled. The chat tab shows an unread-count badge derived from Convex sessions.

### Backend (`convex/`)

Convex holds all user-generated data. Auth is Clerk-based (`convex/auth.config.js` trusts `CLERK_FRONTEND_API_URL`). Helpers in `convex/util.ts` enforce `getUserIdentity()` on protected functions.

Tables (`convex/schema.ts`):

- **Trackers:** `stepEntry`, `waterIntake`, `mindfulnessEntry`, `sleepEntry`, `mealEntry`, `noteEntry`
- **Profile & users:** `userProfile` (height/weight/age/gender/activity + referral fields), `users` (push token + role)
- **Nutritionist chat:** `nutritionists`, `chatSessions`, `chatMessages`
- **Challenge:** `challengeProgress` (habits 1–21, before/after photos in Convex storage), `challengeOrders`, `challengeMessages`

Each tracker module exposes `create` / `getByUserId` / `deleteByUserIdAndTimestamp`, plus a `getByUserIdForServer` used by the AI API routes (which query Convex server-side with the forwarded Clerk token). `convex/migrations/` holds one-off data migrations.

> Note: table indexes are inconsistent between `userId` and `userID` casing across modules — preserve the existing casing when adding functions to a given table.

### State & data flow

- **Realtime user data** → Convex (`useQuery`/`useMutation` from `convex/react`).
- **REST/WooCommerce & web flows** → TanStack React Query (`providers/QueryProvider.tsx`, `hooks/useMeals.ts`, `hooks/useWebSubscription.ts`).
- **Auth/session** → Clerk (`useAuth`, `useUser`; roles live in `user.unsafeMetadata.role`).
- **Subscription state** → `useRevenueCat()` context + `usePaywall()`.

---

## 4. Getting started

### Prerequisites

- Node 18+ (recommend 20/22), **pnpm** (`corepack enable` or `npm i -g pnpm`)
- **EAS CLI** (`npm i -g eas-cli`) and an Expo account with access to the `juicefast` org
- iOS: Xcode + Simulator (macOS). Android: Android Studio + an emulator/device.
- Accounts/keys for: **Clerk**, **Convex**, **Google Generative AI**, **RevenueCat**, **WooCommerce**.

### Install & configure

```bash
git clone <repository-url>
cd juicefast-mobile-app
pnpm install
cp .env.example .env.local   # then fill in the values (see §5)
```

### Convex

```bash
npx convex dev      # first run links/creates the deployment and generates convex/_generated
```

Keep `npx convex dev` running while developing so schema/function changes deploy live.

### Run the app

```bash
pnpm start          # Expo dev server (Metro)
pnpm ios            # build & run native iOS (uses expo-dev-client)
pnpm android        # build & run native Android
pnpm web            # run in the browser
```

Because the app uses native modules (RevenueCat, secure store, notifications), you need a **dev client build** — Expo Go is not sufficient. Build one with `eas build --profile development` (see §7) or `pnpm ios` / `pnpm android` locally.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Start Metro / Expo dev server |
| `pnpm ios` / `pnpm android` | Build & run the native app locally |
| `pnpm web` | Run the web build |
| `pnpm lint` | ESLint (`eslint-config-expo`) |
| `pnpm format` | Prettier (with Tailwind class sorting) |
| `pnpm reset-project` | Moves starter code aside (from Expo template; not used day-to-day) |

Python helpers in `scripts/` (`duration_updater*.py`, `fix_duration.py`) are one-off content-data utilities for the JF Club JSON, not part of the app runtime.

---

## 5. Environment variables

Copy `.env.example` → `.env.local`. All keys are required for full functionality; those prefixed `EXPO_PUBLIC_` are embedded in the client bundle (do **not** put secrets there beyond what's intended to be public).

| Variable | Used for |
| --- | --- |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk client auth |
| `CLERK_SECRET_KEY` | Clerk server (API routes) |
| `CLERK_FRONTEND_API_URL` | Convex ↔ Clerk JWT trust (`convex/auth.config.js`) |
| `CONVEX_DEPLOYMENT` | Convex CLI deployment target |
| `EXPO_PUBLIC_CONVEX_URL` | Convex client + server API routes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini (AI chat + meal analysis) |
| `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` | RevenueCat iOS |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` | RevenueCat Android |
| `EXPO_PUBLIC_REVENUECAT_DEV_API_KEY` | RevenueCat in `__DEV__` builds |
| `EXPO_PUBLIC_API_BASE_URL` | Base URL for the hosted API routes |
| `APP_VARIANT` | `development` selects the dev app name/bundle id/icon (`app.config.js`) |
| `WP_CK` / `WP_CS` | WooCommerce consumer key/secret (store + web subscription) |
| `EXPO_PUBLIC_WC_URL` | WooCommerce/WordPress base URL |
| `EXPO_PUBLIC_YEARLY_PRODUCT_ID` / `EXPO_PUBLIC_MONTHLY_PRODUCT_ID` | Subscription product IDs |

The same variables are configured as **GitHub Actions secrets** (for EAS Update) and must also be set in **EAS** and **Vercel** project settings. `google-services.json` / `google-services-dev.json` (Android FCM) are committed and selected by `APP_VARIANT`.

---

## 6. Web & server API routes

The app also ships as a **web app + serverless API**, hosted on **Vercel** (`vercel.json`):

- Build: `expo export -p web` → static client in `dist/client`, server bundle in `dist/server`.
- All requests are rewritten to `api/index.ts`, which uses `expo-server`'s Vercel adapter to serve the Expo Router API routes (`app/api/*+api.ts`).

The API routes are the trusted server surface. They authenticate by forwarding the caller's **Clerk bearer token** to Convex (`convex.setAuth(token)`) and reject requests without an `Authorization` header:

- `POST /api/chat` — streams a Gemini response, injecting today's tracked metrics from Convex as context.
- `POST /api/analyze-meal` — `generateObject` with Gemini to extract macros from a base64 meal image.
- `POST /api/push` — authenticated relay to Expo's push service (used by the web client, which can't hit Expo push directly).
- `POST /api/web-subscription` — WooCommerce web subscription flow.

---

## 7. Build & release (EAS)

Profiles are defined in `eas.json`; `appVersionSource` is `remote` (versioning lives in EAS).

| Profile | Purpose | Notes |
| --- | --- | --- |
| `development` | Dev client, internal distribution | Sets `APP_VARIANT=development` (dev app id/name/icon) |
| `preview` | Internal QA builds | Android builds as APK |
| `production` | Store builds | `autoIncrement` on, `production` channel |

```bash
eas build   --profile development --platform ios      # or android
eas build   --profile production  --platform all
eas submit  --profile production  --platform ios      # / android
```

**OTA updates.** `expo-updates` is wired to the EAS Update endpoint with `runtimeVersion` pinned to the app version (`1.1.3`). The GitHub Actions workflow `.github/workflows/eas-update.yml` publishes an update to the **production** channel when:

- a `push` to `main` has a commit message starting with `[ci]`, **or**
- a PR to `main` has a title starting with `[ci]`, **or**
- the workflow is dispatched manually.

Only JS/asset changes ship via OTA. Native changes (new native modules, permissions, `runtimeVersion` bump) require a new EAS **build** and store submission.

---

## 8. Project layout (top level)

```
app/          File-based routes (screens + server API routes)
components/   UI components, grouped by feature (tracker, dashboard, club, challenge, onboarding, ai, chat, nutritionist, ui, icons)
convex/       Backend: schema, queries/mutations/actions, auth config, migrations, generated types
providers/    React context providers (RevenueCat, Query, Loading, NavigationGuard)
hooks/        Custom hooks (paywall, meals, club logic, onboarding, social sign-in, push token, theme, web subscription)
schemas/      Zod schemas (Meals, UserProfile)
utils/        Helpers (referral, sanitize, alert, navigation guard, quiz formatting, image, data loaders)
services/     messagingService.ts (push notifications)
constants/    Colors.ts, Fonts.ts
data/         Bundled content JSON (jf-club, jf-recipes, jf-beauty) + onboarding quiz + backups
styles/       global.css (NativeWind/Tailwind)
assets/       Fonts (Lufga family) and images (icons, JF Club imagery, challenge art, socials)
docs/         Feature-specific deep dives (see §9)
api/          Vercel adapter entry (index.ts)
scripts/      One-off content data utilities (Python) + reset-project
```

Path alias `@/*` maps to the repo root (`tsconfig.json`), e.g. `import { WellnessTracker } from "@/components/tracker/WellnessTracker"`.

---

## 9. Further documentation

Feature-specific docs live in `docs/`:

- [`PUSH_NOTIFICATIONS.md`](docs/PUSH_NOTIFICATIONS.md) — push token flow & message types
- [`PAYWALL_TESTING.md`](docs/PAYWALL_TESTING.md) — testing the RevenueCat paywall
- [`REVENUECAT_TROUBLESHOOTING.md`](docs/REVENUECAT_TROUBLESHOOTING.md) — common subscription issues
- [`WEB_SUBSCRIPTION.md`](docs/WEB_SUBSCRIPTION.md) — WooCommerce web subscription flow
- [`REFERRAL_SYSTEM.md`](docs/REFERRAL_SYSTEM.md) — referral codes & attribution
- [`PROMOTION_PREFERENCE_REFACTOR.md`](docs/PROMOTION_PREFERENCE_REFACTOR.md) — promotion preference change
- [`REFACTOR_SUMMARY.md`](docs/REFACTOR_SUMMARY.md) — route-group refactor history
- [`SECURITY_FIXES.md`](docs/SECURITY_FIXES.md) — hardening notes
- [`CLAUDE.md`](CLAUDE.md) — AI-assistant working notes for this repo

---

## 10. Handover checklist / notes for the next owner

Accounts & dashboards you will need transferred or invited to:

- **Expo / EAS** — org `juicefast`, project id `6e9c5757-7446-4974-80fa-fadd2ad8ebc4` (builds, updates, push, secrets)
- **Convex** — the production deployment (`CONVEX_DEPLOYMENT`) and its dashboard
- **Clerk** — the application instance (users, JWT template for Convex, `unsafeMetadata.role` for nutritionist/admin)
- **RevenueCat** — iOS & Android projects, entitlements, offerings/products
- **Google Cloud** — Generative AI (Gemini) API key + billing
- **Firebase** — Android FCM project behind `google-services*.json`
- **WooCommerce / WordPress** — store + subscription REST credentials
- **Vercel** — web + API hosting project (env vars mirrored here)
- **App Store Connect** & **Google Play Console** — store listings, signing, review
- **GitHub** — repo + Actions secrets for EAS Update

Known gotchas:

- Convex table indexes mix `userId` / `userID` casing — match the existing column when extending a table.
- Nutritionist/admin behavior is driven by `user.unsafeMetadata.role` in Clerk; there is no separate admin UI to set it.
- `RevenueCatProvider` has a `PREMIUM_ACCESS_DEBUG` flag (default `false`) that force-unlocks premium in dev — make sure it stays `false` for releases.
- Requires a **dev client** build (native modules); Expo Go won't run it.

---

**Private & proprietary — Juicefast App.** Built with Expo & React Native.
