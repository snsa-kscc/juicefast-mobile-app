import { View, Text } from "react-native";

interface ProgressBarProps {
  value: number;
  maxValue: number;
  color: string;
  backgroundColor?: string;
  showMarkers?: boolean;
  markers?: string[];
}

export function ProgressBar({
  value,
  maxValue,
  color,
  backgroundColor = "#F2E9D8",
  showMarkers = false,
  markers = [],
}: ProgressBarProps) {
  const progressPercentage = Math.min(100, (value / maxValue) * 100);

  return (
    <View className="w-full max-w-xs">
      <View className="rounded-full h-4" style={{ backgroundColor }}>
        <View
          className="h-4 rounded-full"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: color,
          }}
        />
      </View>
      {showMarkers && markers.length > 0 && (
        <View className="flex-row justify-between items-center mt-4">
          {markers.map((marker, index) => (
            <Text key={index} className="text-xs text-gray-500">
              {marker}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
