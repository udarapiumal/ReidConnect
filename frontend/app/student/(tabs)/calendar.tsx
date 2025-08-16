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
import axiosInstance from '@/app/api/axiosInstance';
import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const { width } = Dimensions.get('window');

type EventType = 'lecture' | 'university' | 'personal' | 'deadline';
type ViewMode = 'Week' | 'Month';

// Format a Date as local YYYY-MM-DD (avoid UTC shifts from toISOString)
const dateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

function toISO(d: Date) {
  return d.toISOString();
}

// Pretty labels/helpers
function titleCase(s?: string) {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/(^|[_\-\s])+([a-z])/g, (_, p1, p2) => (p1 ? ' ' : '') + p2.toUpperCase())
    .trim();
}

function formatAudience(years?: string[], faculties?: string[]) {
  const ys = (years ?? []).map((y) => y.replace(/^YEAR_?/, 'Y')).join(', ');
  const fs = (faculties ?? []).join('/');
  if (ys && fs) return `${ys} • ${fs}`;
  return ys || fs || '';
}

export type CalendarEvent = {
  id: number;
  clubId: number;
  name: string;
  description: string;
  venueId: number;
  venueName: string;
  date: string;        // YYYY-MM-DD (LocalDate from backend)
  imagePath: string;
  slotIds: number[];
  createdAt: string;   // LocalDateTime from backend
  targetYears: string[];  // Years enum from backend
  targetFaculties: string[];  // Faculties enum from backend
  category: string;    // EventCategory enum from backend
  startTime?: string;  // HH:mm (derived from slotIds)
  endTime?: string;    // HH:mm (derived from slotIds)
  type: EventType;     // mapped from category for frontend use
  title: string;       // mapped from name for frontend use
};


