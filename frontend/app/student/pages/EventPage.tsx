import { View, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EventData, EventCard } from '@/components/EventCard'; // Assuming EventData is exported

// This is a placeholder for your actual data fetching logic from your database
const Events: EventData[] = [
  {
    id: '1',
    title: 'Mind Matters - Phase 2',
    category: 'Wellness',
    date: 'Today, 10:30 AM',
    location: 'Google Meet',
    image: require('@/assets/images/event1.png'),
    club: 'Rotaract Club of UOC',
  },
  {
    id: '2',
    title: "ROTA අවුරුදු '25",
    category: 'Cultural',
    date: 'Apr 14, 2025',
    location: 'University of Colombo',
    image: require('@/assets/images/event2.png'),
    club: 'Rotaract Club of UOC',
  },
  {
    id: '3',
    title: 'Food & Wine Festival',
    category: 'Food',
    date: 'Jul 22, 2025',
    location: 'Downtown Plaza',
    image: require('@/assets/images/event2.png'),
    club: 'Rotaract Club of UOC',
  },
];


export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState<EventData[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Combine all event arrays to search for the event
    const allEvents = [...Events];
    
    // Find the event by ID
    const foundEvent = allEvents.find(e => e.id === id);
    
    if (foundEvent) {
      setEvent(foundEvent);
      
      // Get related events (same category, excluding current event)
      const related = allEvents.filter(e => 
        e.id !== id && 
        (e.category === foundEvent.category || e.club === foundEvent.club)
      ).slice(0, 3);
      
      setRelatedEvents(related);
    }
    
    setLoading(false);
  }, [id]);

  const handleRelatedEventPress = (eventId: string) => {
    router.push(`/student/pages/EventPage?id=${eventId}`);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!event) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Event not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: event.title }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        {event.image && (
          <Image 
            source={typeof event.image === 'string' ? { uri: event.image } : event.image as any}
            style={styles.eventImage}
            resizeMode="cover"
          />
        )}
        
        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <ThemedText type="title" style={styles.title}>{event.title}</ThemedText>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Category:</ThemedText>
            <ThemedText style={styles.value}>{event.category}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Date:</ThemedText>
            <ThemedText style={styles.value}>{event.date}</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Location:</ThemedText>
            <ThemedText style={styles.value}>{event.location}</ThemedText>
          </View>
          
          {event.club && (
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Club:</ThemedText>
              <ThemedText style={styles.value}>{event.club}</ThemedText>
            </View>
          )}
        </View>
        
        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <View style={styles.relatedSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Related Events
            </ThemedText>
            {relatedEvents.map((relatedEvent) => (
              <EventCard
                key={relatedEvent.id}
                event={relatedEvent}
                size="small"
                onPress={() => handleRelatedEventPress(relatedEvent.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    marginTop: 8,
    fontSize: 16,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 80,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  relatedSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});