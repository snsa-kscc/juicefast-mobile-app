import { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { SleepTimePicker } from "@/components/tracker/SleepTimePicker";

interface SleepTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hours: number, minutes: number) => void;
  initialHours?: number;
  initialMinutes?: number;
  title: string;
}

export function SleepTimeModal({
  visible,
  onClose,
  onConfirm,
  initialHours = 22,
  initialMinutes = 0,
  title,
}: SleepTimeModalProps) {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);

  const handleConfirm = () => {
    onConfirm(hours, minutes);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-3xl p-6 mx-6 w-[90%] max-w-md">
          <Text className="text-2xl font-lufga-bold text-center mb-3 text-black">
            {title}
          </Text>

          <View className="border-b mb-6 border-gray-100" />

          <View className="bg-gray-50 p-4 rounded-lg mb-6">
            <SleepTimePicker
              hours={hours}
              minutes={minutes}
              onChange={(h, m) => {
                setHours(h);
                setMinutes(m);
              }}
            />
          </View>

          <View className="border-b mb-6 border-gray-100" />

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 px-6 py-3 rounded-full border border-gray-300"
            >
              <Text className="text-black text-base font-lufga-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              className="flex-1 px-6 py-3 rounded-full bg-gray-900"
            >
              <Text className="text-white text-base font-lufga-semibold text-center">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
