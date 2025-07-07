import { Ionicons } from '@expo/vector-icons'; // or any icon pack you use
import { Tabs } from 'expo-router';
import { ClubProvider } from '../../context/ClubContext';


export default function ClubTabsLayout() {
  return (
    <ClubProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#151718',
            borderTopWidth: 0,
            paddingVertical: 6,
            height: 60,
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case 'dashboard':
                iconName = 'home';
                break;
              case 'calendar':
                iconName = 'calendar';
                break;
              case 'create':
                iconName = 'add-circle';
                break;
              case 'events':
                iconName = 'megaphone';
                break;
              case 'profile':
                iconName = 'person';
                break;
              default:
                iconName = 'ellipse';
            }

            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
        <Tabs.Screen name="create" options={{ title: 'Create' }} />
        <Tabs.Screen name="events" options={{ title: 'Events' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </ClubProvider>
  );
}
