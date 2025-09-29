import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { getPushToken, sendPushNotification, addNotificationListener, addForegroundNotificationListener } from '@/services/messagingService';

export default function PushNotificationTest() {
  const [myToken, setMyToken] = useState('');
  const [otherToken, setOtherToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get my token
    getPushToken().then(token => {
      if (token) {
        setMyToken(token);
        console.log('My Token:', token);
      }
    });

    // Listen for incoming notifications
    const unsubscribeTap = addNotificationListener((chatId) => {
      Alert.alert('Notification tapped!', `Chat ID: ${chatId}`);
    });

    // Listen for notifications when app is open
    const unsubscribeForeground = addForegroundNotificationListener(
      (sender, message, chatId) => {
        Alert.alert('New message received!', `${sender}: ${message}`);
      }
    );

    return () => {
      unsubscribeTap();
      unsubscribeForeground();
    };
  }, []);

  const handleSend = async () => {
    if (!otherToken || !message) {
      Alert.alert('Error', 'Enter token and message');
      return;
    }

    try {
      await sendPushNotification(otherToken, 'Test User', message, 'chat-123');
      Alert.alert('Success', 'Notification sent!');
      setMessage('');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send notification');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pt-12">
        <Text className="text-xl font-bold mb-4">Test Push Notifications</Text>

        {/* Show my token */}
        <Text className="text-sm font-medium mb-2">My Token:</Text>
        <Text
          className="text-xs bg-gray-100 p-3 mb-4 rounded-md"
          selectable
        >
          {myToken || 'Loading...'}
        </Text>

        {/* Input for other device's token */}
        <Text className="text-sm font-medium mb-2">Other Device Token:</Text>
        <TextInput
          className="border border-gray-300 p-3 mb-4 rounded-md text-sm"
          value={otherToken}
          onChangeText={setOtherToken}
          placeholder="Paste token from other device"
          multiline
        />

        {/* Message to send */}
        <Text className="text-sm font-medium mb-2">Message:</Text>
        <TextInput
          className="border border-gray-300 p-3 mb-4 rounded-md text-sm"
          value={message}
          onChangeText={setMessage}
          placeholder="Type a test message"
        />

        <Button title="Send Notification" onPress={handleSend} />
      </View>
    </ScrollView>
  );
}