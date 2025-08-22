import { SleepTracker } from "@/components/tracker/SleepTracker";
import { AnimatedScreen } from "@/components/AnimatedScreen";

export default function Sleep() {
  return (
    <AnimatedScreen>
      <SleepTracker 
        userId="user123"
        initialSleepData={{
          sleep: {
            hoursSlept: 7.5,
            quality: 4,
            startTime: new Date('2024-01-01T22:30:00'),
            endTime: new Date('2024-01-02T06:00:00')
          }
        }}
      />
    </AnimatedScreen>
  );
}