import { Platform, StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axiosInstance from '../../api/axiosInstance';
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

// API function to fetch featured events
const getFeaturedEvents = async () => {
  try {
    const response = await axiosInstance.get('/api/events/featured');
    console.log('Featured Events:', response.data);
    
    let userId = null;
    let token = null;
    
    try {
      token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<UserType>(token);
        userId = decoded.id;
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }

    // Fetch attendance counts and user status for each featured event
    const eventsWithCounts = await Promise.all(
      response.data.map(async (event: any) => {
        try {
          // Fetch attendance counts
          const countsResponse = await axiosInstance.get(`/api/events/${event.id}/attendance/counts`);
          const rawCounts = countsResponse.data;
          console.log(`Raw counts for featured event ${event.id}:`, rawCounts);
          
          // Map API response to expected format
          const mappedCounts = {
            going: rawCounts.goingCount || 0,
            interested: rawCounts.interestedCount || 0
          };
          console.log(`Mapped counts for featured event ${event.id}:`, mappedCounts);
          
          // Fetch user status if logged in
          let userStatus = 'none';
          if (userId && token) {
            try {
              const userStatusResponse = await axiosInstance.get(
                `/api/events/${event.id}/attendance/user/${userId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                }
              );
              const responseData = userStatusResponse.data;
              const rawStatus = responseData.status;
              userStatus = rawStatus ? rawStatus.toLowerCase() : 'none';
              console.log(`User status for featured event ${event.id}:`, rawStatus, '-> normalized:', userStatus);
            } catch (error: any) {
              if (error.response?.status === 404) {
                console.log(`User has not registered for featured event ${event.id} yet`);
              } else {
                console.error(`Failed to fetch user status for featured event ${event.id}:`, error);
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
          console.error(`Failed to fetch counts for featured event ${event.id}:`, error);
          return {
            ...event,
            going: 0,
            interested: 0,
            statusOfUser: 'none',
          };
        }
      })
    );
    
    console.log('Featured events with counts and user status:', eventsWithCounts);
    return eventsWithCounts;
  } catch (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }
};

// API function to fetch events
const getAllEvents = async () => {
  try {
    const response = await axiosInstance.get('/api/events');
    console.log('Events:', response.data);
    
    let userId = null;
    let token = null;
    
    try {
      token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<UserType>(token);
        userId = decoded.id;
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }

    
    // Fetch attendance counts and user status for each event
    const eventsWithCounts = await Promise.all(
      response.data.map(async (event: any) => {
        try {
          // Fetch attendance counts
          const countsResponse = await axiosInstance.get(`/api/events/${event.id}/attendance/counts`);
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
              const userStatusResponse = await axiosInstance.get(
                `/api/events/${event.id}/attendance/user/${userId}`,
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
  // {
  //   id: '1',
  //   club: 'Gavel Club of University of Colombo',
  //   avatar: require('@/assets/images/event1.png'),
  //   time: '1 day ago',
  //   text: 'New blog post out now! "Why you should live away from home at least once in your life".',
  //   image: require('@/assets/images/event2.png'),
  //   likes: 52,
  //   comments: 11,
  // },
  // {
  //   id: '2',
  //   club: 'Hiking Adventures',
  //   avatar: require('@/assets/images/event2.png'),
  //   time: '3 days ago',
  //   text: 'Beautiful day on the trail yesterday! Thanks to everyone who joined our mountain expedition.',
  //   image: require('@/assets/images/event1.png'),
  //   likes: 67,
  //   comments: 15,
  // },
];

// Event categories
const EVENT_CATEGORIES = ['ALL', 'SPORTS', 'MUSIC', 'WELLNESS', 'OTHER', 'COMPETITION'] as const;
type EventCategory = typeof EVENT_CATEGORIES[number];

export default function HomePage() {
  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const router = useRouter();

  // State for events
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [nextEvents, setNextEvents] = useState<EventData[]>([]);
  const [popularEvents, setPopularEvents] = useState<EventData[]>([]);
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('ALL');
  const [loading, setLoading] = useState(true);

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch featured events and all events in parallel
        const [featuredEventsData, eventsData] = await Promise.all([
          getFeaturedEvents(),
          getAllEvents()
        ]);
        
        // Categorize events based on different criteria
        
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
            // Filter for events within the next week and not in the past
            return eventDate > now && eventDate < oneWeekFromNow;
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);
        
        // Popular Events - most 5 events with the highest engagement (only future events)
        const popular = eventsData
          .filter((event: any) => {
            const eventDate = new Date(event.date);
            const now = new Date();
            return event.interested > 0 && eventDate > now; // Only future events
          })
          .sort((a: any, b: any) => b.interested - a.interested)
          .slice(0, 5);

        // Set state with categorized events
        setFeaturedEvents(featuredEventsData); // Only show actual featured events from API
        setNextEvents(next); // Show empty if no events with user attendance
        setUpcomingEvents(upcoming);
        setPopularEvents(popular);
        setAllEvents(eventsData);
        setFilteredEvents(eventsData);
        
      } catch (error) {
        console.error('Failed to fetch events, using empty arrays:', error);
        // Use empty arrays if API fails
        setFeaturedEvents([]);
        setNextEvents([]);
        setUpcomingEvents([]);
        setPopularEvents([]);
        setAllEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Update filtered events when allEvents changes
  useEffect(() => {
    filterEventsByCategory(selectedCategory);
  }, [allEvents]);

  // Filter events by category
  const filterEventsByCategory = (category: EventCategory) => {
    setSelectedCategory(category);
    let eventsToFilter = [];
    
    if (category === 'ALL') {
      eventsToFilter = allEvents;
    } else {
      eventsToFilter = allEvents.filter((event: any) => 
        event.category?.toUpperCase() === category
      );
    }
    
    // Sort events to show upcoming events first, then by engagement
    const sortedEvents = eventsToFilter.sort((a: any, b: any) => {
      const eventDateA = new Date(a.date);
      const eventDateB = new Date(b.date);
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Check if events are upcoming (within next week)
      const aIsUpcoming = eventDateA > now && eventDateA < oneWeekFromNow;
      const bIsUpcoming = eventDateB > now && eventDateB < oneWeekFromNow;
      
      // Prioritize upcoming events
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;
      
      // If both are upcoming or both are not upcoming, sort by date
      if (aIsUpcoming && bIsUpcoming) {
        return eventDateA.getTime() - eventDateB.getTime();
      }
      
      // For non-upcoming events, sort by engagement (interested + going)
      const engagementA = (a.interested || 0) + (a.going || 0);
      const engagementB = (b.interested || 0) + (b.going || 0);
      return engagementB - engagementA;
    });
    
    setFilteredEvents(sortedEvents);
  };

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
          {featuredEvents.length > 0 && (
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
          )}

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

          {/* All events categorize by all, and other categories tags*/}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>All Events</ThemedText>
            
            {/* Category Tags */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContainer}
              style={styles.categoryScrollView}>
              {EVENT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTag,
                    selectedCategory === category && styles.categoryTagActive,
                    { borderColor: tint }
                  ]}
                  onPress={() => filterEventsByCategory(category)}>
                  <ThemedText
                    style={[
                      styles.categoryText,
                      selectedCategory === category && [styles.categoryTextActive, { color: tint }]
                    ]}>
                    {category}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Filtered Events */}
            <View style={styles.eventsGrid}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => {
                  // Check if this is the first non-upcoming event after upcoming events
                  const eventDate = new Date(event.date);
                  const now = new Date();
                  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  const isUpcoming = eventDate > now && eventDate < oneWeekFromNow;
                  
                  // Check if previous event was upcoming and this one isn't
                  const prevEvent = index > 0 ? filteredEvents[index - 1] : null;
                  const prevEventDate = prevEvent ? new Date(prevEvent.date) : null;
                  const prevIsUpcoming = prevEventDate ? (prevEventDate > now && prevEventDate < oneWeekFromNow) : false;
                  const shouldShowOtherEventsHeader = index > 0 && prevIsUpcoming && !isUpcoming;
                  
                  return (
                    <View key={event.id}>
                      {index === 0 && isUpcoming && (
                        <View style={styles.sectionDivider}>
                          <ThemedText style={styles.sectionDividerText}>🔥 Happening Soon</ThemedText>
                        </View>
                      )}
                      {shouldShowOtherEventsHeader && (
                        <View style={styles.sectionDivider}>
                          <ThemedText style={styles.sectionDividerText}>📅 Other Events</ThemedText>
                        </View>
                      )}
                      <EventCard 
                        event={event} 
                        size="small" 
                        onPress={() => handleEventPress(event.id)}
                      />
                    </View>
                  );
                })
              ) : (
                <View style={styles.noEventsContainer}>
                  <ThemedText style={styles.noEventsText}>
                    No events found in {selectedCategory.toLowerCase()} category
                  </ThemedText>
                </View>
              )}
            </View>
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
  categoryScrollView: {
    marginTop: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
  },
  categoryTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  categoryTagActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    fontWeight: '700',
  },
  eventsGrid: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionDivider: {
    marginVertical: 16,
    alignItems: 'center',
  },
  sectionDividerText: {
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.8,
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noEventsText: {
    fontSize: 16,
    opacity: 0.6,
  },
  bottomPadding: {
    height: 40,
  },
});