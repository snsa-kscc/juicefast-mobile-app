export function generateAPIUrl(path: string): string {
  // In development, you might want to use a local server
  // In production, this would be your actual API URL
  const baseURL = __DEV__
    ? 'https://juicefast-nutrition-app--stt4l7lbec.expo.app'
    : 'https://juicefast-nutrition-app.expo.app';

  return `${baseURL}${path}`;
}