import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Ruler,
  Scale,
  Calendar,
  Activity,
  LogOut,
  Settings,
  Bell,
  Heart,
  Award,
  Users,
  ChevronDown,
} from 'lucide-react-native';
import { WellnessHeader } from '../components/ui/CustomHeader';
import { UserProfile, User as UserType, calculateDailyCalories, getActivityLevelText } from '../schemas/UserProfileSchema';

// Mock data - replace with actual data source
const mockUser: UserType = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  image: null,
};

const mockProfile: UserProfile = {
  id: '1',
  height: 175,
  weight: 70,
  age: 30,
  gender: 'male',
  activityLevel: 'moderate',
  referralCode: 'JOHN123',
  referralCount: 3,
  referrals: [],
};

interface SelectProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
}

function Select({ value, onValueChange, placeholder, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-3"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {value ? options.find(opt => opt.value === value)?.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#9CA3AF" />
      </TouchableOpacity>
      
      {isOpen && (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 z-50 shadow-lg">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="px-3 py-3 border-b border-gray-100 last:border-b-0"
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
            >
              <Text className="text-gray-900">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [height, setHeight] = useState<string>(mockProfile?.height?.toString() || '170');
  const [weight, setWeight] = useState<string>(mockProfile?.weight?.toString() || '');
  const [age, setAge] = useState<string>(mockProfile?.age?.toString() || '');
  const [gender, setGender] = useState<string | undefined>(mockProfile?.gender);
  const [activityLevel, setActivityLevel] = useState<string | undefined>(mockProfile?.activityLevel);

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);

      const updatedProfile: UserProfile = {
        id: mockUser.id,
        height: parseInt(height) || 170,
        weight: weight ? parseInt(weight) : undefined,
        age: age ? parseInt(age) : undefined,
        gender: gender || '',
        activityLevel: (activityLevel as any) || 'moderate',
        referralCode: profile?.referralCode,
        referredBy: profile?.referredBy,
        referralCount: profile?.referralCount || 0,
        referrals: profile?.referrals || [],
      };

      // TODO: Save to actual data source
      setProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.push('/') },
      ]
    );
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const activityOptions = [
    { label: 'Sedentary (little to no exercise)', value: 'sedentary' },
    { label: 'Light (exercise 1-3 days/week)', value: 'light' },
    { label: 'Moderate (exercise 3-5 days/week)', value: 'moderate' },
    { label: 'Active (exercise 6-7 days/week)', value: 'active' },
    { label: 'Very Active (professional athlete level)', value: 'very_active' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <WellnessHeader
        title="Profile"
        subtitle="Manage your health profile"
        showBackButton
        onBackPress={() => router.back()}
      />
      
      <ScrollView className="flex-1 px-6">
        {/* Profile Card */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold mb-4">Your Profile</Text>
          
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center mb-4 overflow-hidden">
              {mockUser?.image ? (
                <Image source={{ uri: mockUser.image }} className="w-full h-full" />
              ) : (
                <User size={48} color="#3B82F6" />
              )}
            </View>
            <Text className="text-xl font-semibold text-center">
              {mockUser?.name || (mockUser?.email ? mockUser.email.split('@')[0] : 'Health Tracker User')}
            </Text>
          </View>

          <View className="space-y-3">
            <TouchableOpacity
              className="flex-row items-center p-3 bg-gray-50 rounded-lg"
              onPress={() => setIsEditing(true)}
            >
              <Settings size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-900 font-medium">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
              <Bell size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-900 font-medium">Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
              <Award size={20} color="#6B7280" />
              <Text className="ml-3 text-gray-900 font-medium">Goals & Targets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-3 bg-red-50 rounded-lg"
              onPress={handleLogout}
            >
              <LogOut size={20} color="#EF4444" />
              <Text className="ml-3 text-red-500 font-medium">Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Details */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold mb-4">
            {isEditing ? 'Edit Your Details' : 'Your Details'}
          </Text>

          {isEditing ? (
            <View className="space-y-4">
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Height (cm)</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-3">
                    <Ruler size={16} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-2 text-gray-900"
                      value={height}
                      onChangeText={setHeight}
                      keyboardType="numeric"
                      placeholder="170"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Weight (kg)</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-3">
                    <Scale size={16} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-2 text-gray-900"
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      placeholder="70"
                    />
                  </View>
                </View>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Age</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-3">
                    <Calendar size={16} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-2 text-gray-900"
                      value={age}
                      onChangeText={setAge}
                      keyboardType="numeric"
                      placeholder="30"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Gender</Text>
                  <Select
                    value={gender}
                    onValueChange={setGender}
                    placeholder="Select gender"
                    options={genderOptions}
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Activity Level</Text>
                <View className="flex-row items-center">
                  <Activity size={16} color="#9CA3AF" />
                  <View className="flex-1 ml-2">
                    <Select
                      value={activityLevel}
                      onValueChange={setActivityLevel}
                      placeholder="Select activity level"
                      options={activityOptions}
                    />
                  </View>
                </View>
              </View>

              <View className="flex-row justify-end space-x-3 pt-4">
                <TouchableOpacity
                  className="px-6 py-3 bg-gray-100 rounded-lg"
                  onPress={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-6 py-3 bg-blue-500 rounded-lg"
                  onPress={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Text className="text-white font-medium">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="space-y-4">
              <View className="flex-row flex-wrap">
                <View className="w-1/2 pr-2 mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                      <Ruler size={20} color="#3B82F6" />
                    </View>
                    <View>
                      <Text className="text-sm text-gray-500">Height</Text>
                      <Text className="font-medium">{profile?.height || '-'} cm</Text>
                    </View>
                  </View>
                </View>

                <View className="w-1/2 pl-2 mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                      <Scale size={20} color="#3B82F6" />
                    </View>
                    <View>
                      <Text className="text-sm text-gray-500">Weight</Text>
                      <Text className="font-medium">{profile?.weight || '-'} kg</Text>
                    </View>
                  </View>
                </View>

                <View className="w-1/2 pr-2 mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                      <Calendar size={20} color="#3B82F6" />
                    </View>
                    <View>
                      <Text className="text-sm text-gray-500">Age</Text>
                      <Text className="font-medium">{profile?.age || '-'}</Text>
                    </View>
                  </View>
                </View>

                <View className="w-1/2 pl-2 mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                      <User size={20} color="#3B82F6" />
                    </View>
                    <View>
                      <Text className="text-sm text-gray-500">Gender</Text>
                      <Text className="font-medium">
                        {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '-'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="w-full mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                      <Activity size={20} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-gray-500">Activity Level</Text>
                      <Text className="font-medium">
                        {profile?.activityLevel ? getActivityLevelText(profile.activityLevel) : '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className="bg-blue-500 py-3 rounded-lg items-center"
                onPress={() => setIsEditing(true)}
              >
                <Text className="text-white font-medium">Edit Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Health Metrics Summary */}
        <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold mb-4">Health Metrics</Text>
          
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/3 px-2 mb-4">
              <View className="bg-red-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Heart size={20} color="#EF4444" />
                  <Text className="text-lg font-bold">
                    {profile?.weight && profile?.height 
                      ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
                      : '-'
                    }
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-600">BMI</Text>
              </View>
            </View>

            <View className="w-1/3 px-2 mb-4">
              <View className="bg-green-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Heart size={20} color="#10B981" />
                  <Text className="text-sm font-bold">
                    {profile?.weight && profile?.height && profile?.age && profile?.gender && profile?.activityLevel
                      ? calculateDailyCalories(profile.weight, profile.height, profile.age, profile.gender, profile.activityLevel)
                      : '-'
                    }
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-600">Daily Calories</Text>
              </View>
            </View>

            <View className="w-1/3 px-2 mb-4">
              <View className="bg-blue-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Heart size={20} color="#3B82F6" />
                  <Text className="text-sm font-bold">
                    {profile?.weight ? `${Math.round(profile.weight * 30)} ml` : '-'}
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-600">Water Goal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral Section */}
        {profile?.referralCode && (
          <View className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <Text className="text-lg font-bold mb-4">Referral Program</Text>
            
            <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Users size={20} color="#3B82F6" />
                <Text className="text-lg font-bold">{profile.referralCount || 0}</Text>
              </View>
              <Text className="text-sm font-medium text-gray-600 mb-2">Referrals Made</Text>
              <Text className="text-xs text-gray-500">Your code: {profile.referralCode}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
