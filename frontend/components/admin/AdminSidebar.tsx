import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';

type MenuItem = {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  path: string;
};

const menuItems: MenuItem[] = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
  { icon: 'calendar', label: 'Events', path: '/admin/events' },
  { icon: 'book', label: 'Lectures', path: '/admin/lectures' },
  { icon: 'bookmark', label: 'Bookings', path: '/admin/bookings' },
  { icon: 'file-text', label: 'Reports', path: '/admin/reports' },
  { icon: 'bell', label: 'Notifications', path: '/admin/notifications' },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.sidebar}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>ReidConnect</ThemedText>
        <ThemedText style={styles.subtitle}>AcademicAdmin</ThemedText>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              pathname === item.path && styles.activeMenuItem,
            ]}
            onPress={() => router.push(item.path)}
          >
            <FontAwesome 
              name={item.icon} 
              size={18} 
              color="#FFFFFF" 
              style={styles.icon} 
            />
            <ThemedText style={styles.menuText}>{item.label}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => router.push('/')}
      >
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
        <FontAwesome name="sign-out" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: '#2A2A2A',
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 30,
    paddingVertical: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#F86D70',
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 8,
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F86D70',
    padding: 12,
    borderRadius: 5,
    marginTop: 30,
  },
  logoutText: {
    color: '#FFFFFF',
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
