import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function CalendarView() {
  const [selectedCourse, setSelectedCourse] = useState('All courses');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');
  
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // Generate dates for July 2025
  const generateCalendarDates = () => {
    const weeks = [
      [1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19, 20, 21]
    ];
    
    return weeks;
  };
  
  const hasEvent = (day: number) => {
    return [10, 15, 17].includes(day);
  };
  
  const isActive = (day: number) => {
    return [1, 4, 10, 15].includes(day);
  };
  
  const calendarWeeks = generateCalendarDates();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Calendar</ThemedText>
        <TouchableOpacity style={styles.newEventButton}>
          <ThemedText style={styles.newEventText}>New event</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.navigationHeader}>
        <View style={styles.monthNavigator}>
          <TouchableOpacity>
            <ThemedText style={styles.navigationLink}>← June</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.monthTitle}>July 2025</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.navigationLink}>August →</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filters}>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedCourse}
              onValueChange={(value) => setSelectedCourse(value)}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="All courses" value="All courses" />
              <Picker.Item label="CS Courses" value="CS Courses" />
              <Picker.Item label="Engineering" value="Engineering" />
            </Picker>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="All statuses" value="All statuses" />
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Approved" value="Approved" />
            </Picker>
          </View>
        </View>
      </View>
      
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {daysOfWeek.map(day => (
            <View key={day} style={styles.dayHeader}>
              <ThemedText style={styles.dayHeaderText}>{day}</ThemedText>
            </View>
          ))}
        </View>
        
        {calendarWeeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map(day => (
              <TouchableOpacity 
                key={day} 
                style={[
                  styles.day,
                  isActive(day) && styles.activeDay
                ]}
              >
                <ThemedText style={styles.dayText}>{day}</ThemedText>
                {hasEvent(day) && (
                  <View style={[
                    styles.eventDot,
                    day === 10 ? styles.pendingEventDot : styles.approvedEventDot
                  ]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  newEventButton: {
    backgroundColor: '#F86D70',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  newEventText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  navigationHeader: {
    marginBottom: 16,
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navigationLink: {
    color: '#64B5F6',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    height: 40,
  },
  calendar: {
    marginTop: 8,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  dayHeaderText: {
    color: '#CCC',
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDay: {
    backgroundColor: '#444',
    borderRadius: 20,
  },
  dayText: {
    color: '#FFFFFF',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 4,
  },
  pendingEventDot: {
    backgroundColor: '#FFC107',
  },
  approvedEventDot: {
    backgroundColor: '#4CAF50',
  },
});
