// app/club/post/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClub } from '../../context/ClubContext';

const { width } = Dimensions.get('window');

interface Comment {
  id: number;
  content: string;
  studentName: string;
  createdAt: string;
  replies: Comment[];
}

interface Post {
  id: number;
  description: string;
  mediaPaths: string[];
  clubId: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useClub();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (!token || !id) return;

    setIsLoading(true);

    // Fetch post details
    axios.get(`http://192.168.1.5:8080/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setPost(res.data);
        setEditDescription(res.data.description);
      })
      .catch((err) => {
        console.error("Failed to fetch post", err);
        Alert.alert("Error", "Failed to load post");
      });

    // Fetch like count
    axios.get(`http://192.168.1.5:8080/api/posts/${id}/likes/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setLikeCount(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch like count", err);
      });

    // Fetch total comment count
    axios.get(`http://192.168.1.5:8080/api/comments/post/${id}/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setCommentCount(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch comment count", err);
    });

    // Fetch comments (tree)
    axios.get(`http://192.168.1.5:8080/api/comments/post/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch comments", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [id, token]);

  const handleDeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await axios.delete(`http://192.168.1.5:8080/api/posts/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              Alert.alert("Success", "Post deleted successfully");
              router.back();
            } catch (error) {
              console.error("Failed to delete post", error);
              Alert.alert("Error", "Failed to delete post");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEditPost = async () => {
    if (!editDescription.trim()) {
      Alert.alert("Error", "Description cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(`http://192.168.1.5:8080/api/posts/${id}`, {
        description: editDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setPost(prev => prev ? { ...prev, description: editDescription } : null);
      setIsEditModalVisible(false);
      Alert.alert("Success", "Post updated successfully");
    } catch (error) {
      console.error("Failed to update post", error);
      Alert.alert("Error", "Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderImageCarousel = () => {
    if (!post?.mediaPaths || post.mediaPaths.length === 0) {
      return null;
    }

    return (
      <View style={styles.imageCarouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(newIndex);
          }}
        >
          {post.mediaPaths.map((path, index) => (
            <Image
              key={index}
              source={{ 
                uri: path.startsWith('uploads/')
                  ? `http://192.168.1.5:8080/${path}`
                  : `http://192.168.1.5:8080/uploads/${path}`
              }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {post.mediaPaths.length > 1 && (
          <View style={styles.imageIndicators}>
            {post.mediaPaths.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex ? styles.activeIndicator : styles.inactiveIndicator
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderComments = () => {
    const renderNestedComments = (comment: Comment, depth = 0) => (
      <View key={comment.id} style={[styles.commentItem, { marginLeft: depth * 20 }]}>
        <View style={styles.commentContainer}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>
              {getInitials(comment.studentName)}
            </Text>
          </View>
          
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{comment.studentName}</Text>
              <Text style={styles.commentTimestamp}>
                {formatTimeAgo(comment.createdAt)}
              </Text>
            </View>
            <Text style={styles.commentText}>{comment.content}</Text>
            
            <View style={styles.commentActions}>
              <TouchableOpacity style={styles.commentAction}>
                <Ionicons name="heart-outline" size={16} color="#6B7280" />
                <Text style={styles.commentActionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentAction}>
                <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                <Text style={styles.commentActionText}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.map((reply) => renderNestedComments(reply, depth + 1))}
          </View>
        )}
      </View>
    );

    return (
      <View style={styles.commentsSection}>
        <View style={styles.commentsSectionHeader}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <View style={styles.commentsCount}>
            <Text style={styles.commentsCountText}>{commentCount}</Text>
          </View>
        </View>
        
        {comments.length === 0 ? (
          <View style={styles.noCommentsContainer}>
            <Ionicons name="chatbubble-outline" size={48} color="#374151" />
            <Text style={styles.noCommentsText}>No comments yet</Text>
            <Text style={styles.noCommentsSubtext}>Any added comments will be displayed here!</Text>
          </View>
        ) : (
          <View style={styles.commentsContainer}>
            {comments.map(comment => renderNestedComments(comment))}
          </View>
        )}
      </View>
    );
  };

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with action buttons */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Ionicons name="create-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeletePost}
            >
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post content */}
        <View style={styles.postContent}>
          <Text style={styles.description}>{post.description}</Text>
          
          {/* Image carousel */}
          {renderImageCarousel()}
          
          {/* Post stats */}
          <View style={styles.postStats}>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="heart-outline" size={22} color="#EF4444" />
              <Text style={styles.statText}>{likeCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={22} color="#3B82F6" />
              <Text style={styles.statText}>{commentCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="share-outline" size={22} color="#10B981" />
              <Text style={styles.statText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Post metadata */}
          <View style={styles.postMetadata}>
            <Text style={styles.metadataText}>
              Posted {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* Comments section */}
        {renderComments()}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Post</Text>
            <TouchableOpacity onPress={handleEditPost} disabled={isLoading}>
              <Text style={[styles.modalSaveButton, isLoading && styles.modalSaveButtonDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={26}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Enter post description..."
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>
      </Modal>

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingOverlayContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingOverlayText}>Processing...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F0F0F',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
  },
  deleteButton: {
  },
  postContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    color: '#F9FAFB',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  imageCarouselContainer: {
    marginBottom: 20,
  },
  postImage: {
    width: width - 40,
    height: 300,
    borderRadius: 16,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
  },
  inactiveIndicator: {
    backgroundColor: '#374151',
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statText: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '500',
  },
  postMetadata: {
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  metadataText: {
    color: '#6B7280',
    fontSize: 14,
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  commentsTitle: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '600',
  },
  commentsCount: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  commentsCountText: {
    color: '#F9FAFB',
    fontSize: 12,
    fontWeight: '500',
  },
  noCommentsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  noCommentsText: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '500',
  },
  noCommentsSubtext: {
    color: '#6B7280',
    fontSize: 14,
  },
  commentsContainer: {
    gap: 16,
  },
  commentItem: {
    marginBottom: 4,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '600',
  },
  commentTimestamp: {
    color: '#6B7280',
    fontSize: 12,
  },
  commentText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 20,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentActionText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#374151',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  modalTitle: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCancelButton: {
    color: '#6B7280',
    fontSize: 16,
  },
  modalSaveButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButtonDisabled: {
    color: '#374151',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    color: '#F9FAFB',
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    textAlignVertical: 'top',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayContent: {
    alignItems: 'center',
    gap: 16,
  },
  loadingOverlayText: {
    color: '#F9FAFB',
    fontSize: 16,
  },
});