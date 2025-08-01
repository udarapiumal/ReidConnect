import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useThemeColor } from '../../../hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const { width: screenWidth } = Dimensions.get('window');
const imageSize = (screenWidth - 4) / 3; // 3 columns with 2px gaps
const router = useRouter();

const formatTimeAgo = (timestamp: string) => {
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
  const [token, setToken] = useState<string | null>(null);
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
  const [postStats, setPostStats] = useState({}); // Store like/comment counts for posts
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [clubDetails, setClubDetails] = useState<any>(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const buttonColor = useThemeColor({}, 'button');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

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
      const decoded: any = jwtDecode(storedToken);
      console.log('Decoded token:', decoded);
      setUser(decoded); // ✅ SET USER HERE
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


  // Function to fetch club details (should be passed as props or from route params)
  const fetchClubDetails = async (clubId: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/club/${clubId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
      setClubDetails(res.data);
    } catch (error) {
      console.error('Error fetching club details:', error);
    }
  };

  // Function to check subscription status
  const checkSubscriptionStatus = async () => {
  if (!clubDetails?.id || !user?.id) return;
  try {
    const res = await axios.get(
      `${BASE_URL}/api/subscriptions/check/${clubDetails.id}?userId=${user.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setIsSubscribed(res.data === true);
  } catch (error) {
    console.error('Error checking subscription status:', error);
    setIsSubscribed(false);
  }
};


  // Function to handle subscription
  const handleSubscribe = async () => {
    if (!clubDetails?.id || subscribeLoading || !user?.id) return;
    
    setSubscribeLoading(true);
    try {
      if (isSubscribed) {
        // Unsubscribe
        await axios.post(`${BASE_URL}/api/subscriptions/unsubscribe`, 
          { 
            userId: user.id,
            clubId: clubDetails.id 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSubscribed(false);
        Alert.alert('Success', 'Unsubscribed successfully!');
      } else {
        // Subscribe
        await axios.post(`${BASE_URL}/api/subscriptions/subscribe`, 
          { 
            userId: user.id,
            clubId: clubDetails.id 
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsSubscribed(true);
        Alert.alert('Success', 'Subscribed successfully!');
      }
      fetchSubCount(); // Refresh subscriber count
    } catch (error) {
      console.error('Error handling subscription:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  const fetchSubCount = async () => {
    try {
      const [subCountResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/subscriptions/club/${clubDetails.id}/count`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);
      console.log(subCountResponse.data);
      setSubCount(subCountResponse.data || 0);
    } catch (error) {
      console.error(`Error fetching subCount:`, error);
      return { subCount: 0 };
    }
  };

  const fetchPostStats = async (postId: number) => {
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

  const fetchAllPostStats = async (postsData: any[]) => {
    try {
      const statsPromises = postsData.map((post: any) => fetchPostStats(post.id));
      const statsResults = await Promise.all(statsPromises);
      
      const statsMap: any = {};
      postsData.forEach((post: any, index: number) => {
        statsMap[post.id] = statsResults[index];
      });
      
      setPostStats(statsMap);
    } catch (error) {
      console.error('Error fetching all post stats:', error);
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
      
      // Fetch stats for all posts
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


  // Initialize club details from route params
  useEffect(() => {
  if (clubId && typeof clubId === 'string' && token) {
    fetchClubDetails(clubId);
  }
}, [clubId, token]);


  const currentData = selectedTab === 'posts' ? posts : events;

  const handleItemPress = (index: number) => {
    setSelectedIndex(index);
    setShowDetailView(true);
  };

  const renderGridItem = ({ item, index }: { item: any; index: number }) => {
    // Handle different image path structures for posts vs events
    const imageUri = selectedTab === 'posts' 
      ? (item.mediaPaths?.[0] ? `${BASE_URL}/${item.mediaPaths[0]}` : null)
      : (item.imagePath ? `${BASE_URL}/${item.imagePath}` : null);
    
    return (
      <TouchableOpacity 
        style={styles.gridItem} 
        onPress={() => handleItemPress(index)}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.gridImage}
            onError={(error) => {
              console.log('Image load error:', error.nativeEvent.error);
            }}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons 
              name={selectedTab === 'posts' ? "image-outline" : "calendar-outline"} 
              size={32} 
              color="#666" 
            />
          </View>
        )}
        {/* Multiple images indicator - only for posts */}
        {selectedTab === 'posts' && item.mediaPaths && item.mediaPaths.length > 1 && (
          <View style={styles.multipleImagesIndicator}>
            <Ionicons name="copy-outline" size={16} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDetailItem = ({ item, index }: { item: any; index: number }) => {
    const isEvent = selectedTab === 'events';
    const images = isEvent ? (item.imagePath ? [item.imagePath] : []) : (item.mediaPaths || []);
    
    // Get post stats for this item (only for posts)
    const stats = !isEvent ? (postStats as any)[item.id] || { likeCount: 0, commentCount: 0 } : null;
    
    // Format target years and faculties for events
    const formatTargets = (targets: string[]) => {
      if (!targets || targets.length === 0) return '';
      return targets.map((target: string) => target.replace('_', ' ')).join(', ');
    };

    // Format date for events
    const formatEventDate = (dateString: string) => {
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
                uri: clubDetails.imagePath?.startsWith('uploads/') 
                ? `${BASE_URL}/${clubDetails.imagePath}` 
                : `${BASE_URL}/uploads/${clubDetails.imagePath}` 
            }}
            style={styles.detailAvatar}
          />
          <View style={styles.detailHeaderText}>
            <Text style={[styles.detailClubName, { color: textColor }]}>{clubDetails?.clubName || "Club Name"}</Text>
            <Text style={styles.detailTime}>{formatTimeAgo(item.createdAt)}</Text>
          </View>
        </View>
        
        {/* Event venue header - only for events */}
        {isEvent && (
          <View style={styles.eventVenue}>
            <Ionicons name="location-outline" size={16} color="#0095f6" />
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
            images.map((path: string, idx: number) => (
              <Image
                key={idx}
                source={{ uri: `${BASE_URL}/${path}` }}
                style={styles.detailImage}
                onError={(error) => {
                  console.log('Detail image load error:', error.nativeEvent.error);
                }}
              />
            ))
          ) : (
            <View style={styles.detailPlaceholder}>
              <Ionicons 
                name={isEvent ? "calendar-outline" : "image-outline"} 
                size={64} 
                color="#666" 
              />
              <Text style={styles.placeholderText}>
                {isEvent ? 'Event image' : 'No image available'}
              </Text>
            </View>
          )}
        </ScrollView>
        
        {images.length > 1 && (
          <View style={styles.imageIndicators}>
            {images.map((_: any, idx: number) => (
              <View key={idx} style={styles.indicator} />
            ))}
          </View>
        )}

        {/* Post Actions and Stats - only for posts */}
        {!isEvent && (
          <View style={styles.postActions}>
            <View style={styles.postActionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color={textColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color={textColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="paper-plane-outline" size={24} color={textColor} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Like and Comment Count - only for posts */}
        {!isEvent && stats && (
          <View style={styles.postStats}>
            {stats.likeCount > 0 && (
              <Text style={[styles.likesText, { color: textColor }]}>
                {stats.likeCount === 1 ? '1 like' : `${stats.likeCount} likes`}
              </Text>
            )}
            {stats.commentCount > 0 && (
              <TouchableOpacity>
                <Text style={styles.commentsText}>
                  View {stats.commentCount === 1 ? '1 comment' : `all ${stats.commentCount} comments`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        <View style={styles.detailContent}>
          {/* Event name - highlighted for events */}
          {isEvent && (
            <Text style={[styles.eventName, { color: textColor }]}>{item.name}</Text>
          )}
          
          <Text style={[styles.detailDescription, { color: textColor }]}>
            {item.description || 'No description'}
          </Text>
          
          {/* Event specific details */}
          {isEvent && (
            <View style={styles.eventDetails}>
              {item.date && (
                <View style={styles.eventDetailRow}>
                  <Ionicons name="calendar" size={16} color="#0095f6" />
                  <Text style={styles.eventDetailText}>{formatEventDate(item.date)}</Text>
                </View>
              )}
              
              {item.targetYears && item.targetYears.length > 0 && (
                <View style={styles.eventDetailRow}>
                  <Ionicons name="school" size={16} color="#0095f6" />
                  <Text style={styles.eventDetailText}>
                    Target Years: {formatTargets(item.targetYears)}
                  </Text>
                </View>
              )}
              
              {item.targetFaculties && item.targetFaculties.length > 0 && (
                <View style={styles.eventDetailRow}>
                  <Ionicons name="business" size={16} color="#0095f6" />
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                   <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                
                  <Text style={[styles.title, { color: textColor }]}>Profile</Text>
                
                <View style={styles.headerActions}>
                </View>
              </View>
      {/* Header */}
      <View style={[styles.profileHeader, { backgroundColor }]}>
        <View style={styles.profileTopRow}>
          {clubDetails?.profilePicture ? (
              <Image
          source={{
              uri: `${BASE_URL}${clubDetails.profilePicture}`
          }}
          style={styles.avatar}
          />
          ) : (
              <Image
              source={require('../../../assets/images/default-profile.png')} // fallback image
              style={styles.avatar}
              />
          )}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>{postCount}</Text>
              <Text style={[styles.statLabel, { color: textColor }]}>posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>{eventCount}</Text>
              <Text style={[styles.statLabel, { color: textColor }]}>events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: textColor }]}>{subCount || 0}</Text>
              <Text style={[styles.statLabel, { color: textColor }]}>subscribers</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[styles.clubName, { color: textColor }]}>{clubDetails?.clubName || "Club Name"}</Text>
          <Text style={[styles.clubBio, { color: textColor }]}>
            {clubDetails?.bio || "Club Name"}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.subscribeButton, { backgroundColor: isSubscribed ? '#666' : buttonColor }]}
            onPress={handleSubscribe}
            disabled={subscribeLoading}
          >
            {subscribeLoading ? (
              <ActivityIndicator size="small" color={buttonTextColor} />
            ) : (
              <Text style={[styles.subscribeButtonText, { color: buttonTextColor }]}>
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={[styles.tabSwitcher, { borderTopColor: borderColor }]}>
        <TouchableOpacity
          onPress={() => setSelectedTab('posts')}
          style={[styles.tabButton, selectedTab === 'posts' && { borderBottomColor: textColor }]}
        >
          <Ionicons 
            name="grid-outline" 
            size={24} 
            color={selectedTab === 'posts' ? textColor : '#666'} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('events')}
          style={[styles.tabButton, selectedTab === 'events' && { borderBottomColor: textColor }]}
        >
          <Ionicons 
            name="calendar-outline" 
            size={24} 
            color={selectedTab === 'events' ? textColor : '#666'} 
          />
        </TouchableOpacity>
      </View>

      {/* Grid Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={currentData}
          renderItem={renderGridItem}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.gridContainer}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Feather 
                name={selectedTab === 'posts' ? "image" : "calendar"} 
                size={48} 
                color="#666" 
              />
              <Text style={[styles.emptyText, { color: textColor }]}>
                No {selectedTab} yet
              </Text>
            </View>
          )}
        />
      )}

      {/* Detail View Modal */}
      <Modal
        visible={showDetailView}
        animationType="slide"
        onRequestClose={() => setShowDetailView(false)}
      >
        <SafeAreaView style={[styles.detailContainer, { backgroundColor }]}>
          <View style={[styles.detailTopBar, { borderBottomColor: borderColor }]}>
            <TouchableOpacity 
              onPress={() => setShowDetailView(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.detailTitle, { color: textColor }]}>
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
              length: screenWidth + 200, // Approximate item height
              offset: (screenWidth + 200) * index,
              index,
            })}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    width: 44,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  searchButton: {
    width: 44,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonActive: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  
  // Profile Header
  profileHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginRight: 24,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  profileInfo: {
    marginBottom: 16,
  },
  clubName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  clubBio: {
    fontSize: 14,
    lineHeight: 18,
  },
  actionButtons: {
    marginTop: 16,
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#0095f6',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#262626',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Tab Switcher
  tabSwitcher: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },

  // Grid
  gridContainer: {
    paddingTop: 2,
  },
  gridItem: {
    width: imageSize,
    height: imageSize,
    position: 'relative',
    backgroundColor: '#1a1a1a', // Keep this as fallback
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a', // Keep this as fallback
    justifyContent: 'center',
    alignItems: 'center',
  },
  multipleImagesIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    marginTop: 16,
  },

  // Detail View
  detailContainer: {
    flex: 1,
  },
  detailTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: 4,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailCard: {
    marginBottom: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  detailHeaderText: {
    flex: 1,
  },
  detailClubName: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 1,
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
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0095f6',
  },
  
  // Post Actions and Stats (new styles)
  postActions: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  postActionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  postStats: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentsText: {
    color: '#999',
    fontSize: 14,
  },
  
  detailContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  eventVenue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#111',
    marginBottom: 2,
  },
  venueText: {
    color: '#0095f6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  eventDetails: {
    marginTop: 12,
    gap: 8,
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
});