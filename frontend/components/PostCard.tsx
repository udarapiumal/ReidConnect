import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';
import { useAuth } from '@/app/context/AuthContext';
import axiosInstance from '@/app/api/axiosInstance';

export type PostData = {
  id: string;
  club: string;
  avatar: string | number;
  time: string;
  text: string;
  image?: string | number;
  likes: number;
  comments: number;
};

export type CommentData = {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
  replies?: CommentData[];
};

type PostCardProps = {
  post: PostData;
  onPress?: () => void;
};

export function PostCard({ post, onPress }: PostCardProps) {
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const shadowColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const fetchLikeCount = async () => {
    try {
      const response = await axiosInstance.get(`/api/posts/${post.id}/likes/count`);
      setLikesCount(response.data);
    } catch (error) {
      console.error(`Error fetching like count for post ${post.id}:`, error);
    }
  };


  // Check if user has liked this post on component mount
  useEffect(() => {
    checkLikeStatus();
    fetchCommentCount();
    fetchLikeCount();
  }, []);

  const checkLikeStatus = async () => {
    if (!user || !token) return;
    
    try {
      // You might need to implement an endpoint to check if user liked a post
      // For now, we'll assume the post data includes this information
      // or we can track it locally after like/unlike actions
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const response = await axiosInstance.get(`/api/comments/post/${post.id}/count`);
      setCommentsCount(response.data);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  const handleLike = async () => {
    if (!user || !token || isLiking) return;

    setIsLiking(true);
    
    try {
      if (isLiked) {
        // Unlike the post
        await axiosInstance.delete(`/api/posts/${post.id}/like?userId=${user.id}`);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        // Like the post
        await axiosInstance.post(`/api/posts/${post.id}/like?userId=${user.id}`);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      Alert.alert('Error', 'Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const fetchComments = async () => {
    if (!showComments) return;
    
    setLoadingComments(true);
    try {
      const response = await axiosInstance.get(`/api/comments/post/${post.id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentPress = () => {
    setShowComments(true);
    fetchComments();
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || isPostingComment) return;

    setIsPostingComment(true);
    try {
      const commentData = {
        postId: parseInt(post.id),
        userId: user.id,
        content: newComment.trim(),
        parentCommentId: null // For top-level comments
      };

      await axiosInstance.post('/api/comments', commentData);
      setNewComment('');
      setCommentsCount(prev => prev + 1);
      
      // Refresh comments
      await fetchComments();
      
      Alert.alert('Success', 'Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setIsPostingComment(false);
    }
  };

  const renderComment = (comment: CommentData, level = 0) => {
    const marginLeft = level * 20; // Indent replies
    
    return (
      <View key={comment.id} style={[styles.commentContainer, { marginLeft }]}>
        <View style={styles.commentHeader}>
          <ThemedText style={styles.commentAuthor}>{comment.authorName}</ThemedText>
          <ThemedText style={[styles.commentTime, { color: secondaryTextColor }]}>
            {formatTimeAgo(comment.createdAt)}
          </ThemedText>
        </View>
        <ThemedText style={styles.commentContent}>{comment.content}</ThemedText>
        
        {/* Render replies if they exist */}
        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map(reply => renderComment(reply, level + 1))}
          </View>
        )}
      </View>
    );
  };

  // Helper function to format time ago from timestamp
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffMs = now.getTime() - createdAt.getTime();

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    if (days > 0) {
      return `${days}d ago`;
    }
    if (totalHours > 0) {
      return `${totalHours}h ago`;
    }
    return `${totalMinutes}m ago`;
  };

  // Handle different image source types with better debugging
  const getImageSource = (image: string | number | undefined) => {
    if (typeof image === 'string') {
      console.log(`PostCard - Image URL for post ${post.id}:`, image);
      return { uri: image };
    } else if (typeof image === 'number') {
      return image; // This is a require() result
    }
    return undefined;
  };

  // Image error handler
  const handleImageError = (error: any) => {
    console.error(`Image load error for post ${post.id}:`, error);
    console.log(`Failed image URL:`, post.image);
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully for post ${post.id}`);
  };

  return (
    <>
      <ThemedView style={[styles.container, { shadowColor: shadowColor }]}>
        <View style={styles.header}>
          <Image
            source={{ uri: `${BASE_URL}${post.avatar}` }}
            style={[styles.avatar, { backgroundColor: placeholderColor }]}
            contentFit="cover"
            onError={handleImageError}
          />
          <View style={styles.headerText}>
            <ThemedText style={styles.clubName}>{post.club}</ThemedText>
            <ThemedText style={[styles.time, { color: secondaryTextColor }]}>
              {post.time}
            </ThemedText>
          </View>
          <TouchableOpacity>
            <Feather name="more-vertical" size={20} color={secondaryTextColor} />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.content}>{post.text}</ThemedText>

        {post.image && (
          <Image
            source={getImageSource(post.image)}
            style={[styles.contentImage, { backgroundColor: placeholderColor }]}
            contentFit="cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            placeholder={placeholderColor}
            transition={200}
          />
        )}

        <View style={[styles.actions, { borderTopColor: borderColor }]}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLike}
            disabled={isLiking}
          >
            <Feather 
              name="thumbs-up" 
              size={18} 
              color={isLiked ? '#007AFF' : secondaryTextColor} 
            />
            <ThemedText style={[styles.actionText, { color: isLiked ? '#007AFF' : secondaryTextColor }]}>
              {likesCount}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCommentPress}>
            <Feather
              name="message-circle"
              size={18}
              color={secondaryTextColor}
            />
            <ThemedText style={[styles.actionText, { color: secondaryTextColor }]}>
              {commentsCount}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Feather name="share-2" size={18} color={secondaryTextColor} />
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowComments(false)}
      >
        <ThemedView style={[styles.modalContainer, { backgroundColor }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <ThemedText style={styles.modalTitle}>Comments</ThemedText>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowComments(false)}
            >
              <Feather name="x" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <ScrollView style={styles.commentsScrollView}>
            {loadingComments ? (
              <View style={styles.loadingContainer}>
                <ThemedText>Loading comments...</ThemedText>
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.emptyCommentsContainer}>
                <ThemedText style={{ color: secondaryTextColor }}>
                  No comments yet. Be the first to comment!
                </ThemedText>
              </View>
            ) : (
              comments.map(comment => renderComment(comment))
            )}
          </ScrollView>

          {/* Add Comment Input */}
          <View style={[styles.commentInputContainer, { borderTopColor: borderColor }]}>
            <TextInput
              style={[styles.commentInput, { 
                color: textColor, 
                borderColor: borderColor,
                backgroundColor: backgroundColor 
              }]}
              placeholder="Add a comment..."
              placeholderTextColor={placeholderColor}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.postButton, { 
                backgroundColor: newComment.trim() ? '#007AFF' : borderColor 
              }]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || isPostingComment}
            >
              <ThemedText style={[styles.postButtonText, { 
                color: newComment.trim() ? 'white' : secondaryTextColor 
              }]}>
                {isPostingComment ? 'Posting...' : 'Post'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  clubName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 20,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  commentsScrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCommentsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  commentContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 18,
  },
  repliesContainer: {
    marginTop: 8,
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});