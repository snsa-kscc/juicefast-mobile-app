import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { authClient } from '@/lib/auth-client';

export default function AuthDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setResult('Testing connection...');
    
    try {
      // Test if the auth server is reachable
      const response = await fetch(`${process.env.EXPO_PUBLIC_AUTH_URL}/api/auth/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setResult(`✅ Auth server reachable. Status: ${response.status}`);
      } else {
        setResult(`❌ Auth server error. Status: ${response.status}`);
      }
    } catch (error) {
      setResult(`❌ Connection failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setResult('Testing login...');
    
    try {
      const response = await authClient.signIn.email({
        email: 'test@example.com',
        password: 'testpassword123',
      });
      
      if (response.data) {
        setResult(`✅ Login successful: ${JSON.stringify(response.data, null, 2)}`);
      } else if (response.error) {
        setResult(`❌ Login failed: ${JSON.stringify(response.error, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ Login error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4 bg-gray-100 m-4 rounded-lg">
      <Text className="text-lg font-bold mb-4">Auth Debug Panel</Text>
      
      <TouchableOpacity
        onPress={testConnection}
        disabled={isLoading}
        className="bg-blue-500 p-3 rounded mb-2"
      >
        <Text className="text-white text-center">Test Connection</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={testLogin}
        disabled={isLoading}
        className="bg-green-500 p-3 rounded mb-2"
      >
        <Text className="text-white text-center">Test Login</Text>
      </TouchableOpacity>
      
      <View className="mt-4 p-3 bg-white rounded">
        <Text className="text-sm font-mono">{result || 'No test run yet'}</Text>
      </View>
      
      <View className="mt-4 p-3 bg-yellow-100 rounded">
        <Text className="text-xs">Auth URL: {process.env.EXPO_PUBLIC_AUTH_URL}</Text>
        <Text className="text-xs">DB URL: {process.env.EXPO_PUBLIC_DATABASE_URL ? 'Set' : 'Not Set'}</Text>
      </View>
    </View>
  );
}
