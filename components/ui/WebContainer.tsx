import { Platform, View } from "react-native";
import { ReactNode } from "react";

export function WebContainer({ children }: { children: ReactNode }) {
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View className="flex-1 items-center bg-gray-900">
      <View className="flex-1 w-full bg-jf-gray" style={{ maxWidth: 380 }}>
        {children}
      </View>
    </View>
  );
}
