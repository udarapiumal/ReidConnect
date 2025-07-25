import { View, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EventData, EventCard } from '@/components/EventCard'; // Assuming EventData is exported
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '../../api/axiosInstance';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants/config';

interface UserType {
  id: string;
  sub: string;
  role: string;
}


export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedEvents, setRelatedEvents] = useState<EventData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [interestStatus, setInterestStatus] = useState<'none' | 'interested' | 'going'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorScheme = useColorScheme() ?? 'dark';
  const colors = Colors[colorScheme];
  const [clubInfo, setClubInfo] = useState<{
  name: string;
  subCount: number;
  isSubscribed: boolean;
  image?: string;
} | null>(null);


  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get token and decode to get user info for status checking
        const token = await AsyncStorage.getItem("token");
        let userId = null;
        if (token) {
          try {
            const decoded = jwtDecode<UserType>(token);
            userId = decoded.id;
          } catch (error) {
            console.error('Failed to decode token:', error);
          }
        }
        
        // Fetch specific event
        const eventResponse = await axiosInstance.get(`${BASE_URL}/api/events/${id}`);
        const eventData = eventResponse.data;
        
        // Fetch attendance counts
        let countsData = { going: 0, interested: 0 };
        try {
          const countsResponse = await axiosInstance.get(`${BASE_URL}/api/events/${id}/attendance/counts`);
          const rawCounts = countsResponse.data;
          
          // Map API response to expected format
          countsData = {
            going: rawCounts.goingCount || 0,
            interested: rawCounts.interestedCount || 0
          };
        } catch (error) {
          console.error('Failed to fetch attendance counts:', error);
        }
        
        // Fetch user's attendance status if logged in
        let userStatus = 'none';
        if (userId && token) {
          try {
            // Fetch user's attendance status from the API
            const userStatusResponse = await axiosInstance.get(`/api/events/${id}/attendance/user/${userId}`);

            
            const responseData = userStatusResponse.data;
            
            // Extract status from the response
            const rawStatus = responseData.status;
            // Normalize the status from database (API returns uppercase like "INTERESTED", "GOING")
            userStatus = rawStatus ? rawStatus.toLowerCase() : 'none';
            console.log('👤 User status from API:', rawStatus, '-> normalized:', userStatus);
          } catch (error: any) {
            console.error('Failed to fetch user status:', error);
            if (error.response?.status === 403) {
              console.log('👤 403 Forbidden - User may not have permission');
            } else if (error.response?.status === 404) {
              console.log('👤 404 Not Found - User has not registered for this event yet');
            }
            // Fallback: Start with 'none' status if there's an error
            userStatus = 'none';
          }
        }

        // Fetch club information with better error handling and fallbacks
        if (eventData.clubId) {
          try {
            
            // Fetch club details
            let clubData = null;
            try {
              const clubRes = await axiosInstance.get(`${BASE_URL}/api/club/${eventData.clubId}`);
              clubData = clubRes.data;
            } catch (clubError) {
              console.error('🔴 Failed to fetch club details:', clubError);
              // Fallback to event.club name if available
              clubData = { name: eventData.club || 'Unknown Club' };
            }

            // Fetch subscriber count
            let subCount = 0;
            try {
              const countRes = await axiosInstance.get(`${BASE_URL}/api/subscriptions/club/${eventData.clubId}/count`);
              subCount = countRes.data || 0;
            } catch (countError) {
              console.error('🔴 Failed to fetch subscriber count:', countError);
              subCount = 0;
            }

            // Fetch subscription status
            let isSubscribed = false;
            if (userId) {
              try {
                const subStatusRes = await axiosInstance.get(`${BASE_URL}/api/subscriptions/check/${eventData.clubId}?userId=${userId}`);
                isSubscribed = subStatusRes.data === true || subStatusRes.data.isSubscribed === true;
              } catch (subError) {
                console.error('🔴 Failed to fetch subscription status:', subError);
                isSubscribed = false;
              }
            }

            // Set club info with all collected data
            const clubInfo = {
              name: clubData?.clubName || eventData.club || 'Unknown Club',
              subCount: subCount,
              isSubscribed: isSubscribed,
              image: clubData?.profilePicture, // Add club image
            };

            setClubInfo(clubInfo);

          } catch (err) {
            console.error('🔴 Failed to load club info:', err);
            // Set fallback club info so the section still renders
            setClubInfo({
              name: eventData.club || 'Unknown Club',
              subCount: 0,
              isSubscribed: false,
              image: undefined,
            });
          }
        } else {
          // Set fallback club info using event.club if available
          if (eventData.club) {
            setClubInfo({
              name: eventData.club,
              subCount: 0,
              isSubscribed: false,
              image: undefined
            });
          }
        }

        
        // Combine event data with counts and user status
        const combinedEvent = {
          ...eventData,
          going: countsData.going || 0,
          interested: countsData.interested || 0,
          statusOfUser: userStatus,
        };
        
        setEvent(combinedEvent);
        
        // Set initial interest status based on user's current status from database
        // userStatus is already normalized to lowercase ('interested', 'going', 'none')
        const normalizedStatus = userStatus as 'none' | 'interested' | 'going';
        console.log('🎯 Setting initial interest status:', userStatus, '->', normalizedStatus);
        setInterestStatus(normalizedStatus);

        // Fetch all events for related events
        const allEventsResponse = await axiosInstance.get(`${BASE_URL}/api/events`);
        const allEvents = allEventsResponse.data;
        
        // Get related events (same category or club, excluding current event)
        const related = allEvents.filter((e: EventData) => 
          e.id !== parseInt(id) && 
          (e.category === combinedEvent.category || e.clubId === combinedEvent.clubId)
        ).slice(0, 3);
        
        // Fetch related events attendance counts
        const relatedWithCounts = await Promise.all(
          related.map(async (relatedEvent: EventData) => {
            try {
              const relatedCountsResponse = await axiosInstance.get(`${BASE_URL}/api/events/${relatedEvent.id}/attendance/counts`);
              const rawCounts = relatedCountsResponse.data;
              return {
                ...relatedEvent,
                going: rawCounts.goingCount || 0,
                interested: rawCounts.interestedCount || 0,
              };
            } catch (error) {
              console.error(`Failed to fetch counts for related event ${relatedEvent.id}:`, error);
              return {
                ...relatedEvent,
                going: 0,
                interested: 0,
              };
            }
          })
        );
        
        setRelatedEvents(relatedWithCounts);
        
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleFollowClub = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token || !event?.clubId) {
      console.log('🔴 No token or clubId available for follow action');
      return;
    }

    try {
      const decoded = jwtDecode<UserType>(token);
      const userId = decoded.id;

      const endpoint = clubInfo?.isSubscribed ? "unsubscribe" : "subscribe";

      await axiosInstance.post(`${BASE_URL}/api/subscriptions/${endpoint}`, {
        userId,
        clubId: event.clubId,
      });

      // Update club info optimistically
      setClubInfo((prev) => {
        if (!prev) return prev;
        const newIsSubscribed = !prev.isSubscribed;
        const newSubCount = prev.subCount + (prev.isSubscribed ? -1 : 1);
        
        console.log('🏢 Updated club info:', {
          ...prev,
          isSubscribed: newIsSubscribed,
          subCount: newSubCount,
        });
        
        return {
          ...prev,
          isSubscribed: newIsSubscribed,
          subCount: newSubCount,
        };
      });

    } catch (error) {
      console.error('🔴 Subscription action failed:', error);
    }
  };


  const handleInteraction = async (newStatus: 'interested' | 'going') => {
    if (!event || isSubmitting) return;

    setIsSubmitting(true);
    const oldStatus = interestStatus;

    // Determine the final status - if clicking the same button, deselect it
    const finalStatus = newStatus === oldStatus ? 'none' : newStatus;

    try {
      // Get token and decode to get user info
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token");
      
      const decoded = jwtDecode<UserType>(token);
      const userId = decoded.id;

      // Optimistically update the UI with proper count calculations
      let newInterestedCount = event.interested || 0;
      let newGoingCount = event.going || 0;

      // Remove old status count
      if (oldStatus === 'interested') newInterestedCount -= 1;
      if (oldStatus === 'going') newGoingCount -= 1;

      // Add new status count (only if not 'none')
      if (finalStatus === 'interested') newInterestedCount += 1;
      if (finalStatus === 'going') newGoingCount += 1;
      
      setEvent(prev => prev ? { ...prev, interested: newInterestedCount, going: newGoingCount } : null);
      setInterestStatus(finalStatus);
      
      // Determine API method and URL based on current and new status
      let method: string;
      let apiUrl: string;
      let body: any = null;

      if (finalStatus === 'none') {
        // Remove attendance
        method = 'DELETE';
        apiUrl = `${BASE_URL}/api/events/${id}/attendance?userId=${userId}`;
      } else if (oldStatus === 'none') {
        // Mark new attendance
        method = 'POST';
        apiUrl = `${BASE_URL}/api/events/${id}/attendance?userId=${userId}&status=${finalStatus.toUpperCase()}`;
      } else {
        // Update existing attendance
        method = 'PUT';
        apiUrl = `${BASE_URL}/api/events/${id}/attendance?userId=${userId}&status=${finalStatus.toUpperCase()}`;
      }
      
      console.log('🚀 Making API call:', {
        method,
        url: apiUrl,
        oldStatus,
        newStatus: finalStatus,
        userId,
      });

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        ...(body && { body: JSON.stringify(body) })
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API call failed with status ${response.status}: ${errorText}`);
      }

      const responseText = await response.text();

      // After successful API call, fetch updated counts from server to ensure accuracy
      try {
        const countsResponse = await axiosInstance.get(`${BASE_URL}/api/events/${id}/attendance/counts`);
        const rawUpdatedCounts = countsResponse.data;
        console.log('✅ Raw updated counts from server:', rawUpdatedCounts);
        
        // Map API response to expected format
        const updatedCounts = {
          going: rawUpdatedCounts.goingCount || 0,
          interested: rawUpdatedCounts.interestedCount || 0
        };
        console.log('✅ Mapped updated counts:', updatedCounts);
        
        setEvent(prev => prev ? { 
          ...prev, 
          interested: updatedCounts.interested, 
          going: updatedCounts.going 
        } : null);
      } catch (countError) {
        console.error('Failed to fetch updated counts:', countError);
        // Keep the optimistic update if we can't fetch from server
      }
      
      console.log('✅ Status updated successfully in database');

    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert optimistic UI update on error
      setEvent(prev => prev ? { ...prev, interested: event.interested || 0, going: event.going || 0 } : null);
      setInterestStatus(oldStatus);
      // Optionally, show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRelatedEventPress = (eventId: number) => {
    router.push(`/student/pages/EventPage?id=${eventId}`);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!event) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Event not found.</ThemedText>
      </ThemedView>
    );
  }

  const InfoRow = ({ icon, text }: { icon: any; text: string }) => (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={24} color={colors.icon} />
      <ThemedText style={[styles.infoText, { color: colors.text }]}>{text}</ThemedText>
    </View>
  );
  

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: event.name, 
          headerTintColor: colors.text, 
          headerStyle: { backgroundColor: colors.background } 
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Banner */}
        <View style={styles.bannerContainer}>
          {event.imagePath && (
            <Image 
              source={{ uri: `${BASE_URL}/${event.imagePath}` }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Event Header */}
        <View style={styles.headerContainer}>
          <ThemedText style={styles.eventTime}>{event.date}</ThemedText>
          <ThemedText style={styles.eventTitle}>{event.name}</ThemedText>
          <ThemedText style={styles.eventHost}>Public · Event by {event.club}</ThemedText>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              { backgroundColor: interestStatus === 'interested' ? '#8B0000' : (interestStatus === 'going' ? colors.secondaryButton : colors.button) }
            ]}
            onPress={() => handleInteraction('interested')}
            disabled={isSubmitting}
          >
            <Ionicons name={interestStatus === 'interested' ? "star" : "star-outline"} size={20} color={interestStatus === 'interested' ? colors.buttonText : (interestStatus === 'going' ? colors.secondaryButtonText : colors.buttonText)} />
            <ThemedText style={[styles.buttonText, { color: interestStatus === 'interested' ? colors.buttonText : (interestStatus === 'going' ? colors.secondaryButtonText : colors.buttonText) }]}>Interested</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.button, 
              { backgroundColor: interestStatus === 'going' ? '#8B0000' : colors.secondaryButton}
            ]}
            onPress={() => handleInteraction('going')}
            disabled={isSubmitting}
          >
            <Ionicons name={interestStatus === 'going' ? "checkmark-circle" : "checkmark"} size={20} color={interestStatus === 'going' ? colors.buttonText : (interestStatus === 'interested' ? colors.secondaryButtonText : colors.buttonText)} />
            <ThemedText style={[styles.buttonText, { color: interestStatus === 'going' ? colors.buttonText : (interestStatus === 'interested' ? colors.secondaryButtonText : colors.buttonText) }]}>Going</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.moreOptionsButton, { backgroundColor: colors.secondaryButton }]}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.secondaryButtonText} />
          </TouchableOpacity>
        </View>

        {/* Event Info Section */}
        <View style={[styles.eventInfoSection, { borderTopColor: colors.border }]}>
          <InfoRow icon="location-outline" text={event.venueName} />
          <InfoRow icon="checkmark-circle-outline" text={`${event.going} going · ${event.interested} interested`} />
          <InfoRow icon="globe-outline" text={event.privacy || 'Public'} />
        </View>

        {/* Navigation Tabs */}
        <View style={[styles.navTabsContainer, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.navTab, styles.activeTab, { backgroundColor: colors.secondaryButton }]}>
            <ThemedText style={[styles.navTabText, { color: colors.secondaryButtonText }]}>About</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <ThemedText style={[styles.navTabText, { color: colors.icon }]}>Posts</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Details Section */}
        <View style={[styles.detailsSection, { borderTopColor: colors.border }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>What to expect</ThemedText>
          <ThemedText style={[styles.detailsBody, { color: colors.text }]} numberOfLines={isExpanded ? undefined : 5}>
            {event.description}
          </ThemedText>
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <ThemedText style={[styles.seeMore, { color: colors.text }]}>{isExpanded ? 'see less' : 'see more'}</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Host Section */}
        <View style={[styles.hostSection, { borderTopColor: colors.border }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Hosted by</ThemedText>
          {clubInfo && (
            <View style={[styles.hostProfile, { backgroundColor: colors.card }]}>
              {/* Club Image */}
              {clubInfo.image ? (
                <Image 
                  source={{ uri: `${BASE_URL}${clubInfo.image}` }}
                  style={styles.hostLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.hostLogo, styles.hostLogoPlaceholder, { backgroundColor: colors.border }]}>
                  <Ionicons name="people-outline" size={40} color={colors.icon} />
                </View>
              )}
              
              <ThemedText style={[styles.hostName, { color: colors.text }]}>{clubInfo.name}</ThemedText>
              <ThemedText style={[styles.hostStats, { color: colors.icon }]}>
                {clubInfo.subCount} followers
              </ThemedText>
              <TouchableOpacity 
                style={[styles.followButton, { backgroundColor: colors.secondaryButton }]}
                onPress={handleFollowClub}
              >
                <Ionicons name={clubInfo.isSubscribed ? "checkmark" : "add"} size={20} color={colors.secondaryButtonText} />
                <ThemedText style={[styles.buttonText, { color: colors.secondaryButtonText }]}>
                  {clubInfo.isSubscribed ? "Following" : "Follow"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        
        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <View style={[styles.relatedSection, { borderTopColor: colors.border }]}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, {color: colors.text}]}>
              Related Events
            </ThemedText>
            {relatedEvents.map((relatedEvent) => (
              <EventCard
                key={relatedEvent.id}
                event={relatedEvent}
                size="small"
                onPress={() => handleRelatedEventPress(relatedEvent.id)}
              />
            ))}
          </View>
        )}

        {/* Recent posts Section */}
        <View style={[styles.relatedSection, { borderTopColor: colors.border }]}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, {color: colors.text}]}>
            Recent Posts
          </ThemedText>
          {/* Placeholder for recent posts */}
          <ThemedText style={{ color: colors.text }}>No recent posts available.</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  headerContainer: {
    padding: 16,
    marginTop: -40,
    position: 'relative',
    zIndex: 1,
    gap: 8,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  eventHost: {
    fontSize: 14,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexGrow: 1,
  },
  interestedButton: {
    // backgroundColor set dynamically
  },
  goingButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  moreOptionsButton: {
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfoSection: {
    paddingHorizontal: 16,
    gap: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoText: {
    fontSize: 15,
  },
  navTabsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    marginTop: 16,
  },
  navTab: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    // backgroundColor set dynamically
  },
  navTabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailsSection: {
    padding: 16,
    borderTopWidth: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  detailsBody: {
    fontSize: 15,
    lineHeight: 21,
  },
  seeMore: {
    fontSize: 15,
    marginTop: 12,
  },
  hostSection: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  hostProfile: {
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
  },
  
  hostName: {
    fontSize: 17,
    fontWeight: '600',
  },
  hostStats: {
    fontSize: 13,
  },
  hostDescription: {
    fontSize: 15,
    textAlign: 'center',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    marginTop: 12,
  },
  relatedSection: {
    marginTop: 30,
    padding: 16,
    paddingTop: 20,
    borderTopWidth: 8,
  },
   hostLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  hostLogoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 40,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

});