import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";
import "../styles/global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Text className="text-3xl font-bold text-red-500">Hello World</Text>
    </View>
  );
}
