import Constants from "expo-constants";

export function generateAPIUrl(path: string): string {
  let baseURL = "https://juicefast-nutrition-app.expo.app";

  if (process.env.NODE_ENV === "development") {
    const hostUri = Constants.expoConfig?.hostUri;
    const isTunnel = hostUri?.includes(".exp.direct") || hostUri?.includes("ngrok");

    baseURL = isTunnel ? `https://${hostUri}` : `http://${hostUri}:8081`;
  }
  return `${baseURL}${path}`;
}
