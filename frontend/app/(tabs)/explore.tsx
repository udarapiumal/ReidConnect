import React from 'react';
import { StyleSheet, View, ScrollView, TextInput, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { CategoryCard, CategoryData } from '@/components/CategoryCard';
import { EventCard, EventData } from '@/components/EventCard';

// Mock data
const categories: CategoryData[] = [
  {
    id: '1',
    name: 'Music',
    icon: 'music',
    colors: ['#4c669f', '#3b5998'],
  },
  {
    id: '2',
    name: 'Sports',
    icon: 'activity',
    colors: ['#ff4b1f', '#ff9068'],
  },
  {
    id: '3',
    name: 'Food',
    icon: 'coffee',
    colors: ['#11998e', '#38ef7d'],
  },
  {
    id: '4',
    name: 'Arts',
    icon: 'image',
    colors: ['#8e2de2', '#4a00e0'],
  },
  {
    id: '5',
    name: 'Technology',
    icon: 'cpu',
    colors: ['#2193b0', '#6dd5ed'],
  },
  {
    id: '6',
    name: 'Education',
    icon: 'book',
    colors: ['#373b44', '#4286f4'],
  },
];

const popularEvents: EventData[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    category: 'Music',
    date: 'Jul 15, 2025',
    location: 'Central Park',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Tech Conference 2025',
    category: 'Technology',
    date: 'Aug 10, 2025',
    location: 'Convention Center',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Food & Wine Festival',
    category: 'Food',
    date: 'Jul 22, 2025',
    location: 'Downtown Plaza',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function ExplorePage() {
  const renderCategoryItem = ({ item }: { item: CategoryData }) => (
      <CategoryCard category={item} />
  );

  return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>

          {/* Header */}
          <ThemedText style={styles.headerTitle}>Explore</ThemedText>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search for events, clubs, or places"
                placeholderTextColor="#888"
            />
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
            <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.categoriesContainer}
            />
          </View>

          {/* Popular This Week */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Popular This Week</ThemedText>
            {popularEvents.map(event => (
                <EventCard key={event.id} event={event} size="small" />
            ))}
          </View>

          {/* Bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    backgroundColor: '#fff',
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
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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