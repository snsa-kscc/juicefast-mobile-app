import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LoadingProvider } from "../providers/LoadingProvider";
import { QueryProvider } from "../providers/QueryProvider";
import { usePushTokenStorage } from "../hooks/usePushTokenStorage";
import "../styles/global.css";
import { handleAppInstallWithReferral } from "../utils/appInstallHandler";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const FONT_CONFIG = {
  "Lufga-Thin": require("../assets/fonts/LufgaThin.ttf"),
  "Lufga-ThinItalic": require("../assets/fonts/LufgaThinItalic.ttf"),
  "Lufga-ExtraLight": require("../assets/fonts/LufgaExtraLight.ttf"),
  "Lufga-ExtraLightItalic": require("../assets/fonts/LufgaExtraLightItalic.ttf"),
  "Lufga-Light": require("../assets/fonts/LufgaLight.ttf"),
  "Lufga-LightItalic": require("../assets/fonts/LufgaLightItalic.ttf"),
  "Lufga-Regular": require("../assets/fonts/LufgaRegular.ttf"),
  "Lufga-Italic": require("../assets/fonts/LufgaItalic.ttf"),
  "Lufga-Medium": require("../assets/fonts/LufgaMedium.ttf"),
  "Lufga-MediumItalic": require("../assets/fonts/LufgaMediumItalic.ttf"),
  "Lufga-SemiBold": require("../assets/fonts/LufgaSemiBold.ttf"),
  "Lufga-SemiBoldItalic": require("../assets/fonts/LufgaSemiBoldItalic.ttf"),
  "Lufga-Bold": require("../assets/fonts/LufgaBold.ttf"),
  "Lufga-BoldItalic": require("../assets/fonts/LufgaBoldItalic.ttf"),
  "Lufga-ExtraBold": require("../assets/fonts/LufgaExtraBold.ttf"),
  "Lufga-ExtraBoldItalic": require("../assets/fonts/LufgaExtraBoldItalic.ttf"),
  "Lufga-Black": require("../assets/fonts/LufgaBlack.ttf"),
  "Lufga-BlackItalic": require("../assets/fonts/LufgaBlackItalic.ttf"),
};

const SCREEN_OPTIONS = {
  presentation: "card" as const,
  animation: "slide_from_right" as const,
};

function AuthenticatedLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // Automatically store push token for all authenticated users
  usePushTokenStorage({ skip: !user });

  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load

    if (isSignedIn && user) {
      // User is signed in - check onboarding status
      const isOnboardingCompleted =
        user.unsafeMetadata?.onboardingCompleted === true;
      if (isOnboardingCompleted) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    } else {
      // User is not signed in - redirect to signup
      router.replace("/(auth)/sso-signup");
    }
  }, [isSignedIn, user, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  return (
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
        name="nutritionist"
        options={{
          ...SCREEN_OPTIONS,
          // headerShown: false,
          // gestureEnabled: false
        }}
      />
      <Stack.Screen name="test-push" options={SCREEN_OPTIONS} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts(FONT_CONFIG);

  // Handle referral code from app install
  useEffect(() => {
    const initializeReferral = async () => {
      try {
        await handleAppInstallWithReferral();
      } catch (error) {
        console.error("Error initializing referral system:", error);
      }
    };

    if (loaded) {
      initializeReferral();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LoadingProvider>
            <QueryProvider>
              <AuthenticatedLayout />
            </QueryProvider>
          </LoadingProvider>
        </GestureHandlerRootView>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
