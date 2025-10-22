import React, { useState } from "react";
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

interface EditPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

const { height: windowHeight } = Dimensions.get("window");

export function EditPasswordModal({
  visible,
  onClose,
  onSave,
}: EditPasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentPassword, newPassword);
      handleClose();
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsSaving(false);
    }
  };

  const isValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
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
                <Text className="text-xl font-lufga-bold text-gray-800">
                  Change Password
                </Text>
                <TouchableOpacity onPress={handleClose} className="p-1">
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                className="gap-4"
                showsVerticalScrollIndicator={false}
              >
                <View className="gap-2">
                  <Text className="text-sm font-lufga-medium text-gray-700">
                    Current Password
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 font-lufga"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    editable={!isSaving}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-lufga-medium text-gray-700">
                    New Password
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 font-lufga"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    editable={!isSaving}
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-sm font-lufga-medium text-gray-700">
                    Confirm New Password
                  </Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 font-lufga"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    editable={!isSaving}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <Text className="text-xs text-red-500 font-lufga">
                      Passwords do not match
                    </Text>
                  )}
                </View>

                <View className="flex-row gap-3 mt-2">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-3.5 items-center"
                    onPress={handleClose}
                    disabled={isSaving}
                  >
                    <Text className="text-base font-lufga-semibold text-gray-700">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 rounded-xl py-3.5 items-center ${
                      !isValid ? "bg-gray-400" : "bg-blue-500"
                    }`}
                    onPress={handleSave}
                    disabled={isSaving || !isValid}
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
