import React from 'react';
import { View } from 'react-native';
import { Spinner } from './Spinner';

export function LoadingOverlay() {
  return (
    <View className="absolute inset-0 bg-black/50 flex-1 justify-center items-center z-50">
      <Spinner size={48} color="#10B981" />
    </View>
  );
}