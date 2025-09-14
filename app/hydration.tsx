import { AnimatedScreen } from '@/components/AnimatedScreen';
import { HydrationTracker } from '@/components/tracker/HydrationTracker';
import { TrackerScreenWrapper } from '@/components/TrackerScreenWrapper';
import { useRouter } from 'expo-router';
import React from 'react';

export default function HydrationScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <TrackerScreenWrapper>
      <AnimatedScreen>
        <HydrationTracker onBack={handleBack} />
      </AnimatedScreen>
    </TrackerScreenWrapper>
  );
}
