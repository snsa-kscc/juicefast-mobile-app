import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <TouchableOpacity onPress={handleSignOut} disabled={isSigningOut}>
      <Text>{isSigningOut ? "Signing out..." : "Sign out"}</Text>
    </TouchableOpacity>
  );
};
