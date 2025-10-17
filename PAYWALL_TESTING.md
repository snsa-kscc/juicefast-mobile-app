# Paywall Testing Guide (iOS Only)

> **Note:** This implementation currently supports iOS only. Android support can be added later when you have the Android API key.

## Prerequisites

Before testing, ensure you have:

1. ✅ Created a subscription in App Store Connect
2. ✅ Configured RevenueCat with your App Store subscription
3. ✅ Added the subscription to a RevenueCat offering (ideally named "default")
4. ✅ Set `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` in your `.env.local` file
5. ✅ Testing on an **iOS physical device** (required for purchases)

## Setting Up Sandbox Testing

### 1. Create Sandbox Test Account

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to **Users and Access** → **Sandbox Testers**
3. Click the **+** button to add a new sandbox tester
4. Fill in the details:
   - Email: Use a unique email (doesn't need to be real)
   - Password: Create a strong password
   - Country/Region: Select your region
5. Save the tester account

**Important:** Don't verify the email - sandbox accounts don't need verification.

### 2. Configure Your iOS Device

1. **Sign out of App Store ONLY** (NOT iCloud):
   - Go to **Settings** → Scroll down to **App Store**
   - Tap your Apple ID at the top
   - Tap **Sign Out**
   - ⚠️ **Do NOT sign out of iCloud** - keep that signed in!
2. **Do NOT sign in with the sandbox account yet** - wait until you make your first purchase
3. Make sure you're testing on a **physical device** (not simulator for real purchases)

### 3. Build and Install the App

```bash
# For development build
eas build --profile development --platform ios

# Or for preview build
eas build --profile preview --platform ios
```

Install the build on your device via TestFlight or direct installation.

## Testing the Purchase Flow

### Step 1: Trigger the Paywall

1. Open the app and navigate to the **Club** tab
2. You should see the paywall screen with your subscription packages
3. Verify that:
   - All subscription options are displayed
   - Prices are shown correctly
   - "Restore Purchases" button is visible

### Step 2: Make a Test Purchase

1. Tap on a subscription package
2. The iOS purchase dialog will appear
3. **Now sign in with your sandbox account** when prompted
4. Complete the purchase flow
5. The purchase should complete instantly (no actual charge)

### Step 3: Verify Access

1. After successful purchase, you should see a success alert
2. The paywall should disappear
3. You should now have access to the Club content
4. Close and reopen the app to verify the subscription persists

### Step 4: Test Restore Purchases

**Method 1: Using Debug Button (Recommended - No App Deletion Required)**

This method uses a built-in debug function that simulates losing your subscription locally.

1. After purchasing a subscription, you should have access to the Club tab
2. To access the debug button, you need to trigger the paywall screen:
   - **Option A:** Use the debug function from anywhere in the app (see "Quick Debug Access" below)
   - **Option B:** If you can still see the paywall screen, scroll down to find the debug button
3. Tap the "🧪 Test Restore Flow (Debug)" button (only visible in development mode)
4. Confirm the simulation in the alert dialog
5. The app will clear the local subscription state - paywall should now appear
6. Tap "Restore Purchases" button
7. Your subscription should be restored from RevenueCat and paywall should disappear

**Quick Debug Access (From Anywhere):**
You can also test this from the React Native debugger console:
```javascript
// In your browser console (when React Native debugger is connected):
// This will clear the subscription state
```

**Method 2: Full App Reinstall (Tests Complete Flow)**

This method tests the complete restore flow including app state reset.

1. Delete the app from your device
2. Reinstall the app
3. Sign in with your Clerk account
4. Navigate to the Club tab (paywall should appear)
5. Tap "Restore Purchases"
6. Sign in with the same sandbox account if prompted
7. Your subscription should be restored and paywall should disappear

**Method 3: Using RevenueCat's Customer Info Sync**

You can also force a refresh of customer info without any deletion:

1. While subscribed, force close the app completely
2. Reopen the app
3. RevenueCat automatically syncs customer info on app launch
4. This tests that the subscription persists across app sessions

## Testing Different Scenarios

### Test Subscription Cancellation

**Note:** Sandbox subscriptions don't appear in regular iOS Settings. To test cancellation:

**Option 1: Let it Auto-Cancel (Recommended)**
- Sandbox subscriptions auto-renew up to 6 times, then cancel automatically
- Just wait for it to expire (see accelerated renewal rates below)

**Option 2: Manual Testing**
1. On your iOS device, open the native **Settings** app (gear icon)
2. Tap your **Apple ID name** at the very top (shows your profile picture)
3. Tap **Subscriptions**
4. **Important:** Sandbox subscriptions may NOT appear here
5. If you see your test subscription, you can cancel it
6. If not, use Option 1 instead

**What to Expect:**
- After cancellation, you should still have access until the period ends
- Then the paywall should reappear when subscription expires

### Test Expired Subscription

Sandbox subscriptions have accelerated renewal rates:
- 1 week subscription = 3 minutes
- 1 month subscription = 5 minutes
- 2 months subscription = 10 minutes
- 3 months subscription = 15 minutes
- 6 months subscription = 30 minutes
- 1 year subscription = 1 hour

Wait for the subscription to expire and verify the paywall reappears.

### Test Multiple Packages

If you have multiple subscription tiers:
1. Purchase the basic tier
2. Verify access
3. Upgrade to a higher tier
4. Verify the upgrade works correctly

## Debugging Tips

### Check RevenueCat Dashboard

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Customers**
3. Search for your test user
4. Verify:
   - Customer info is created
   - Subscription is active
   - Entitlements are granted

### Enable Debug Logging

Add this to your `RevenueCatProvider.tsx` initialization:

```typescript
if (__DEV__) {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
}
```

### Common Issues

**Issue:** "Cannot connect to iTunes Store"
- **Solution:** Make sure you're signed out of your real Apple ID in Settings → App Store

**Issue:** Paywall doesn't disappear after purchase
- **Solution:** Check RevenueCat dashboard to verify the entitlement is active
- Check that your entitlement identifier matches in RevenueCat

**Issue:** No packages showing
- **Solution:** Verify your offering is set as "current" in RevenueCat
- Check that products are properly linked in RevenueCat

**Issue:** "This In-App Purchase has already been bought"
- **Solution:** This is normal for sandbox testing. Use "Restore Purchases" or create a new sandbox account

## Production Testing Checklist

Before going live:

- [ ] Test with multiple sandbox accounts
- [ ] Test all subscription durations
- [ ] Test restore purchases flow
- [ ] Test subscription expiration
- [ ] Test cancellation flow
- [ ] Verify analytics are tracking correctly
- [ ] Test on multiple iOS versions
- [ ] Review subscription terms and privacy policy
- [ ] Test with poor network conditions
- [ ] Verify error handling for failed purchases

## Environment Variables

Make sure this is set in your `.env.local`:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=your_ios_api_key_here
```

Android support can be added later by:
1. Getting your Android API key from RevenueCat
2. Adding `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` to `.env.local`
3. Updating the `initializeRevenueCat()` function in `RevenueCatProvider.tsx`

## Next Steps

1. Customize the paywall UI in `PaywallScreen.tsx`
2. Add analytics tracking for purchase events
3. Implement promotional offers
4. Add subscription management screen
5. Add Android support when ready (see Environment Variables section above)
