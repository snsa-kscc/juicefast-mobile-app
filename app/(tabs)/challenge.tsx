import { ChallengeEntry } from "@/components/challenge/ChallengeEntry";
import { ChallengeDashboard } from "@/components/challenge/ChallengeDashboard";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TrackerScreen() {
  const { user } = useUser();
  const isAdmin = user?.unsafeMetadata?.role === "admin";

  // Check if user is enrolled in challenge
  const challengeProgress = useQuery(
    api.challengeProgress.getUserChallengeProgress
  );
  const isEnrolled = challengeProgress?.hasStartedChallenge;

  // Show loading state while query is resolving
  if (challengeProgress === undefined) {
    return null;
  }

  if (isEnrolled) {
    return <ChallengeDashboard progress={challengeProgress} />;
  }

  return <ChallengeEntry isAdmin={isAdmin} />;
}
