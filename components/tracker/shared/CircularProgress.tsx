import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface CircularProgressProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  backgroundColor?: string;
  displayValue?: string | number;
  unit?: string;
}

export function CircularProgress({
  value,
  maxValue,
  size = 250,
  strokeWidth = 10,
  color,
  backgroundColor = "#F2E9D8",
  displayValue,
  unit,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const strokeDashoffset =
    circumference - (circumference * progressPercentage) / 100;
  const percentageDisplay = Math.round(progressPercentage);

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="white"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText
          x={size / 2}
          y={size / 2 + 10}
          textAnchor="middle"
          fontSize="44"
          fontWeight="bold"
          fill="#000"
        >
          {percentageDisplay}
        </SvgText>
      </Svg>
      {unit && <Text className="text-sm text-gray-500 mt-2">{unit}</Text>}
    </View>
  );
}
