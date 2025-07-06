import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} /> }} />
            <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarIcon: ({ color, size }) => <FontAwesome name="calendar" size={size} color={color} /> }} />
            <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ color, size }) => <FontAwesome name="users" size={size} color={color} /> }} />
            <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color, size }) => <FontAwesome name="compass" size={size} color={color} /> }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} /> }} />
        </Tabs>
    );
}