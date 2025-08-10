import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, RefreshControl, LayoutAnimation, UIManager, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { EventData, EventCard } from '@/components/EventCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import axiosInstance from '@/app/api/axiosInstance';
import { BASE_URL } from '@/constants/config';
import { router } from 'expo-router';
import { handleLogout } from '@/utils/logout';

// Types for API responses
interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  authorities: Array<{ authority: string }>;
  // Additional profile fields that might be returned
  studentName?: string;
  academicYear?: string;
  faculty?: string;
  contactNumber?: string;
  bio?: string;
  profilePictureUrl?: string;
  interests?: string[];
  userId?: number;
}

export type ClubData = {
  id: number;
  clubName: string;
  userId: number;
  website: string;
  profilePicture: string;
  bio: string;
  subCount: number;
  isJoined?: boolean;
};

// Default fallback data structure
const defaultUserData = {
  name: 'Loading...',
  username: '@loading',
  email: 'loading@ucsc.cmb.ac.lk',
  academicYear: 'N/A',
  faculty: 'N/A',
  contactNumber: 'N/A',
  bio: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
  stats: {
    eventsAttended: 0,
    clubsJoined: 0,
  },
  interests: [] as string[],
};


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// API Functions (using provided endpoints)
const fetchStudentDetails = async (): Promise<UserData | null> => {
  try {
    const response = await axiosInstance.get('/student/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

const fetchGoingEvents = async () => {
  try {
    const response = await axiosInstance.get('/student/events/going/upcoming');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching going events:', error);
    return [];
  }
};

const fetchInterestedEvents = async () => {
  try {
    const response = await axiosInstance.get('/student/events/interested/upcoming');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching interested events:', error);
    return [];
  }
};

const fetchPastEvents = async () => {
  try {
    const response = await axiosInstance.get('/student/events/past');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching past events:', error);
    return [];
  }
};

const fetchPastGoingEventsCount = async () => {
  try {
    const response = await axiosInstance.get('/student/events/past/going/count');
    return response.data || 0;
  } catch (error) {
    console.error('Error fetching past going events count:', error);
    return 0;
  }
};

const fetchSubscribedClubsCount = async () => {
  try {
    const response = await axiosInstance.get('/student/clubs/subscribed/count');
    return response.data || 0;
  } catch (error) {
    console.error('Error fetching subscribed clubs count:', error);
    return 0;
  }
};

const fetchSubscribedClubs = async () => {
  try {
    const response = await axiosInstance.get('/student/clubs/subscribed');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching subscribed clubs:', error);
    return [];
  }
};

// API function to update student details
const updateStudentDetails = async (data: {
  username: string;
  studentName: string;
  profilePictureUrl: string;
  contactNumber: string;
}) => {
  try {
    const response = await axiosInstance.put('/student/me', data);
    return response.data;
  } catch (error) {
    console.error('Error updating student details:', error);
    throw error;
  }
};

const settingsOptions = [
  { 
    id: '1', 
    title: 'Edit Profile', 
    icon: 'user',
    subItems: [
      { id: '1a', title: 'Personal Information', icon: 'edit-3' },
      { id: '1b', title: 'Change Password', icon: 'key' },
    ]
  },
  { 
    id: '2', 
    title: 'Notifications', 
    icon: 'bell',
  },
  { id: '4', title: 'Help & Support', icon: 'help-circle' },
  { id: '5', title: 'Log Out', icon: 'log-out' },
];

type TabName = 'Events' | 'Clubs' | 'Notifications' | 'Settings';

type ClubItemProps = {
  club: any;
  onPress?: () => void;
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
          source={{ uri: `${BASE_URL}/${club.profilePicture}` }}
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

type SettingsItemProps = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  isExpanded?: boolean;
  hasSubItems?: boolean;
};

const SettingsItem = ({ title, icon, onPress, isExpanded, hasSubItems }: SettingsItemProps) => {
  const cardColor = useThemeColor({}, 'card');
  const iconColor = useThemeColor({}, 'icon');
  const secondaryButtonColor = useThemeColor({}, 'secondaryButton');
  
  return (
    <TouchableOpacity style={[styles.settingsItem, { backgroundColor: cardColor }]} onPress={onPress}>
      <View style={[styles.settingsIconContainer, { backgroundColor: secondaryButtonColor }]}>
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <ThemedText style={styles.settingsTitle}>{title}</ThemedText>
      {/* Show chevron only if it has sub-items, and change icon based on state */}
      {hasSubItems && (
         <Feather name={isExpanded ? "chevron-down" : "chevron-right"} size={20} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};

const SubSettingItem = ({ title, icon, onPress }: Omit<SettingsItemProps, 'isExpanded' | 'hasSubItems'>) => {
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const secondaryButtonColor = useThemeColor({}, 'secondaryButton');

  return (
    <TouchableOpacity style={[styles.settingsItem, styles.subSettingsItem, { backgroundColor }]} onPress={onPress}>
      <View style={[styles.settingsIconContainer, { backgroundColor: secondaryButtonColor }]}>
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <ThemedText style={styles.settingsTitle}>{title}</ThemedText>
    </TouchableOpacity>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabName>('Events');
  const [userData, setUserData] = useState(defaultUserData);
  const [subscribedClubs, setSubscribedClubs] = useState<ClubData[]>([]);
  const [goingEvents, setGoingEvents] = useState<EventData[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<EventData[]>([]);
  const [pastEvents, setPastEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleEventPress = (eventId: number) => {
    router.push(`/student/pages/EventPage?id=${eventId}`);
  };

  const handleClubPress = (club: ClubData) => {
      // Navigate to club details page
      console.log('Navigate to club:', club.clubName);
      router.push({
        pathname: '/student/pages/ClubPage',
        params: { clubId: club.id.toString() }
      });
    };

  const handleItemPress = (option: (typeof settingsOptions)[0]) => {
      if (option.subItems) {
          // Animate the layout change
          // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          // Toggle expansion
          setExpandedId(expandedId === option.id ? null : option.id);
      } else if (option.title === 'Log Out') {
          handleLogout();
      }else if(option.title === 'Help & Support'){
          console.log("wobbily wibbily");
      }
       else {
          // Handle navigation for items without sub-menus
          // navigation.navigate('PrivacyScreen');
      }
  };

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  // Fetch user data and clubs on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!refreshing) setLoading(true);
        setError(null);

        // Fetch current user
        const currentUser = await fetchStudentDetails();
        if (!currentUser) {
          throw new Error('Failed to fetch user data');
        }

        // Fetch all required data in parallel
        const [
          goingEventsData,
          interestedEventsData,
          pastEventsData,
          pastGoingCount,
          clubsCount,
          clubsData
        ] = await Promise.all([
          fetchGoingEvents(),
          fetchInterestedEvents(),
          fetchPastEvents(),
          fetchPastGoingEventsCount(),
          fetchSubscribedClubsCount(),
          fetchSubscribedClubs()
        ]);

        // Update user data with API response, falling back to defaults for missing fields
        const updatedUserData = {
          name: currentUser.studentName || 'Unknown User',
          username: `@${currentUser.username}`,
          email: currentUser.email,
          academicYear: currentUser.academicYear || 'N/A',
          faculty: currentUser.faculty || 'N/A',
          contactNumber: currentUser.contactNumber || 'N/A',
          bio: currentUser.bio || '',
          avatar: currentUser.profilePictureUrl || defaultUserData.avatar,
          stats: {
            eventsAttended: pastGoingCount,
            clubsJoined: clubsCount,
          },
          interests: currentUser.interests || [],
        };

        setUserData(updatedUserData);
        setGoingEvents(goingEventsData);
        setInterestedEvents(interestedEventsData);
        setPastEvents(pastEventsData);
        setSubscribedClubs(clubsData);

      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadUserData();
  }, [refreshTrigger]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Events':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Going Events</ThemedText>
            {goingEvents.length > 0 ? (
              goingEvents.map(event => (
                <EventCard key={event.id} event={event} size="small" onPress={() => handleEventPress(event.id)} />
              ))
            ) : (
              <ThemedText style={{ textAlign: 'center', opacity: 0.6, marginBottom: 16 }}>
                No events to show
              </ThemedText>
            )}

            <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>Interested Events</ThemedText>
            {interestedEvents.length > 0 ? (
              interestedEvents.map(event => (
                <EventCard key={event.id} event={event} size="small" onPress={() => handleEventPress(event.id)} />
              ))
            ) : (
              <ThemedText style={{ textAlign: 'center', opacity: 0.6, marginBottom: 16 }}>
                No events to show
              </ThemedText>
            )}

            <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>Past Events</ThemedText>
            {pastEvents.length > 0 ? (
              pastEvents.map(event => (
                <EventCard key={event.id} event={event} size="small" onPress={() => handleEventPress(event.id)} />
              ))
            ) : (
              <ThemedText style={{ textAlign: 'center', opacity: 0.6, marginBottom: 16 }}>
                No events to show
              </ThemedText>
            )}
          </View>
        );
      case 'Clubs':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Subscribed Clubs</ThemedText>
            {loading ? (
              <ActivityIndicator size="large" color={tintColor} style={{ marginTop: 20 }} />
            ) : subscribedClubs.length > 0 ? (
              subscribedClubs.map(club => (
                <ClubCard key={club.id} club={club} onPress={() => handleClubPress(club)} />
              ))
            ) : (
              <ThemedText style={{ textAlign: 'center', opacity: 0.6, marginTop: 20 }}>
                No clubs joined yet
              </ThemedText>
            )}
          </View>
        );
      case 'Notifications':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Recent Notifications</ThemedText>
            <View style={[styles.NotificationsItem, { backgroundColor: cardColor }]}>
              <Feather name="heart" size={20} color="#FF6B6B" />
              <ThemedText style={styles.NotificationsText}>Liked Tech Conference 2025</ThemedText>
              <ThemedText style={styles.NotificationsTime}>2 hours ago</ThemedText>
            </View>
            <View style={[styles.NotificationsItem, { backgroundColor: cardColor }]}>
              <Feather name="user-plus" size={20} color="#4ECDC4" />
              <ThemedText style={styles.NotificationsText}>Joined Music Society</ThemedText>
              <ThemedText style={styles.NotificationsTime}>1 day ago</ThemedText>
            </View>
            <View style={[styles.NotificationsItem, { backgroundColor: cardColor }]}>
              <Feather name="check-circle" size={20} color="#45B7D1" />
              <ThemedText style={styles.NotificationsText}>Attended Career Fair 2025</ThemedText>
              <ThemedText style={styles.NotificationsTime}>2 weeks ago</ThemedText>
            </View>
          </View>
        );
      case 'Settings':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
            {settingsOptions.map(option => (
                <View key={option.id}>
                    {/* Main Setting Item */}
                    <SettingsItem
                        title={option.title}
                        icon={option.icon as keyof typeof Feather.glyphMap}
                        onPress={() => handleItemPress(option)}
                        hasSubItems={!!option.subItems}
                        isExpanded={expandedId === option.id}
                    />

                    {/* Conditionally Rendered Sub-Items */}
                    {expandedId === option.id && option.subItems && (
                        <View>
                            {option.subItems.map(subItem => (
                                <SubSettingItem
                                    key={subItem.id}
                                    title={subItem.title}
                                    icon={subItem.icon as keyof typeof Feather.glyphMap}
                                    onPress={() => {
                                        // Handle sub-item press (e.g., navigate)
                                        if (subItem.title === 'Personal Information') {
                                            router.push('/student/profile/profileEdit');
                                        } else if (subItem.title === 'Change Password') {
                                            router.push('/student/profile/changePassword');
                                        } else {
                                            console.log(`Pressed ${subItem.title}`);
                                        }
                                    }}
                                />
                            ))}
                        </View>
                    )}
                </View>
            ))}
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#FF6B6B" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: tintColor }]}
            onPress={() => {
              setError(null);
              setRefreshTrigger(prev => prev + 1);
            }}
          >
            <ThemedText style={[styles.retryButtonText, { color: 'white' }]}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
          }
        >
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Image 
            // source={{ uri: userData.avatar }}
            source={{ uri: `${BASE_URL}/${userData.avatar}` }}
            style={styles.avatar}
            contentFit="cover"
          />

          <ThemedText style={styles.userName}>{userData.name}</ThemedText>
          <ThemedText style={styles.userHandle}>{userData.username}</ThemedText>
          
          {/* Academic Info */}
          <View style={styles.academicInfo}>
            <ThemedText style={styles.academicText}>{userData.academicYear}rd Year • {userData.faculty}</ThemedText>
          </View>
          
          {/* Bio */}
          {/* {userData.bio && (
            <ThemedText style={styles.userBio}>{userData.bio}</ThemedText>
          )} */}
          
          {/* Interests */}
          {userData.interests && userData.interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {userData.interests.map((interest: string, index: number) => (
                <View key={index} style={[styles.interestTag, { backgroundColor: tintColor }]}>
                  <ThemedText style={[styles.interestText, { color: 'white' }]}>{interest}</ThemedText>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.statsContainer, { backgroundColor: cardColor }]}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{userData.stats.eventsAttended}</ThemedText>
              <ThemedText style={styles.statLabel}>Events</ThemedText>
            </View>
            
            <View style={[styles.statDivider, { backgroundColor: borderColor }]} />

            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{userData.stats.clubsJoined}</ThemedText>
              <ThemedText style={styles.statLabel}>Clubs</ThemedText>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { borderBottomColor: borderColor }]}>
          {(['Events', 'Clubs', 'Notifications', 'Settings'] as TabName[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton, 
                activeTab === tab && [styles.activeTabButton, { borderBottomColor: tintColor }]
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText style={[
                styles.tabText, 
                activeTab === tab && [styles.activeTabText, { color: tintColor }]
              ]}>
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {renderTabContent()}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      )}
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
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 8,
  },
  academicInfo: {
    marginBottom: 12,
  },
  academicText: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: '500',
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.6,
  },
  activeTabText: {
    fontWeight: 'bold',
    opacity: 1,
  },
  tabContentContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  // Event Item Styles
  eventItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventImage: {
    width: 80,
    height: '100%',
    backgroundColor: '#eee',
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventMetaText: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
  eventStatusContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
  },
  // Notifications Item Styles
  NotificationsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  NotificationsText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  NotificationsTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  // Settings Item Styles
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  subSettingsItem: {
    marginLeft: 0,
  },
  bottomPadding: {
    height: 80,
  },
  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  //club cards
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
});
