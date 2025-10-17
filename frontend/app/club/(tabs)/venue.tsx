import { Feather, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { 
  ActivityIndicator, 
  Dimensions, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../../../constants/config';
import { useClub } from '../../context/ClubContext';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function VenueBookingsListScreen() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { token, clubDetails } = useClub();
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusFilters = [
    { label: 'All Status', value: null },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [clubDetails.userId, token])
  );

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, selectedStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/bookings/summary/club/${clubDetails.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (selectedStatus) {
      filtered = filtered.filter(booking => booking.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(booking =>
        booking.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.clubName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
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
      const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };

  const formatTimeSlots = (slots) => {
    if (!slots || slots.length === 0) return 'No slots';
    if (slots.length === 1) {
      return `${slots[0].startTime}`;
    }
    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];
    return `${firstSlot.startTime} - ${lastSlot.endTime}`;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          container: styles.statusApproved,
          text: styles.statusApprovedText,
          icon: 'check-circle',
          color: '#10B981',
        };
      case 'REJECTED':
        return {
          container: styles.statusRejected,
          text: styles.statusRejectedText,
          icon: 'x-circle',
          color: '#EF4444',
        };
      case 'PENDING':
      default:
        return {
          container: styles.statusPending,
          text: styles.statusPendingText,
          icon: 'clock',
          color: '#F59E0B',
        };
    }
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
                placeholder="Search bookings..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          ) : (
            <Text style={styles.title}>Venue Bookings</Text>
          )}
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push('/club/venue/book')}
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

        <View style={styles.filterContainer}>
          <RNPickerSelect
            placeholder={{ label: 'Filter by Status', value: null }}
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
            items={statusFilters}
            style={{
              inputIOS: {
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                paddingRight: 30,
              },
              inputAndroid: {
                fontSize: 16,
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                paddingRight: 30,
              },
            }}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Feather name="chevron-down" size={20} color="#9CA3AF" />}
          />
        </View>

        <ScrollView 
          contentContainerStyle={styles.bookingList}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007aff" />
            </View>
          ) : filteredBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="calendar" size={48} color="#4A5568" />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No bookings found' : 'No venue bookings yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try adjusting your search' : 'Create your first booking to get started'}
              </Text>
            </View>
          ) : (
            filteredBookings.map((booking) => {
              const statusStyle = getStatusStyle(booking.status);
              
              return (
                <TouchableOpacity
                  key={booking.bookingId}
                  style={styles.bookingCard}
                  onPress={() => router.push(`/club/venue/booking/${booking.bookingId}`)}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.venueInfo}>
                      <View style={styles.venueIconContainer}>
                        <Ionicons name="business" size={24} color="#007aff" />
                      </View>
                      <View style={styles.venueDetails}>
                        <Text style={styles.venueName}>{booking.venueName}</Text>
                        <Text style={styles.bookingId}>Booking #{booking.bookingId}</Text>
                      </View>
                    </View>
                    
                    <View style={[styles.statusBadge, statusStyle.container]}>
                      <Feather name={statusStyle.icon} size={14} color={statusStyle.color} />
                      <Text style={[styles.statusText, statusStyle.text]}>
                        {booking.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Feather name="calendar" size={16} color="#9CA3AF" />
                        <Text style={styles.infoLabel}>Date</Text>
                      </View>
                      <Text style={styles.infoValue}>{formatDate(booking.date)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Feather name="clock" size={16} color="#9CA3AF" />
                        <Text style={styles.infoLabel}>Time Slots</Text>
                      </View>
                      <Text style={styles.infoValue}>
                        {formatTimeSlots(booking.slotIds)} ({booking.slotIds?.length || 0} slots)
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Feather name="user" size={16} color="#9CA3AF" />
                        <Text style={styles.infoLabel}>Club</Text>
                      </View>
                      <Text style={styles.infoValue}>{booking.clubName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Feather name="phone" size={16} color="#9CA3AF" />
                        <Text style={styles.infoLabel}>Contact</Text>
                      </View>
                      <Text style={styles.infoValue}>{booking.contactNumber}</Text>
                    </View>

                    {booking.reason && (
                      <View style={styles.reasonContainer}>
                        <View style={styles.reasonHeader}>
                          <Feather name="message-square" size={16} color="#9CA3AF" />
                          <Text style={styles.reasonLabel}>Reason</Text>
                        </View>
                        <Text style={styles.reasonText} numberOfLines={2}>
                          {booking.reason}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.footerLeft}>
                      <Feather name="user-check" size={14} color="#9CA3AF" />
                      <Text style={styles.footerText}>{booking.registrationNumber}</Text>
                    </View>
                    <View style={styles.footerRight}>
                      <Feather name="chevron-right" size={16} color="#007aff" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
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
  filterContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  bookingList: {
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
  bookingCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  venueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  venueDetails: {
    flex: 1,
  },
  venueName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  bookingId: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  statusApproved: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusPendingText: {
    color: '#F59E0B',
  },
  statusApprovedText: {
    color: '#10B981',
  },
  statusRejectedText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  reasonContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reasonLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reasonText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  footerRight: {
    padding: 4,
  },
});