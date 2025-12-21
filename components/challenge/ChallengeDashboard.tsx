import { View, Text } from "react-native";
import { Doc } from "@/convex/_generated/dataModel";

interface ChallengeDashboardProps {
  progress?: Doc<"challengeProgress"> | null;
  isAdmin?: boolean;
}

export function ChallengeDashboard({
  progress,
  isAdmin = false,
}: ChallengeDashboardProps) {
  return (
    <View className="flex-1 bg-jf-gray">
      <Text className="text-center text-xl font-lufga-bold mt-10">
        Challenge Dashboard
      </Text>
      <Text className="text-center text-base font-lufga mt-2">
        {progress?.hasStartedChallenge ? "Challenge Started" : "Not Started"}
      </Text>
      {isAdmin && (
        <Text className="text-center text-sm text-red-500 mt-2">
          Admin View
        </Text>
      )}
    </View>
  );
}
