export default () => {
  const defaultAppId = "com.juicefastapp.juicefastnutritionapp";

  return {
    expo: {
      name: process.env.DEV_APP_ID ? "Juicefast DEV" : "Juicefast AI",
      slug: "juicefast-nutrition-app",
      version: "1.0.2",
      orientation: "portrait",
      icon: "./assets/images/jf-picto-ios.png",
      scheme: process.env.DEV_APP_ID ? "juicefast-dev" : "juicefast-ai",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        icon: "./assets/images/jf-picto-ios.png",
        supportsTablet: true,
        bundleIdentifier: process.env.DEV_APP_ID ?? defaultAppId,
        infoPlist: {
          ITSAppUsesNonExemptEncryption: false,
        },
        entitlements: {
          "aps-environment": "production",
        },
      },
      android: {
        icon: "./assets/images/jf-picto-android.png",
        adaptiveIcon: {
          foregroundImage: "./assets/images/jf-picto-android.png",
          backgroundColor: "#2d2d2d",
        },
        edgeToEdgeEnabled: true,
        package: process.env.DEV_APP_ID ?? defaultAppId,
        permissions: [
          "android.permission.RECEIVE_BOOT_COMPLETED",
          "android.permission.VIBRATE",
          "android.permission.WAKE_LOCK",
        ],
        softwareKeyboardLayoutMode: "resize",
        useNextNotificationsApi: true,
        googleServicesFile: process.env.DEV_APP_ID
          ? "./google-services-dev.json"
          : "./google-services.json",
      },
      web: {
        bundler: "metro",
        output: "server",
        favicon: "./assets/images/favicon.png",
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            image: "./assets/images/jf-picto.png",
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#2d2d2d",
          },
        ],
        "expo-font",
        "expo-secure-store",
        "expo-web-browser",
        [
          "expo-video",
          {
            supportsBackgroundPlayback: true,
            supportsPictureInPicture: true,
          },
        ],
        [
          "expo-notifications",
          {
            icon: "./assets/images/notification-icon.png",
            color: "#2d2d2d",
            sounds: [],
            mode: "production",
          },
        ],
      ],
      experiments: {
        typedRoutes: true,
      },
      extra: {
        router: {},
        eas: {
          projectId: "6e9c5757-7446-4974-80fa-fadd2ad8ebc4",
        },
      },
      owner: "juicefast",
      runtimeVersion: "1.0.2",
      updates: {
        url: "https://u.expo.dev/6e9c5757-7446-4974-80fa-fadd2ad8ebc4",
      },
    },
  };
};
