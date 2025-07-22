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
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { EventCard, EventData } from '@/components/EventCard';
import { PostCard, PostData } from '@/components/PostCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';

interface UserType {
  id: string;
  sub: string;
  role: string;
}

// API function to fetch events
const getAllEvents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/events`);
    console.log('Events:', response.data);
    
    // Get user info for status checking
    const token = await AsyncStorage.getItem("token");
    let userId = null;
    if (token) {
      try {
        const decoded = jwtDecode<UserType>(token);
        userId = decoded.id;
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
    
    // Fetch attendance counts and user status for each event
    const eventsWithCounts = await Promise.all(
      response.data.map(async (event: any) => {
        try {
          // Fetch attendance counts
          const countsResponse = await axios.get(`${BASE_URL}/api/events/${event.id}/attendance/counts`);
          const rawCounts = countsResponse.data;
          console.log(`Raw counts for event ${event.id}:`, rawCounts);
          
          // Map API response to expected format
          const mappedCounts = {
            going: rawCounts.goingCount || 0,
            interested: rawCounts.interestedCount || 0
          };
          console.log(`Mapped counts for event ${event.id}:`, mappedCounts);
          
          // Fetch user status if logged in
          let userStatus = 'none';
          if (userId && token) {
            try {
              const userStatusResponse = await axios.get(
                `${BASE_URL}/api/events/${event.id}/attendance/user/${userId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                }
              );
              const responseData = userStatusResponse.data;
              const rawStatus = responseData.status;
              userStatus = rawStatus ? rawStatus.toLowerCase() : 'none';
              console.log(`User status for event ${event.id}:`, rawStatus, '-> normalized:', userStatus);
            } catch (error: any) {
              if (error.response?.status === 404) {
                console.log(`User has not registered for event ${event.id} yet`);
              } else {
                console.error(`Failed to fetch user status for event ${event.id}:`, error);
              }
              userStatus = 'none';
            }
          }
          
          return {
            ...event,
            ...mappedCounts,
            statusOfUser: userStatus,
          };
        } catch (error) {
          console.error(`Failed to fetch counts for event ${event.id}:`, error);
          return {
            ...event,
            going: 0,
            interested: 0,
            statusOfUser: 'none',
          };
        }
      })
    );
    
    console.log('Events with counts and user status:', eventsWithCounts);
    return eventsWithCounts;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

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
          .filter((event: any) => 
            event.statusOfUser === 'going' || event.statusOfUser === 'interested'
          )
          .sort((a: any, b: any) => {
            // Prioritize 'going' events over 'interested'
            if (a.statusOfUser === 'going' && b.statusOfUser === 'interested') return -1;
            if (a.statusOfUser === 'interested' && b.statusOfUser === 'going') return 1;
            // Then sort by date
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
          .slice(0, 5);
        
        // Upcoming Events - events happening soon (sorted by date)
        const upcoming = eventsData
          .filter((event: any) => {
            const eventDate = new Date(event.date);
            const now = new Date();
            const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            // Filter for events within the next week
            return eventDate > now && eventDate < oneWeekFromNow;
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);
        
        // Popular Events - most 5 events with the highest engagement
        // (interested)
        const popular = eventsData
          .filter((event: any) => event.interested > 0)
          .sort((a: any, b: any) => b.interested - a.interested)
          .slice(0, 5);

        // Nearby Events - events in specific venues or categories
        const nearby = eventsData
          .filter((event: any) => 
            event.venueName?.toLowerCase().includes('university') ||
            event.venueName?.toLowerCase().includes('colombo') ||
            event.venueName?.toLowerCase().includes('campus')
          )
          .slice(0, 5);
        
        // Set state with categorized events, fallback to all events if categories are empty
        setFeaturedEvents(featured.length > 0 ? featured : eventsData.slice(0, 3));
        setNextEvents(next); // Show empty if no events with user attendance
        setUpcomingEvents(upcoming);
        setPopularEvents(popular);
        setNearbyEvents(nearby.length > 0 ? nearby : eventsData.slice(0, 5));
        
      } catch (error) {
        console.error('Failed to fetch events, using empty arrays:', error);
        // Use empty arrays if API fails
        setFeaturedEvents([]);
        setNextEvents([]);
        setUpcomingEvents([]);
        setPopularEvents([]);
        setNearbyEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventPress = (eventId: number) => {
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
          {nextEvents.length > 0 && (
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
          )}

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
                      size="large" 
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
                        size="large" 
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
                  size="large" 
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