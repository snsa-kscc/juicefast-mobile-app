import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Heart, Store, MessageCircle, Users } from 'lucide-react-native';
import "../styles/global.css";
import { QueryProvider } from "../providers/QueryProvider";
import { LoadingProvider } from "../providers/LoadingProvider";

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



function TabLayoutContent() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Lufga-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, size }) => (
            <Store size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="steps"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'JF Club',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mindfulness"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="hydration"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chat/ai"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chat/nutritionist"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts(FONT_CONFIG);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LoadingProvider>
            <QueryProvider>
              <TabLayoutContent />
            </QueryProvider>
          </LoadingProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
