import React from 'react';
import { useRouter } from 'expo-router';
import { HydrationTracker } from '../components/tracker/HydrationTracker';
import { AnimatedScreen } from '../components/AnimatedScreen';

const MOCK_HYDRATION_DATA = {
  waterIntake: [
    {
      amount: 500,
      timestamp: new Date('2024-01-01T08:00:00'),
    },
    {
      amount: 300,
      timestamp: new Date('2024-01-01T12:00:00'),
    },
    {
      amount: 250,
      timestamp: new Date('2024-01-01T15:30:00'),
    },
  ],
};

export default function HydrationScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <AnimatedScreen>
      <HydrationTracker 
        userId="demo-user"
        initialWaterData={MOCK_HYDRATION_DATA}
        onBack={handleBack}
      />
    </AnimatedScreen>
  );
}