import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PostCard, PostData } from '@/components/PostCard';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data
const communityPosts: PostData[] = [
  {
    id: '1',
    club: 'Photography Club',
    avatar: require('@/assets/images/event1.png'),
    time: '2 hours ago',
    text: 'Join us this weekend for our photo walk through the botanical gardens! All skill levels welcome.',
    image: require('@/assets/images/event1.png'),
    likes: 24,
    comments: 5,
  },
  {
    id: '2',
    club: 'Running Group',
    avatar: require('@/assets/images/event2.png'),
    time: '5 hours ago',
    text: 'New 5K route added to our weekend meetup options! Check it out on our website.',
    likes: 18,
    comments: 3,
  },
  {
    id: '3',
    club: 'Book Club',
    avatar: require('@/assets/images/event1.png'),
    time: '1 day ago',
    text: 'Our July book selection is "The Midnight Library" by Matt Haig. Discussion will be on July 28th at the downtown cafe.',
    likes: 32,
    comments: 12,
  },
  {
    id: '4',
    club: 'Tech Meetup',
    avatar: require('@/assets/images/event2.png'),
    time: '2 days ago',
    text: 'Excited to announce our next workshop on AI and Machine Learning basics. RSVP now, space is limited!',
    image: require('@/assets/images/event1.png'),
    likes: 45,
    comments: 8,
  },
  {
    id: '5',
    club: 'Hiking Adventures',
    avatar: require('@/assets/images/event1.png'),
    time: '3 days ago',
    text: 'Beautiful day on the trail yesterday! Thanks to everyone who joined our mountain expedition.',
    image: require('@/assets/images/event2.png'),
    likes: 67,
    comments: 15,
  },
];

export default function CommunityPage() {
  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#888', dark: '#aaa' }, 'text');

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']}>

          {/* Header */}
          <ThemedText style={styles.headerTitle}>Community Feed</ThemedText>

          {/* Feed */}
          <View style={styles.feedContainer}>
            {communityPosts.map(post => (
              <PostCard key={post.id} post={post} />
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
  },
  postButton: {
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
