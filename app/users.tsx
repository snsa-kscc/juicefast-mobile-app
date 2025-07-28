import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Fetch users (replaces SSR)
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        Alert.alert('Error', 'Failed to fetch users');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Create user (replaces server action)
  const createUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(prev => [...prev, result.data]);
        setNewUserName('');
        setNewUserEmail('');
        Alert.alert('Success', 'User created successfully');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
      <Text className="text-gray-600">{item.email}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-8">
      <TouchableOpacity 
        className="mb-4"
        onPress={() => router.back()}
      >
        <Text className="text-blue-500 text-lg">← Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-gray-800 mb-6">Users Management</Text>
      
      {/* Create User Form (replaces server action form) */}
      <View className="bg-white p-4 rounded-lg mb-6 shadow-sm">
        <Text className="text-lg font-semibold mb-4">Add New User</Text>
        
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
          placeholder="Name"
          value={newUserName}
          onChangeText={setNewUserName}
        />
        
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
          placeholder="Email"
          value={newUserEmail}
          onChangeText={setNewUserEmail}
          keyboardType="email-address"
        />
        
        <TouchableOpacity 
          className="bg-blue-500 py-3 rounded-lg"
          onPress={createUser}
        >
          <Text className="text-white text-center font-semibold">Create User</Text>
        </TouchableOpacity>
      </View>

      {/* Users List (replaces SSR data) */}
      <Text className="text-lg font-semibold mb-4">Users List</Text>
      
      {loading ? (
        <Text className="text-center text-gray-500">Loading users...</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
