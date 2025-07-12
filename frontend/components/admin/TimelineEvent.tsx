import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';

type EventStatus = 'Pending' | 'Approved' | 'Rejected';

interface TimelineEventProps {
  time: string;
  title: string;
  location: string;
  status: EventStatus;
}

export default function TimelineEvent({ time, title, location, status }: TimelineEventProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'Pending': return '#FFC107';
      case 'Rejected': return '#F44336';
      default: return '#FFC107';
    }
  };

  const getEventColor = () => {
    if (title.includes('AI')) return '#FF9800';
    if (title.includes('Guest')) return '#2196F3';
    return '#9C27B0';
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.time}>{time}</ThemedText>
      <View style={[styles.eventIcon, { backgroundColor: getEventColor() }]}>
        <FontAwesome 
          name={title.includes('AI') ? 'desktop' : 'book'} 
          size={16} 
          color="#FFFFFF"
        />
      </View>
      <View style={styles.eventContent}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.location}>{location}</ThemedText>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <ThemedText style={styles.statusText}>{status}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 8,
  },
  time: {
    width: 50,
    color: '#CCC',
    fontSize: 14,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  location: {
    fontSize: 14,
    color: '#CCC',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
