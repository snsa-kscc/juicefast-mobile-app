import React from 'react';
import { useRouter } from 'expo-router';
import { HydrationTracker } from '../components/tracker/HydrationTracker';

export default function HydrationScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <HydrationTracker 
      userId="demo-user"
      onBack={handleBack}
    />
  );
}