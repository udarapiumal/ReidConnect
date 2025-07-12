import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout() {
  return (
    <View style={styles.container}>
      <AdminSidebar />
      <View style={styles.content}>
        <AdminHeader />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
  },
  content: {
    flex: 1,
  },
});
