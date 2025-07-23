import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PostCard, PostData } from '@/components/PostCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';
import axiosInstance from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

// Helper function to format time ago from timestamp
const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffMs = now.getTime() - createdAt.getTime();

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  if (totalHours > 0) {
    return `${totalHours} hour${totalHours !== 1 ? 's' : ''} ago`;
  }

  return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''} ago`;
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#888', dark: '#aaa' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const storedToken = await AsyncStorage.getItem('token');
          if (!storedToken) {
            console.warn('No authentication token found');
            setLoading(false);
            return;
          }

          try {
            const decoded = jwtDecode(storedToken);
            console.log('Token info:', {
              userId: decoded.id,
              role: decoded.role,
              exp: new Date(decoded.exp * 1000).toLocaleString(),
              tokenPreview: storedToken
            });
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
          }

          setToken(storedToken);

          console.log('Requesting from URL:', '/api/posts');

          const response = await axiosInstance.get('/api/posts');

          console.log('Fetched posts:', response.data);

          const formattedPosts: PostData[] = response.data.map(post => {
            const imageUrl = post.mediaPaths && post.mediaPaths.length > 0
              ? post.mediaPaths[0].startsWith('uploads/')
                ? `${BASE_URL}/${post.mediaPaths[0]}`
                : `${BASE_URL}/uploads/${post.mediaPaths[0]}`
              : null;

            console.log('Post:', post.id, 'Image URL:', imageUrl, 'Media paths:', post.mediaPaths);

            return {
              id: post.id,
              club: post.clubName || 'Unknown Club',
              avatar: post.clubAvatar || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Closeup_of_lawn_grass.jpg/1920px-Closeup_of_lawn_grass.jpg?20220125170732',
              time: formatTimeAgo(post.createdAt),
              text: post.description || 'No description',
              image: imageUrl || require('@/assets/images/event1.png'),
              likes: post.likes || 0,
              comments: post.comments || 0,
            };
          });

          setPosts(formattedPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']}>

          {/* Header */}
          <ThemedText style={styles.headerTitle}>Community Feed</ThemedText>

          {/* Feed */}
          <View style={styles.feedContainer}>
            {loading ? (
              <View style={[styles.loadingContainer, { backgroundColor }]}>
                <ThemedText>Loading posts...</ThemedText>
              </View>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <View style={[styles.emptyContainer, { backgroundColor }]}>
                <ThemedText>No posts found</ThemedText>
              </View>
            )}
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
  feedContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 80,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
});
