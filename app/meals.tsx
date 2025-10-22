import { AnimatedScreen } from "@/components/AnimatedScreen";
import { MealsTracker } from "@/components/tracker/MealsTracker";
import { useRouter } from "expo-router";

export default function Meals() {
  const router = useRouter();

  return (
    <AnimatedScreen>
      <MealsTracker
        onBack={() => router.back()}
        onSettingsPress={() => router.push("/profile")}
      />
    </AnimatedScreen>
  );
}
