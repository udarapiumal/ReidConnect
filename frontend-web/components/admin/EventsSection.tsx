import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';

export default function EventsSection() {
  const events = [
    { event: 'AI Seminar', date: '2025-07-10', status: 'Pending' },
    { event: 'Guest Lecture', date: '2025-07-15', status: 'Approved' },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'Pending': return '#FFC107';
      default: return '#F44336';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Event</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
      </View>
      
      {events.map((event, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{event.event}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{event.date}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(event.status) }
          ]}>
            <Text style={styles.statusText}>{event.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 16,
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
  addButton: {
    backgroundColor: '#F86D70',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    color: '#AAAAAA',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tableCell: {
    color: '#FFFFFF',
  },
  statusBadge: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    width: 'auto',
    maxWidth: 80,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
