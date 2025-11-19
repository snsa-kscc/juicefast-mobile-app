import { Platform, View } from "react-native";
import { ReactNode } from "react";

export function WebContainer({ children }: { children: ReactNode }) {
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View className="flex-1 items-center bg-stone-200">
      <View className="flex-1 w-full bg-jf-gray max-w-xl m-6">{children}</View>
    </View>
  );
}
