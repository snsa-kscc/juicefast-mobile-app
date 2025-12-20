import { ChallengeTracker } from "@/components/challenge/ChallengeTracker";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

export default function TrackerScreen() {
  const { user } = useUser();
  const isAdmin = user?.unsafeMetadata?.role === "admin";

  return <ChallengeTracker isAdmin={isAdmin} />;
}
