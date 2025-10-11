import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Defs, Filter, FeDropShadow, LinearGradient, Stop, Text as SvgText } from "react-native-svg";

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
  const percentageDisplay = Math.round(progressPercentage);
  
  const startAngle = 225;
  const totalArc = 270;
  const progressArc = (progressPercentage / 100) * totalArc;
  const iconAngle = startAngle + progressArc;
  
  const iconRad = ((iconAngle - 90) * Math.PI) / 180;
  const iconX = size / 2 + radius * Math.cos(iconRad);
  const iconY = size / 2 + radius * Math.sin(iconRad);

  return (
    <View
      className="items-center justify-center"
      style={{ width: size + 60, height: size + 80, paddingTop: 30, paddingHorizontal: 30, paddingBottom: 50 }}
    >
      <Svg width={size + 40} height={size + 50} viewBox={`-20 -20 ${size + 40} ${size + 50}`}>
        <Defs>
          <LinearGradient id="circleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor={backgroundColor} />
          </LinearGradient>
          <Filter id="shadow">
            <FeDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
          </Filter>
        </Defs>
        <Circle
          cx={size / 2 + 20}
          cy={size / 2 + 20}
          r={radius}
          fill="white"
          stroke="url(#circleGradient)"
          strokeWidth={strokeWidth}
          filter="url(#shadow)"
        />
        <Circle
          cx={iconX + 20}
          cy={iconY + 20}
          r={12}
          fill="#000"
          stroke="white"
          strokeWidth={2}
        />
        <Circle
          cx={iconX + 20}
          cy={iconY + 20}
          r={6}
          fill="none"
          stroke="white"
          strokeWidth={1.5}
        />
        <SvgText
          x={size / 2 + 20}
          y={size / 2 + 30}
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
