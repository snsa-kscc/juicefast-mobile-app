import { Stack } from 'expo-router';

export default function ClubLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="content/[id]" 
        options={{ 
          title: 'Content',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="categories/[category]" 
        options={{ 
          title: 'Category',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="categories/[category]/[subcategory]" 
        options={{ 
          title: 'Subcategory',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
