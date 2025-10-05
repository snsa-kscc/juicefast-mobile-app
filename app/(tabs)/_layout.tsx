import {
  Badge,
  Icon,
  Label,
  NativeTabs,
} from "expo-router/unstable-native-tabs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const { isSignedIn } = useAuth();
  const sessions = useQuery(
    api.nutritionistChat.getActiveUserSessions,
    isSignedIn ? undefined : "skip"
  );
  const unreadCount =
    sessions?.reduce((sum, session) => sum + (session.unreadCount || 0), 0) ||
    0;

  return (
    <NativeTabs
    // screenOptions={{
    //   headerShown: false,
    //   tabBarStyle: {
    //     backgroundColor: "#ffffff",
    //     borderTopWidth: 1,
    //     borderTopColor: "#e5e5e5",
    //     height: Platform.OS === "ios" ? 80 + insets.bottom : 70,
    //     paddingBottom: Platform.OS === "ios" ? insets.bottom + 10 : 10,
    //     paddingTop: 10,
    //   },
    //   tabBarActiveTintColor: "#000000",
    //   tabBarInactiveTintColor: "#9ca3af",
    //   tabBarLabelStyle: {
    //     fontSize: 12,
    //     fontFamily: "Lufga-Medium",
    //   },
    // }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon
          sf={{ default: "house", selected: "house.fill" }}
          drawable="ic_menu_home"
        />
      </NativeTabs.Trigger>
      {/* options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }} */}

      <NativeTabs.Trigger name="tracker">
        <Label>Tracker</Label>
        <Icon
          sf={{ default: "heart", selected: "heart.fill" }}
          drawable="ic_menu_home"
        />
      </NativeTabs.Trigger>
      {/* options={{
          title: "Tracker",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
         }} */}

      <NativeTabs.Trigger name="store">
        <Label>Store</Label>
        <Icon
          sf={{ default: "bag", selected: "bag.fill" }}
          drawable="stat_notify_chat"
        />
      </NativeTabs.Trigger>
      {/* options={{
          title: "Store",
          tabBarIcon: ({ color, size }) => <Store size={size} color={color} />,
         }} */}

      <NativeTabs.Trigger name="chat">
        <Label>Chat</Label>
        <Icon
          sf={{ default: "message", selected: "message.fill" }}
          drawable="ic_dialog_email"
        />
        {unreadCount > 0 && <Badge>{unreadCount.toString()}</Badge>}
      </NativeTabs.Trigger>
      {/* options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
         }} */}

      <NativeTabs.Trigger name="club">
        <Label>JF Club</Label>
        <Icon
          sf={{ default: "person.2", selected: "person.2.fill" }}
          drawable="ic_dialog_email"
        />
      </NativeTabs.Trigger>
      {/* options={{
          title: "JF Club",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }} */}
    </NativeTabs>
  );
}
