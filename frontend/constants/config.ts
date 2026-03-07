import Constants from "expo-constants";

const getLocalIp = () => {
  const linkingUri = Constants.linkingUri;
  if (linkingUri) {
    const match = linkingUri.match(/:\/\/([^:]+):/);
    if (match) {
      return match[1];
    }
  }
  return "127.0.0.1";
};

// In development, use the local machine's IP (auto-detected from Expo).
// In production builds, use the hosted backend URL.
const PRODUCTION_URL = "https://YOUR_PRODUCTION_URL_HERE";

export const BASE_URL = __DEV__
  ? `http://${getLocalIp()}:8080`
  : PRODUCTION_URL;
