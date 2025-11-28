import { View } from "react-native";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const progress = (current / total) * 100;

  return (
    <View className="flex-1 ml-4 mr-4">
      <View className="h-2 bg-white rounded-full overflow-hidden">
        <View
          className="h-full rounded-full bg-[#11B364]"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}
