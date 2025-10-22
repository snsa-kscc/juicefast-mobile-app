import { AnimatedScreen } from "@/components/AnimatedScreen";
import { SleepTracker } from "@/components/tracker/SleepTracker";
import { useRouter } from "expo-router";

export default function Sleep() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSettingsPress = () => {
    router.push("/profile");
  };

  return (
    <AnimatedScreen>
      <SleepTracker onBack={handleBack} onSettingsPress={handleSettingsPress} />
    </AnimatedScreen>
  );
}
