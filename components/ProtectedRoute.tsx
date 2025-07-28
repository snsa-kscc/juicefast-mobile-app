import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { authNavigation } from '@/lib/router-helpers';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      authNavigation.toLogin();
    }
  }, [isLoading, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Redirecting to login...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
