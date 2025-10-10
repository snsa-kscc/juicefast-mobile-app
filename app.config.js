// const IS_DEV = process.env.APP_VARIANT === "development";
// const IS_PREVIEW = process.env.APP_VARIANT === "preview";

// // Determine app variant
// const getAppName = () => {
//   if (IS_DEV) return "Juicefast (Dev)";
//   if (IS_PREVIEW) return "Juicefast (Preview)";
//   return "Juicefast Nutrition App";
// };

// const getBundleIdentifier = () => {
//   if (IS_DEV) return "com.juicefastapp.juicefastnutritionapp.dev";
//   if (IS_PREVIEW) return "com.juicefastapp.juicefastnutritionapp.preview";
//   return "com.juicefastapp.juicefastnutritionapp";
// };

// const getAndroidPackage = () => {
//   if (IS_DEV) return "com.juicefastapp.juicefastnutritionapp.dev";
//   if (IS_PREVIEW) return "com.juicefastapp.juicefastnutritionapp.preview";
//   return "com.juicefastapp.juicefastnutritionapp";
// };

export default {
  expo: {
    name: "Juicefast Nutrition App",
    slug: "juicefast-nutrition-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/jf-picto.png",
    scheme: "juicefast-nutrition-app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.juicefastapp.juicefastnutritionapp",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      entitlements: {
        "aps-environment": "production",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/jf-picto.png",
        backgroundColor: "#2d2d2d",
      },
      edgeToEdgeEnabled: true,
      package: "com.juicefastapp.juicefastnutritionapp",
      permissions: [
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.VIBRATE",
        "android.permission.WAKE_LOCK",
      ],
      softwareKeyboardLayoutMode: "resize",
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
      "expo-notifications",
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
    owner: "juicefast-app",
    runtimeVersion: "1.0.0",
    updates: {
      url: "https://u.expo.dev/6e9c5757-7446-4974-80fa-fadd2ad8ebc4",
    },
  },
};
