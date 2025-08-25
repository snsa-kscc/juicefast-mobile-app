import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../styles/global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
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
  });

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="steps"
        options={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="sleep"
        options={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="mindfulness"
        options={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="hydration"
        options={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
