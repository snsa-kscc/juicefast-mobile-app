# Promotion Preference Refactor

## Overview
Refactored the promotion preference handling to use Clerk metadata instead of storing in the userProfile database table.

## Changes Made

### 1. Email Signup (`app/(auth)/email-signup.tsx`)
- **Added**: `disallow_promotion: noPromotions` to Clerk's `unsafeMetadata` during user signup
- **Removed**: SecureStore storage of `allow_promotion` after verification
- **Benefit**: Preference is stored immediately with user authentication data

### 2. Profile Screen (`app/profile.tsx`)
- **Removed**: `allowPromotion` state variable
- **Removed**: Loading promotion preference from userProfile database
- **Updated**: Switch component now reads from `user?.unsafeMetadata?.disallow_promotion`
- **Updated**: Switch updates Clerk metadata directly using `user?.update()`
- **Removed**: `allow_promotion` parameter from all `updateUserProfile` mutation calls
- **Benefit**: Real-time updates to Clerk, no database sync needed

### 3. Onboarding Utility (`utils/onboarding.ts`)
- **Removed**: Reading `allow_promotion` from SecureStore
- **Removed**: Passing `allow_promotion` to `createOrUpdateUserProfile` mutation
- **Removed**: Deleting `allow_promotion` from SecureStore after onboarding
- **Benefit**: Simplified onboarding flow, no temporary storage needed

### 4. Convex Backend (`convex/userProfile.ts`)
- **Removed**: `allow_promotion: v.optional(v.boolean())` from mutation arguments
- **Benefit**: Cleaner API, one less field to manage

### 5. Database Schema (`convex/schema.ts`)
- **Removed**: `allow_promotion: v.optional(v.boolean())` from userProfile table definition
- **Benefit**: Simplified database schema

## How It Works Now

### During Signup
1. User checks/unchecks "I don't want to receive updates and promotions"
2. State is stored in `noPromotions` variable
3. On signup, `disallow_promotion: noPromotions` is added to Clerk's `unsafeMetadata`
4. No temporary storage needed

### During Onboarding
1. Promotion preference is already in Clerk metadata
2. Onboarding completion doesn't need to handle promotion preferences
3. User profile is created without promotion field

### In Profile Screen
1. Switch reads from `user?.unsafeMetadata?.disallow_promotion`
2. Display value is inverted (we store "disallow" but show "allow")
3. On toggle, directly updates Clerk metadata via `user.update()`
4. No database mutation needed for this preference

## Benefits

1. **Single Source of Truth**: Clerk metadata is the only place storing this preference
2. **No Sync Issues**: No need to keep database and Clerk in sync
3. **Simpler Code**: Removed temporary storage and database field
4. **Better Architecture**: User preferences tied to authentication, not profile data
5. **Easier Access**: Available anywhere through Clerk's `user` object
6. **Real-time Updates**: Changes reflect immediately without database round-trip

## Migration Notes

- Existing users with `allow_promotion` in database: Field will be ignored, preference defaults to "allow" (disallow_promotion = false)
- New users: Preference stored in Clerk from signup
- No data migration needed as this is a preference, not critical data

## Testing Checklist

- [ ] New user signup with promotion checkbox checked
- [ ] New user signup with promotion checkbox unchecked
- [ ] Profile screen displays correct toggle state
- [ ] Toggle switch updates Clerk metadata
- [ ] Onboarding completion works without promotion field
- [ ] Existing users can still update their preference
