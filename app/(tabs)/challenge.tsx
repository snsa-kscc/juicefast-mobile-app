import { ChallengeEntry } from "@/components/challenge/ChallengeEntry";
import { ChallengeDashboard } from "@/components/challenge/ChallengeDashboard";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { View, ActivityIndicator, Text } from "react-native";

export default function TrackerScreen() {
  const { user } = useUser();
  const isAdmin = user?.unsafeMetadata?.role === "admin";

  // Check if user is enrolled in challenge
  const challengeProgress = useQuery(
    api.challengeProgress.getUserChallengeProgress
  );
  const hasStartedChallenge = challengeProgress?.hasStartedChallenge;
  const shouldShowModal = !challengeProgress?.hasClearedEntryModal;

  // Show loading state while query is resolving
  if (challengeProgress === undefined) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="text-lufga-bold">Loading...</Text>
      </View>
    );
  }

  if (hasStartedChallenge) {
    return <ChallengeDashboard showModal={shouldShowModal} />;
  }

  return <ChallengeEntry isAdmin={isAdmin} />;
}
