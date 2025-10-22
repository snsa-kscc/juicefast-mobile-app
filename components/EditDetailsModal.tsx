import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  X,
  ChevronDown,
  Ruler,
  Scale,
  Calendar,
  User,
} from "lucide-react-native";

interface EditDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  initialHeight: string;
  initialWeight: string;
  initialAge: string;
  initialGender: string | undefined;
  initialActivityLevel: string | undefined;
  genderOptions: { label: string; value: string }[];
  activityOptions: { label: string; value: string }[];
  onSave: (
    height: string,
    weight: string,
    age: string,
    gender: string | undefined,
    activityLevel: string | undefined
  ) => Promise<void>;
}

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
        className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text
          className={`text-base font-lufga ${
            value ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </Text>
        <ChevronDown
          size={20}
          color="#6B7280"
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-xl mb-1 z-[9999] shadow-lg">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="px-4 py-3 border-b border-gray-100 last:border-b-0"
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text className="text-base text-gray-900 font-lufga">
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const { height: windowHeight } = Dimensions.get("window");

export function EditDetailsModal({
  visible,
  onClose,
  initialHeight,
  initialWeight,
  initialAge,
  initialGender,
  initialActivityLevel,
  genderOptions,
  activityOptions,
  onSave,
}: EditDetailsModalProps) {
  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [age, setAge] = useState(initialAge);
  const [gender, setGender] = useState(initialGender);
  const [activityLevel, setActivityLevel] = useState(initialActivityLevel);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setHeight(initialHeight);
      setWeight(initialWeight);
      setAge(initialAge);
      setGender(initialGender);
      setActivityLevel(initialActivityLevel);
    }
  }, [
    visible,
    initialHeight,
    initialWeight,
    initialAge,
    initialGender,
    initialActivityLevel,
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(height, weight, age, gender, activityLevel);
      onClose();
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-transparent justify-end">
            <View
              className="bg-white rounded-t-[20px] p-5"
              style={{ maxHeight: windowHeight * 0.7 }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl text-gray-800 font-lufga-bold">
                  Edit Your Details
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                className="gap-5"
                showsVerticalScrollIndicator={false}
                style={{ overflow: "visible" }}
              >
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-2">
                    {/* ispravi duple fontove */}
                    <Text className="text-sm font-lufga-medium text-gray-700">
                      Height (cm)
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                      <Ruler size={16} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-2 text-base text-gray-900 font-lufga py-3"
                        value={height}
                        onChangeText={setHeight}
                        placeholder="170"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        editable={!isSaving}
                      />
                    </View>
                  </View>

                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-lufga-medium text-gray-700">
                      Weight (kg)
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                      <Scale size={16} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-2 text-base text-gray-900 font-lufga py-3"
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="70"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        editable={!isSaving}
                      />
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-lufga-medium text-gray-700">
                      Age
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3">
                      <Calendar size={16} color="#9CA3AF" />
                      <TextInput
                        className="flex-1 ml-2 text-base text-gray-900 font-lufga py-3"
                        value={age}
                        onChangeText={setAge}
                        placeholder="30"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        editable={!isSaving}
                      />
                    </View>
                  </View>

                  <View className="flex-1 gap-2">
                    <Text className="text-sm font-lufga-medium text-gray-700">
                      Gender
                    </Text>
                    <Select
                      value={gender}
                      onValueChange={setGender}
                      placeholder="Select gender"
                      options={genderOptions}
                    />
                  </View>
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-lufga-medium text-gray-700">
                    Activity Level
                  </Text>
                  <Select
                    value={activityLevel}
                    onValueChange={setActivityLevel}
                    placeholder="Select activity level"
                    options={activityOptions}
                  />
                </View>

                <View className="flex-row gap-3 mt-2">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-3.5 items-center"
                    onPress={onClose}
                    disabled={isSaving}
                  >
                    <Text className="text-base font-lufga-semibold text-gray-700">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-blue-500 rounded-xl py-3.5 items-center"
                    onPress={handleSave}
                    disabled={isSaving}
                  >
                    <Text className="text-base font-lufga-semibold text-white">
                      {isSaving ? "Saving..." : "Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
