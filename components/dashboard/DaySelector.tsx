import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";

interface DaySelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DaySelector({ selectedDate, onDateSelect }: DaySelectorProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  // Generate last 30 days with current day as the last item
  const generateLast30Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    return days;
  };

  const last30Days = generateLast30Days();

  // Scroll to show last 7 days (current day + 6 previous days)
  useEffect(() => {
    if (contentWidth > 0 && scrollViewWidth > 0) {
      // Calculate position to show last 7 days
      // Each day item is 40px (w-10) + 16px margin (mr-4) = 56px
      const scrollPosition = Math.max(0, contentWidth - scrollViewWidth);

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: false });
      }, 50);
    }
  }, [contentWidth, scrollViewWidth]);
  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <View className="pb-6">
      <View className="ml-6 mr-6">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
          onContentSizeChange={(width) => setContentWidth(width)}
          onLayout={(event: LayoutChangeEvent) =>
            setScrollViewWidth(event.nativeEvent.layout.width)
          }
        >
          {last30Days.map((date: Date, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => onDateSelect(new Date(date))}
              className="items-center justify-center w-12 h-12 rounded-full mr-3 bg-white"
              style={{
                borderWidth: isSameDate(selectedDate, date) ? 2 : 1,
                borderColor: isSameDate(selectedDate, date)
                  ? "#E8D5B0"
                  : "#E5E7EB",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="text-base font-lufga-medium text-black">
                {formatDate(date)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
