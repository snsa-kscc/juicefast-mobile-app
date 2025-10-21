import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lufga } from "@/constants/Fonts";

interface SleepTimePickerProps {
  hours: number;
  minutes: number;
  onChange: (hours: number, minutes: number) => void;
}

const ITEM_HEIGHT = 40;

export function SleepTimePicker({
  hours,
  minutes,
  onChange,
}: SleepTimePickerProps) {
  const [selectedHours, setSelectedHours] = useState(hours);
  const [selectedMinutes, setSelectedMinutes] = useState(minutes);
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    setTimeout(() => {
      hourScrollRef.current?.scrollTo({
        y: hours * ITEM_HEIGHT,
        animated: false,
      });
      minuteScrollRef.current?.scrollTo({
        y: minutes * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, []);

  const handleHourScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const newHours = hourOptions[index];
    if (newHours !== undefined && newHours !== selectedHours) {
      setSelectedHours(newHours);
      onChange(newHours, selectedMinutes);
    }
  };

  const handleMinuteScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const newMinutes = minuteOptions[index];
    if (newMinutes !== undefined && newMinutes !== selectedMinutes) {
      setSelectedMinutes(newMinutes);
      onChange(selectedHours, newMinutes);
    }
  };

  return (
    <View className="flex-row justify-center items-center">
      {/* Hours Picker */}
      <View style={{ width: 96, height: 200, position: "relative" }}>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 80,
            height: ITEM_HEIGHT,
            backgroundColor: "#EDE9FE",
            borderRadius: 6,
            zIndex: 0,
          }}
        />
        <LinearGradient
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 80,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 80,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        <ScrollView
          ref={hourScrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleHourScroll}
          contentContainerStyle={{ paddingVertical: 80 }}
        >
          {hourOptions.map((option) => (
            <View
              key={option}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: Lufga.semiBold,
                  color: option === selectedHours ? "#8B5CF6" : "#9CA3AF",
                }}
              >
                {option}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Text
        style={{
          fontSize: 16,
          fontFamily: Lufga.medium,
          color: "#6B7280",
          marginHorizontal: 8,
        }}
      >
        h
      </Text>

      {/* Minutes Picker */}
      <View style={{ width: 96, height: 200, position: "relative" }}>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 80,
            height: ITEM_HEIGHT,
            backgroundColor: "#EDE9FE",
            borderRadius: 6,
            zIndex: 0,
          }}
        />
        <LinearGradient
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 80,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 80,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        <ScrollView
          ref={minuteScrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMinuteScroll}
          contentContainerStyle={{ paddingVertical: 80 }}
        >
          {minuteOptions.map((option) => (
            <View
              key={option}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: Lufga.semiBold,
                  color: option === selectedMinutes ? "#8B5CF6" : "#9CA3AF",
                }}
              >
                {option.toString().padStart(2, "0")}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Text
        style={{
          fontSize: 16,
          fontFamily: Lufga.medium,
          color: "#6B7280",
          marginLeft: 8,
        }}
      >
        min
      </Text>
    </View>
  );
}
