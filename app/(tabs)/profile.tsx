import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth-client";
import { router } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { authNavigation } from '@/lib/router-helpers';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            authNavigation.toLogin();
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-16">
        <Text className="text-3xl font-bold text-gray-900 mb-8">Profile</Text>

        <View className="bg-gray-50 rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-2">User Information</Text>
          <View className="space-y-2">
            <View>
              <Text className="text-sm text-gray-600">Name</Text>
              <Text className="text-base text-gray-900">{user?.name || "Not provided"}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600">Email</Text>
              <Text className="text-base text-gray-900">{user?.email || "Not provided"}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600">User ID</Text>
              <Text className="text-base text-gray-900 font-mono">{user?.id || "Not provided"}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity className="bg-red-600 rounded-lg py-3 px-6" onPress={handleLogout}>
          <Text className="text-white text-center font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
