# RevenueCat Dashboard Troubleshooting

## Issue: Purchases Not Showing in Dashboard

### What I Just Fixed:

✅ **Added User ID Login** - RevenueCat now logs in users with their Clerk ID, so purchases are properly tracked
✅ **Added Debug Logging** - Console logs will help you see what's happening

### How to Check if It's Working:

1. **Check Console Logs** when you open the app:

   ```
   Logging in RevenueCat user: user_xxxxx
   RevenueCat Customer Info: { userId: 'user_xxxxx', entitlements: [] }
   RevenueCat Offerings loaded: default
   ```

2. **Check Console Logs** when making a purchase:
   ```
   Starting purchase for package: $rc_monthly
   Purchase successful! { userId: 'user_xxxxx', entitlements: ['premium'], ... }
   ```

### Steps to Verify in RevenueCat Dashboard:

#### 1. Check Customer Exists

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Navigate to **Customers** in the left sidebar
3. Search for your Clerk user ID (starts with `user_`)
4. You should see the customer with purchase history

#### 2. Check Transactions

1. In the customer detail page, look for **Transactions** tab
2. You should see sandbox purchases listed
3. Check the **Status** column - should show "Active" for valid subscriptions

#### 3. Check Entitlements

1. In the customer detail page, look for **Entitlements** section
2. Active entitlements should be listed here
3. If empty, the entitlement might not be configured

### Common Issues & Solutions:

#### Issue 1: Customer Not Found

**Problem:** User ID not being set correctly

**Solution:**

- Check console logs for "Logging in RevenueCat user: ..."
- Make sure you're logged into the app with Clerk
- User ID should match between Clerk and RevenueCat

#### Issue 2: Purchase Completes but No Entitlement

**Problem:** Product not linked to entitlement in RevenueCat

**Solution:**

1. Go to RevenueCat Dashboard → **Products**
2. Find your iOS subscription product
3. Click on it and check **Entitlements** section
4. Make sure it's linked to an entitlement (e.g., "premium")
5. If not, click **Add Entitlement** and create/link one

#### Issue 3: Sandbox Purchase Not Showing

**Problem:** Sandbox purchases take a moment to sync

**Solution:**

- Wait 10-30 seconds after purchase
- Refresh the RevenueCat dashboard
- Check the **Sandbox** filter is enabled in dashboard
- Verify you're using a sandbox Apple ID

#### Issue 4: Multiple Anonymous Users

**Problem:** RevenueCat created anonymous users before login

**Solution:**

- This is normal for the first run
- After the fix, new purchases will be under the correct user ID
- Old anonymous users can be ignored

### Verify Your Setup:

#### 1. Check Product Configuration

```
RevenueCat Dashboard → Products → [Your Product]
```

Verify:

- ✅ Product ID matches App Store Connect
- ✅ Linked to an entitlement
- ✅ Entitlement is active

#### 2. Check Offering Configuration

```
RevenueCat Dashboard → Offerings → Current
```

Verify:

- ✅ "Current" offering exists
- ✅ Your subscription package is in the offering
- ✅ Package is available

#### 3. Check App Configuration

```
RevenueCat Dashboard → Apps → [Your App]
```

Verify:

- ✅ iOS bundle ID matches your app
- ✅ App Store Connect integration is active
- ✅ Shared secret is configured (if using)

### Testing Checklist:

1. **Before Purchase:**
   - [ ] Open app and check console for "Logging in RevenueCat user"
   - [ ] Verify user ID is your Clerk user ID
   - [ ] Check offerings are loaded

2. **During Purchase:**
   - [ ] Tap subscription package
   - [ ] Complete sandbox purchase
   - [ ] Check console for "Purchase successful!"
   - [ ] Verify entitlements in console log

3. **After Purchase:**
   - [ ] Wait 30 seconds
   - [ ] Go to RevenueCat Dashboard → Customers
   - [ ] Search for your Clerk user ID
   - [ ] Verify transaction appears
   - [ ] Check entitlement is active

### Debug Commands:

Add these to your code temporarily to debug:

```typescript
// In RevenueCatProvider after purchase
const debugInfo = await Purchases.getCustomerInfo();
console.log("Full Customer Info:", JSON.stringify(debugInfo, null, 2));
```

### Still Not Working?

1. **Check API Key:**
   - Verify `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` is correct
   - Make sure it's the iOS key, not Android
   - Check for typos or extra spaces

2. **Check App Store Connect:**
   - Subscription must be approved (or in "Ready to Submit")
   - Sandbox testing must be enabled
   - Product ID must match exactly

3. **Check RevenueCat Integration:**
   - App Store Connect integration must be set up
   - Shared secret must be configured
   - Bundle ID must match

4. **Contact RevenueCat Support:**
   - They can see backend logs
   - Provide them with:
     - Your app bundle ID
     - Sandbox Apple ID email
     - Approximate time of purchase
     - User ID from console logs

### Expected Console Output:

When everything works correctly, you should see:

```
Logging in RevenueCat user: user_2abc123xyz
RevenueCat Customer Info: {
  userId: 'user_2abc123xyz',
  entitlements: []
}
RevenueCat Offerings loaded: default
Starting purchase for package: $rc_monthly
Purchase successful! {
  userId: 'user_2abc123xyz',
  entitlements: ['premium'],
  activeSubscriptions: ['your_product_id']
}
```

### Next Steps:

1. Rebuild your app with the updated code
2. Install on your device
3. Make a test purchase
4. Check console logs
5. Check RevenueCat dashboard after 30 seconds
6. If still not working, share console logs for further debugging
