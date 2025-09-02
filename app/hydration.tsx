import { AnimatedScreen } from '@/components/AnimatedScreen';
import { HydrationTracker } from '@/components/tracker/HydrationTracker';
import { TrackerScreenWrapper } from '@/components/TrackerScreenWrapper';
import { useRouter } from 'expo-router';
import React from 'react';

const MOCK_HYDRATION_DATA = {
  waterIntake: [
    {
      amount: 500,
      time: new Date('2024-01-01T08:00:00'),
      type: 'water' as const
    },
    {
      amount: 350,
      time: new Date('2024-01-01T10:30:00'),
      type: 'tea' as const
    },
    {
      amount: 250,
      time: new Date('2024-01-01T14:15:00'),
      type: 'water' as const
    }
  ],
  dailyGoal: 2200,
  currentIntake: 1100
};

export default function HydrationScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <HydrationTracker 
          userId="user123"
          initialHydrationData={MOCK_HYDRATION_DATA}
          onBack={handleBack}
        />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
