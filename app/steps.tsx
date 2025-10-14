import { AnimatedScreen } from "@/components/AnimatedScreen";
import { StepsTracker } from "@/components/tracker/StepsTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";

const MOCK_STEPS_DATA = {
  steps: [
    {
      count: 3500,
      timestamp: new Date("2024-01-01T08:00:00"),
    },
    {
      count: 2000,
      timestamp: new Date("2024-01-01T14:30:00"),
    },
    {
      count: 1500,
      timestamp: new Date("2024-01-01T18:00:00"),
    },
  ],
};

export default function StepsScreen() {
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
        <StepsTracker onBack={handleBack} onSettingsPress={handleSettingsPress} />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
