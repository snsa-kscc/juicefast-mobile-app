# Push Notifications Implementation

This app now has push notifications implemented for the nutritionist chat feature.

## How It Works

1. **Push Token Storage**: Each user's device generates a unique push token that's stored in the Convex database
2. **Message Sending**: When a message is sent, the recipient's push token is retrieved and a notification is sent via Expo's push service
3. **Notification Handling**: Notifications work when the app is closed, in background, or open (with different behaviors)

## Testing Push Notifications

### Method 1: Test Component
1. Open the app on two physical devices
2. Navigate to `/test-notifications` on both devices
3. Copy the token from Device A
4. Paste the token into Device B's "Other Device Token" field
5. Send a message from Device B to Device A
6. Close the app on Device A to see the notification

### Method 2: Using Expo Push Tool
1. Get your device token from the app (check console logs or the test component)
2. Go to https://expo.dev/notifications
3. Paste your token
4. Type a test message and send

### Method 3: Using Two Devices in Chat
1. Open the chat between a user and nutritionist on two different devices
2. Send messages between devices
3. Close the recipient app to see push notifications

## Key Features

- ✅ Push tokens are automatically stored when users open the app
- ✅ Notifications are sent when messages are delivered
- ✅ Works when app is closed, backgrounded, or open
- ✅ Foreground notifications are handled silently (no popup when app is open)
- ✅ Users can tap notifications to open the relevant chat

## Files Modified

- `services/messagingService.ts` - Core push notification service
- `convex/schema.ts` - Added users table for push token storage
- `convex/users.ts` - User management functions
- `convex/nutritionistChat.ts` - Updated to return recipient info for notifications
- `components/nutritionist/NutritionistChat.tsx` - User-side chat with push notifications
- `app/nutritionist/chat/[sessionId].tsx` - Nutritionist-side chat with push notifications
- `components/PushNotificationTest.tsx` - Test component (optional)
- `app/test-notifications.tsx` - Test route (optional)

## Requirements

- Physical device (push notifications don't work on simulator)
- Expo Go app for development
- Proper notification permissions on device
- Internet connection

## Troubleshooting

1. **No token generated**: Ensure you're using a physical device, not simulator
2. **Permission denied**: Check device notification settings for the app
3. **Notifications not showing**: Make sure app is fully closed (swiped away from multitasking)
4. **Testing issues**: Use two physical devices for reliable testing