import { useRouter } from "expo-router";
import { MealsTracker } from "@/components/MealsTracker";
import { AnimatedScreen } from "@/components/AnimatedScreen";

export default function Meals() {
  const router = useRouter();

  return (
    <AnimatedScreen>
      <MealsTracker 
        userId="user123" 
        onBack={() => router.back()}
      />
    </AnimatedScreen>
  );
}