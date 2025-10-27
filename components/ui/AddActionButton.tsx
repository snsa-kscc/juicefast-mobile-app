import { usePathname, useRouter } from "expo-router";
import { Plus, X } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  MealIcon,
  MindfulnessIcon,
  NoteIcon,
  SleepIcon,
  StepsIcon,
  WaterIcon,
} from "@/components/icons/TrackerIcons";

interface ActionOption {
  id: string;
  title: string;
  iconColor: string;
  route: string;
}

export function AddActionButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const rotation = useSharedValue(0);
  const screenHeight = Dimensions.get("window").height;
  const fabBottom = screenHeight * 0.17;

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 90 : 0, { duration: 200 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const wellnessOptions: ActionOption[] = [
    {
      id: "meals",
      title: "Meals",
      iconColor: "rgba(13, 201, 155, 1)",
      route: "/meals",
    },
    {
      id: "activity",
      title: "Steps",
      iconColor: "rgba(255, 200, 86, 1)",
      route: "/steps",
    },
    {
      id: "mindfulness",
      title: "Mindfulness",
      iconColor: "rgba(254, 142, 119, 1)",
      route: "/mindfulness",
    },
    {
      id: "sleep",
      title: "Sleep",
      iconColor: "rgba(98, 95, 211, 1)",
      route: "/sleep",
    },
    {
      id: "hydration",
      title: "Water",
      iconColor: "rgba(76, 195, 255, 1)",
      route: "/hydration",
    },
    {
      id: "notes",
      title: "Notes",
      iconColor: "rgba(255, 159, 64, 1)",
      route: "/notes",
    },
  ];

  const handleOptionPress = (route: string) => {
    if (pathname === route) return;
    handleCloseModal();

    const existingRoutes = [
      "/meals",
      "/steps",
      "/mindfulness",
      "/hydration",
      "/sleep",
      "/notes",
    ];

    if (existingRoutes.includes(route)) {
      router.push(route as any);
    } else {
      console.log(`Route ${route} not implemented yet`);
    }
  };

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case "meals":
        return <MealIcon color={color} />;
      case "activity":
        return <StepsIcon color={color} />;
      case "mindfulness":
        return <MindfulnessIcon color={color} />;
      case "hydration":
        return <WaterIcon color={color} />;
      case "sleep":
        return <SleepIcon color={color} />;
      case "notes":
        return <NoteIcon color={color} />;
      default:
        return <StepsIcon color={color} />;
    }
  };

  return (
    <>
      {/* Floating Action Button - Outside Modal */}
      {!isOpen && (
        <View
          className="absolute right-6"
          style={{ bottom: fabBottom, zIndex: 9999, elevation: 9999 }}
          pointerEvents="auto"
        >
          <TouchableOpacity
            className="w-14 h-14 rounded-full bg-white justify-center items-center shadow-lg"
            onPress={handleOpenModal}
            activeOpacity={0.8}
          >
            <Animated.View style={animatedStyle}>
              <Plus size={28} color="#000000" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : undefined}
        onRequestClose={handleCloseModal}
      >
        {/* Floating Action Button - Inside Modal */}
        <View
          className="absolute right-6"
          style={{ bottom: fabBottom, zIndex: 9999, elevation: 9999 }}
          pointerEvents="auto"
        >
          <TouchableOpacity
            className="w-14 h-14 rounded-full bg-white justify-center items-center shadow-lg"
            onPress={handleCloseModal}
            activeOpacity={0.8}
          >
            <Animated.View style={animatedStyle}>
              <X size={28} color="#000000" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Modal Content */}
        <View className="flex-1 justify-end">
          <View className="bg-[#F5F5F5] rounded-t-[20px] px-5 pt-3 pb-5">
            {/* Handle Indicator */}
            <View className="items-center mb-7">
              <View className="w-10 h-1 bg-black rounded-full" />
            </View>

            <View className="mb-5">
              <Text className="text-2xl font-lufga-bold text-black text-center mb-10 tracking-wider">
                WELLNESS LOG
              </Text>
              {wellnessOptions.map((option) => {
                const isCurrentScreen = pathname === option.route;
                return (
                  <TouchableOpacity
                    key={option.id}
                    className={`flex-row items-center py-4 px-5 mb-2 rounded-xl ${
                      isCurrentScreen ? "bg-[#F0F0F0] opacity-60" : "bg-white"
                    }`}
                    onPress={() => handleOptionPress(option.route)}
                    activeOpacity={isCurrentScreen ? 1 : 0.7}
                    disabled={isCurrentScreen}
                  >
                    <View className="justify-center items-center mr-9">
                      {renderIcon(option.id, option.iconColor)}
                    </View>
                    <Text
                      className={`text-base font-lufga-medium ${
                        isCurrentScreen ? "text-[#999]" : "text-black"
                      }`}
                    >
                      {option.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-sm text-[#666] text-center mt-5 leading-5 pb-10 font-lufga">
              For the most accurate insights,{"\n"}log daily.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
