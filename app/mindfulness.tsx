import { AnimatedScreen } from "@/components/AnimatedScreen";
import { MindfulnessTracker } from "@/components/tracker/MindfulnessTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";

export default function MindfulnessScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  const mockData = {
    mindfulness: [
      {
        type: "meditation" as const,
        duration: 15,
        timestamp: new Date('2024-01-01T07:00:00'),
        mood: "calm" as const
      },
      {
        type: "breathing" as const,
        duration: 5,
        timestamp: new Date('2024-01-01T12:30:00'),
        mood: "focused" as const
      },
      {
        type: "meditation" as const,
        duration: 20,
        timestamp: new Date('2024-01-01T19:00:00'),
        mood: "peaceful" as const
      }
    ],
    dailyGoal: 30,
    currentMinutes: 40
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <MindfulnessTracker 
          userId="user123"
          initialMindfulnessData={mockData}
          onBack={handleBack}
        />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
