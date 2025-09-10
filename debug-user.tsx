import { useUser } from '@clerk/clerk-expo';
import { View, Text } from 'react-native';

export default function DebugUser() {
  const { user } = useUser();
  
  return (
    <View className="p-4">
      <Text>User ID: {user?.id}</Text>
      <Text>Metadata: {JSON.stringify(user?.unsafeMetadata, null, 2)}</Text>
    </View>
  );
}