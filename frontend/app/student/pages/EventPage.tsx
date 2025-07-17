import { View, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EventData, EventCard } from '@/components/EventCard'; // Assuming EventData is exported
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
    going: 1,
    interested: 5,
    privacy: 'Public · Anyone on or off ReidConnect',
    description: `Exclusive First Look: All-New MG ZS Hybrid+\nGet an exclusive first look at the UK's best-selling MG ZS Hybrid+, now in Sri Lanka!\n\nJoin us for an intimate preview before the rest of the country gets to see it. Take a closer look, sit inside, and experience what's new.\nWhen: Thursday, 17th July 2025...`,
    host: {
      name: 'Rotaract Club of UOC',
      logo: require('@/assets/images/ucsc-logo.png'),
      pastEvents: 1,
      followers: '4.1K',
      description: 'Official page of Rotaract Club of University of Colombo'
    }
  },
  {
    id: '2',
    title: "ROTA අවුරුදු '25",
    category: 'Cultural',
    date: 'Apr 14, 2025',
    location: 'University of Colombo',
    image: require('@/assets/images/event2.png'),
    club: 'Rotaract Club of UOC',
    going: 122,
    interested: 500,
    privacy: 'Public · Anyone on or off ReidConnect',
    description: `Celebrate the Sinhala & Tamil New Year with us! ROTA අවුරුදු '25 brings you a day full of traditional games, music, and food. Don't miss out on the fun!`,
    host: {
      name: 'Rotaract Club of UOC',
      logo: require('@/assets/images/ucsc-logo.png'),
      pastEvents: 1,
      followers: '4.1K',
      description: 'Official page of Rotaract Club of University of Colombo'
    }
  },
  {
    id: '3',
    title: 'Food & Wine Festival',
    category: 'Food',
    date: 'Jul 22, 2025',
    location: 'Downtown Plaza',
    image: require('@/assets/images/event2.png'),
    club: 'Rotaract Club of UOC',
    going: 250,
    interested: 1200,
    privacy: 'Public · Anyone on or off ReidConnect',
    description: `A paradise for foodies! Explore a variety of cuisines from top chefs and enjoy a selection of the finest wines. A perfect weekend outing.`,
    host: {
      name: 'Rotaract Club of UOC',
      logo: require('@/assets/images/ucsc-logo.png'),
      pastEvents: 1,
      followers: '4.1K',
      description: 'Official page of Rotaract Club of University of Colombo'
    }
  },
];


export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState<EventData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];

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

  const InfoRow = ({ icon, text }: { icon: any; text: string }) => (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={24} color={colors.icon} />
      <ThemedText style={[styles.infoText, { color: colors.text }]}>{text}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: event.title, 
          headerTintColor: colors.text, 
          headerStyle: { backgroundColor: colors.background } 
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Banner */}
        <View style={styles.bannerContainer}>
          {event.image && (
            <Image 
              source={typeof event.image === 'string' ? { uri: event.image } : event.image as any}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Event Header */}
        <View style={styles.headerContainer}>
          <ThemedText style={styles.eventTime}>{event.date}</ThemedText>
          <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
          <ThemedText style={styles.eventHost}>Public · Event by {event.club}</ThemedText>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]}>
            <Ionicons name="star" size={20} color={colors.buttonText} />
            <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>Interested</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondaryButton }]}>
            <Ionicons name="checkmark" size={20} color={colors.secondaryButtonText} />
            <ThemedText style={[styles.buttonText, { color: colors.secondaryButtonText }]}>Going</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.moreOptionsButton, { backgroundColor: colors.secondaryButton }]}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.secondaryButtonText} />
          </TouchableOpacity>
        </View>

        {/* Event Info Section */}
        <View style={[styles.eventInfoSection, { borderTopColor: colors.border }]}>
          <InfoRow icon="location-outline" text={event.location} />
          <InfoRow icon="checkmark-circle-outline" text={`${event.going} going · ${event.interested} interested`} />
          <InfoRow icon="globe-outline" text={event.privacy} />
        </View>

        {/* Navigation Tabs */}
        <View style={[styles.navTabsContainer, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.navTab, styles.activeTab, { backgroundColor: colors.secondaryButton }]}>
            <ThemedText style={[styles.navTabText, { color: colors.secondaryButtonText }]}>About</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <ThemedText style={[styles.navTabText, { color: colors.icon }]}>Posts</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={[styles.detailsSection, { borderTopColor: colors.border }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>What to expect</ThemedText>
          <ThemedText style={[styles.detailsBody, { color: colors.text }]} numberOfLines={isExpanded ? undefined : 5}>
            {event.description}
          </ThemedText>
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <ThemedText style={[styles.seeMore, { color: colors.text }]}>{isExpanded ? 'see less' : 'see more'}</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Host Section */}
        <View style={[styles.hostSection, { borderTopColor: colors.border }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Meet your host</ThemedText>
          <View style={[styles.hostProfile, { backgroundColor: colors.card }]}>
            <Image source={event.host.logo} style={styles.hostLogo} />
            <ThemedText style={[styles.hostName, { color: colors.text }]}>{event.host.name}</ThemedText>
            <ThemedText style={[styles.hostStats, { color: colors.icon }]}>{`${event.host.pastEvents} past event · ${event.host.followers} followers`}</ThemedText>
            <ThemedText style={[styles.hostDescription, { color: colors.text }]}>{event.host.description}</ThemedText>
            <TouchableOpacity style={[styles.followButton, { backgroundColor: colors.secondaryButton }]}>
              <Ionicons name="add" size={20} color={colors.secondaryButtonText} />
              <ThemedText style={[styles.buttonText, { color: colors.secondaryButtonText }]}>Follow</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <View style={[styles.relatedSection, { borderTopColor: colors.border }]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, {color: colors.text}]}>
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

        {/* Recent posts Section */}
        <View style={[styles.relatedSection, { borderTopColor: colors.border }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, {color: colors.text}]}>
            Recent Posts
          </ThemedText>
          {/* Placeholder for recent posts */}
          <ThemedText style={{ color: colors.text }}>No recent posts available.</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  headerContainer: {
    padding: 16,
    marginTop: -40,
    position: 'relative',
    zIndex: 1,
    gap: 8,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  eventHost: {
    fontSize: 14,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  interestedButton: {
    // backgroundColor set dynamically
  },
  goingButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  moreOptionsButton: {
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfoSection: {
    paddingHorizontal: 16,
    gap: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    fontSize: 15,
  },
  navTabsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    marginTop: 16,
  },
  navTab: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    // backgroundColor set dynamically
  },
  navTabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailsSection: {
    padding: 16,
    borderTopWidth: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  detailsBody: {
    fontSize: 15,
    lineHeight: 21,
  },
  seeMore: {
    fontSize: 15,
    marginTop: 12,
  },
  hostSection: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  hostProfile: {
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
  },
  hostLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  hostName: {
    fontSize: 17,
    fontWeight: '600',
  },
  hostStats: {
    fontSize: 13,
  },
  hostDescription: {
    fontSize: 15,
    textAlign: 'center',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    marginTop: 12,
  },
  relatedSection: {
    marginTop: 30,
    padding: 16,
    paddingTop: 20,
    borderTopWidth: 8,
  },
});