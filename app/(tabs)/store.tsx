import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export default function StoreScreen() {
  const { link } = useLocalSearchParams<{ link?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [storedLink, setStoredLink] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Store Screen - Link parameter:", link);
    if (link && !storedLink) {
      const decodedLink = decodeURIComponent(link);
      console.log("Storing link:", decodedLink);
      setStoredLink(decodedLink);
    }
  }, [link, storedLink]);

  useEffect(() => {
    // Prevent back navigation for guests
    const backHandler = () => {
      if (!isSignedIn) {
        Alert.alert(
          "Sign In Required",
          "You need to create an account or sign in to access other features.",
          [
            {
              text: "Sign Up",
              onPress: () => router.push("/(auth)/sso-signup"),
            },
            {
              text: "Log In",
              onPress: () => router.push("/(auth)/sign-in"),
            },
            {
              text: "Stay in Store",
              style: "cancel",
            },
          ]
        );
        return true; // Prevent back
      }
      return false; // Allow back for authenticated users
    };

    // Add back handler listener
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );

    // Cleanup listener on unmount
    return () => subscription.remove();
  }, [isSignedIn, router]);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const getWebViewSource = () => {
    const urlToUse = storedLink || "https://juicefast.com/";
    console.log("Using URL:", urlToUse);
    return { uri: urlToUse };
  };

  return (
    <ThemedView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      <WebView
        source={getWebViewSource()}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        allowsAirPlayForMediaPlayback={true}
        mixedContentMode="compatibility"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    zIndex: 1,
  },
});
