import { ArrowLeft, Settings } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface TrackerHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  onSettingsPress?: () => void;
  accentColor?: string;
}

export function TrackerHeader({
  title,
  subtitle,
  onBack,
  onSettingsPress,
  accentColor = "#4CC3FF",
}: TrackerHeaderProps) {
  return (
    <View className="relative overflow-hidden py-6">
      <View
        className="absolute w-64 h-64 rounded-full blur-[80px] -top-5 z-0 opacity-40"
        style={{ backgroundColor: accentColor }}
      />
      <View className="flex-row items-center justify-between px-4 relative z-10">
        {onBack && (
          <TouchableOpacity
            className="rounded-full h-10 w-10 items-center justify-center"
            style={{ backgroundColor: accentColor }}
            onPress={onBack}
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-lufga-bold">{title}</Text>
        <TouchableOpacity
          className="rounded-full bg-transparent h-10 w-10 items-center justify-center"
          onPress={onSettingsPress}
        >
          <Settings size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <View className="px-6 py-2 items-center relative z-10">
        <Text className="font-lufga text-sm text-gray-500 text-center">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
