import { Stack } from 'expo-router';
import { ClubProvider } from '../context/ClubContext';

export default function ClubLayout() {
  return (
    <ClubProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ClubProvider>
  );
}
