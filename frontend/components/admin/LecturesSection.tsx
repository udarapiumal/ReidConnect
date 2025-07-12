import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function LecturesSection() {
  const lectures = [
    { course: 'Data Structures', time: '10:00 AM' },
    { course: 'Algorithms', time: '2:00 PM' },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Lectures</ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tableHeader}>
        <ThemedText style={[styles.tableHeaderText, { flex: 2 }]}>Course</ThemedText>
        <ThemedText style={[styles.tableHeaderText, { flex: 1 }]}>Time</ThemedText>
      </View>
      
      {lectures.map((lecture, index) => (
        <View key={index} style={styles.tableRow}>
          <ThemedText style={[styles.tableCell, { flex: 2 }]}>{lecture.course}</ThemedText>
          <ThemedText style={[styles.tableCell, { flex: 1 }]}>{lecture.time}</ThemedText>
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tableCell: {
    color: '#FFFFFF',
  },
});
