// page structure
// featured events
// your next event
// upcoming events this week
// community feed
// for you
//

import { Platform, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { EventCard, EventData } from '@/components/EventCard';
import { PostCard, PostData } from '@/components/PostCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data
const featuredEvents: EventData[] = [
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

const upcomingEvents: EventData[] = [
  {
    id: '4',
    title: 'Yoga in the Park',
    category: 'Fitness',
    date: 'Tomorrow, 8:00 AM',
    location: 'Riverside Park',
    image: require('@/assets/images/event1.png'),
  },
  {
    id: '5',
    title: 'Indie Film Screening',
    category: 'Arts',
    date: 'Jul 8, 7:00 PM',
    location: 'Art House Cinema',
    image: require('@/assets/images/event2.png'),
  },
  {
    id: '6',
    title: 'Farmers Market',
    category: 'Food',
    date: 'Saturday, 9:00 AM',
    location: 'Town Square',
    image: require('@/assets/images/event1.png'),
  },
];

export default function HomePage() {
  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const router = useRouter();

  const handleEventPress = (eventId: string) => {
    router.push(`/student/pages/EventPage?id=${eventId}`);
  };

  // const handlePostPress = (postId: string) => {
  //   router.push(`/student/pages/PostPage?id=${postId}`);
  // };

  const handleCommunitySeeMorePress = () => {
    router.push(`/student/community`);
  };

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

          {/* Upcoming Event */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming Event</ThemedText>
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
            <ThemedText type="subtitle" style={styles.sectionTitle}>Popular Event</ThemedText>
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
            {upcomingEvents.map(event => (
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