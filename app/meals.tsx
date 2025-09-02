import { AnimatedScreen } from "@/components/AnimatedScreen";
import { MealsTracker } from "@/components/tracker/MealsTracker";
import { TrackerScreenWrapper } from "@/components/TrackerScreenWrapper";
import { useRouter } from "expo-router";

export default function Meals() {
  const router = useRouter();

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <MealsTracker 
          userId="user123" 
          onBack={() => router.back()}
        />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
