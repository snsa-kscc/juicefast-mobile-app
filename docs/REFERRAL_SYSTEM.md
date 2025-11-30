# Referral System Documentation

## Overview

The Juicefast mobile app includes a referral system that allows users to be referred through custom links from the web landing page. When users install the app through these referral links, the referral code is automatically captured and stored for use during signup.

## Architecture

### Components

1. **Referral Landing Page** (`/referral/index.html`)
   - Web page that captures referral codes from URL parameters
   - Provides two clear buttons for iOS and Android app store downloads
   - Copies referral code to clipboard before redirecting

2. **Referral Storage** (`/utils/referralStorage.ts`)
   - Secure storage utility using Expo SecureStore
   - Handles storing, retrieving, and managing referral codes

3. **App Install Handler** (`/utils/appInstallHandler.ts`)
   - Captures referral codes from deep links and clipboard
   - Validates codes with alphanumeric pattern (3-20 characters)
   - Simplified unified approach for iOS and Android

4. **Email Signup Integration** (`/app/(auth)/email-signup.tsx`)
   - Automatically loads stored referral codes during signup
   - Pre-fills the referral field and validates codes against database
   - Stores validated codes for processing during onboarding

5. **OAuth Signup Integration** (`/app/(auth)/sso-signup.tsx`)
   - Logs existing referral codes for debugging
   - Bypasses manual validation (trusting app store source)
   - Proceeds to onboarding where referral codes are processed

6. **Onboarding Processing** (`/utils/onboarding.ts`)
   - Retrieves stored referral codes from SecureStore
   - Creates user profiles with referral relationships
   - Increments referrer counts and cleans up stored codes

## Flow

### 1. Referral Link Generation

```
https://your-domain.com/referral/?code=USER123
```

### 2. Web Page Processing

- Extract `code` parameter from URL
- Display two clear buttons: "Download for iOS" and "Download for Android"
- When user clicks a button:
  - Copy referral code to clipboard
  - Redirect to appropriate app store:
    - iOS: `https://apps.apple.com/us/app/juicefast-ai/id6751504716`
    - Android: `https://play.google.com/store/apps/details?id=com.juicefastapp.juicefastnutritionapp`

### 3. App Installation & Launch

- App stores do not pass referral parameters to the app
- On first launch, `handleAppInstallWithReferral()` checks:
  1. Deep links (if app was opened directly)
  2. Clipboard for referral codes
- Validates clipboard content with pattern: `[A-Z0-9]{3,20}`
- Referral code is stored securely using SecureStore

### 4. User Signup

The referral system handles two different signup methods:

#### Email Signup Flow

- Email signup page loads stored referral code
- Code is pre-filled in the referral field
- Code is validated against user database before signup
- Upon successful verification, referral code is stored again
- Referral is processed during onboarding completion

#### OAuth Signup Flow (Google/Apple)

- Referral code is automatically stored from app install
- OAuth signup bypasses referral validation (trusting app store source)
- Code remains in SecureStore until onboarding completion
- Referral is processed and validated during profile creation
- No user interaction required for referral code entry

## Implementation Details

### Parameter Handling

The system handles different parameter sources:

- **Deep Links**: Accepts `referral`, `referrer`, and `ref` parameters
- **Clipboard**: Validates codes with `[A-Z0-9]{3,20}` pattern
- **Web Page**: Copies codes directly to clipboard

### Security

- Referral codes are stored using Expo SecureStore
- Pattern validation ensures only properly formatted codes are accepted
- Codes are validated against the user database before acceptance
- Automatic cleanup prevents stale referral codes

### Error Handling

- Graceful fallback if referral code cannot be stored
- Validation prevents invalid codes from being accepted
- Debug logging for troubleshooting

## Testing

### Manual Testing

1. **Debug Function**

   ```typescript
   import { debugReferralSystem } from "@/utils/appInstallHandler";

   // Call this in development to test the system
   await debugReferralSystem();
   ```

