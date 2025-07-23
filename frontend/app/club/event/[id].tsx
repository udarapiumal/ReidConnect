import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useClub } from '../../context/ClubContext';

const { width } = Dimensions.get('window');

// Time slots from 8 AM to 5 PM
const TIME_SLOTS = [
  { time: '08:00', label: '8:00 AM' },
  { time: '08:30', label: '8:30 AM' },
  { time: '09:00', label: '9:00 AM' },
  { time: '09:30', label: '9:30 AM' },
  { time: '10:00', label: '10:00 AM' },
  { time: '10:30', label: '10:30 AM' },
  { time: '11:00', label: '11:00 AM' },
  { time: '11:30', label: '11:30 AM' },
  { time: '12:00', label: '12:00 PM' },
  { time: '12:30', label: '12:30 PM' },
  { time: '13:00', label: '1:00 PM' },
  { time: '13:30', label: '1:30 PM' },
  { time: '14:00', label: '2:00 PM' },
  { time: '14:30', label: '2:30 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '15:30', label: '3:30 PM' },
  { time: '16:00', label: '4:00 PM' },
  { time: '16:30', label: '4:30 PM' },
  { time: '17:00', label: '5:00 PM' },
  { time: '17:30', label: '5:30 PM' },
];

// Mapping slot IDs to time slots 
const SLOT_ID_TO_TIME_MAPPING = {
  1: '08:00',
  2: '08:30',
  3: '09:00',
  4: '09:30',
  5: '10:00',
  6: '10:30',
  7: '11:00',
  8: '11:30',
  9: '12:00',
  10: '12:30',
  11: '13:00',
  12: '13:30',
  13: '14:00',
  14: '14:30',
  15: '15:00',
  16: '15:30',
  17: '16:00',
  18: '16:30',
  19: '17:00',
  20: '17:30',
};

const EventDetailsScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token, clubDetails } = useClub();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const eventData = response.data;

      const [going, interested] = await Promise.all([
        axios.get(`${BASE_URL}/api/events/${eventData.id}/attendance/going`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/events/${eventData.id}/attendance/interested`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const enrichedEvent = {
        ...eventData,
        goingCount: going.data,
        interestedCount: interested.data,
      };

      setEvent(enrichedEvent);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostStats = async (postId) => {
        try {
            const [likesResponse, commentsResponse] = await Promise.all([
                axios.get(`${BASE_URL}/api/posts/${postId}/likes/count`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/api/comments/post/${postId}/count`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            return {
                likeCount: likesResponse.data || 0,
                commentCount: commentsResponse.data || 0
            };
        } catch (error) {
            console.error(`Error fetching stats for post ${postId}:`, error);
            return { likeCount: 0, commentCount: 0 };
        }
    };

  const fetchPostsForEvent = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/posts/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const posts = response.data;

       // Fetch stats for each post
            const postsWithStats = await Promise.all(
                posts.map(async (post) => {
                    const stats = await fetchPostStats(post.id);
                    return {
                        ...post,
                        likeCount: stats.likeCount,
                        commentCount: stats.commentCount
                    };
                })
            );

      setPosts(postsWithStats);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const formatTime = (time24) => {
    const [hour, minute] = time24.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${suffix}`;
  };

  const deleteEvent = async () => {
  try {
    await axios.delete(`${BASE_URL}/api/events/${event.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Event deleted successfully');
    router.back(); // Or navigate to a different page like router.replace('/club/events')
  } catch (error) {
    console.error('Failed to delete event:', error);
    alert('Failed to delete event. Please try again.');
  }
};


  useEffect(() => {
    fetchEvent();
    fetchPostsForEvent();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {event.imagePath && (
            <View style={styles.imageContainer}>
              <Image
                source={{ 
                  uri: event.imagePath.startsWith('uploads/') 
                    ? `${BASE_URL}/${event.imagePath}` 
                    : `${BASE_URL}/uploads/${event.imagePath}` 
                }}
                style={styles.heroImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.imageOverlay}
              />
            </View>
          )}
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => router.back()}>
            <Text style={styles.addButtonText}>Link a Post</Text>
            <Ionicons name="add-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Event Title */}
          <Text style={styles.eventTitle}>{event.name}</Text>
          
          {/* Event Date Badge */}
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{event.date}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteEvent}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

          </View>

          {/* Event Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color="#4ECDC4" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Venue</Text>
                <Text style={styles.detailValue}>{event.venueName || 'No venue specified'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="time" size={20} color="#4ECDC4" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time</Text>
                {event.slotIds && event.slotIds.length > 0 ? (() => {
                  const sorted = event.slotIds.sort((a, b) => a - b);
                  const startId = sorted[0];
                  const endId = sorted[sorted.length - 1] + 1;
                  const startTime = SLOT_ID_TO_TIME_MAPPING[startId];
                  const endTime = SLOT_ID_TO_TIME_MAPPING[endId];
                  
                  return (
                    <Text style={styles.detailValue}>
                      {formatTime(startTime)} - {formatTime(endTime)}
                    </Text>
                  );
                })() : (
                  <Text style={styles.detailValue}>No time assigned</Text>
                )}
              </View>
            </View>
          </View>

          {/* Attendance Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="people" size={24} color="#007aff" />
              </View>
              <Text style={styles.statNumber}>{event.goingCount || 0}</Text>
              <Text style={styles.statLabel}>going</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="heart" size={24} color="#EF4444" />
              </View>
              <Text style={styles.statNumber}>{event.interestedCount || 0}</Text>
              <Text style={styles.statLabel}>interested</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>What to expect</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* Posts Section */}
<View style={styles.postsSection}>
  <View style={styles.postsHeader}>
    <Text style={styles.sectionTitle}>Recent posts</Text>
    <TouchableOpacity>
      <Text style={styles.seeAllText}>See all</Text>
    </TouchableOpacity>
  </View>
  
  {postsLoading ? (
    <View style={styles.postsLoadingContainer}>
      {[1, 2].map((item) => (
        <View key={item} style={styles.postShimmer}>
          <View style={styles.shimmerContent}>
            <View style={[styles.shimmerLine, { width: '80%' }]} />
            <View style={[styles.shimmerLine, { width: '60%' }]} />
            <View style={styles.shimmerTimestamp} />
          </View>
          <View style={styles.shimmerImage} />
        </View>
      ))}
    </View>
  ) : posts.length === 0 ? (
    <View style={styles.emptyPostsContainer}>
      <Text style={styles.emptyPostsText}>No posts yet</Text>
    </View>
  ) : (
    posts.map((post) => (
      <TouchableOpacity
        key={post.id}
        style={styles.postCard}
        onPress={() => router.push(`/club/post/${post.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.postContent}>
          <Text style={styles.postDescription} numberOfLines={2}>
            {post.description}
          </Text>
          
          <View style={styles.postFooter}>
            <View style={styles.postStats}>
              <View style={styles.postStat}>
                <Ionicons name="heart" size={16} color="#666" />
                <Text style={styles.postStatText}>{post.likeCount}</Text>
              </View>
              <View style={styles.postStat}>
                <Ionicons name="chatbubble" size={16} color="#666" />
                <Text style={styles.postStatText}>{post.commentCount}</Text>
              </View>
            </View>
            
            <Text style={styles.postTimestamp}>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Post Media - only show first image */}
        {post.mediaPaths && post.mediaPaths.length > 0 && (
          <Image
            source={{ uri: `${BASE_URL}/${post.mediaPaths[0]}` }}
            style={styles.postImage}
          />
        )}
      </TouchableOpacity>
    ))
  )}
</View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  heroSection: {
    position: 'relative',
    height: 300,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButton: {
  position: 'absolute',
  top: 50,
  right: 20,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(0,0,0,0.6)',
  zIndex: 1,
},
addButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
  marginRight: 6, // space between text and icon
  fontWeight: '500',
},


  contentSection: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 34,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333333',
    marginHorizontal: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
  },
  postsSection: {
    marginBottom: 32,
  },
  
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  seeAllText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  
  postCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  
  postContent: {
    flex: 1,
    paddingRight: 16,
  },
  
  postDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  postStatText: {
    fontSize: 14,
    color: '#888',
  },
  
  postTimestamp: {
    fontSize: 14,
    color: '#666',
  },
  
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
  },
  
  // Loading states
  postsLoadingContainer: {
    gap: 16,
  },
  
  postShimmer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  
  shimmerContent: {
    flex: 1,
    paddingRight: 16,
  },
  
  shimmerLine: {
    height: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginBottom: 8,
  },
  
  shimmerTimestamp: {
    height: 14,
    width: '30%',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginTop: 4,
  },
  
  shimmerImage: {
    width: 60,
    height: 60,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
  },
  
  // Empty state
  emptyPostsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  
  emptyPostsText: {
    color: '#666',
    fontSize: 16,
  },

});

export default EventDetailsScreen;