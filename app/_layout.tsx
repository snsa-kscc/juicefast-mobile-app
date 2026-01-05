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
import "@/utils/nativewind";
import "@/utils/navigationGuard";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebContainer } from "@/components/ui/WebContainer";
import {
  addNotificationListener,
  setActiveSessionId,
  getInitialNotification,
  type NotificationData,
} from "@/services/messagingService";

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
      segments.includes("chat") || segments.includes("nutritionist");

    if (!isInChatScreen) {
      setActiveSessionId(null);
    }
  }, [segments]);

  // Handle notification taps
  useEffect(() => {
    if (!user) return;

    const handleNotification = (data: NotificationData) => {
      if (data.intendedRecipientId && data.intendedRecipientId !== user.id)
        return;

      const isInChatScreen =
        segments.includes("chat") || segments.includes("nutritionist");

      const navigate = (path: string, shouldReplace: boolean) => {
        if (shouldReplace) {
          router.replace(path as any);
        } else {
          router.push(path as any);
        }
      };

      switch (data.type) {
        case "chat": {
          const isNutritionist =
            user.unsafeMetadata?.role === "nutritionist" ||
            user.unsafeMetadata?.role === "admin";
          const path = isNutritionist
            ? `/nutritionist/chat/${data.chatId}`
            : `/chat/nutritionist`;
          navigate(path, isInChatScreen);
          break;
        }
        case "challenge_notification":
          navigate("/(tabs)/challenge", false);
          break;
        case "test_notification":
          navigate("/(tabs)", false);
          break;
      }
    };

    return addNotificationListener(handleNotification);
  }, [user, router, segments]);

  // Auth routing (including cold start from notification)
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const isOnboardingCompleted =
        user.unsafeMetadata?.onboardingCompleted === true;

      if (!isOnboardingCompleted) {
        router.replace("/onboarding");
        return;
      }

      // Check for cold start notification
      const initial = getInitialNotification();
      if (initial) {
        if (
          initial.intendedRecipientId &&
          initial.intendedRecipientId !== user.id
        ) {
          router.replace("/(tabs)");
          return;
        }

        switch (initial.type) {
          case "chat": {
            const isNutritionist =
              user.unsafeMetadata?.role === "nutritionist" ||
              user.unsafeMetadata?.role === "admin";
            router.replace(
              (isNutritionist
                ? `/nutritionist/chat/${initial.chatId}`
                : `/chat/nutritionist`) as any
            );
            return;
          }
          case "challenge_notification":
            router.replace("/(tabs)/challenge");
            return;
          case "test_notification":
            // Fall through to default home navigation
            break;
        }
      }

      router.replace("/(tabs)");
    } else {
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
