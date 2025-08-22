import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { Settings } from 'lucide-react-native';

interface UserProfile {
  id: string;
  name: string;
}

interface DailyHealthMetrics {
  date: string;
  score: number;
}

interface TrackingOption {
  id: string;
  name: string;
  target: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  unit: string;
}

interface TrackerClientProps {
  userId?: string;
  weeklyMetrics?: DailyHealthMetrics[];
  weeklyAverageScore?: number;
}

const MealIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path d="M16.5 13.7497H5.5" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M11.1359 38.5V22" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10.9999 13.75V5.5" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M38.5 38.5C29.3873 38.5 22 31.1127 22 22C22 12.8873 29.3873 5.5 38.5 5.5" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M38.4999 31.1663C33.4373 31.1663 29.3333 27.0623 29.3333 21.9997C29.3333 16.9371 33.4373 12.833 38.4999 12.833" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16.5 5.5V16.5C16.5 19.5376 14.0376 22 11 22V22C7.96243 22 5.5 19.5376 5.5 16.5V5.5" stroke="#0DC99B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StepsIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M38.4999 22L27.4999 22C26.4874 22 25.6666 21.1792 25.6666 20.1667L25.6666 12.8333C25.6666 8.78324 28.9498 5.5 32.9999 5.5V5.5C37.05 5.5 40.3333 8.78324 40.3333 12.8333L40.3333 20.1667C40.3333 21.1792 39.5124 22 38.4999 22Z" stroke="#FFC856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M33 33V33C29.9624 33 27.5 30.5376 27.5 27.5L27.5 22L38.5 22L38.5 27.5C38.5 30.5376 36.0376 33 33 33Z" stroke="#FFC856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M16.4999 27.5L5.49992 27.5C4.4874 27.5 3.66658 26.6792 3.66658 25.6667L3.66658 18.3333C3.66658 14.2832 6.94983 11 10.9999 11V11C15.05 11 18.3333 14.2832 18.3333 18.3333L18.3333 25.6667C18.3333 26.6792 17.5124 27.5 16.4999 27.5Z" stroke="#FFC856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M11 38.5V38.5C7.96243 38.5 5.5 36.0376 5.5 33L5.5 27.5L16.5 27.5L16.5 33C16.5 36.0376 14.0376 38.5 11 38.5Z" stroke="#FFC856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MindfulnessIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path d="M12.8333 18.3331C13.5574 17.4439 14.5474 16.9397 15.5833 16.9397C16.6191 16.9397 17.5816 17.4439 18.3333 18.3331" stroke="#FE8E77" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M25.6667 18.3331C26.3909 17.4439 27.3809 16.9397 28.4167 16.9397C29.4526 16.9397 30.4151 17.4439 31.1667 18.3331" stroke="#FE8E77" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M33.6672 10.3327C40.1109 16.7764 40.1109 27.2236 33.6672 33.6672C27.2236 40.1109 16.7764 40.1109 10.3327 33.6672C3.88909 27.2236 3.88909 16.7764 10.3327 10.3327C16.7764 3.88909 27.2236 3.88909 33.6672 10.3327" stroke="#FE8E77" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M28.4166 26.9277C28.4166 26.9277 26.0094 29.3331 21.9999 29.3331C17.9886 29.3331 15.5833 26.9277 15.5833 26.9277" stroke="#FE8E77" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SleepIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M22.0346 22.0351C25.9791 17.9799 26.9151 11.868 24.3647 6.81817C24.2096 6.4998 24.2521 6.12051 24.4738 5.84433C24.6955 5.56815 25.0566 5.44464 25.401 5.52721C28.4396 6.25758 31.2176 7.81267 33.4288 10.0211C40.0647 16.485 40.2048 27.1043 33.7417 33.741C27.1054 40.2042 16.4865 40.0651 10.0216 33.4305C7.81354 31.2193 6.25834 28.4417 5.52723 25.4035C5.44463 25.0591 5.56813 24.698 5.8443 24.4763C6.12047 24.2546 6.49976 24.2121 6.81813 24.3672C11.868 26.9181 17.9804 25.9813 22.0346 22.0351Z" stroke="#625FD3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WaterIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 44 44" fill="none">
    <Path d="M30.5909 15.9248C35.3356 20.6695 35.3356 28.3621 30.5909 33.1086C25.8463 37.8551 18.1536 37.8533 13.4071 33.1086C8.66059 28.364 8.66242 20.6713 13.4071 15.9248" stroke="#4CC3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.4016 15.9313L21.9999 7.33301" stroke="#4CC3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M30.5983 15.9313L22 7.33301" stroke="#4CC3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export function WellnessTracker({ userId = "", weeklyMetrics = [], weeklyAverageScore = 71 }: TrackerClientProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading profile
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [userId]);

  const trackingOptions: TrackingOption[] = [
    {
      id: "meals",
      name: "Eat 2 healthy meals",
      target: "2",
      icon: <MealIcon />,
      color: "#E8F8F3",
      progress: 0,
      unit: "healthy meals today",
    },
    {
      id: "steps",
      name: "Take 10 000 steps",
      target: "10000",
      icon: <StepsIcon />,
      color: "#FFF8E8",
      progress: 0,
      unit: "steps today",
    },
    {
      id: "mindfulness",
      name: "Spend 20 quiet minutes",
      target: "20",
      icon: <MindfulnessIcon />,
      color: "#FFEFEB",
      progress: 0,
      unit: "minutes today",
    },
    {
      id: "sleep",
      name: "Sleep 8 hours",
      target: "8",
      icon: <SleepIcon />,
      color: "#EEEDFF",
      progress: 0,
      unit: "hours today",
    },
    {
      id: "water",
      name: "Drink 2.2L of water",
      target: "2.2",
      icon: <WaterIcon />,
      color: "#EBF9FF",
      progress: 0,
      unit: "liters today",
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading health tracker...</Text>
      </View>
    );
  }

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (circumference * Math.min(100, weeklyAverageScore)) / 100;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.blob} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Wellness Tracker</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View style={styles.planSection}>
          <Text style={styles.planText}>Today I'm going to....</Text>
        </View>
      </View>

      {/* Wellness Score */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreTitle}>WELLNESS SCORE</Text>
          <View style={styles.infoButton}>
            <Text style={styles.infoIcon}>i</Text>
          </View>
        </View>
        <Text style={styles.scoreSubtitle}>Average wellness score for the last 7 days</Text>

        {/* Circular Progress */}
        <View style={styles.circularProgress}>
          <Svg width="250" height="250" viewBox="0 0 250 250">
            <Circle
              cx="125"
              cy="125"
              r="110"
              fill="white"
              stroke="#F2E9D8"
              strokeWidth="10"
            />
            <Circle
              cx="125"
              cy="125"
              r="110"
              fill="none"
              stroke="#E8D5B0"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 125 125)"
            />
          </Svg>
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreText}>{Math.round(weeklyAverageScore)}</Text>
          </View>
        </View>
      </View>

      {/* Tracking Options */}
      <View style={styles.trackingSection}>
        <Text style={styles.trackingTitle}>What would you like to track today?</Text>
        
        {trackingOptions.map((option) => (
          <TouchableOpacity key={option.id} style={[styles.trackingCard, { backgroundColor: option.color }]}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>{option.icon}</View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{option.name}</Text>
                <Text style={styles.cardSubtitle}>
                  {option.progress} {option.unit}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  header: {
    position: 'relative',
    paddingVertical: 24,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(76, 195, 255, 0.4)',
    top: -20,
    left: 0,
    opacity: 0.6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    zIndex: 10,
  },
  planText: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: 'bold',
  },
  scoreSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  circularProgress: {
    position: 'relative',
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#000',
  },
  trackingSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  trackingCard: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomSpacing: {
    height: 96,
  },
});