const startOfWeekMon = (d: Date) => {
  const x = new Date(d);
  const day = x.getDay();
  const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  x.setDate(diff);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfWeekSun = (d: Date) => {
  const start = startOfWeekMon(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

const startOfMonthGrid = (currentMonth: Date) => {
  const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  return startOfWeekMon(first);
};

const endOfMonthGrid = (currentMonth: Date) => {
  const last = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const end = endOfWeekSun(last);
  return end;
};

function getRange(viewMode: ViewMode, currentMonth: Date, selectedDate: Date) {
  if (viewMode === 'Week') {
    return { start: startOfWeekMon(selectedDate), end: endOfWeekSun(selectedDate) };
  }
  return { start: startOfMonthGrid(currentMonth), end: endOfMonthGrid(currentMonth) };
}


// Sample data structure as per specification
const sampleLectures = [
  {
    id: 1,
    day: 'Monday',
    courseCode: 'SENG 31223',
    courseName: 'Database Systems',
    courseType: 'LECTURE',
    group: 'GROUP_A',
    slotIds: [1, 2],
    lecturerCodes: 'LEC001',
    lecturerNames: 'Dr. Smith',
    venue: 'W001',
    degree: 'COMPUTER_SCIENCE',
    year: 'YEAR_3',
    credits: 3,
    startTime: '09:00',
    endTime: '10:30',
  },
  {
    id: 2,
    day: 'Tuesday',
    courseCode: 'SENG 31242',
    courseName: 'Software Architecture and Design',
    courseType: 'LAB',
    group: 'GROUP_B',
    slotIds: [3, 4],
    lecturerCodes: 'LEC002',
    lecturerNames: 'Prof. Johnson',
    venue: 'Lab 01',
    degree: 'SOFTWARE_ENGINEERING',
    year: 'YEAR_3',
    credits: 2,
    startTime: '11:00',
    endTime: '12:30',
  },
  {
    id: 3,
    day: 'Wednesday',
    courseCode: 'SENG 31213',
    courseName: 'Software Quality Assurance',
    courseType: 'LECTURE',
    group: 'GROUP_A',
    slotIds: [5],
    lecturerCodes: 'LEC003',
    lecturerNames: 'Dr. Wilson',
    venue: 'E401',
    degree: 'COMPUTER_SCIENCE',
    year: 'YEAR_3',
    credits: 3,
    startTime: '14:00',
    endTime: '15:30',
  },
];

// const sampleEvents = [
//   {
//     id: 1,
//     clubId: 101,
//     name: 'Assignment Submission',
//     description: 'Submit the assignment for SENG 31223.',
//     venueId: 201,
//     venueName: 'Online',
//     date: '2025-08-12',
//     imagePath: '/images/assignment.png',
//     slotIds: [10],
//     createdAt: '2025-08-01T10:00:00',
//     targetYears: ['YEAR_3'],
//     targetFaculties: ['FOC'],
//     category: 'DEADLINE',
//     startTime: '23:59',
//     endTime: '23:59',
//     type: 'deadline',
//   },
//   {
//     id: 2,
//     clubId: 102,
//     name: 'Study Group Meeting',
//     description: 'Group discussion for the upcoming exam.',
//     venueId: 202,
//     venueName: 'Library Discussion Room 3',
//     date: '2025-08-14',
//     imagePath: '/images/study-group.png',
//     slotIds: [11, 12],
//     createdAt: '2025-08-10T14:00:00',
//     targetYears: ['YEAR_2', 'YEAR_3'],
//     targetFaculties: ['FOC', 'FOE'],
//     category: 'PERSONAL',
//     startTime: '16:00',
//     endTime: '18:00',
//     type: 'personal',
//   },
//   {
//     id: 3,
//     clubId: 103,
//     name: 'Career Fair',
//     description: 'Annual career fair hosted by the university.',
//     venueId: 203,
//     venueName: 'Main Auditorium',
//     date: '2025-08-15',
//     imagePath: '/images/career-fair.png',
//     slotIds: [13, 14, 15, 16],
//     createdAt: '2025-07-20T09:00:00',
//     targetYears: ['YEAR_3', 'YEAR_4'],
//     targetFaculties: ['FOC', 'FOE', 'FOB'],
//     category: 'UNIVERSITY',
//     startTime: '10:00',
//     endTime: '17:00',
//     type: 'university',
//   },
// ];

//get the event
// const sampleEvents

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Week' | 'Month'>('Week');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarPermission, setCalendarPermission] = useState(false);
  const { eventsByDate, isLoading } = useCalendarEvents(viewMode, currentMonth, selectedDate);

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
    const dateStr = dateKey(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hasLecture = sampleLectures.some((lecture) => lecture.day === dayName);
    const hasRemote = (eventsByDate[dateStr]?.length ?? 0) > 0;
    return hasLecture || hasRemote;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = dateKey(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    const lectures = sampleLectures
      .filter((lecture) => lecture.day === dayName)
      .map((lecture) => ({
        ...lecture,
        type: 'lecture' as const,
        title: lecture.courseName,
        lecturer: lecture.lecturerNames,
        module: lecture.courseCode,
        startTime: lecture.startTime,
        endTime: lecture.endTime,
      }));

    const remote = eventsByDate[dateStr] ?? [];

    return [...lectures, ...remote].sort((a: any, b: any) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));
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
    if (isLoading) {
      return (
        <View style={styles.scheduleContainer}>
          <ThemedText style={styles.scheduleHeader}>Loading...</ThemedText>
        </View>
      );
    }
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
              const titleText = (event as any).title || (event as any).name || 'Untitled event';
              const timeText = event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : 'Time not set';
              const venueText = (event as any).venueName || (event as any).venue || '';
              const audienceText = formatAudience((event as any).targetYears, (event as any).targetFaculties);
              const categoryText = titleCase((event as any).category);

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
                    <View style={styles.eventHeaderRow}>
                      <ThemedText style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>
                        {titleText}
                      </ThemedText>
                      {!!categoryText && (
                        <View style={[styles.categoryChip, { borderColor: colors.text, backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                          <ThemedText style={[styles.categoryChipText, { color: colors.text }]} numberOfLines={1}>
                            {categoryText}
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    <ThemedText style={[styles.eventTime, { color: colors.text }]}>
                      {timeText}
                    </ThemedText>

                    {event.type === 'lecture' && 'module' in event && (
                      <ThemedText style={[styles.eventInfo, { color: colors.text }]} numberOfLines={1}>
                        {(event as any).module} • {(event as any).lecturer}
                      </ThemedText>
                    )}

                    {!!venueText && (
                      <View style={styles.eventMetaRow}>
                        <Ionicons name="location-outline" size={14} color={colors.text} style={styles.eventMetaIcon} />
                        <ThemedText style={[styles.eventMetaText, { color: colors.text }]} numberOfLines={1}>
                          {venueText}
                        </ThemedText>
                      </View>
                    )}

                    {!!audienceText && (
                      <View style={styles.eventMetaRow}>
                        <Ionicons name="people-outline" size={14} color={colors.text} style={styles.eventMetaIcon} />
                        <ThemedText style={[styles.eventMetaText, { color: colors.text }]} numberOfLines={1}>
                          {audienceText}
                        </ThemedText>
                      </View>
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
            {(['Week', 'Month'] as ViewMode[]).map((mode) => (
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


// Helper function to map backend category to frontend event type
function mapCategoryToEventType(category: string): EventType {
  const c = (category || '').toUpperCase();
  // Map backend categories to frontend types; default to 'university'
  if (c === 'DEADLINE' || c === 'ASSIGNMENT') return 'deadline';
  if (c === 'PERSONAL') return 'personal';
  // COMPETITION, WORKSHOP, SEMINAR, MEETUP, etc. -> treat as university events for now
  return 'university';
}

// --- Slot to time helpers ---
// Slots are 30-minute windows starting at 08:00.
// slotId=1 => 08:00-08:30, slotId=2 => 08:30-09:00, slotId=3 => 09:00-09:30, ...
const SLOT_BASE_MINUTES = 8 * 60; // 08:00 in minutes

function toHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function timesFromSlotIds(slotIds?: number[]): { startTime?: string; endTime?: string } {
  if (!Array.isArray(slotIds) || slotIds.length === 0) return {};
  // sanitize & sort
  const slots = slotIds
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n) && n >= 1)
    .sort((a, b) => a - b);
  if (slots.length === 0) return {};
  const first = slots[0];
  const last = slots[slots.length - 1];
  const startMinutes = SLOT_BASE_MINUTES + (first - 1) * 30;
  const endMinutes = SLOT_BASE_MINUTES + last * 30; // end is exclusive of the last slot start
  return { startTime: toHHMM(startMinutes), endTime: toHHMM(endMinutes) };
}

// Replace with your real API call
async function fetchEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
  try {
    // Backend expects date-only params without time: startDate/endDate in YYYY-MM-DD
    const startDate = dateKey(start);
    const endDate = dateKey(end);
    const res = await axiosInstance.get(`/api/events/date/range`, {
      params: { startDate, endDate },
    });
    
    if (res.status === 304) return [];
    
    // Map backend data to frontend CalendarEvent format
    return res.data.map((event: any) => {
      const type = mapCategoryToEventType(event.category);
      // Derive times from slotIds (30-minute slots starting at 08:00)
      const { startTime, endTime } = timesFromSlotIds(event.slotIds);
      return {
        ...event,
        type,
        title: event.name || 'Untitled event',
        startTime,
        endTime,
      } as CalendarEvent;
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export function useCalendarEvents(viewMode: ViewMode, currentMonth: Date, selectedDate: Date) {
  const queryClient = useQueryClient();
  const range = getRange(viewMode, currentMonth, selectedDate);

  // Use date-only keys to align with API and improve cache hits
  const queryKey = ['events', viewMode, dateKey(range.start), dateKey(range.end)];
  const query = useQuery({
    queryKey,
    queryFn: () => fetchEvents(range.start, range.end),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  // Prefetch adjacent windows
  const prefetch = (start: Date, end: Date) => {
    const key = ['events', viewMode, dateKey(start), dateKey(end)];
    queryClient.prefetchQuery({ queryKey: key, queryFn: () => fetchEvents(start, end) });
  };

  // compute neighbor ranges
  const neighbors = useMemo(() => {
    if (viewMode === 'Week') {
      const prevStart = new Date(range.start); prevStart.setDate(prevStart.getDate() - 7);
      const prevEnd = new Date(range.end); prevEnd.setDate(prevEnd.getDate() - 7);
      const nextStart = new Date(range.start); nextStart.setDate(nextStart.getDate() + 7);
      const nextEnd = new Date(range.end); nextEnd.setDate(nextEnd.getDate() + 7);
      return { prev: { start: prevStart, end: prevEnd }, next: { start: nextStart, end: nextEnd } };
    }
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return {
      prev: { start: startOfMonthGrid(prevMonth), end: endOfMonthGrid(prevMonth) },
      next: { start: startOfMonthGrid(nextMonth), end: endOfMonthGrid(nextMonth) },
    };
  }, [viewMode, range.start, range.end, currentMonth]);

  // kick off prefetch (side effect)
  useEffect(() => {
    prefetch(neighbors.prev.start, neighbors.prev.end);
    prefetch(neighbors.next.start, neighbors.next.end);
  }, [neighbors.prev.start, neighbors.prev.end, neighbors.next.start, neighbors.next.end]);

  // normalize by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    (query.data ?? []).forEach((e) => {
      const key = e.date;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    // sort by start time
    Object.values(map).forEach(list => list.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')));
    return map;
  }, [query.data]);

  return {
    eventsByDate,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
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
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    marginLeft: 8,
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventMetaIcon: {
    marginRight: 4,
  },
  eventMetaText: {
    fontSize: 11,
    opacity: 0.8,
    flexShrink: 1,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    padding: 16,
  },
});

