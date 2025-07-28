import { useAuth } from "@/contexts/AuthContext";
import { signIn } from "@/lib/auth-client";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { authNavigation } from "@/lib/router-helpers";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      authNavigation.toTabs();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        Alert.alert("Login Failed", result.error.message);
      } else {
        authNavigation.toTabs();
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-gray-600 text-center">Sign in to your account</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity className={`bg-blue-600 rounded-lg py-3 mt-6 ${isLoading ? "opacity-50" : ""}`} onPress={handleLogin} disabled={isLoading}>
            <Text className="text-white text-center font-semibold text-lg">{isLoading ? "Signing In..." : "Sign In"}</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="./signup" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
