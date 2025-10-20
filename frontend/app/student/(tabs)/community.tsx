import React, { useState, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PostCard, PostData } from '@/components/PostCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';
import axiosInstance from '../../api/axiosInstance';

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

const PAGE_SIZE = 10; // Load 10 posts at a time

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tint = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const fetchPosts = async (pageNum: number, isRefresh = false) => {
    // Prevent multiple simultaneous requests
    if (loadingMore && !isRefresh) return;
    
    // Don't load more if we've reached the end
    if (!hasMore && !isRefresh) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Backend should support pagination: /api/posts/active?page=1&limit=10
      const response = await axiosInstance.get('/api/posts/active', {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          // Optional: sortBy: 'createdAt' or 'likes'
        }
      });

      const postsData = response.data.posts || response.data; // Adjust based on your API response
      const totalPages = response.data.totalPages || Math.ceil(response.data.total / PAGE_SIZE);

      // Check if there are more posts
      setHasMore(pageNum < totalPages);

      const enrichedPosts = await Promise.all(
        postsData.map(async (post: any) => {
          let profilePicture = null;
          let commentsCount = 0;

          try {
            const clubResponse = await axiosInstance.get(`/api/club/${post.clubId}`);
            profilePicture = clubResponse.data.profilePicture;
            // log profilePicture;
            console.log(`Profile picture for club ${post.clubId}: ${profilePicture}`);
          } catch (error) {
            console.warn(`Error fetching club for post ${post.id}:`, error);
          }

          try {
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

      if (isRefresh || pageNum === 1) {
        // Replace all posts on refresh or initial load
        setPosts(enrichedPosts);
      } else {
        // Append new posts for pagination
        setPosts(prevPosts => [...prevPosts, ...enrichedPosts]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1, true);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      fetchPosts(1);
    }, [])
  );

  const renderItem = ({ item }: { item: PostData }) => (
    <PostCard post={item} />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={tint} />
        <ThemedText style={styles.loadingText}>Loading more posts...</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ThemedText style={styles.headerTitle}>Community Feed</ThemedText>

        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tint}
              colors={[tint]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            loading ? (
              <View style={[styles.loadingContainer, { backgroundColor }]}>
                <ActivityIndicator size="large" color={tint} />
                <ThemedText style={styles.loadingText}>Loading posts...</ThemedText>
              </View>
            ) : (
              <View style={[styles.emptyContainer, { backgroundColor }]}>
                <ThemedText>No posts found</ThemedText>
              </View>
            )
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    gap: 12,
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
});