import { ChallengeEntry } from "@/components/challenge/ChallengeEntry";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

export default function TrackerScreen() {
  const { user } = useUser();
  const isAdmin = user?.unsafeMetadata?.role === "admin";

  return <ChallengeEntry isAdmin={isAdmin} />;
}
