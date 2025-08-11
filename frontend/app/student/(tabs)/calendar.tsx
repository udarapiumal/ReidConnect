import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

type EventType = 'lecture' | 'university' | 'personal' | 'deadline';

// Sample data structure as per specification
const sampleLectures = [
  {
    id: 1,
    title: 'Mathematics',
    module: 'MATH101',
    lecturer: 'Dr. Smith',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '10:30',
  },
  {
    id: 2,
    title: 'Physics',
    module: 'PHY201',
    lecturer: 'Prof. Johnson',
    dayOfWeek: 2, // Tuesday
    startTime: '11:00',
    endTime: '12:30',
  },
  {
    id: 3,
    title: 'Computer Science',
    module: 'CS301',
    lecturer: 'Dr. Wilson',
    dayOfWeek: 3, // Wednesday
    startTime: '14:00',
    endTime: '15:30',
  },
];

const sampleEvents = [
  {
    id: 1,
    title: 'Assignment Submission',
    date: '2025-08-12',
    startTime: '23:59',
    endTime: '23:59',
    type: 'deadline',
  },
  {
    id: 2,
    title: 'Study Group Meeting',
    date: '2025-08-14',
    startTime: '16:00',
    endTime: '18:00',
    type: 'personal',
  },
  {
    id: 3,
    title: 'Career Fair',
    date: '2025-08-15',
    startTime: '10:00',
    endTime: '17:00',
    type: 'university',
  },
];

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('Week');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarPermission, setCalendarPermission] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const secondaryTextColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'text');

  useEffect(() => {
    requestCalendarPermission();
  }, []);

  const requestCalendarPermission = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setCalendarPermission(status === 'granted');
    } catch (error) {
      console.log('Calendar permission error:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };
  
  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (7 * direction));
    setSelectedDate(newDate);
    setCurrentMonth(newDate); // Also update the month in the header
  };

  const getWeekDays = (dateRef = selectedDate) => {
    const startOfWeek = new Date(dateRef);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    const startDayOfWeek = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1));
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const hasEvents = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    
    const hasLecture = sampleLectures.some(lecture => lecture.dayOfWeek === dayOfWeek);
    const hasEvent = sampleEvents.some(event => event.date === dateStr);
    
    return hasLecture || hasEvent;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    
    const lectures = sampleLectures
      .filter(lecture => lecture.dayOfWeek === dayOfWeek)
      .map(lecture => ({ ...lecture, type: 'lecture' }));
    
    const events = sampleEvents.filter(event => event.date === dateStr);
    
    return [...lectures, ...events].sort((a, b) => {
      const timeA = a.startTime || '00:00';
      const timeB = b.startTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'lecture': return 'book-outline';
      case 'university': return 'briefcase-outline';
      case 'personal': return 'star-outline';
      case 'deadline': return 'calendar-outline';
      default: return 'calendar-outline';
    }
  };

  const getEventColors = (type: EventType) => {
    switch (type) {
      case 'lecture':
        return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
      case 'university':
        return { bg: '#e9d5ff', text: '#7c3aed', border: '#c4b5fd' };
      case 'personal':
        return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
      case 'deadline':
        return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' };
      default:
        return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <View style={[styles.weekContainer, { backgroundColor: cardColor }]}>
        {weekDays.map((date, index) => {
          const isSelected = isSelectedDate(date);
          const isTodayDate = isToday(date);
          const hasEventsForDay = hasEvents(date);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCard,
                { backgroundColor: backgroundColor, borderColor: borderColor },
                isSelected && [styles.selectedDayCard, { backgroundColor: primaryColor, shadowColor: primaryColor }],
                isTodayDate && !isSelected && [styles.todayDayCard, { borderColor: primaryColor }],
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <ThemedText style={[styles.dayName, isSelected && styles.selectedText]}>
                {dayNames[index]}
              </ThemedText>
              <ThemedText style={[styles.dayNumber, isSelected && styles.selectedText]}>
                {date.getDate()}
              </ThemedText>
              {hasEventsForDay && (
                <View style={[
                  styles.eventIndicator,
                  { backgroundColor: isSelected ? 'white' : primaryColor }
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderMonthView = () => {
    const monthDays = getMonthDays();
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return (
      <View style={[styles.monthContainer, { backgroundColor: cardColor }]}>
        <View style={styles.monthHeader}>
          {dayNames.map((day, index) => (
            <ThemedText key={index} style={styles.monthHeaderDay}>{day}</ThemedText>
          ))}
        </View>
        <View style={styles.monthGrid}>
          {monthDays.map((date, index) => {
            const isSelected = isSelectedDate(date);
            const isTodayDate = isToday(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const hasEventsForDay = hasEvents(date);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthDayCell,
                  { borderColor: borderColor },
                  isSelected && [styles.selectedMonthDay, { backgroundColor: primaryColor }],
                  isTodayDate && !isSelected && [styles.todayMonthDay, { borderColor: primaryColor }],
                  !isCurrentMonthDay && [styles.otherMonthDay, { backgroundColor: backgroundColor }],
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <ThemedText style={[
                  styles.monthDayNumber,
                  isSelected && styles.selectedText,
                  !isCurrentMonthDay && styles.otherMonthText,
                ]}>
                  {date.getDate()}
                </ThemedText>
                {hasEventsForDay && isCurrentMonthDay && (
                  <View style={[
                    styles.monthEventIndicator,
                    { backgroundColor: isSelected ? 'white' : primaryColor }
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderSchedule = () => {
    const events = getEventsForDate(selectedDate);
    
    return (
      <View style={[styles.scheduleContainer, { backgroundColor: backgroundColor }]}>
        <ThemedText style={styles.scheduleHeader}>
          Schedule for {formatSelectedDate(selectedDate)}
        </ThemedText>
        
        {events.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={48} color={secondaryTextColor} />
            <ThemedText style={styles.noEventsText}>No schedules for today.</ThemedText>
            <ThemedText style={styles.noEventsSubtext}>Enjoy your free time!</ThemedText>
          </View>
        ) : (
          <ScrollView style={styles.eventsContainer}>
            {events.map((event, index) => {
              const colors = getEventColors(event.type as EventType);
              
              return (
                <View
                  key={index}
                  style={[
                    styles.eventCard,
                    { backgroundColor: colors.bg, borderLeftColor: colors.border }
                  ]}
                >
                  <Ionicons
                    name={getEventIcon(event.type as EventType)}
                    size={20}
                    color={colors.text}
                    style={styles.eventIcon}
                  />
                  <View style={styles.eventDetails}>
                    <ThemedText style={[styles.eventTitle, { color: colors.text }]}>
                      {event.title}
                    </ThemedText>
                    <ThemedText style={[styles.eventTime, { color: colors.text }]}>
                      {event.startTime} - {event.endTime}
                    </ThemedText>
                    {event.type === 'lecture' && 'module' in event && (
                      <ThemedText style={[styles.eventInfo, { color: colors.text }]}>
                        {event.module} - {event.lecturer}
                      </ThemedText>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor }]} edges={['top']}>
      <View style={[styles.appContainer, { backgroundColor: cardColor, shadowColor: textColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardColor, shadowColor: textColor }]}>
          <View style={styles.navigationControls}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => viewMode === 'Week' ? navigateWeek(-1) : navigateMonth(-1)}
            >
              <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>
            
            <ThemedText style={styles.monthTitle}>
              {formatDate(currentMonth)}
            </ThemedText>
            
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => viewMode === 'Week' ? navigateWeek(1) : navigateMonth(1)}
            >
              <Ionicons name="chevron-forward" size={24} color={textColor} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.viewToggle, { backgroundColor: backgroundColor }]}>
            {['Week', 'Month'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.viewButton,
                  viewMode === mode && [styles.activeViewButton, { backgroundColor: primaryColor, shadowColor: primaryColor }]
                ]}
                onPress={() => setViewMode(mode)}
              >
                <ThemedText style={[
                  styles.viewButtonText,
                  viewMode === mode && styles.activeViewButtonText
                ]}>
                  {mode}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Calendar View */}
        {viewMode === 'Week' ? renderWeekView() : renderMonthView()}
        
        {/* Schedule Section */}
        {renderSchedule()}
        
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  monthTitle: {
    fontSize: width < 380 ? 18 : 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  viewToggle: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 8,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeViewButton: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeViewButtonText: {
    color: 'white',
  },
  weekContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  dayCard: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedDayCard: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  todayDayCard: {
    borderWidth: 2,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedText: {
    color: 'white',
  },
  eventIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  monthContainer: {
    padding: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  monthHeaderDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthDayCell: {
    width: `${100/7}%`,
    height: 60,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  selectedMonthDay: {
  },
  todayMonthDay: {
    borderWidth: 2,
  },
  otherMonthDay: {
  },
  monthDayNumber: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
  otherMonthText: {
    color: '#9ca3af',
  },
  monthEventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 'auto',
  },
  scheduleContainer: {
    padding: 16,
    flex: 1,
  },
  scheduleHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  noEventsText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  noEventsSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  eventsContainer: {
    flex: 1,
  },
  eventCard: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eventIcon: {
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  eventInfo: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 4,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    padding: 16,
  },
});

