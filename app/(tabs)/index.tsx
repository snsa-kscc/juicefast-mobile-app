import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  return (
    <WebView
      style={[styles.container, { marginTop: Constants.statusBarHeight }]}
      source={{ uri: "https://meal-tracker-tan.vercel.app" }}
      originWhitelist={["*"]}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
