import React from 'react';
import { View, Text } from 'react-native';

export default function StoreTab() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-medium text-gray-800">Store</Text>
      <Text className="text-gray-600 mt-2">Coming Soon</Text>
    </View>
  );
}