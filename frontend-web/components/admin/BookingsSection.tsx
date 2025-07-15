import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';

export default function BookingsSection() {
  const bookings = [
    { room: 'Room 101: AI Seminar', time: '(10:00 AM)' },
    { room: 'Room 202: Guest Lecture', time: '(2:00 PM)' },
    { room: 'Room 303: Data Structures', time: '(11:00 AM)' },
    { room: 'Room 404: Algorithms', time: '(3:00 PM)' },
    { room: 'Room 505: Web Development', time: '(1:00 PM)' }
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <TouchableOpacity style={styles.manageButton}>
          <Text style={styles.manageButtonText}>Manage</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.bookingsList}>
        {bookings.map((booking, index) => (
          <View key={index} style={styles.bookingItem}>
            <Text style={styles.roomText}>• {booking.room}</Text>
            <Text style={styles.timeText}>{booking.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  manageButton: {
    backgroundColor: '#F86D70',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bookingsList: {
    gap: 8,
  },
  bookingItem: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  roomText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  timeText: {
    color: '#AAAAAA',
    fontSize: 14,
    marginLeft: 15,
  },
});
