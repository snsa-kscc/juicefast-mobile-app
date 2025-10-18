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
import { X } from "lucide-react-native";

interface EditNameModalProps {
  visible: boolean;
  onClose: () => void;
  initialFirstName: string;
  initialLastName: string;
  onSave: (firstName: string, lastName: string) => Promise<void>;
}

const { height: windowHeight } = Dimensions.get("window");

export function EditNameModal({
  visible,
  onClose,
  initialFirstName,
  initialLastName,
  onSave,
}: EditNameModalProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setFirstName(initialFirstName);
      setLastName(initialLastName);
    }
  }, [visible, initialFirstName, initialLastName]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(firstName, lastName);
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
          <View className="bg-white rounded-t-[20px] p-5" style={{ maxHeight: windowHeight * 0.5 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800 font-[Lufga-Bold]">
                Edit Name
              </Text>
              <TouchableOpacity onPress={onClose} className="p-1">
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="gap-4" showsVerticalScrollIndicator={false}>
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 font-[Lufga-Medium]">
                First Name
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 font-[Lufga-Regular]"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#9CA3AF"
                editable={!isSaving}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 font-[Lufga-Medium]">
                Last Name
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 font-[Lufga-Regular]"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#9CA3AF"
                editable={!isSaving}
              />
            </View>

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-3.5 items-center"
                onPress={onClose}
                disabled={isSaving}
              >
                <Text className="text-base font-semibold text-gray-700 font-[Lufga-SemiBold]">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-xl py-3.5 items-center"
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text className="text-base font-semibold text-white font-[Lufga-SemiBold]">
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