2. **End-to-End Testing**
   ```
   1. Visit: https://your-domain.com/referral/?code=TEST123
   2. Click "Download for iOS" or "Download for Android" button
   3. Verify "TEST123" is copied to clipboard
   4. Install and launch the app
   5. Navigate to email signup
   6. Verify "TEST123" appears in referral field
   ```

### Android Testing (ADB)

For testing Play Store referrals on Android:

```bash
# Simulate Play Store referrer broadcast
adb shell am broadcast -a com.android.vending.INSTALL_REFERRER \
  --es referrer "referral=TEST123" \
  com.juicefastapp.juicefastnutritionapp
```

### iOS Testing

For iOS, test with custom URL schemes:

```bash
# Test deep link with referral
xcrun simctl openurl booted "juicefast-ai://sso-signup?referral=TEST123"
```

## Limitations & Future Improvements

### Current Limitations

1. **Clipboard Reliability**: Users may copy other content to clipboard before installing the app, causing the referral code to be lost.

2. **iOS Clipboard Privacy**: iOS 14+ shows paste notifications that may confuse users when the app reads clipboard on first launch.

3. **Timing Window**: No timestamp validation - clipboard content could be old if user delays app installation.

4. **Deep Link Fallback**: Deep links still work but are not the primary method after simplification.

### Recommended Improvements

1. **Install Referrer Library**

   ```bash
   npm install @react-native-firebase/app @react-native-firebase/analytics
   ```

   - Better Android Play Store referral tracking
   - Cross-platform attribution

2. **Timestamp Validation**
   - Add timestamp metadata to clipboard content
   - Reject clipboard content older than 10-15 minutes
   - Improve reliability by reducing stale referral code acceptance

3. **Analytics Integration**
   - Track referral conversion rates
   - Monitor clipboard vs deep link effectiveness
   - Measure user behavior on referral page

## Troubleshooting

### Common Issues

1. **Referral Code Not Appearing in Signup**
   - Check console logs for `handleAppInstallWithReferral` execution
   - Verify app was launched through referral link or clipboard contains JF- code
   - Test clipboard functionality manually

2. **Invalid Referral Code Error**
   - Ensure referral code exists in user database
   - Check that clipboard content matches `[A-Z0-9]{3,20}` pattern
   - Verify code format and length requirements

3. **Clipboard Not Working**
   - iOS: Check if clipboard permission was granted by user
   - Android: Ensure clipboard access is enabled in app settings
   - Test with manual clipboard copy/paste

4. **Referral Code Format Issues**
   - Verify web page is copying code without any prefix
   - Check that app validates code format correctly
   - Test with various referral code lengths and formats

### Debug Logging

Enable debug logging by checking console output:

- `"Referral code stored from deep link: [CODE]"`
- `"Referral code stored from clipboard: [CODE]"`
- `"No referral code found from deep link or clipboard"`

## File Structure

```
/referral/
├── index.html                 # Referral landing page
├── assets/
│   ├── fonts/                # Custom fonts
│   └── images/               # Logo and icons

/utils/
├── referralStorage.ts        # Secure storage utility
└── appInstallHandler.ts      # Install referral handling

/app/(auth)/
└── email-signup.tsx          # Signup with referral integration

docs/
└── REFERRAL_SYSTEM.md        # This documentation
```

## Support

For issues or questions about the referral system:

1. Check console logs for error messages
2. Run the debug function to test components
3. Verify referral codes exist in the user database
4. Test with different platforms (iOS/Android)

Last updated: November 2025

## Recent Changes (November 2025)

### Simplified Referral System

- **Removed automatic device detection** from referral page
- **Added explicit iOS/Android buttons** for better user control
- **Implemented clipboard-based referral code transfer**:
  - Web page copies referral code to clipboard when button clicked
  - App reads clipboard on first launch with pattern validation
- **Unified app install handler** with single function for both platforms
- **Improved validation** with alphanumeric pattern to reduce false positives
- **Enhanced user feedback** throughout the referral process
