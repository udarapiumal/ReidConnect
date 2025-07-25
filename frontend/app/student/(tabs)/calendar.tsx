import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EventData } from '@/components/EventCard';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const generateCalendarDays = () => {
  const days = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get first day of the month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Get number of days in the month
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Add empty days for beginning of month
  for (let i = 0; i < startingDay; i++) {
    days.push({ day: '', isCurrentMonth: false, hasEvent: false, isEmpty: true });
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i.toString(),
      isCurrentMonth: true,
      isToday: i === today.getDate(),
      hasEvent: [5, 12, 18, 22, 25].includes(i), // Mock events on these days
      isEmpty: false,
    });
  }

  // Add any remaining days to fill out the last week
  const remainingDays = 7 - (days.length % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      days.push({ day: '', isCurrentMonth: false, hasEvent: false, isEmpty: true });
    }
  }

  return days;
};

const calendarDays = generateCalendarDays();

const scheduledEvents: EventData[] = [
  {
    id: 1,
    clubId: 1,
    name: 'Team Building Workshop',
    description: 'A great team building workshop for everyone',
    date: 'July 5, 2025 • 10:00 AM - 2:00 PM',
    imagePath: 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 1,
    venueName: 'Conference Room A',
    createdAt: '2025-07-01',
    category: 'Work',
  },
  {
    id: 2,
    clubId: 2,
    name: 'Yoga in the Park',
    description: 'Relaxing yoga session in the park',
    date: 'July 5, 2025 • 8:00 AM - 9:00 AM',
    imagePath: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 2,
    venueName: 'Riverside Park',
    createdAt: '2025-07-01',
    category: 'Fitness',
  },
  {
    id: 3,
    clubId: 3,
    name: 'Dinner with Friends',
    description: 'Social dinner event with friends',
    date: 'July 5, 2025 • 7:00 PM',
    imagePath: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 3,
    venueName: 'Bistro on Main',
    createdAt: '2025-07-01',
    category: 'Social',
  },
];

type CalendarDayProps = {
  day: string;
  isCurrentMonth: boolean;
  isToday?: boolean;
  hasEvent: boolean;
  isEmpty: boolean;
  onPress?: () => void;
};

const CalendarDay = ({ day, isCurrentMonth, isToday, hasEvent, isEmpty, onPress }: CalendarDayProps) => {
  const tintColor = useThemeColor({}, 'tint');
  
  if (isEmpty) {
    return <View style={styles.emptyDay} />;
  }

  return (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        isToday && [styles.todayDay, { backgroundColor: tintColor }],
      ]}
      onPress={onPress}>
      <ThemedText style={[
        styles.dayText,
        !isCurrentMonth && styles.otherMonthDay,
        isToday && styles.todayText,
      ]}>
        {day}
      </ThemedText>
      {hasEvent && <View style={[styles.eventDot, { backgroundColor: tintColor }]} />}
    </TouchableOpacity>
  );
};

type EventListItemProps = {
  event: EventData;
  onPress?: () => void;
};

const EventListItem = ({ event, onPress }: EventListItemProps) => {
  const cardColor = useThemeColor({}, 'card');
  const iconColor = useThemeColor({}, 'icon');
  
  return (
    <TouchableOpacity style={[styles.eventItem, { backgroundColor: cardColor }]} onPress={onPress}>
      <View style={[styles.eventColor, { backgroundColor: getCategoryColor(event.category || 'Other') }]} />
      <View style={styles.eventDetails}>
        <ThemedText style={styles.eventTitle}>{event.name}</ThemedText>
        <ThemedText style={styles.eventTime}>{event.date}</ThemedText>
        <View style={styles.eventLocation}>
          <Feather name="map-pin" size={12} color={iconColor} />
          <ThemedText style={styles.eventLocationText}>{event.venueName}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Helper function to get a color based on event category
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Work': '#4285F4',
    'Social': '#EA4335',
    'Fitness': '#34A853',
    'Music': '#FBBC05',
    'Food': '#FF6D01',
    'Arts': '#8F44AD',
    'Technology': '#00ACC1',
  };

  return colors[category] || '#6200ee';
};

export default function CalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState('July 2025');
  
  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const renderCalendarDay = ({ item, index }: { item: CalendarDayProps; index: number }) => (
    <CalendarDay {...item} />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={styles.content}>
        {/* Month Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity style={styles.monthNavButton}>
            <Feather name="chevron-left" size={24} color={iconColor} />
          </TouchableOpacity>

          <ThemedText style={styles.monthTitle}>{selectedMonth}</ThemedText>

          <TouchableOpacity style={styles.monthNavButton}>
            <Feather name="chevron-right" size={24} color={iconColor} />
          </TouchableOpacity>
        </View>

        {/* Days of week */}
        <View style={styles.daysOfWeekContainer}>
          {daysOfWeek.map(day => (
            <ThemedText key={day} style={styles.dayOfWeekText}>{day}</ThemedText>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          <FlatList
            data={calendarDays}
            renderItem={renderCalendarDay}
            keyExtractor={(_, index) => index.toString()}
            numColumns={7}
            scrollEnabled={false}
          />
        </View>

        {/* Schedule */}
        <View style={styles.scheduleContainer}>
          <ThemedText style={styles.scheduleTitle}>Your Schedule</ThemedText>
          {scheduledEvents.map(event => (
            <EventListItem key={event.id} event={event} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthNavButton: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayOfWeekText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  calendarDay: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  emptyDay: {
    width: 36,
    height: 36,
    margin: 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  todayDay: {
    borderRadius: 18,
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 6,
  },
  scheduleContainer: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventColor: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
});
