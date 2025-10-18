
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EventCard, EventData } from '@/components/EventCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axiosInstance from '../../api/axiosInstance';
import { BASE_URL } from '@/constants/config';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function CategoryEventPage() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!category) return;
      setLoading(true);
      try {
        console.log(category.toUpperCase());

        const response = await axiosInstance.get(`${BASE_URL}/api/events/category?category=${category.toUpperCase()}`);
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events by category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category]);

  const handleEventPress = (eventId: number) => {
    router.push(`/student/pages/EventPage?id=${eventId}`);
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <Stack.Screen options={{ title: category, headerTintColor: textColor, headerStyle: { backgroundColor: backgroundColor } }} />
      <ThemedView style={[styles.container, { backgroundColor }]}>
        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                size="large"
                onPress={() => handleEventPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <ThemedView style={[styles.container, styles.centered]}>
            <ThemedText>No events found for this category.</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
