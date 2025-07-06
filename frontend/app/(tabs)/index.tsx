import { Image } from 'expo-image';
import { Platform, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EventCard, EventData } from '@/components/EventCard';
import { PostCard, PostData } from '@/components/PostCard';

// Mock data
const featuredEvents: EventData[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    category: 'Music',
    date: 'Jul 15, 2025',
    location: 'Central Park',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Tech Conference 2025',
    category: 'Technology',
    date: 'Aug 10, 2025',
    location: 'Convention Center',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Food & Wine Festival',
    category: 'Food',
    date: 'Jul 22, 2025',
    location: 'Downtown Plaza',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
  },
];

const communityPosts: PostData[] = [
  {
    id: '1',
    club: 'Photography Club',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    time: '2 hours ago',
    text: 'Join us this weekend for our photo walk through the botanical gardens! All skill levels welcome.',
    image: 'https://images.unsplash.com/photo-1560800655-58a01bfde4f7?q=80&w=2070&auto=format&fit=crop',
    likes: 24,
    comments: 5,
  },
  {
    id: '2',
    club: 'Running Group',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop',
    time: '5 hours ago',
    text: 'New 5K route added to our weekend meetup options! Check it out on our website.',
    likes: 18,
    comments: 3,
  },
];

const upcomingEvents: EventData[] = [
  {
    id: '4',
    title: 'Yoga in the Park',
    category: 'Fitness',
    date: 'Tomorrow, 8:00 AM',
    location: 'Riverside Park',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Indie Film Screening',
    category: 'Arts',
    date: 'Jul 8, 7:00 PM',
    location: 'Art House Cinema',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Farmers Market',
    category: 'Food',
    date: 'Saturday, 9:00 AM',
    location: 'Town Square',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function HomePage() {
  return (
      <ThemedView style={styles.container}>
        <ScrollView
            showsVerticalScrollIndicator={false}>
         <SafeAreaView edges={['top']}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText type="defaultSemiBold" style={styles.welcomeText}>Good afternoon 👋</ThemedText>
              <ThemedText type="title" style={styles.userName}>Shenal</ThemedText>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="search" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="bell" size={24} color="#333" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Featured Events */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming Events</ThemedText>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredEventsContainer}>
              {featuredEvents.map(event => (
                  <EventCard key={event.id} event={event} size="large" />
              ))}
            </ScrollView>
          </View>

          {/* Community Feed */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Community Feed</ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllButton}>See All</ThemedText>
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
                <EventCard key={event.id} event={event} size="small" />
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
  welcomeText: {
    fontSize: 16,
    marginBottom: 3,
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
    color: '#007bff',
    fontWeight: '600',
  },
  featuredEventsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  bottomPadding: {
    height: 40,
  },
});