import { AnimatedScreen } from "@/components/AnimatedScreen";
import { MindfulnessTracker } from "@/components/tracker/MindfulnessTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";

export default function MindfulnessScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <MindfulnessTracker onBack={handleBack} />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
