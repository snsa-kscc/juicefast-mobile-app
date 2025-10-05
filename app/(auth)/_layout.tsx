import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/onboarding"} />;
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="sso-signup"
      />
    </SafeAreaView>
  );
}
