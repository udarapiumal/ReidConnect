import { Alert } from 'react-native';
import { router } from 'expo-router';

export const handleLogout = async () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    // Optionally, clear cookies or tokens here
    router.replace('/Login');
  } catch (err) {
    Alert.alert('Logout Failed', 'An error occurred while logging out.');
  }
};
