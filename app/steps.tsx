import { AnimatedScreen } from "@/components/AnimatedScreen";
import { StepsTracker } from "@/components/tracker/StepsTracker";
import { useRouter } from "expo-router";

export default function StepsScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  return (
    <AnimatedScreen>
      <StepsTracker onBack={handleBack} onSettingsPress={handleSettingsPress} />
    </AnimatedScreen>
  );
}
