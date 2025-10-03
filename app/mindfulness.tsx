import { AnimatedScreen } from "@/components/AnimatedScreen";
import { MindfulnessTracker } from "@/components/tracker/MindfulnessTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";

export default function MindfulnessScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <MindfulnessTracker 
          onBack={handleBack}
          onSettingsPress={handleSettingsPress}
        />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
