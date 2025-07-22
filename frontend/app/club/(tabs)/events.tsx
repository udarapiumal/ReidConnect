import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useClub } from '../../context/ClubContext';


const { width } = Dimensions.get('window');

export default function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { token, clubDetails } = useClub();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { label: 'All Categories', value: null },
    { label: 'Sports', value: 'SPORTS' },
    { label: 'Music', value: 'MUSIC' },
    { label: 'Wellness', value: 'WELLNESS' },
    { label: 'Competition', value: 'COMPETITION' },
    { label: 'Other', value: 'OTHER' },
  ];


  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/events/club/${clubDetails.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enrichedEvents = await Promise.all(
        res.data.map(async (event) => {
          const [going, interested] = await Promise.all([
            axios.get(`${BASE_URL}/api/events/${event.id}/attendance/going`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/api/events/${event.id}/attendance/interested`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          return {
            ...event,
            goingCount: going.data,
            interestedCount: interested.data,
          };
        })
      );

      setEvents(enrichedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
  let filtered = events;

  if (selectedCategory) {
    filtered = filtered.filter(event => event.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    filtered = filtered.filter(event =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.venueName && event.venueName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  setFilteredEvents(filtered);
};


  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    if (searchVisible) {
      setSearchQuery('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      const options = { weekday: 'short', day: 'numeric', month: 'short' };
      return date.toLocaleDateString(undefined, options);
    }
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {searchVisible ? (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          ) : (
            <Text style={styles.title}>Events</Text>
          )}
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push('/club/event/create')}
            >
              <Ionicons name="add-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.searchButton, searchVisible && styles.searchButtonActive]}
              onPress={handleSearchToggle}
            >
              <Ionicons name={searchVisible ? "close-outline" : "search"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
  <RNPickerSelect
    placeholder={{ label: 'Filter by Category', value: null }}
    value={selectedCategory}
    onValueChange={(value) => setSelectedCategory(value)}
    items={categories}
    style={{
      inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: '#333',
        backgroundColor: '#fff',
        paddingRight: 30,
      },
      inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        color: '#333',
        backgroundColor: '#fff',
        paddingRight: 30,
      },
    }}
    useNativeAndroidPickerStyle={false}
    Icon={() => <Feather name="chevron-down" size={20} color="#666" />}
  />
</View>


        <ScrollView 
          contentContainerStyle={styles.eventList}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007aff" />
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="calendar" size={48} color="#4A5568" />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No events found' : 'No events yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try adjusting your search' : 'Create your first event to get started'}
              </Text>
            </View>
          ) : (
            filteredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => router.push(`/club/event/${event.id}`)}
                activeOpacity={0.9}
              >
                <View style={styles.eventImageContainer}>
                  <Image
                    source={{ uri: `${BASE_URL}/${event.imagePath}` }}
                    style={styles.eventImage}
                  />
                  <View style={styles.gradientOverlay} />
                  
                  {/* Floating attendance badges */}
                  
                </View>
                
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <View style={styles.dateTimeContainer}>
                      <Text style={styles.eventDate}>
                        {formatDate(event.date)}
                      </Text>
                      <Text style={styles.eventTime}>
                        {formatTime(event.date)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.eventName}>{event.name}</Text>
                  
                  <View style={styles.locationContainer}>
                    <Feather name="map-pin" size={16} color="#9CA3AF" />
                    <Text style={styles.eventLocation}>
                      {event.venueName || 'Location TBD'}
                    </Text>
                  </View>
                  
                  <View style={styles.attendanceRow}>
                    <View style={styles.attendanceStats}>
                      <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                          <Feather name="heart" size={12} color="#FF6B6B" />
                        </View>
                        <Text style={styles.statText}>
                          {event.interestedCount} interested
                        </Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <View style={styles.statIcon}>
                          <Feather name="check-circle" size={12} color="#4ECDC4" />
                        </View>
                        <Text style={styles.statText}>
                          {event.goingCount} going
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
    backgroundColor: '#0F0F0F',
  },
  backButton: {
    width: 44,
    height: 24,
  },
  title: {
    color: '#fff',
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
  eventList: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 20,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  eventCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  eventImageContainer: {
    position: 'relative',
    height: 220,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  attendanceBadges: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    gap: 8,
  },
  attendanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  goingBadge: {
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  eventContent: {
    padding: 24,
  },
  eventHeader: {
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDate: {
    color: '#007aff',
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 255, 0.3)',
  },
  eventTime: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  eventName: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  eventLocation: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '500',
  },
  attendanceRow: {
    marginBottom: 4,
  },
  attendanceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
});