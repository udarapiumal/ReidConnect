import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native';
import TimelineEvent from './TimelineEvent';

export default function Timeline() {
  const [filter, setFilter] = useState('Next 7 days');
  const [sortBy, setSortBy] = useState('Sort by dates');
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
        <View style={styles.filters}>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={filter}
              onValueChange={(value) => setFilter(value)}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Next 7 days" value="Next 7 days" />
              <Picker.Item label="Today" value="Today" />
              <Picker.Item label="This month" value="This month" />
            </Picker>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={sortBy}
              onValueChange={(value) => setSortBy(value)}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Sort by dates" value="Sort by dates" />
              <Picker.Item label="Sort by name" value="Sort by name" />
              <Picker.Item label="Sort by status" value="Sort by status" />
            </Picker>
          </View>
        </View>
      </View>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search by activity type or name"
        placeholderTextColor="#999"
      />
      
      <View style={styles.eventsContainer}>
        <View style={styles.dayGroup}>
          <Text style={styles.dayHeader}>Thu, 10 July</Text>
          <TimelineEvent 
            time="10:00" 
            title="AI Seminar" 
            location="Room 101 • CS Dept" 
            status="Pending"
          />
        </View>
        
        <View style={styles.dayGroup}>
          <Text style={styles.dayHeader}>Tue, 15 July</Text>
          <TimelineEvent 
            time="14:00" 
            title="Guest Lecture" 
            location="Room 202 • Engineering" 
            status="Approved"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    width: 120,
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    height: 40,
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 10,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  eventsContainer: {
    gap: 16,
  },
  dayGroup: {
    gap: 8,
  },
  dayHeader: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 4,
  },
});
