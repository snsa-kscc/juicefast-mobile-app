import { Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Filter,
  FeDropShadow,
  LinearGradient,
  Stop,
  Text as SvgText,
  Path,
  Rect,
} from "react-native-svg";

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
  strokeWidth = 15,
  color,
  backgroundColor = "#F2E9D8",
  displayValue,
  unit,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = Math.min(
    100,
    Math.max(0, (value / maxValue) * 100)
  );
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
      style={{
        width: size + 60,
        height: size + 80,
        paddingTop: 30,
        paddingHorizontal: 30,
        paddingBottom: 50,
      }}
    >
      <Svg
        width={size + 20}
        height={size + 20}
        viewBox={`-10 -10 ${size + 20} ${size + 20}`}
      >
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
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="white"
          stroke="url(#circleGradient)"
          strokeWidth={strokeWidth}
          filter="url(#shadow)"
        />
        <Circle
          cx={iconX}
          cy={iconY}
          r={16}
          fill="#000"
          stroke="white"
          strokeWidth={4}
        />
        <Path
          d={`M ${iconX - 11 + 14.2083} ${iconY - 11 + 13.5637} C ${iconX - 11 + 15.5695} ${iconY - 11 + 11.8794} ${iconX - 11 + 15.3965} ${iconY - 11 + 9.42936} ${iconX - 11 + 13.8123} ${iconY - 11 + 7.95298} C ${iconX - 11 + 12.2281} ${iconY - 11 + 6.47661} ${iconX - 11 + 9.77188} ${iconY - 11 + 6.47661} ${iconX - 11 + 8.18764} ${iconY - 11 + 7.95298} C ${iconX - 11 + 6.60339} ${iconY - 11 + 9.42936} ${iconX - 11 + 6.43047} ${iconY - 11 + 11.8794} ${iconX - 11 + 7.79164} ${iconY - 11 + 13.5637}`}
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Rect
          x={iconX - 11 + 2.75}
          y={iconY - 11 + 2.75}
          width={16.5}
          height={16.5}
          rx={8.25}
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d={`M ${iconX - 11 + 11} ${iconY - 11 + 11.458} V ${iconY - 11 + 15.1247}`}
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <SvgText
          x={size / 2}
          y={size / 2 + 15}
          textAnchor="middle"
          fontSize="52"
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
