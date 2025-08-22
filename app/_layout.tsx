import { useFonts } from "expo-font";
import { View } from "react-native";
import { StepsTracker } from "@/components/tracker/StepsTracker";
import "../styles/global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <StepsTracker 
        userId="user123" 
        initialStepsData={{
          steps: [
            { count: 2500, timestamp: new Date('2024-01-01T08:00:00') },
            { count: 1800, timestamp: new Date('2024-01-01T12:00:00') }
          ]
        }} 
      />
    </View>
  );
}
