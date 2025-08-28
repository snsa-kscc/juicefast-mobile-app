import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Activity, Utensils, Brain, Moon, Droplets } from 'lucide-react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';

interface ActionOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

export function AddActionButton() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={handleCloseBottomSheet}
      />
    ),
    []
  );

  const actionOptions: ActionOption[] = [
    {
      id: 'activity',
      title: 'Log Activity',
      subtitle: 'Track steps, workouts, or movement',
      icon: <Activity size={24} color="#FFC856" />,
      color: '#FFF8E8',
      route: '/steps'
    },
    {
      id: 'meal',
      title: 'Log Meal',
      subtitle: 'Record what you ate today',
      icon: <Utensils size={24} color="#0DC99B" />,
      color: '#E8F8F3',
      route: '/meals'
    },
    {
      id: 'mindfulness',
      title: 'Log Mindfulness',
      subtitle: 'Track meditation or quiet time',
      icon: <Brain size={24} color="#FE8E77" />,
      color: '#FFEFEB',
      route: '/mindfulness'
    },
    {
      id: 'sleep',
      title: 'Log Sleep',
      subtitle: 'Record your sleep hours',
      icon: <Moon size={24} color="#625FD3" />,
      color: '#EEEDFF',
      route: '/sleep'
    },
    {
      id: 'hydration',
      title: 'Log Water',
      subtitle: 'Track your water intake',
      icon: <Droplets size={24} color="#4CC3FF" />,
      color: '#EBF9FF',
      route: '/hydration'
    }
  ];

  const handleOptionPress = (route: string) => {
    handleCloseBottomSheet();
    router.push(route as any);
  };

  return (
    <>
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenBottomSheet}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>What would you like to log?</Text>
          <Text style={styles.subtitle}>Choose an activity to track your wellness</Text>
          
          <View style={styles.optionsContainer}>
            {actionOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionItem, { backgroundColor: option.color }]}
                onPress={() => handleOptionPress(option.route)}
                activeOpacity={0.7}
              >
                <View style={styles.optionIcon}>
                  {option.icon}
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CC3FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#E5E7EB',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});