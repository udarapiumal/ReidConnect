// page structure
// featured events
// your next event
// upcoming events this week
// community feed
// for you
//

import { Platform, StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';

import { EventCard, EventData } from '@/components/EventCard';
import { PostCard, PostData } from '@/components/PostCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';

// API function to fetch events
const getAllEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/events`);
    console.log('Events:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Mock data for fallback
// const fallbackEvents: EventData[] = [
//   {
//     id: '1',
//     title: 'Mind Matters - Phase 2',
//     category: 'Wellness',
//     date: 'Today, 10:30 AM',
//     location: 'Google Meet',
//     image: require('@/assets/images/event1.png'),
//     club: 'Rotaract Club of UOC',
//   },
//   {
//     id: '2',
//     title: "ROTA අවුරුදු '25",
//     category: 'Cultural',
//     date: 'Apr 14, 2025',
//     location: 'University of Colombo',
//     image: require('@/assets/images/event2.png'),
//     club: 'Rotaract Club of UOC',
//   },
//   {
//     id: '3',
//     title: 'Food & Wine Festival',
//     category: 'Food',
//     date: 'Jul 22, 2025',
//     location: 'Downtown Plaza',
//     image: require('@/assets/images/event2.png'),
//     club: 'Rotaract Club of UOC',
//   },
// ];

const communityPosts: PostData[] = [
  {
    id: '1',
    club: 'Gavel Club of University of Colombo',
    avatar: require('@/assets/images/event1.png'),
    time: '1 day ago',
    text: 'New blog post out now! "Why you should live away from home at least once in your life".',
    image: require('@/assets/images/event2.png'),
    likes: 52,
    comments: 11,
  },
  {
    id: '2',
    club: 'Hiking Adventures',
    avatar: require('@/assets/images/event2.png'),
    time: '3 days ago',
    text: 'Beautiful day on the trail yesterday! Thanks to everyone who joined our mountain expedition.',
    image: require('@/assets/images/event1.png'),
    likes: 67,
    comments: 15,
  },
];

export default function HomePage() {
  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const router = useRouter();

  // State for events
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [nextEvents, setNextEvents] = useState<EventData[]>([]);
  const [popularEvents, setPopularEvents] = useState<EventData[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getAllEvents();
        
        // Categorize events based on different criteria
        
        // Featured Events - events with high engagement or marked as featured
        const featured = eventsData
          .filter((event: any) => event.featured || (event.going + event.interested) > 50)
          .slice(0, 3);
        
        // Your Next Event - events user is going to or interested in
        const next = eventsData
          .filter((event: any) => event.statusOfUser === 'going' || event.statusOfUser === 'interested')
          .slice(0, 5);
        
        // Upcoming Events - events happening soon (sorted by date)
        const upcoming = eventsData
          .filter((event: any) => {
            const eventDate = new Date(event.date);
            const now = new Date();
            return eventDate > now;
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);
        
        // Popular Events - events with high engagement
        const popular = eventsData
          .sort((a: any, b: any) => (b.going + b.interested) - (a.going + a.interested))
          .slice(0, 5);
        
        // Nearby Events - events in specific locations or categories
        const nearby = eventsData
          .filter((event: any) => 
            event.location?.toLowerCase().includes('university') ||
            event.location?.toLowerCase().includes('colombo') ||
            event.location?.toLowerCase().includes('campus')
          )
          .slice(0, 5);
        
        // Set state with categorized events, fallback to all events if categories are empty
        setFeaturedEvents(featured.length > 0 ? featured : eventsData.slice(0, 3));
        setNextEvents(next.length > 0 ? next : eventsData.slice(0, 3));
        setUpcomingEvents(upcoming.length > 0 ? upcoming : eventsData.slice(0, 5));
        setPopularEvents(popular.length > 0 ? popular : eventsData.slice(0, 5));
        setNearbyEvents(nearby.length > 0 ? nearby : eventsData.slice(0, 5));
        
      } catch (error) {
        console.error('Failed to fetch events, using fallback data:', error);
        // Use fallback data if API fails
        setFeaturedEvents(fallbackEvents);
        setNextEvents(fallbackEvents);
        setUpcomingEvents(fallbackEvents);
        setPopularEvents(fallbackEvents);
        setNearbyEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventPress = (eventId: string) => {
    router.push(`/student/pages/EventPage?id=${eventId}`);
  };

  // const handlePostPress = (postId: string) => {
  //   router.push(`/student/pages/PostPage?id=${postId}`);
  // };

  const handleCommunitySeeMorePress = () => {
    router.push(`/student/community`);
  };

  // Show loading spinner while fetching events
  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading events...</ThemedText>
      </ThemedView>
    );
  }

  return (
      <ThemedView style={styles.container}>
        <ScrollView
            showsVerticalScrollIndicator={false}>
         <SafeAreaView edges={['top']}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="title" style={styles.logo}>ReidConnect</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.welcomeText}>Good afternoon, Shenal 👋</ThemedText>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="search" size={24} color={iconColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="bell" size={24} color={iconColor} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Events */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Featured Events</ThemedText>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredEventsContainer}>
              {featuredEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      size="large" 
                      onPress={() => handleEventPress(event.id)}
                    />
              ))}
            </ScrollView>
          </View>

          {/* Your Next Event */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Your Next Event</ThemedText>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredEventsContainer}>
              {nextEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      size="very_large" 
                      onPress={() => handleEventPress(event.id)}
                    />
              ))}
            </ScrollView>
          </View>

          {/* Upcoming Event */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming Events</ThemedText>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredEventsContainer}>
              {upcomingEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      size="very_large" 
                      onPress={() => handleEventPress(event.id)}
                    />
                ))}
            </ScrollView>
          </View>

          {/* Popular Event */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Popular Events</ThemedText>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredEventsContainer}>
              {popularEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        size="very_large" 
                        onPress={() => handleEventPress(event.id)}
                      />
              ))}
            </ScrollView>
          </View>

          {/* Community Feed */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Community Feed</ThemedText>
              <TouchableOpacity onPress={handleCommunitySeeMorePress}>
                <ThemedText style={[styles.seeAllButton, { color: tint }]}>See All</ThemedText>
              </TouchableOpacity>
            </View>
            {communityPosts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
          </View>

          {/* Upcoming Events */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming Near You</ThemedText>
            {nearbyEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  size="small" 
                  onPress={() => handleEventPress(event.id)}
                />
            ))}
          </View>

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
          </SafeAreaView>
        </ScrollView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e63946',
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '800',
  },
  featuredEventsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  bottomPadding: {
    height: 40,
  },
});