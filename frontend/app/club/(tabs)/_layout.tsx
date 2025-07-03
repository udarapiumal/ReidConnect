// app/club/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { ClubProvider } from '../../context/ClubContext';

export default function ClubTabsLayout() {
  return (
    <ClubProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0f0f0f' },
          tabBarActiveTintColor: '#fff',
        }}
      >
        <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="analytics" options={{ title: 'Analytics' }} />
        <Tabs.Screen name="community" options={{ title: 'Community' }} />
        <Tabs.Screen name="content" options={{ title: 'Content' }} />
        <Tabs.Screen name="earn" options={{ title: 'Earn' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </ClubProvider>
  );
}
