import { useRouter } from "expo-router";
import { StepsTracker } from "@/components/tracker/StepsTracker";
import { AnimatedScreen } from "@/components/AnimatedScreen";

export default function Steps() {
  const router = useRouter();

  return (
    <AnimatedScreen>
      <StepsTracker 
        userId="user123" 
        initialStepsData={{
          steps: [
            { count: 2500, timestamp: new Date('2024-01-01T08:00:00') },
            { count: 1800, timestamp: new Date('2024-01-01T12:00:00') }
          ]
        }}
        onBack={() => router.back()}
      />
    </AnimatedScreen>
  );
}