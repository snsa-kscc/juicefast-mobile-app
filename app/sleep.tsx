import { AnimatedScreen } from "@/components/AnimatedScreen";
import { SleepTracker } from "@/components/tracker/SleepTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";

export default function Sleep() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <SleepTracker onBack={handleBack} />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}