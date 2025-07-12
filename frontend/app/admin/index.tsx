import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Timeline from '@/components/admin/Timeline';
import CalendarView from '@/components/admin/CalendarView';
import LecturesSection from '@/components/admin/LecturesSection';
import BookingsSection from '@/components/admin/BookingsSection';
import EventsSection from '@/components/admin/EventsSection';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.title}>Dashboard</ThemedText>
      
      <View style={styles.mainContent}>
        <View style={styles.leftSection}>
          <Timeline />
        </View>
        <View style={styles.rightSection}>
          <CalendarView />
        </View>
      </View>
      
      <View style={styles.sectionsRow}>
        <LecturesSection />
        <BookingsSection />
        <EventsSection />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  mainContent: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },
  leftSection: {
    flex: 3,
  },
  rightSection: {
    flex: 2,
  },
  sectionsRow: {
    flexDirection: 'row',
    gap: 20,
  },
});
