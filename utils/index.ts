export function generateAPIUrl(path: string): string {
  let baseURL = "https://juicefast-nutrition-app.expo.app";

  if (process.env.NODE_ENV === "development") {
    baseURL = `http://${process.env.EXPO_PUBLIC_DEV_IP}:8081`;
  }
  return `${baseURL}${path}`;
}
