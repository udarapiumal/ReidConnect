import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PostCard, PostData } from '@/components/PostCard';

// Mock data
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
  {
    id: '3',
    club: 'Book Club',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop',
    time: '1 day ago',
    text: 'Our July book selection is "The Midnight Library" by Matt Haig. Discussion will be on July 28th at the downtown cafe.',
    likes: 32,
    comments: 12,
  },
  {
    id: '4',
    club: 'Tech Meetup',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop',
    time: '2 days ago',
    text: 'Excited to announce our next workshop on AI and Machine Learning basics. RSVP now, space is limited!',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop',
    likes: 45,
    comments: 8,
  },
  {
    id: '5',
    club: 'Hiking Adventures',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop',
    time: '3 days ago',
    text: 'Beautiful day on the trail yesterday! Thanks to everyone who joined our mountain expedition.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop',
    likes: 67,
    comments: 15,
  },
];

export default function CommunityPage() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <ThemedText style={styles.headerTitle}>Community Feed</ThemedText>

        {/* Create Post-Input */}
        <ThemedView style={styles.createPostContainer}>
          <TextInput
            style={styles.createPostInput}
            placeholder="Share an update..."
            placeholderTextColor="#888"
            multiline
          />
          <TouchableOpacity style={styles.postButton}>
            <Feather name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </ThemedView>

        {/* Feed */}
        <View style={styles.feedContainer}>
          {communityPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  createPostInput: {
    flex: 1,
    minHeight: 40,
    fontSize: 16,
    color: '#333',
  },
  postButton: {
    backgroundColor: '#6200ee',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  feedContainer: {
    paddingBottom: 16,
  },
  bottomPadding: {
    height: 80,
  },
});
