import { Platform } from 'react-native';

export function formatWildfireError(err: unknown): string {
  if (err instanceof Error) {
    if (isLikelyCorsOrNetworkError(err)) {
      if (Platform.OS === 'web') {
        return 'Network request blocked in web preview (browser CORS). Test this tool on Android — it works there. Expo web cannot call LANDFIRE, geocoding, and some weather APIs from localhost.';
      }
      return 'Network request failed. Check your connection and try again.';
    }
    return err.message;
  }

  return 'Something went wrong. Please try again.';
}

function isLikelyCorsOrNetworkError(err: Error) {
  const message = err.message.toLowerCase();
  return (
    message.includes('failed to fetch') ||
    message.includes('network request failed') ||
    message.includes('load failed') ||
    err.name === 'TypeError'
  );
}
