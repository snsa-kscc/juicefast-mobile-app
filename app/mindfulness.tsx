import { MindfulnessTracker } from "../components/tracker/MindfulnessTracker";
import { AnimatedScreen } from "../components/AnimatedScreen";

export default function MindfulnessScreen() {
  const mockData = {
    mindfulness: [
      {
        minutes: 10,
        activity: "meditation",
        timestamp: new Date(),
      },
      {
        minutes: 5,
        activity: "breathing",
        timestamp: new Date(),
      },
    ],
  };

  return (
    <AnimatedScreen>
      <MindfulnessTracker 
        userId="user123" 
        initialMindfulnessData={mockData} 
      />
    </AnimatedScreen>
  );
}