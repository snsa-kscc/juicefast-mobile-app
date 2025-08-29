import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DaySelectorProps {
  weekDates: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DaySelector({ weekDates, selectedDate, onDateSelect }: DaySelectorProps) {
  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 1);
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };

  return (
    <View className="px-6 pb-6">
      <View className="flex-row justify-between">
        {weekDates.map((date: Date, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => onDateSelect(date)}
            className={`flex-col items-center justify-center w-10 h-12 rounded-lg ${
              isToday(date) 
                ? "bg-black" 
                : isSameDate(selectedDate, date) 
                ? "bg-gray-200" 
                : ""
            }`}
          >
            <Text className={`text-[10px] font-medium mb-1 ${
              isToday(date) ? "text-white" : "text-gray-500"
            }`}>
              {formatDay(date)}
            </Text>
            <Text className={`text-sm font-semibold ${
              isToday(date) ? "text-white" : "text-black"
            }`}>
              {formatDate(date)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}