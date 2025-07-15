import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  return (
    <View style={styles.container}>
      <AdminSidebar />
      <View style={styles.content}>
        <AdminHeader />
        <View style={styles.mainContent}>
          {children}
        </View>
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
  mainContent: {
    flex: 1,
  }
});
