import React from 'react';
import { View } from 'react-native';
import { CustomBottomNavigation } from './ui/CustomBottomNavigation';

interface TrackerScreenWrapperProps {
  children: React.ReactNode;
}

export function TrackerScreenWrapper({ children }: TrackerScreenWrapperProps) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: 70 }}>
        {children}
      </View>
      <CustomBottomNavigation />
    </View>
  );
}
