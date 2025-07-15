import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export function AdminHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="bell" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.userButton}>
          <FontAwesome name="user-circle" size={20} color="#FFFFFF" />
          <Text style={styles.userName}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1E1E1E',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 16,
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  userName: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
