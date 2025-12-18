import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoadingProvider } from "@/providers/LoadingProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { RevenueCatProvider } from "@/providers/RevenueCatProvider";
import { usePushTokenStorage } from "@/hooks/usePushTokenStorage";
import "@/styles/global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebContainer } from "@/components/ui/WebContainer";
import {
  addNotificationListener,
  addForegroundNotificationListener,
  setActiveSessionId,
} from "@/services/messagingService";
import * as Notifications from "expo-notifications";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const FONT_CONFIG = {
  "Lufga-Thin": require("@/assets/fonts/LufgaThin.ttf"),
  "Lufga-ThinItalic": require("@/assets/fonts/LufgaThinItalic.ttf"),
  "Lufga-ExtraLight": require("@/assets/fonts/LufgaExtraLight.ttf"),
  "Lufga-ExtraLightItalic": require("@/assets/fonts/LufgaExtraLightItalic.ttf"),
  "Lufga-Light": require("@/assets/fonts/LufgaLight.ttf"),
  "Lufga-LightItalic": require("@/assets/fonts/LufgaLightItalic.ttf"),
  "Lufga-Regular": require("@/assets/fonts/LufgaRegular.ttf"),
  "Lufga-Italic": require("@/assets/fonts/LufgaItalic.ttf"),
  "Lufga-Medium": require("@/assets/fonts/LufgaMedium.ttf"),
  "Lufga-MediumItalic": require("@/assets/fonts/LufgaMediumItalic.ttf"),
  "Lufga-SemiBold": require("@/assets/fonts/LufgaSemiBold.ttf"),
  "Lufga-SemiBoldItalic": require("@/assets/fonts/LufgaSemiBoldItalic.ttf"),
  "Lufga-Bold": require("@/assets/fonts/LufgaBold.ttf"),
  "Lufga-BoldItalic": require("@/assets/fonts/LufgaBoldItalic.ttf"),
  "Lufga-ExtraBold": require("@/assets/fonts/LufgaExtraBold.ttf"),
  "Lufga-ExtraBoldItalic": require("@/assets/fonts/LufgaExtraBoldItalic.ttf"),
  "Lufga-Black": require("@/assets/fonts/LufgaBlack.ttf"),
  "Lufga-BlackItalic": require("@/assets/fonts/LufgaBlackItalic.ttf"),
};

const SCREEN_OPTIONS = {
  presentation: "card" as const,
  animation: "slide_from_right" as const,
};

function AuthenticatedLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const segments = useSegments() as string[];

  // Automatically store push token for all authenticated users
  usePushTokenStorage({ skip: !user });

  // Clear active session when user navigates away from chat screens
  useEffect(() => {
    const isInChatScreen =
      (segments.includes("nutritionist") && segments.includes("chat")) ||
      (segments.includes("chat") && segments.includes("nutritionist"));

    if (!isInChatScreen) {
      setActiveSessionId(null);
    }
  }, [segments]);

  // Global notification handler for push notification taps
  useEffect(() => {
    if (!user) return;

    // Handle notification taps when app was closed/backgrounded
    const unsubscribeTap = addNotificationListener(
      (chatId, intendedRecipientId) => {
        // Validate that the current user is the intended recipient
        if (intendedRecipientId && intendedRecipientId !== user.id) {
          console.log(
            "Ignoring notification - not the intended recipient:",
            intendedRecipientId
          );
          return;
        }

        console.log("User tapped notification for chat:", chatId);

        // Navigate based on user role
        const isNutritionist =
          user.unsafeMetadata?.role === "nutritionist" ||
          user.unsafeMetadata?.role === "admin";

        if (chatId) {
          if (isNutritionist) {
            // Nutritionist navigates to their chat interface
            router.push(`/nutritionist/chat/${chatId}`);
          } else {
            // Regular user navigates to nutritionist chat with session ID
            router.push(`/chat/nutritionist?sessionId=${chatId}`);
          }
        } else {
          // Fallback to chat options if no specific chat ID
          router.push("/chat");
        }
      }
    );

    // Handle notifications when app is open (foreground)
    const unsubscribeForeground = addForegroundNotificationListener(
      (senderName, messageText, chatId, intendedRecipientId) => {
        // Validate that the current user is the intended recipient
        if (intendedRecipientId && intendedRecipientId !== user.id) {
          console.log(
            "Ignoring foreground notification - not the intended recipient:",
            intendedRecipientId
          );
          return;
        }
      }
    );

    return () => {
      unsubscribeTap();
      unsubscribeForeground();
    };
  }, [user, router]);

  const shouldShowAddButton =
    isSignedIn &&
    !segments.includes("(auth)") &&
    !segments.includes("onboarding");

  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load

    if (isSignedIn && user) {
      // Check if app was opened from a notification (cold start)
      const handleNotificationNavigation = async () => {
        try {
          const response = Notifications.getLastNotificationResponse();

          if (response?.notification?.request?.content?.data) {
            const { chatId, intendedRecipientId } =
              response.notification.request.content.data;

            // Validate that the current user is the intended recipient
            if (intendedRecipientId && intendedRecipientId !== user.id) {
              console.log(
                "Ignoring cold start notification - not the intended recipient:",
                intendedRecipientId
              );
            } else if (chatId) {
              console.log("App opened from notification for chat:", chatId);

              // Navigate based on user role
              const isNutritionist =
                user.unsafeMetadata?.role === "nutritionist" ||
                user.unsafeMetadata?.role === "admin";

              // Check onboarding first, then navigate to chat
              const isOnboardingCompleted =
                user.unsafeMetadata?.onboardingCompleted === true;

              if (!isOnboardingCompleted) {
                // Store the chat navigation for after onboarding
                // For now, just proceed with onboarding
                router.replace("/onboarding");
              } else {
                if (isNutritionist) {
                  router.replace(`/nutritionist/chat/${chatId}`);
                } else {
                  router.replace(`/chat/nutritionist?sessionId=${chatId}`);
                }
                return; // Skip normal navigation
              }
            }
          }
        } catch (error) {
          console.error("Error checking notification response:", error);
        }

        // Normal navigation if no notification or notification handled
        const isOnboardingCompleted =
          user.unsafeMetadata?.onboardingCompleted === true;
        if (isOnboardingCompleted) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      };

      handleNotificationNavigation();
    } else {
      // User is not signed in - redirect to signup
      router.replace("/(auth)/sso-signup");
    }
  }, [isSignedIn, isLoaded, router, user]);

  if (!isLoaded) {
    return null;
  }

  return (
    <WebContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="flex-1 bg-jf-gray">
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="meals" options={SCREEN_OPTIONS} />
          <Stack.Screen name="steps" options={SCREEN_OPTIONS} />
          <Stack.Screen name="hydration" options={SCREEN_OPTIONS} />
          <Stack.Screen name="mindfulness" options={SCREEN_OPTIONS} />
          <Stack.Screen name="sleep" options={SCREEN_OPTIONS} />
          <Stack.Screen name="profile" options={SCREEN_OPTIONS} />
          <Stack.Screen name="chat/ai" options={SCREEN_OPTIONS} />
          <Stack.Screen name="chat/nutritionist" options={SCREEN_OPTIONS} />
          <Stack.Screen
            name="nutritionist/chat/[sessionId]"
            options={SCREEN_OPTIONS}
          />
          <Stack.Screen name="test-push" options={SCREEN_OPTIONS} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeAreaView>
    </WebContainer>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts(FONT_CONFIG);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RevenueCatProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <LoadingProvider>
              <QueryProvider>
                <AuthenticatedLayout />
              </QueryProvider>
            </LoadingProvider>
          </GestureHandlerRootView>
        </RevenueCatProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
