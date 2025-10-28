import React, {
  useEffect,
  useOptimistic,
  useState,
  startTransition,
  useMemo,
} from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@/convex/_generated/api";
import { WellnessHeader, TrackerButton } from "@/components/tracker/shared";

interface NotesTrackerProps {
  onBack?: () => void;
  onSettingsPress?: () => void;
}

export function NotesTracker({ onBack, onSettingsPress }: NotesTrackerProps) {
  const { user } = useUser();
  const [noteContent, setNoteContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const upsertNote = useMutation(api.noteEntry.upsert);
  const deleteNote = useMutation(api.noteEntry.deleteByDate);

  // Get today's date in YYYY-MM-DD format
  const todayDate = useMemo(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }, []);

  // Fetch today's note
  const existingNote = useQuery(
    api.noteEntry.getByDate,
    user?.id ? { date: todayDate } : "skip"
  );

  // Initialize note content when data loads
  useEffect(() => {
    if (existingNote) {
      setNoteContent(existingNote.content);
      setHasUnsavedChanges(false);
    }
  }, [existingNote]);

  // Track unsaved changes
  const handleContentChange = (text: string) => {
    setNoteContent(text);
    setHasUnsavedChanges(
      text !== (existingNote?.content || "") && text.trim() !== ""
    );
  };

  // Optimistic state for the note content
  const [optimisticContent, setOptimisticContent] = useOptimistic(
    existingNote?.content || "",
    (state, newContent: string) => newContent
  );

  const handleSaveNote = async () => {
    if (!user?.id || noteContent.trim() === "" || isSaving) return;

    setIsSaving(true);
    startTransition(() => {
      setOptimisticContent(noteContent);
    });

    try {
      await upsertNote({
        content: noteContent.trim(),
        date: todayDate,
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!user?.id || !existingNote) return;

    try {
      await deleteNote({ date: todayDate });
      setNoteContent("");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const characterCount = noteContent.length;
  const maxCharacters = 5000;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className="flex-1 bg-jf-gray"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <WellnessHeader
          title="Daily Focus"
          subtitle="Capture your thoughts, track your progress."
          accentColor="rgba(255, 159, 64, 1)"
          showBackButton={true}
          onBackPress={onBack}
          onSettingsPress={onSettingsPress}
        />

        {/* Note Editor */}
        <View className="px-6">
          <View className="mb-2">
            <Text className="font-lufga-semibold text-2xl mb-1">
              Today's Priority
            </Text>
            {existingNote && (
              <Text className="font-lufga text-xs text-gray-500">
                Last updated:{" "}
                {new Date(existingNote.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}
          </View>
          <View className="flex-row justify-end items-center mb-2">
            <Text
              className={`font-lufga text-xs ${
                characterCount > maxCharacters * 0.9
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {characterCount}/{maxCharacters}
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-4 mb-4">
            <TextInput
              className="font-lufga text-base min-h-24 text-gray-800"
              placeholder="Today I choose to..."
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              value={noteContent}
              onChangeText={handleContentChange}
              maxLength={maxCharacters}
            />
          </View>

          {hasUnsavedChanges && (
            <View className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <Text className="font-lufga text-sm text-amber-800">
                You have unsaved changes
              </Text>
            </View>
          )}

          <TrackerButton
            title={"Lock it in"}
            onPress={handleSaveNote}
            isLoading={isSaving}
            loadingText="Locking in..."
            disabled={!hasUnsavedChanges || noteContent.trim() === ""}
          />

          {existingNote && (
            <TouchableOpacity
              onPress={handleDeleteNote}
              className="mt-3 p-4 bg-red-100 rounded-full active:bg-red-200"
            >
              <Text className="font-lufga-medium text-center text-red-600">
                Delete Focus
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tips Card */}
        <View className="px-6 mt-6 mb-16">
          <View className="bg-white rounded-2xl p-4">
            <Text className="font-lufga-semibold text-xl mb-2">Focus Tips</Text>
            <View>
              {[
                "Reflect on your day's achievements and challenges",
                "Track your mood and energy levels",
                "Set intentions for today",
                "Note any patterns in your wellness journey",
              ].map((tip, index, array) => (
                <View
                  key={index}
                  className={`flex-row items-start ${index < array.length - 1 ? "mb-2" : ""}`}
                >
                  <View className="bg-orange-100 rounded-full p-1 mr-2 mt-0.5">
                    <View className="w-2 h-2" />
                  </View>
                  <Text className="font-lufga text-sm flex-1">{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
