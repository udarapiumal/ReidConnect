import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useThemeColor } from '../../../hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const GRID_SPACING = 12;
const imageSize = (screenWidth - 40 - (GRID_SPACING * 2)) / 3;
const imageHeight = imageSize * (4/3);

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffMs = now.getTime() - createdAt.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  let result = '';
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || (!days && !hours)) result += `${minutes}m `;
  return result.trim() + ' ago';
};

export default function ClubProfileScreen() {
  const [token, setToken] = useState(null);
  const { clubId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [subCount, setSubCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [postStats, setPostStats] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [clubDetails, setClubDetails] = useState(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const router = useRouter();

  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const buttonColor = useThemeColor({}, 'button');
  const buttonTextColor = useThemeColor({}, 'buttonText');

  useFocusEffect(
    useCallback(() => {
      const loadToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          if (!storedToken) {
            console.warn('No token found');
            return;
          }

          setToken(storedToken);

          try {
            const decoded = jwtDecode(storedToken);
            setUser(decoded);
          } catch (decodeErr) {
            console.error('Token decode error:', decodeErr);
          }
        } catch (err) {
          console.error('Error loading token:', err);
        }
      };

      loadToken();
    }, [])
  );

  const fetchClubDetails = async (clubId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/club/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClubDetails(res.data);
    } catch (error) {
      console.error('Error fetching club details:', error);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!clubDetails?.id || !user?.id) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/api/subscriptions/check/${clubDetails.id}?userId=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSubscribed(res.data === true);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
    }
  };

  const handleSubscribe = async () => {
    if (!clubDetails?.id || subscribeLoading || !user?.id) return;
    
    setSubscribeLoading(true);
    try {
      if (isSubscribed) {
        await axios.post(`${BASE_URL}/api/subscriptions/unsubscribe`, 
          { userId: user.id, clubId: clubDetails.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSubscribed(false);
        Alert.alert('Success', 'Unsubscribed successfully!');
      } else {
        await axios.post(`${BASE_URL}/api/subscriptions/subscribe`, 
          { userId: user.id, clubId: clubDetails.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSubscribed(true);
        Alert.alert('Success', 'Subscribed successfully!');
      }
      fetchSubCount();
    } catch (error) {
      console.error('Error handling subscription:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  const fetchSubCount = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subscriptions/club/${clubDetails.id}/count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubCount(res.data || 0);
    } catch (error) {
      console.error('Error fetching subCount:', error);
    }
  };

  const fetchPostStats = async (postId) => {
    try {
      const [likeCountRes, commentCountRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/posts/${postId}/likes/count`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/comments/post/${postId}/count`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      return {
        likeCount: likeCountRes.data || 0,
        commentCount: commentCountRes.data || 0
      };
    } catch (error) {
      console.error(`Error fetching post stats for post ${postId}:`, error);
      return { likeCount: 0, commentCount: 0 };
    }
  };

  const fetchAllPostStats = async (postsData) => {
    try {
      const statsPromises = postsData.map(post => fetchPostStats(post.id));
      const statsResults = await Promise.all(statsPromises);
      
      const statsMap = {};
      postsData.forEach((post, index) => {
        statsMap[post.id] = statsResults[index];
      });
      
      setPostStats(statsMap);
    } catch (error) {
      console.error('Error fetching all post stats:', error);
    }
  };

  const fetchComments = async (postId) => {
    setLoadingComments(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/comments/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !user?.id) return;

    try {
      const commentData = {
        postId: selectedPostId,
        content: commentText.trim(),
        parentCommentId: replyingTo?.id || null,
        userId: user.id
      };

      await axios.post(`${BASE_URL}/api/comments`, commentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCommentText('');
      setReplyingTo(null);
      await fetchComments(selectedPostId);
      
      const updatedStats = await fetchPostStats(selectedPostId);
      setPostStats(prev => ({
        ...prev,
        [selectedPostId]: updatedStats
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentPress = (postId) => {
    setSelectedPostId(postId);
    setShowComments(true);
    fetchComments(postId);
  };

  const handleLikeToggle = async (postId) => {
    if (!user?.id) return;
    const isLiked = likedPosts[postId];
    try {
      if (isLiked) {
        await axios.delete(`${BASE_URL}/api/posts/${postId}/like`, {
          params: { userId: user.id },
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BASE_URL}/api/posts/${postId}/like`, null, {
          params: { userId: user.id },
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
      const updatedStats = await fetchPostStats(postId);
      setPostStats(prev => ({ ...prev, [postId]: updatedStats }));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/posts/club/${clubDetails.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const postsData = res.data || [];
      setPosts(postsData);
      
      if (postsData.length > 0) {
        await fetchAllPostStats(postsData);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/events/club/${clubDetails.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const [postRes, eventRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/posts/club/${clubDetails.id}/count`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/events/count/${clubDetails.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPostCount(postRes.data || 0);
      setEventCount(eventRes.data || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    if (!token || !clubDetails?.id) return;
    if (selectedTab === 'posts') fetchPosts();
    else fetchEvents();
  }, [selectedTab, token, clubDetails]);

  useEffect(() => {
    if (token && clubDetails?.id) {
      fetchCounts();
      fetchSubCount();
      checkSubscriptionStatus();
    }
  }, [clubDetails, token]);

  useEffect(() => {
    if (clubId && typeof clubId === 'string' && token) {
      fetchClubDetails(clubId);
    }
  }, [clubId, token]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/posts/likedByUser/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const likedIds = res.data;
        const likedMap = {};
        likedIds.forEach(id => likedMap[id] = true);
        setLikedPosts(likedMap);
      } catch (err) {
        console.error('Error fetching liked posts:', err);
      }
    };

    if (user?.id) fetchLikedPosts();
  }, [user]);

  const currentData = selectedTab === 'posts' ? posts : events;

  const handleItemPress = (index) => {
    setSelectedIndex(index);
    setShowDetailView(true);
  };

  const renderComment = ({ item, depth = 0 }) => (
    <View style={[styles.commentItem, { marginLeft: depth * 32 }]}>
      <Image
        source={{ uri: `${BASE_URL}${item.profilePictureUrl}` }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.userName || 'User'}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <View style={styles.commentActions}>
          <Text style={styles.commentTime}>{formatTimeAgo(item.createdAt)}</Text>
          <TouchableOpacity onPress={() => setReplyingTo(item)}>
            <Text style={styles.replyButton}>Reply</Text>
          </TouchableOpacity>
        </View>
        {item.replies && item.replies.length > 0 && (
          <FlatList
            data={item.replies}
            renderItem={({ item: reply }) => renderComment({ item: reply, depth: depth + 1 })}
            keyExtractor={(reply) => reply.id.toString()}
          />
        )}
      </View>
    </View>
  );

  const CommentsModal = () => (
    <Modal
      visible={showComments}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setShowComments(false);
        setReplyingTo(null);
        setCommentText('');
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.commentsModalContainer}
      >
        <View style={styles.commentsModalBackdrop} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.commentsModalContent}>
            <View style={styles.commentsHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.commentsTitle}>Comments</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowComments(false);
                  setReplyingTo(null);
                  setCommentText('');
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {loadingComments ? (
              <View style={styles.commentsLoading}>
                <ActivityIndicator size="large" color="#ff3b3b" />
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.noComments}>
                <Ionicons name="chatbubble-outline" size={48} color="#666" />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
              </View>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.commentsList}
              />
            )}

            <View style={styles.commentInputContainer}>
              {replyingTo && (
                <View style={styles.replyingToContainer}>
                  <Text style={styles.replyingToText}>
                    Replying to {replyingTo.userName}
                  </Text>
                  <TouchableOpacity onPress={() => setReplyingTo(null)}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor="#666"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={!commentText.trim()}
                  style={[
                    styles.sendButton,
                    !commentText.trim() && styles.sendButtonDisabled
                  ]}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color={commentText.trim() ? '#ff3b3b' : '#666'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderGridItem = ({ item, index }) => {
    const imageUri = selectedTab === 'posts' 
      ? (item.mediaPaths?.[0] ? `${BASE_URL}/${item.mediaPaths[0]}` : null)
      : (item.imagePath ? `${BASE_URL}/${item.imagePath}` : null);
    
    const itemHeight = selectedTab === 'events' ? imageHeight : imageSize;
    
    return (
      <TouchableOpacity 
        style={[styles.gridItem, { height: itemHeight }]} 
        onPress={() => handleItemPress(index)}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.gridImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons 
              name={selectedTab === 'posts' ? "image-outline" : "calendar-outline"} 
              size={32} 
              color="#666" 
            />
          </View>
        )}
        {selectedTab === 'posts' && item.mediaPaths && item.mediaPaths.length > 1 && (
          <View style={styles.multipleImagesIndicator}>
            <Ionicons name="copy-outline" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDetailItem = ({ item }) => {
    const isEvent = selectedTab === 'events';
    const images = isEvent ? (item.imagePath ? [item.imagePath] : []) : (item.mediaPaths || []);
    const stats = !isEvent ? postStats[item.id] || { likeCount: 0, commentCount: 0 } : null;
    
    const formatTargets = (targets) => {
      if (!targets || targets.length === 0) return '';
      return targets.map(target => target.replace('_', ' ')).join(', ');
    };

    const formatEventDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    return (
      <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <Image
            source={{ 
              uri: clubDetails.profilePicture?.startsWith('/uploads/') 
                ? `${BASE_URL}${clubDetails.profilePicture}` 
                : `${BASE_URL}/uploads/${clubDetails.profilePicture}` 
            }}
            style={styles.detailAvatar}
          />
          <View style={styles.detailHeaderText}>
            <Text style={styles.detailClubName}>{clubDetails?.clubName || "Club Name"}</Text>
            <Text style={styles.detailTime}>{formatTimeAgo(item.createdAt)}</Text>
          </View>
        </View>
        
        {isEvent && (
          <View style={styles.eventVenue}>
            <Ionicons name="location-outline" size={16} color="#ff3b3b" />
            <Text style={styles.venueText}>
              {item.venueName || item.venue || 'Venue TBA'}
            </Text>
          </View>
        )}
        
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.imageContainer}
        >
          {images.length > 0 ? (
            images.map((path, idx) => (
              <Image
                key={idx}
                source={{ uri: `${BASE_URL}/${path}` }}
                style={styles.detailImage}
              />
            ))
          ) : (
            <View style={styles.detailPlaceholder}>
              <Ionicons 
                name={isEvent ? "calendar-outline" : "image-outline"} 
                size={64} 
                color="#666" 
              />
            </View>
          )}
        </ScrollView>
        
        {images.length > 1 && (
          <View style={styles.imageIndicators}>
            {images.map((_, idx) => (
              <View key={idx} style={styles.indicator} />
            ))}
          </View>
        )}

        {!isEvent && (
          <View style={styles.postActions}>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleLikeToggle(item.id)}
              >
                <Ionicons 
                  name={likedPosts[item.id] ? "heart" : "heart-outline"} 
                  size={26} 
                  color={likedPosts[item.id] ? "#ff4444" : "#fff"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCommentPress(item.id)}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="paper-plane-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!isEvent && stats && (
          <View style={styles.postStats}>
            {stats.likeCount > 0 && (
              <Text style={styles.likesText}>
                {stats.likeCount.toLocaleString()} {stats.likeCount === 1 ? 'like' : 'likes'}
              </Text>
            )}
            {stats.commentCount > 0 && (
              <TouchableOpacity onPress={() => handleCommentPress(item.id)}>
                <Text style={styles.commentsText}>
                  View all {stats.commentCount.toLocaleString()} {stats.commentCount === 1 ? 'comment' : 'comments'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View style={styles.detailContent}>
          {isEvent && (
            <Text style={styles.eventName}>{item.name}</Text>
          )}
          
          <Text style={styles.detailDescription}>
            <Text style={styles.descriptionUsername}>{clubDetails?.clubName || "Club"} </Text>
            {item.description || 'No description'}
          </Text>
          
          {isEvent && (
            <View style={styles.eventDetails}>
              {item.date && (
                <View style={styles.eventDetailRow}>
                  <Ionicons name="calendar" size={16} color="#ff3b3b" />
                  <Text style={styles.eventDetailText}>{formatEventDate(item.date)}</Text>
                </View>
              )}
              
              {item.targetYears && item.targetYears.length > 0 && (
                <View style={styles.eventDetailRow}>
                  <Ionicons name="school" size={16} color="#ff3b3b" />
                  <Text style={styles.eventDetailText}>
                    Target Years: {formatTargets(item.targetYears)}
                  </Text>
                </View>
              )}
              
              {item.targetFaculties && item.targetFaculties.length > 0 && (
                <View style={styles.eventDetailRow}>
                  <Ionicons name="business" size={16} color="#ff3b3b" />
                  <Text style={styles.eventDetailText}>
                    Faculties: {formatTargets(item.targetFaculties)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
        </View>
      );
    }

    if (currentData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons 
              name={selectedTab === 'posts' ? "images-outline" : "calendar-outline"} 
              size={48} 
              color="#ff3b3b" 
            />
          </View>
          <Text style={styles.emptyText}>No {selectedTab} yet</Text>
          <Text style={styles.emptySubtext}>
            {selectedTab === 'posts' 
              ? 'This club hasn\'t posted anything yet' 
              : 'No upcoming events'}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={currentData}
        renderItem={renderGridItem}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
        columnWrapperStyle={styles.columnWrapper}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.headerActions} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.coverSection}>
          {clubDetails?.coverPicture ? (
            <Image
              source={{ uri: `${BASE_URL}${clubDetails.coverPicture}` }}
              style={styles.coverImage}
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={48} color="#666" />
            </View>
          )}
          
          <View style={styles.floatingAvatarContainer}>
            <View style={styles.avatarGlow}>
              {clubDetails?.profilePicture ? (
                <Image
                  source={{ uri: `${BASE_URL}${clubDetails.profilePicture}` }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/default-profile.png')}
                  style={styles.avatar}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.clubName}>{clubDetails?.clubName || "Club Name"}</Text>
          <Text style={styles.clubBio}>
            {clubDetails?.bio || "Welcome to our club"}
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="images-outline" size={20} color="#ff3b3b" />
              </View>
              <Text style={styles.statNumber}>{postCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#ff3b3b" />
              </View>
              <Text style={styles.statNumber}>{eventCount}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="people-outline" size={20} color="#ff3b3b" />
              </View>
              <Text style={styles.statNumber}>{subCount || 0}</Text>
              <Text style={styles.statLabel}>Subscribers</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.subscribeButton, { backgroundColor: isSubscribed ? '#666' : '#ff3b3b' }]}
            onPress={handleSubscribe}
            disabled={subscribeLoading}
          >
            {subscribeLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.subscribeButtonText}>
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              onPress={() => setSelectedTab('posts')}
              style={[styles.tabButton, selectedTab === 'posts' && styles.activeTab]}
            >
              <Ionicons 
                name="grid-outline" 
                size={20} 
                color={selectedTab === 'posts' ? '#ff3b3b' : '#666'} 
              />
              <Text style={[styles.tabText, selectedTab === 'posts' && styles.activeTabText]}>
                Posts
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setSelectedTab('events')}
              style={[styles.tabButton, selectedTab === 'events' && styles.activeTab]}
            >
              <Ionicons 
                name="calendar-outline" 
                size={20} 
                color={selectedTab === 'events' ? '#ff3b3b' : '#666'} 
              />
              <Text style={[styles.tabText, selectedTab === 'events' && styles.activeTabText]}>
                Events
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          {renderContent()}
        </View>
      </ScrollView>

      <Modal
        visible={showDetailView}
        animationType="slide"
        onRequestClose={() => setShowDetailView(false)}
      >
        <SafeAreaView style={styles.detailContainer}>
          <View style={styles.detailTopBar}>
            <TouchableOpacity 
              onPress={() => setShowDetailView(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.detailTitle}>
              {selectedTab === 'posts' ? 'Posts' : 'Events'}
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          <FlatList
            data={currentData}
            renderItem={renderDetailItem}
            keyExtractor={(item) => item.id.toString()}
            initialScrollIndex={selectedIndex}
            getItemLayout={(data, index) => ({
              length: screenHeight * 0.9,
              offset: screenHeight * 0.9 * index,
              index,
            })}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#1a1d1f' }} />}
          />
        </SafeAreaView>
      </Modal>

      <CommentsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0b0c' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#151718',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d1f',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    width: 28,
  },
  coverSection: {
    position: 'relative',
    height: 200,
    backgroundColor: '#151718',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1d1f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingAvatarContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    zIndex: 10,
  },
  avatarGlow: {
    padding: 4,
    borderRadius: 60,
    backgroundColor: '#0a0b0c',
    borderWidth: 4,
    borderColor: '#ff3b3b',
    shadowColor: '#ff3b3b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#151718',
  },
  clubName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  clubBio: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1d1f',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252829',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 59, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#151718',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#1a1d1f',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 6,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 59, 59, 0.15)',
  },
  tabText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ff3b3b',
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: GRID_SPACING,
  },
  gridItem: {
    width: imageSize,
    position: 'relative',
    backgroundColor: '#1a1d1f',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1d1f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  multipleImagesIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 6,
    padding: 4,
  },
  loadingContainer: {
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 59, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#0a0b0c',
  },
  detailTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#151718',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d1f',
  },
  detailTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: '#0a0b0c',
    paddingBottom: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  detailAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ff3b3b',
  },
  detailHeaderText: {
    flex: 1,
  },
  detailClubName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  detailTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  imageContainer: {
    height: screenWidth,
  },
  detailImage: {
    width: screenWidth,
    height: screenWidth,
  },
  detailPlaceholder: {
    width: screenWidth,
    height: screenWidth,
    backgroundColor: '#1a1d1f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff3b3b',
  },
  postActions: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 18,
  },
  actionButton: {
    padding: 4,
  },
  postStats: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },
  likesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsText: {
    color: '#999',
    fontSize: 14,
  },
  detailContent: {
    paddingHorizontal: 16,
  },
  eventName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailDescription: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionUsername: {
    fontWeight: '600',
    color: '#fff',
  },
  eventVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 59, 59, 0.1)',
    marginBottom: 0,
  },
  venueText: {
    color: '#ff3b3b',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  eventDetails: {
    marginTop: 16,
    gap: 10,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    color: '#ccc',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  
  // Comments Modal Styles
  commentsModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  commentsModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentsModalContent: {
    backgroundColor: '#151718',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.85,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d1f',
  },
  modalHandle: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
  },
  commentsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginTop: 8,
  },
  closeButton: {
    padding: 4,
  },
  commentsLoading: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  noComments: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  noCommentsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  noCommentsSubtext: {
    color: '#888',
    fontSize: 14,
  },
  commentsList: {
    paddingVertical: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#1a1d1f',
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentTime: {
    color: '#888',
    fontSize: 12,
  },
  replyButton: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#1a1d1f',
    backgroundColor: '#151718',
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 59, 59, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1d1f',
  },
  replyingToText: {
    color: '#ff3b3b',
    fontSize: 13,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#1a1d1f',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});