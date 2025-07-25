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
      <Image 
        source={{ uri: `${BASE_URL}${club.profilePicture}` }}
        style={styles.clubImage}
      />
      <View style={styles.clubInfo}>
        <View style={styles.clubHeader}>
          <ThemedText style={[styles.clubName, { color: textColor }]}>{club.clubName}</ThemedText>
          {club.isJoined && (
            <View style={[styles.joinedBadge, { backgroundColor: tintColor }]}>
              <ThemedText style={styles.joinedText}>Joined</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={[styles.clubDescription, { color: secondaryTextColor }]}>
          {club.bio}
        </ThemedText>
        <View style={styles.clubMeta}>
          <ThemedText style={[styles.clubCategory, { color: tintColor }]}>
            {club.website}
          </ThemedText>
          <ThemedText style={[styles.memberCount, { color: secondaryTextColor }]}>
            {club.subCount} members
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clubsList: {
    flex: 1,
  },
  clubsListContent: {
    paddingHorizontal: 16,
  },
  clubCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  clubImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  clubInfo: {
    flex: 1,
  },
  clubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  joinedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinedText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  clubDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  clubMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clubCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
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
    fontWeight: '600',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
