import { AnimatedScreen } from "@/components/AnimatedScreen";
import { SleepTracker } from "@/components/tracker/SleepTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";

const INITIAL_SLEEP_DATA = {
  sleep: {
    hoursSlept: 7.5,
    quality: 4,
    startTime: new Date('2024-01-01T22:30:00'),
    endTime: new Date('2024-01-02T06:00:00')
  }
};

export default function Sleep() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <SleepTracker 
          userId="user123"
          initialSleepData={INITIAL_SLEEP_DATA}
          onBack={handleBack}
        />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}