import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const iconColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#888', dark: '#aaa' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const fetchPosts = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        console.warn('No authentication token found');
        return;
      }

      setToken(storedToken);

      const response = await axiosInstance.get('/api/posts');
      const postsData = response.data;

      const enrichedPosts = await Promise.all(
        postsData.map(async post => {
          let profilePicture = null;
          let commentsCount = 0;

          try {
            // Fetch club data using clubId
            const clubResponse = await axiosInstance.get(`/api/club/${post.clubId}`);
            profilePicture = clubResponse.data.profilePicture;
          } catch (error) {
            console.warn(`Error fetching club for post ${post.id}:`, error);
          }

          try {
            // Fetch comment count for each post
            const commentCountResponse = await axiosInstance.get(`/api/comments/post/${post.id}/count`);
            commentsCount = commentCountResponse.data;
          } catch (error) {
            console.warn(`Error fetching comment count for post ${post.id}:`, error);
          }

          const imageUrl = post.mediaPaths && post.mediaPaths.length > 0
            ? post.mediaPaths[0].startsWith('uploads/')
              ? `${BASE_URL}/${post.mediaPaths[0]}`
              : `${BASE_URL}/uploads/${post.mediaPaths[0]}`
            : null;

          return {
            id: post.id,
            club: post.clubName || 'Unknown Club',
            avatar: profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Closeup_of_lawn_grass.jpg/1920px-Closeup_of_lawn_grass.jpg?20220125170732',
            time: formatTimeAgo(post.createdAt),
            text: post.description || 'No description',
            image: imageUrl || require('@/assets/images/event1.png'),
            likes: post.likes || 0,
            comments: commentsCount,
          };
        })
      );

      setPosts(enrichedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchPosts(true);
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tint}
            colors={[tint]}
          />
        }
      >
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