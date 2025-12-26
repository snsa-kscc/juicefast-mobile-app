import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

export default function AnotherEntryPage() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-jf-gray"
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Gradient */}
      <LinearGradient
        colors={["#BAF3C1", "#F8F6EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="pb-8"
      >
        <View className="px-6 pt-12">
          {/* Back button only (no dots) */}
          <View className="relative mb-10 h-16">
            <View className="absolute top-0 left-0 h-full items-center justify-center">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-16 h-16 rounded-full bg-[#0DC99B] shadow-lg items-center justify-center"
              >
                <ArrowLeft size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <View className="items-center">
            <Text className="text-5xl leading-tight font-lufga-extrabold text-black text-center">
              Register {"\n"}another order
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content Section */}
      <View className="px-10 pt-4">
        {/* Card */}
        <View
          className={`rounded-3xl shadow-2xl shadow-black/90 mb-10 bg-transparent ${
            Platform.OS === "ios" ? "shadow-black/30" : "shadow-black/90"
          }`}
        >
          <LinearGradient
            colors={["#A5ECC9", "#EFEFEF", "#F8F6EB"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0.005, 0.8, 1]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 24,
            }}
          />
          <View className="relative p-5 flex-row items-center gap-5">
            <View className="w-20 h-20 items-center justify-center overflow-visible">
              <Image
                source={require("@/assets/images/challenge/gift-box.webp")}
                className="w-24 h-24 ml-2"
                resizeMode="contain"
              />
            </View>
            <Text className="flex-1 ml-4 text-2xl leading-tight font-lufga-extrabold text-black">
              Register another order
            </Text>
          </View>
        </View>

        {/* Description Text */}
        <Text className="text-base text-gray-600 text-center font-lufga mb-16 leading-relaxed px-4">
          Every order you register = extra chance to win. Add more orders to
          boost your odds!
        </Text>

        {/* Add Order Button */}
        <TouchableOpacity
          onPress={() => router.push("/challenge/order-entry")}
          className="w-full bg-[#0DC99B] rounded-[20px] py-5 items-center justify-center shadow-md mb-8"
        >
          <Text className="text-white text-2xl font-lufga-semibold">
            Add order
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
