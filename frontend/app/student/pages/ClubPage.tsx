import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl, Text, Dimensions, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';
import axios from 'axios';

const { width } = Dimensions.get('window');

export type ClubDetailData = {
  id: number;
  clubName: string;
  userId: number;
  website: string;
  profilePicture: string;
  bio: string;
  subCount: number;
  isJoined?: boolean;
  description?: string;
  location?: string;
  contactEmail?: string;
  establishedYear?: number;
  category?: string;
};

// API function to fetch club details
const fetchClubDetails = async (clubId: string): Promise<ClubDetailData> => {
  try {
    // Get token from AsyncStorage
    const storedToken = await AsyncStorage.getItem('token');
    if (!storedToken) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${BASE_URL}/api/club/${clubId}`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    });

    return {
      ...response.data,
      isJoined: false, // This could be determined based on user's membership status
    };
  } catch (error) {
    console.error('Error fetching club details:', error);
    throw error;
  }
};

export default function ClubPage() {
  const { clubId } = useLocalSearchParams();
  const [clubDetails, setClubDetails] = useState<ClubDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  // Load club details function
  const loadClubDetails = async (isRefresh = false) => {
    if (!clubId || typeof clubId !== 'string') {
      setError('Invalid club ID');
      setLoading(false);
      return;
    }

    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      const details = await fetchClubDetails(clubId);
      setClubDetails(details);
      setIsJoined(details.isJoined || false);
    } catch (err) {
      setError('Failed to load club details. Please try again.');
      console.error('Error loading club details:', err);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  // Fetch club details on component mount
  useEffect(() => {
    loadClubDetails();
  }, [clubId]);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadClubDetails(true);
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleJoinToggle = async () => {
    if (!clubDetails) return;

    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const endpoint = isJoined ? 'leave' : 'join';
      await axios.post(`${BASE_URL}/api/club/${clubDetails.id}/${endpoint}`, {}, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });

      setIsJoined(!isJoined);
      // Update subCount based on join/leave action
      setClubDetails(prev => prev ? {
        ...prev,
        subCount: isJoined ? prev.subCount - 1 : prev.subCount + 1
      } : null);

      Alert.alert(
        'Success', 
        isJoined ? `You left ${clubDetails.clubName}` : `You joined ${clubDetails.clubName}`
      );
    } catch (error) {
      console.error('Error toggling club membership:', error);
      Alert.alert('Error', 'Failed to update membership status');
    }
  };

  const handleRetry = () => {
    loadClubDetails();
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={[styles.container, { backgroundColor }]}>
          <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
          <View style={[styles.header, { backgroundColor }]}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Club Details</Text>
          </View>
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <Text style={[styles.loadingText, { color: secondaryTextColor }]}>
              Loading club details...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={[styles.container, { backgroundColor }]}>
          <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
          <View style={[styles.header, { backgroundColor }]}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Club Details</Text>
          </View>
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color={iconColor} />
            <Text style={[styles.errorText, { color: textColor }]}>
              {error}
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: cardColor, borderColor }]}
              onPress={handleRetry}
            >
              <Text style={[styles.retryButtonText, { color: textColor }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!clubDetails) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <View style={[styles.container, { backgroundColor }]}>
          <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
          <View style={[styles.header, { backgroundColor }]}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Club Details</Text>
          </View>
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: textColor }]}>
              Club not found
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.container, { backgroundColor }]}>
        <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor }]}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Club Details</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={tintColor}
              colors={[tintColor]}
            />
          }
        >
          {/* Cover Image with Centered Profile Picture */}
          <View style={[styles.coverSection, { backgroundColor: cardColor }]}>
            <View style={[styles.coverImageContainer, { backgroundColor: cardColor }]}>
              <Image
                source={require("@/assets/clubImages/profilePictures/rota_cover.jpg")}
                style={styles.coverImage}
                resizeMode="cover"
              />
            </View>
            
            {/* Profile Picture centered on cover */}
            <View style={styles.profilePictureSection}>
              <View style={styles.profilePictureContainer}>
                <View style={[styles.profilePicture, { backgroundColor: cardColor, borderColor: backgroundColor }]}>
                  <Image 
                    source={imageError ? require("@/assets/clubImages/profilePictures/1.jpeg") : { uri: clubDetails.profilePicture }}
                    style={styles.profilePictureImage}
                    onError={() => setImageError(true)}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Club Info Section */}
          <View style={[styles.clubInfoSection, { backgroundColor }]}>
            {/* Club Name */}
            <Text style={[styles.clubName, { color: textColor }]}>{clubDetails.clubName}</Text>
            
            {/* Member Count */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color={iconColor} />
                <Text style={[styles.statText, { color: secondaryTextColor }]}>{clubDetails.subCount} members</Text>
              </View>
            </View>

            {/* Subscribe Button */}
            <TouchableOpacity 
              style={[
                styles.subscribeButton, 
                { backgroundColor: isJoined ? secondaryTextColor : tintColor }
              ]}
              onPress={handleJoinToggle}
            >
              <Ionicons 
                name={isJoined ? "checkmark" : "add"} 
                size={20} 
                color={backgroundColor} 
                style={styles.subscribeIcon}
              />
              <Text style={[styles.subscribeText, { color: backgroundColor }]}>
                {isJoined ? 'Subscribed' : 'Subscribe'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Club Details */}
          <View style={[styles.profileFields, { backgroundColor }]}>
            {/* Website Field */}
            {clubDetails.website && (
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: textColor }]}>Website</Text>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldValue, { color: secondaryTextColor }]}>{clubDetails.website}</Text>
                  <Ionicons name="globe-outline" size={16} color={iconColor} />
                </View>
              </View>
            )}

            {/* Bio Field */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: textColor }]}>About</Text>
              <View style={styles.fieldRow}>
                <Text style={[styles.fieldValue, styles.bioText, { color: secondaryTextColor }]}>
                  {clubDetails.bio || 'No description available.'}
                </Text>
              </View>
            </View>

            {/* Additional Info */}
            {clubDetails.category && (
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: textColor }]}>Category</Text>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldValue, { color: secondaryTextColor }]}>{clubDetails.category}</Text>
                  <Ionicons name="pricetag-outline" size={16} color={iconColor} />
                </View>
              </View>
            )}

            {clubDetails.location && (
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: textColor }]}>Location</Text>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldValue, { color: secondaryTextColor }]}>{clubDetails.location}</Text>
                  <Ionicons name="location-outline" size={16} color={iconColor} />
                </View>
              </View>
            )}

            {clubDetails.contactEmail && (
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: textColor }]}>Contact</Text>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldValue, { color: secondaryTextColor }]}>{clubDetails.contactEmail}</Text>
                  <Ionicons name="mail-outline" size={16} color={iconColor} />
                </View>
              </View>
            )}

            {clubDetails.establishedYear && (
              <View style={styles.fieldContainer}>
                <Text style={[styles.fieldLabel, { color: textColor }]}>Established</Text>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldValue, { color: secondaryTextColor }]}>{clubDetails.establishedYear}</Text>
                  <Ionicons name="calendar-outline" size={16} color={iconColor} />
                </View>
              </View>
            )}
          </View>

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  coverSection: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  coverImageContainer: {
    width: "100%",
    height: "100%",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  profilePictureSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePictureContainer: {
    position: "relative",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    overflow: "hidden",
  },
  profilePictureImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  clubInfoSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  clubName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 16,
    marginLeft: 4,
  },
  subscribeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  subscribeIcon: {
    marginRight: 8,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  profileFields: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldValue: {
    fontSize: 16,
    flex: 1,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 22,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomPadding: {
    height: 32,
  },
});
