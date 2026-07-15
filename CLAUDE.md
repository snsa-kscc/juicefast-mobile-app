# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. For a full feature/architecture handover, see [README.md](README.md).

## Project Overview

**Juicefast AI** (`juicefast-nutrition-app`) is a cross-platform wellness & nutrition app built with React Native + Expo, running on iOS, Android, and Web from one codebase. It combines wellness tracking (meals, steps, hydration, mindfulness, sleep, notes), an AI health chat and meal-photo analysis (Google Gemini), real-time nutritionist chat, a 21-day habit Challenge, the subscription-gated JF Club content library, a WooCommerce store, referrals, and native/web subscriptions.

Stack: TypeScript (strict), Expo SDK ~54 (New Architecture), React Native 0.81 / React 19, Expo Router ~6, NativeWind 4 + Tailwind 3, React Native Reanimated ~4. Backend is **Convex**; auth is **Clerk**; subscriptions via **RevenueCat** (native) and **WooCommerce** (web). Package manager is **pnpm**.

## Development Commands

- **Start dev server**: `pnpm start` (Metro/Expo)
- **iOS / Android (native)**: `pnpm ios` / `pnpm android` — required because the app uses native modules; **Expo Go will not work**, use a dev-client build
- **Web**: `pnpm web`
- **Convex backend**: `npx convex dev` — keep running while developing so schema/function changes deploy live and `convex/_generated` stays current
- **Lint**: `pnpm lint` (`eslint-config-expo`)
- **Format**: `pnpm format` (Prettier + Tailwind class sorting)

## Architecture

### Provider tree (`app/_layout.tsx`)

Order matters: `ClerkProvider` → `ConvexProviderWithClerk` → `RevenueCatProvider` → `GestureHandlerRootView` → `LoadingProvider` → `QueryProvider` → `AuthenticatedLayout`.

`AuthenticatedLayout` owns: auth gating/routing (signed-out → `(auth)/sso-signup`; signed-in but `onboardingCompleted !== true` → `/onboarding`; else `/(tabs)`), push-notification tap routing (incl. cold start), and push-token registration.

### Routing (`app/`, Expo Router, typed routes)

Route groups in parentheses don't affect the URL. Main groups: `(auth)`, `(tabs)` (Home/Challenge/Store/Chat/Club), `(legal)`. Tracker detail screens (`meals`, `steps`, `hydration`, `mindfulness`, `sleep`, `notes`) and `profile` are stack screens. `chat/`, `nutritionist/`, `challenge/`, `club/` hold their feature screens. Server routes live in `app/api/*+api.ts` (see below).

### Backend (`convex/`)

Convex holds all user data. Auth is Clerk-based (`convex/auth.config.js` trusts `CLERK_FRONTEND_API_URL`). Protected functions enforce `getUserIdentity()` (helpers in `convex/util.ts`). Tables (`convex/schema.ts`): trackers (`stepEntry`, `waterIntake`, `mindfulnessEntry`, `sleepEntry`, `mealEntry`, `noteEntry`), `userProfile`, `users` (push token + role), nutritionist chat (`nutritionists`, `chatSessions`, `chatMessages`), and challenge (`challengeProgress`, `challengeOrders`, `challengeMessages`). Each tracker exposes `create` / `getByUserId` / `deleteByUserIdAndTimestamp` plus `getByUserIdForServer` (used by the AI API routes).

### Server API routes (`app/api/*+api.ts`, hosted on Vercel)

Trusted server surface. They authenticate by forwarding the caller's Clerk bearer token to Convex (`convex.setAuth(token)`) and reject requests without an `Authorization` header. `chat+api.ts` (Gemini chat with the user's tracked data injected), `analyze-meal+api.ts` (meal photo → macros via `generateObject`), `push+api.ts` (authenticated Expo push relay for web), `web-subscription+api.ts` (WooCommerce). Web build/deploy is configured in `vercel.json` (`api/index.ts` is the `expo-server` Vercel adapter).

### State & data flow

- Realtime user data → Convex (`useQuery`/`useMutation` from `convex/react`).
- REST/WooCommerce & web flows → TanStack React Query (`providers/QueryProvider.tsx`, `hooks/`).
- Auth/session/roles → Clerk (`useAuth`, `useUser`; role in `user.unsafeMetadata.role`).
- Subscription state → `useRevenueCat()` + `usePaywall()`.

## Conventions & Gotchas

- **Path alias**: `@/*` → repo root (`tsconfig.json`). Use it for imports.
- **Styling**: NativeWind/Tailwind classes; global styles in `styles/global.css`, config in `tailwind.config.js`. Prettier sorts Tailwind classes — run `pnpm format`.
- **Fonts**: the **Lufga** family (loaded in `app/_layout.tsx`), e.g. `Lufga-Medium`, `Lufga-Bold`. (SpaceMono is present but Lufga is the app font.)
- **Convex casing**: table columns/indexes mix `userId` and `userID` across modules — match the existing column when extending a given table; don't "fix" it in isolation.
- **Roles**: nutritionist/admin behavior is driven by `user.unsafeMetadata.role` in Clerk; there is no in-app admin UI to set it.
- **RevenueCat debug flag**: `providers/RevenueCatProvider.tsx` has `PREMIUM_ACCESS_DEBUG` (default `false`) that force-unlocks premium in `__DEV__`. Keep it `false` for releases.
- **Env vars**: see `.env.example` / README §5. `EXPO_PUBLIC_`-prefixed vars are bundled into the client. `APP_VARIANT=development` switches to the dev app id/name/icon (`app.config.js`).

## Build & Release

EAS profiles in `eas.json`: `development` (dev client), `preview` (internal QA, Android APK), `production` (store, auto-increment). `appVersionSource` is `remote`. OTA updates ship via `expo-updates` to the `production` channel; the GitHub Actions workflow `.github/workflows/eas-update.yml` runs `eas update` when a `push`/PR to `main` is prefixed `[ci]` or on manual dispatch. Native changes (new native modules, permissions, `runtimeVersion` bump) require a new EAS **build** + store submission, not OTA.

## Docs

Feature deep-dives live in `docs/` (push notifications, paywall testing, RevenueCat troubleshooting, web subscription, referral system, security fixes, refactor history).
