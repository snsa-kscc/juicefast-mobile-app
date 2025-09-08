import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LoadingProvider } from "../providers/LoadingProvider";
import { QueryProvider } from "../providers/QueryProvider";
import "../styles/global.css";

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

export default function RootLayout() {
  const [loaded] = useFonts(FONT_CONFIG);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <LoadingProvider>
              <QueryProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="meals" options={SCREEN_OPTIONS} />
                  <Stack.Screen name="steps" options={SCREEN_OPTIONS} />
                  <Stack.Screen name="hydration" options={SCREEN_OPTIONS} />
                  <Stack.Screen name="mindfulness" options={SCREEN_OPTIONS} />
                  <Stack.Screen name="sleep" options={SCREEN_OPTIONS} />
                  <Stack.Screen name="profile" options={SCREEN_OPTIONS} />
                  <Stack.Screen name="chat/ai" options={SCREEN_OPTIONS} />
                  <Stack.Screen
                    name="chat/nutritionist"
                    options={SCREEN_OPTIONS}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </QueryProvider>
            </LoadingProvider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
