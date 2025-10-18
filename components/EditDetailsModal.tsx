import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { X, ChevronDown, Ruler, Scale, Calendar, User, Activity } from "lucide-react-native";

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
  onShowActivityPopup: () => void;
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
    <View style={styles.selectContainer}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectText,
            value ? styles.selectTextValue : styles.selectTextPlaceholder,
          ]}
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
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const { height } = Dimensions.get("window");

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
  onShowActivityPopup,
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
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Your Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Height (cm)</Text>
                <View style={styles.inputContainer}>
                  <Ruler size={16} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    placeholder="170"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    editable={!isSaving}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.flex1, styles.ml3]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputContainer}>
                  <Scale size={16} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
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

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={16} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={setAge}
                    placeholder="30"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    editable={!isSaving}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.flex1, styles.ml3]}>
                <Text style={styles.label}>Gender</Text>
                <Select
                  value={gender}
                  onValueChange={setGender}
                  placeholder="Select gender"
                  options={genderOptions}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Activity Level</Text>
              <View style={styles.inputContainer}>
                <Activity size={16} color="#9CA3AF" />
                <TouchableOpacity
                  style={styles.activitySelectButton}
                  onPress={onShowActivityPopup}
                  disabled={isSaving}
                >
                  <Text
                    style={
                      activityLevel
                        ? styles.activitySelectText
                        : styles.activitySelectPlaceholder
                    }
                  >
                    {activityLevel
                      ? activityOptions.find((opt) => opt.value === activityLevel)
                          ?.label
                      : "Select activity level"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={styles.saveButtonText}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: "Lufga-Bold",
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  ml3: {
    marginLeft: 12,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    fontFamily: "Lufga-Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#111827",
    fontFamily: "Lufga-Regular",
    paddingVertical: 12,
  },
  activitySelectButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
  },
  activitySelectText: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Lufga-Regular",
  },
  activitySelectPlaceholder: {
    fontSize: 16,
    color: "#9CA3AF",
    fontFamily: "Lufga-Regular",
  },
  selectContainer: {
    position: "relative",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectText: {
    fontSize: 16,
    fontFamily: "Lufga-Regular",
  },
  selectTextValue: {
    color: "#111827",
  },
  selectTextPlaceholder: {
    color: "#9CA3AF",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginTop: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Lufga-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "Lufga-SemiBold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Lufga-SemiBold",
  },
});