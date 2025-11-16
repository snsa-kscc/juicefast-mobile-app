import { Tabs } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Home, Heart, Store, MessageCircle, Users } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { Platform } from "react-native";
import {
  Badge,
  Icon,
  Label,
  NativeTabs,
} from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  // Check if iOS 26 or later
  const isIOS26OrLater =
    Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

  // If iOS 26+, use native tabs
  if (isIOS26OrLater) {
    return <IOSNativeTabLayout />;
  }

  // Otherwise use regular tabs
  return <RegularTabLayout />;
}

function RegularTabLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const isNutritionist = user?.unsafeMetadata?.role === "nutritionist";
  
  const userSessions = useQuery(
    api.nutritionistChat.getActiveUserSessions,
    isSignedIn && !isNutritionist ? undefined : "skip"
  );
  const nutritionistSessions = useQuery(
    api.nutritionistChat.getNutritionistSessions,
    isSignedIn && isNutritionist ? undefined : "skip"
  );
  
  const unreadCount = isNutritionist
    ? nutritionistSessions?.reduce((sum, session) => sum + (session.unreadCount || 0), 0) || 0
    : userSessions?.reduce((sum, session) => sum + (session.unreadCount || 0), 0) || 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderRadius: 20,
          height: 70,
          marginHorizontal: 20,
          marginBottom: 25,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 12,
          borderWidth: 1.5,
          borderColor: "rgba(0, 0, 0, 0.2)",
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="light"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              overflow: "hidden",
            }}
          />
        ),
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Lufga-Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="tracker"
        options={{
          title: "Tracker",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="store"
        options={{
          title: "Store",
          tabBarIcon: ({ color, size }) => <Store size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#000",
            color: "#ffffff",
            fontSize: 10,
            fontFamily: "Lufga-Medium",
            minWidth: 18,
            height: 18,
            borderRadius: 9,
          },
        }}
      />

      <Tabs.Screen
        name="club"
        options={{
          title: "JF Club",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

function IOSNativeTabLayout() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const isNutritionist = user?.unsafeMetadata?.role === "nutritionist";
  
  const userSessions = useQuery(
    api.nutritionistChat.getActiveUserSessions,
    isSignedIn && !isNutritionist ? undefined : "skip"
  );
  const nutritionistSessions = useQuery(
    api.nutritionistChat.getNutritionistSessions,
    isSignedIn && isNutritionist ? undefined : "skip"
  );
  
  const unreadCount = isNutritionist
    ? nutritionistSessions?.reduce((sum, session) => sum + (session.unreadCount || 0), 0) || 0
    : userSessions?.reduce((sum, session) => sum + (session.unreadCount || 0), 0) || 0;

  return (
    <NativeTabs
      iconColor={{ default: "#9ca3af", selected: "#000000" }}
      indicatorColor="#000000"
      shadowColor="#000000"
      badgeBackgroundColor="#000"
      badgeTextColor="#ffffff"
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: "house", selected: "house.fill" }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tracker">
        <Label>Tracker</Label>
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="store">
        <Label>Store</Label>
        <Icon sf={{ default: "bag", selected: "bag.fill" }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="chat">
        <Label>Chat</Label>
        <Icon sf={{ default: "message", selected: "message.fill" }} />
        {unreadCount > 0 && <Badge>{unreadCount.toString()}</Badge>}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="club">
        <Label>JF Club</Label>
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
