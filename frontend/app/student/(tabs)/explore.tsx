import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { CategoryCard, CategoryData } from '@/components/CategoryCard';
import { EventCard, EventData } from '@/components/EventCard';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data
const categories: CategoryData[] = [
  {
    id: '1',
    name: 'Clubs',
    icon: 'users',
    colors: ['#667eea', '#764ba2'],
  },
  {
    id: '2',
    name: 'Music',
    icon: 'music',
    colors: ['#4c669f', '#3b5998'],
  },
  {
    id: '3',
    name: 'Sports',
    icon: 'activity',
    colors: ['#ff4b1f', '#ff9068'],
  },
  {
    id: '4',
    name: 'Food',
    icon: 'coffee',
    colors: ['#11998e', '#38ef7d'],
  },
  {
    id: '5',
    name: 'Arts',
    icon: 'image',
    colors: ['#8e2de2', '#4a00e0'],
  },
  {
    id: '6',
    name: 'Technology',
    icon: 'cpu',
    colors: ['#2193b0', '#6dd5ed'],
  },
  {
    id: '7',
    name: 'Education',
    icon: 'book',
    colors: ['#373b44', '#4286f4'],
  },
  {
    id: '8',
    name: 'Health',
    icon: 'heart',
    colors: ['#ff9a9e', '#fecfef'],
  },
  {
    id: '9',
    name: 'Business',
    icon: 'briefcase',
    colors: ['#ffecd2', '#fcb69f'],
  },
  {
    id: '10',
    name: 'Gaming',
    icon: 'monitor',
    colors: ['#a8edea', '#fed6e3'],
  },
  {
    id: '11',
    name: 'Travel',
    icon: 'map-pin',
    colors: ['#fad0c4', '#ffd1ff'],
  },
  {
    id: '12',
    name: 'Environment',
    icon: 'globe',
    colors: ['#89f7fe', '#66a6ff'],
  },
];

const popularEvents: EventData[] = [
  {
    id: 1,
    clubId: 1,
    name: 'Summer Music Festival',
    description: 'Join us for an amazing summer music festival featuring local and international artists.',
    date: 'Jul 15, 2025',
    imagePath: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
    slotIds: [1, 2],
    targetFaculties: ['All'],
    targetYears: ['All'],
    venueId: 1,
    venueName: 'Central Park',
    createdAt: '2025-07-01T00:00:00.000Z',
    category: 'Music',
    going: 245,
    interested: 189,
  },
  {
    id: 2,
    clubId: 2,
    name: 'Tech Conference 2025',
    description: 'Explore the latest in technology with industry experts and networking opportunities.',
    date: 'Aug 10, 2025',
    imagePath: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
    slotIds: [3, 4],
    targetFaculties: ['Engineering', 'Science'],
    targetYears: ['2nd', '3rd', '4th'],
    venueId: 2,
    venueName: 'Convention Center',
    createdAt: '2025-07-01T00:00:00.000Z',
    category: 'Technology',
    going: 156,
    interested: 234,
  },
  {
    id: 3,
    clubId: 3,
    name: 'Food & Wine Festival',
    description: 'Taste amazing cuisine from around the world and discover new flavors.',
    date: 'Jul 22, 2025',
    imagePath: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
    slotIds: [5, 6],
    targetFaculties: ['All'],
    targetYears: ['All'],
    venueId: 3,
    venueName: 'Downtown Plaza',
    createdAt: '2025-07-01T00:00:00.000Z',
    category: 'Food',
    going: 89,
    interested: 167,
  },
];

export default function ExplorePage() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');

  const handleCategoryPress = (category: CategoryData) => {
    if (category.name === 'Clubs') {
      router.push('/student/pages/ClubsPage');
    } else {
      // Handle other categories
      console.log('Navigate to category:', category.name);
    }
  };

  const renderCategoryItem = ({ item }: { item: CategoryData }) => (
      <CategoryCard category={item} onPress={() => handleCategoryPress(item)} />
  );

  return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>

          {/* Header */}
          <ThemedText style={styles.headerTitle}>Explore</ThemedText>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: cardColor, borderColor }]}>
            <Feather name="search" size={20} color={iconColor} style={styles.searchIcon} />
            <TextInput
                style={[styles.searchInput, { color: textColor }]}
                placeholder="Search for events, clubs, or places"
                placeholderTextColor={iconColor}
            />
          </View>

          

          {/* Categories */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>All Categories</ThemedText>
            <FlatList
                key="categories-grid"
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => `grid-${item.id}`}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.categoriesContainer}
            />
          </View>

          {/* Popular This Week */}
          {/* <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Popular This Week</ThemedText>
            {popularEvents.map(event => (
                <EventCard key={event.id} event={event} size="small" />
            ))}
          </View> */}

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 8,
  },
  bottomPadding: {
    height: 80,
  },
});