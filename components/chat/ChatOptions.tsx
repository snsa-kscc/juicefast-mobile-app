import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { WellnessHeader } from "@/components/ui/CustomHeader";
import Svg, { Path, Rect } from "react-native-svg";

interface ChatOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

interface ChatOptionsProps {
  onOptionPress?: (route: string) => void;
  onSettingsPress?: () => void;
}

const NutritionistIcon = () => (
  <Svg width={54} height={54} viewBox="0 0 44 44" fill="none">
    <Path d="M7 12H17" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="3" y="3" width="18" height="18" rx="4" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 8H17" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 16H12" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AIIcon = () => (
  <Svg width={54} height={54} viewBox="0 0 44 44" fill="none">
    <Path
      d="M7 10.0001C7.395 9.51512 7.935 9.24012 8.5 9.24012C9.065 9.24012 9.59 9.51512 10 10.0001"
      stroke="#FE8E77"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 10.0001C14.395 9.51512 14.935 9.24012 15.5 9.24012C16.065 9.24012 16.59 9.51512 17 10.0001"
      stroke="#FE8E77"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.3639C14.8493 21.8787 9.1508 21.8787 5.6361 18.3639C2.12138 14.8492 2.12138 9.15074 5.6361 5.63604C9.15082 2.12132 14.8493 2.12132 18.364 5.63604"
      stroke="#FE8E77"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.5 14.6885C15.5 14.6885 14.187 16.0005 12 16.0005C9.812 16.0005 8.5 14.6885 8.5 14.6885"
      stroke="#FE8E77"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CHAT_OPTIONS: ChatOption[] = [
  {
    id: "nutritionist",
    name: "Chat with our nutritionist",
    description: "Our nutrition experts are waiting to help out",
    icon: <NutritionistIcon />,
    route: "/chat/nutritionist",
  },
  {
    id: "ai",
    name: "Chat with Juicefast AI wellness expert",
    description: "Get instant answers from our AI assistant",
    icon: <AIIcon />,
    route: "/chat/ai",
  },
];

export function ChatOptions({ onOptionPress, onSettingsPress }: ChatOptionsProps) {
  const handleOptionPress = (route: string) => {
    if (onOptionPress) {
      onOptionPress(route);
    } else {
      // Default behavior - log for now until chat screens are implemented
      console.log(`Navigate to: ${route}`);
    }
  };

  return (
    <View className="flex-1 bg-[#FCFBF8]">
      <WellnessHeader
        title="Talk to us"
        subtitle="Choose your chat experience"
        accentColor="#4CC3FF"
        onSettingsPress={onSettingsPress}
      />
      
      <ScrollView 
        className="flex-1 px-4" 
        showsVerticalScrollIndicator={false}
        contentContainerClassName="items-center pb-8"
      >
        <View className="w-full max-w-md space-y-4">
          {CHAT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              className="bg-white rounded-xl shadow-sm"
              onPress={() => handleOptionPress(option.route)}
              activeOpacity={0.7}
            >
              <View className="p-6 flex-row items-start">
                <View className="mr-4">
                  {option.icon}
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-lufga-medium text-black mb-4">
                    {option.name}
                  </Text>
                  <Text className="text-base font-lufga text-gray-600 leading-6">
                    {option.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
