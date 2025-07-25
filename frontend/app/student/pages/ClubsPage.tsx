import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';
import axios from 'axios';

export type ClubData = {
  id: number;
  clubName: string;
  userId: number;
  website: string;
  profilePicture: string;
  bio: string;
  subCount: number;
  isJoined?: boolean; // This will be determined locally
};

// API function to fetch clubs
const fetchClubs = async (): Promise<ClubData[]> => {
  try {
    // Get token from AsyncStorage
    const storedToken = await AsyncStorage.getItem('token');
    if (!storedToken) {
      console.warn('No authentication token found');
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${BASE_URL}/api/club`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    });

    return response.data.map((club: ClubData) => ({
      ...club,
      isJoined: false, // Default value, can be updated based on user interaction
    }));
    
  } catch (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }
};

type ClubCardProps = {
  club: ClubData;
  onPress: () => void;
};

function ClubCard({ club, onPress }: ClubCardProps) {
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  return (
    <TouchableOpacity 
      style={[styles.clubCard, { backgroundColor: cardColor, borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.clubImageWrapper}>
  <Image 
    source={{ uri: `${BASE_URL}${club.profilePicture}` }}
    style={styles.clubImage}
  />
</View>

      <View style={styles.clubInfo}>
        <View style={styles.clubHeader}>
          <ThemedText style={[styles.clubName, { color: textColor }]}>{club.clubName}</ThemedText>
          {club.isJoined && (
            <View style={[styles.joinedBadge, { backgroundColor: tintColor }]}>
              <ThemedText style={styles.joinedText}>Joined</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={[styles.clubDescription]}>
          {club.bio}
        </ThemedText>
        <View style={styles.clubMeta}>
          <ThemedText style={[styles.clubCategory]}>
            {club.website}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<ClubData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');

  // Load clubs function
  const loadClubs = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);
      const fetchedClubs = await fetchClubs();
      setClubs(fetchedClubs);
      setFilteredClubs(fetchedClubs);
    } catch (err) {
      setError('Failed to load clubs. Please try again.');
      console.error('Error loading clubs:', err);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  // Fetch clubs from API on component mount
  useEffect(() => {
    loadClubs();
  }, []);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadClubs(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClubs(clubs);
    } else {
      const filtered = clubs.filter((club: ClubData) =>
        club.clubName.toLowerCase().includes(query.toLowerCase()) ||
        club.bio.toLowerCase().includes(query.toLowerCase()) ||
        club.website.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  };

  const handleClubPress = (club: ClubData) => {
    // Navigate to club details page
    console.log('Navigate to club:', club.clubName);
    router.push({
      pathname: '/student/pages/ClubPage',
      params: { clubId: club.id.toString() }
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleRetry = () => {
    loadClubs();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={iconColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Clubs</ThemedText>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: cardColor, borderColor }]}>
        <Feather name="search" size={20} color={iconColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search clubs..."
          placeholderTextColor={iconColor}
          value={searchQuery}
          onChangeText={handleSearch}
          editable={!loading}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Feather name="x" size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={iconColor} />
          <ThemedText style={[styles.loadingText, { color: textColor }]}>
            Loading clubs...
          </ThemedText>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={48} color={iconColor} />
          <ThemedText style={[styles.errorText, { color: textColor }]}>
            {error}
          </ThemedText>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: cardColor, borderColor }]}
            onPress={handleRetry}
          >
            <ThemedText style={[styles.retryButtonText, { color: textColor }]}>
              Retry
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {/* Clubs List */}
      {!loading && !error && (
        <FlatList
          data={filteredClubs}
          renderItem={({ item }) => (
            <ClubCard club={item} onPress={() => handleClubPress(item)} />
          )}
          keyExtractor={item => item.id.toString()}
          style={styles.clubsList}
          contentContainerStyle={styles.clubsListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={iconColor}
              colors={[iconColor]}
            />
          }
        />
      )}

      {/* No results */}
      {!loading && !error && filteredClubs.length === 0 && searchQuery.length > 0 && (
        <View style={styles.centerContainer}>
          <Feather name="search" size={48} color={iconColor} />
          <ThemedText style={[styles.noResultsText, { color: textColor }]}>
            No clubs found for "{searchQuery}"
          </ThemedText>
        </View>
      )}

      {/* No clubs available */}
      {!loading && !error && clubs.length === 0 && searchQuery.length === 0 && (
        <View style={styles.centerContainer}>
          <Feather name="users" size={48} color={iconColor} />
          <ThemedText style={[styles.noResultsText, { color: textColor }]}>
            No clubs available
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  // Updates and additions for modern clean look
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderColor: '#e0e0e0',
},

searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 14,
  paddingHorizontal: 16,
  paddingVertical: 12,
  marginHorizontal: 20,
  marginTop: 16,
  marginBottom: 8,
  backgroundColor: '#f2f2f2',
  elevation: 2,
},

searchInput: {
  flex: 1,
  fontSize: 16,
  fontWeight: '500',
  paddingVertical: 4,
  marginLeft: 8,
},

joinedBadge: {
  backgroundColor: '#2DC653',
  borderRadius: 12,
  paddingVertical: 4,
  paddingHorizontal: 10,
},

joinedText: {
  fontSize: 12,
  fontWeight: '600',
  color: 'white',
},

clubCategory: {
  fontSize: 13,
  fontWeight: '600',
  color: '#1591EA',
},

retryButton: {
  backgroundColor: '#2DC653',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginTop: 16,
  elevation: 2,
},

retryButtonText: {
  fontSize: 15,
  fontWeight: '600',
  color: '#fff',
},

centerContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 32,
  gap: 12,
},

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: -2,
  },
  headerDivider: {
    height: 1,
    marginTop: 16,
    marginHorizontal: 20,
    opacity: 0.3,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clearButton: {
    padding: 4,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginLeft: 4,
  },
  clubsList: {
    flex: 1,
  },
  clubsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(99, 102, 241, 0.5)',
  },
  clubImageContainer: {
    position: 'relative',
    marginRight: 16,
  },

  imageOverlay: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    opacity: 0.1,
    zIndex: -1,
  },
  clubInfo: {
    flex: 1,
  },
  clubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  clubMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  websiteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
 
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    borderWidth: 4,
    borderRadius: 24,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  clubCard: {
  flexDirection: 'row',
  borderRadius: 20,
  marginBottom: 20,
  padding: 20,
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#ddd',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
},

clubImageWrapper: {
  width: 85,
  height: 85,
  borderRadius: 100,
  borderWidth: 2,
  padding: 2,
  shadowOpacity: 0.4,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  backgroundColor: '#fff',
  marginRight: 16,
  justifyContent: 'center',
  alignItems: 'center',
},

clubImage: {
  width: 80,
  height: 80,
  borderRadius: 100,
},

clubName: {
  fontSize: 18,
  fontWeight: '800',
  marginBottom: 4,
},

clubDescription: {
  fontSize: 14,
  fontWeight: '500',
  lineHeight: 20,
  marginBottom: 8,
  color: '#555',
},

  
});
