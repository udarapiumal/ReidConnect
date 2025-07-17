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

const LOCAL_IP = getLocalIp();

export const BASE_URL = `http://${LOCAL_IP}:8080`;
