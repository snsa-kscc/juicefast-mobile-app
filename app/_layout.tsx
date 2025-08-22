import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { WellnessTracker } from "@/components/tracker/WellnessTracker";
import "../styles/global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <WellnessTracker userId="user123" weeklyAverageScore={75} />
    </View>
  );
}
