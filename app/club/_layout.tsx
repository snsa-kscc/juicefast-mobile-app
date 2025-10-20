import { Stack } from "expo-router";

export default function ClubLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="content/[id]"
        options={{
          title: "Content",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="categories/[category]/[subcategory]"
        options={{
          title: "Subcategory",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
