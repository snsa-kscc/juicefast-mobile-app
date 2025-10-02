import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

interface DaySelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DaySelector({ selectedDate, onDateSelect }: DaySelectorProps) {
  const scrollViewRef = useRef<ScrollView>(null);

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

  // Scroll to show current day and 6 previous days initially
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);
  const formatDay = (date: Date) => {
    return date
      .toLocaleDateString("en-US", { weekday: "short" })
      .substring(0, 1);
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {last30Days.map((date: Date, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => onDateSelect(date)}
            className={`flex-col items-center justify-center w-10 h-12 rounded-lg mr-4 ${
              isToday(date)
                ? "bg-black"
                : isSameDate(selectedDate, date)
                  ? "bg-gray-200"
                  : ""
            }`}
          >
            <Text
              className={`text-[10px] font-medium mb-1 ${
                isToday(date) ? "text-white" : "text-gray-500"
              }`}
            >
              {formatDay(date)}
            </Text>
            <Text
              className={`text-sm font-semibold ${
                isToday(date) ? "text-white" : "text-black"
              }`}
            >
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
