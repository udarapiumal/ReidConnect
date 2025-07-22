import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ClubData = {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  image: string;
  isJoined: boolean;
};

// Mock data for clubs
const clubsData: ClubData[] = [
  {
    id: '1',
    name: 'UCSC Rotaract Club',
    description: 'Community service and leadership development',
    category: 'Community Service',
    memberCount: 245,
    image: require('@/assets/clubImages/profilePictures/rota_ucsc.jpg'),
    isJoined: false,
  },
  {
    id: '2',
    name: 'Computer Science Society',
    description: 'For tech enthusiasts and CS students',
    category: 'Technology',
    memberCount: 189,
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=200&auto=format&fit=crop',
    isJoined: true,
  },
  {
    id: '3',
    name: 'Photography Club',
    description: 'Capture moments and share your vision',
    category: 'Arts',
    memberCount: 156,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop',
    isJoined: false,
  },
  {
    id: '4',
    name: 'Music Society',
    description: 'For music lovers and performers',
    category: 'Music',
    memberCount: 201,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=200&auto=format&fit=crop',
    isJoined: false,
  },
  {
    id: '5',
    name: 'Sports Club',
    description: 'Stay active and compete in various sports',
    category: 'Sports',
    memberCount: 312,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop',
    isJoined: true,
  },
  {
    id: '6',
    name: 'Debate Society',
    description: 'Develop your oratory and critical thinking skills',
    category: 'Education',
    memberCount: 98,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    isJoined: false,
  },
  {
    id: '7',
    name: 'Environmental Club',
    description: 'Protecting our planet through action',
    category: 'Environment',
    memberCount: 167,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=200&auto=format&fit=crop',
    isJoined: false,
  },
  {
    id: '8',
    name: 'Drama Society',
    description: 'Express yourself through theater and performance',
    category: 'Arts',
    memberCount: 134,
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?q=80&w=200&auto=format&fit=crop',
    isJoined: false,
  },
];

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
        source={typeof club.image === 'string' ? { uri: club.image } : club.image}
        style={styles.clubImage}
      />
      <View style={styles.clubInfo}>
        <View style={styles.clubHeader}>
          <ThemedText style={[styles.clubName, { color: textColor }]}>{club.name}</ThemedText>
          {club.isJoined && (
            <View style={[styles.joinedBadge, { backgroundColor: tintColor }]}>
              <ThemedText style={styles.joinedText}>Joined</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={[styles.clubDescription, { color: secondaryTextColor }]}>
          {club.description}
        </ThemedText>
        <View style={styles.clubMeta}>
          <ThemedText style={[styles.clubCategory, { color: tintColor }]}>
            {club.category}
          </ThemedText>
          <ThemedText style={[styles.memberCount, { color: secondaryTextColor }]}>
            {club.memberCount} members
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(clubsData);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClubs(clubsData);
    } else {
      const filtered = clubsData.filter(club =>
        club.name.toLowerCase().includes(query.toLowerCase()) ||
        club.description.toLowerCase().includes(query.toLowerCase()) ||
        club.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  };

  const handleClubPress = (club: ClubData) => {
    // Navigate to club details page
    console.log('Navigate to club:', club.name);
    // You can implement navigation to club details here
  };

  const handleBackPress = () => {
    router.back();
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
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Feather name="x" size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Clubs List */}
      <FlatList
        data={filteredClubs}
        renderItem={({ item }) => (
          <ClubCard club={item} onPress={() => handleClubPress(item)} />
        )}
        keyExtractor={item => item.id}
        style={styles.clubsList}
        contentContainerStyle={styles.clubsListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* No results */}
      {filteredClubs.length === 0 && searchQuery.length > 0 && (
        <View style={styles.noResults}>
          <Feather name="search" size={48} color={iconColor} />
          <ThemedText style={[styles.noResultsText, { color: textColor }]}>
            No clubs found for "{searchQuery}"
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
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
