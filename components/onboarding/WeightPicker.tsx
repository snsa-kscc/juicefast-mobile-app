import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lufga } from "@/constants/Fonts";

interface WeightPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const ITEM_HEIGHT = 40;

export function WeightPicker({ value, onChange, min, max }: WeightPickerProps) {
  const valueInGrams = value * 1000;
  const initialKg = Math.floor(valueInGrams / 1000);
  const initialGrams = Math.round((valueInGrams % 1000) / 100) * 100;

  const [selectedKg, setSelectedKg] = useState(initialKg);
  const [selectedGrams, setSelectedGrams] = useState(initialGrams);

  const kgOptions = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const gramOptions = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const handleKgScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const newKg = kgOptions[index];
    if (newKg !== undefined && newKg !== selectedKg) {
      setSelectedKg(newKg);
      onChange((newKg * 1000 + selectedGrams) / 1000);
    }
  };

  const handleGramScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const newGrams = gramOptions[index];
    if (newGrams !== undefined && newGrams !== selectedGrams) {
      setSelectedGrams(newGrams);
      onChange((selectedKg * 1000 + newGrams) / 1000);
    }
  };

  return (
    <View className="flex-row justify-center items-center">
      {/* KG Picker */}
      <View style={{ width: 96, height: 200, position: "relative" }}>
        {/* Center highlight */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 80,
            height: ITEM_HEIGHT,
            backgroundColor: "#E7F6EF",
            borderRadius: 6,
            zIndex: 0,
          }}
        />
        {/* Top gradient */}
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
        {/* Bottom gradient */}
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
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleKgScroll}
          contentContainerStyle={{ paddingVertical: 80 }}
        >
          {kgOptions.map((option) => (
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
                  color: option === selectedKg ? "#11B364" : "#9CA3AF",
                }}
              >
                {option}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* KG Label */}
      <Text
        style={{
          fontSize: 16,
          fontFamily: Lufga.medium,
          color: "#6B7280",
          marginHorizontal: 8,
        }}
      >
        kg
      </Text>

      {/* Grams Picker */}
      <View style={{ width: 96, height: 200, position: "relative" }}>
        {/* Center highlight */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 80,
            height: ITEM_HEIGHT,
            backgroundColor: "#E7F6EF",
            borderRadius: 6,
            zIndex: 0,
          }}
        />
        {/* Top gradient */}
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
        {/* Bottom gradient */}
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
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleGramScroll}
          contentContainerStyle={{ paddingVertical: 80 }}
        >
          {gramOptions.map((option) => (
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
                  color: option === selectedGrams ? "#11B364" : "#9CA3AF",
                }}
              >
                {option}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Grams Label */}
      <Text
        style={{
          fontSize: 16,
          fontFamily: Lufga.medium,
          color: "#6B7280",
          marginLeft: 8,
        }}
      >
        g
      </Text>
    </View>
  );
}
