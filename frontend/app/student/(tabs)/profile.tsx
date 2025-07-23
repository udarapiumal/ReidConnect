import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { EventData } from '@/components/EventCard';
import { useThemeColor } from '@/hooks/useThemeColor';

// Mock data
const userData = {
  name: 'Alex Doe',
  username: '@alexdoe',
  email: '2021cs123@stu.ucsc.cmb.ac.lk',
  academicYear: '3rd Year',
  faculty: 'Applied Sciences',
  contactNumber: '0771234567',
  bio: 'Computer Science student passionate about technology and community events. Love music festivals and tech conferences!',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
  stats: {
    eventsAttended: 21,
    clubsJoined: 5,
  },
  interests: ['Technology', 'Music', 'Sports', 'Arts'],
};

// Events the student is going to attend
const goingEvents: EventData[] = [
  {
    id: 1,
    clubId: 1,
    name: 'Summer Music Festival',
    description: 'Amazing summer music festival with top artists',
    date: 'Jul 30, 2025',
    imagePath: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 1,
    venueName: 'Central Park',
    createdAt: '2025-07-01',
    category: 'Music',
    statusOfUser: 'going',
  },
];

// Events the student is interested in
const interestedEvents: EventData[] = [
  {
    id: 2,
    clubId: 2,
    name: 'Tech Conference 2025',
    description: 'Annual technology conference with industry leaders',
    date: 'Aug 10, 2025',
    imagePath: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 2,
    venueName: 'Convention Center',
    createdAt: '2025-07-01',
    category: 'Technology',
    statusOfUser: 'interested',
  },
  {
    id: 5,
    clubId: 3,
    name: 'Art Exhibition Opening',
    description: 'Contemporary art exhibition featuring local artists',
    date: 'Aug 15, 2025',
    imagePath: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 3,
    venueName: 'University Gallery',
    createdAt: '2025-07-01',
    category: 'Arts',
    statusOfUser: 'interested',
  },
];

// Past events the student attended
const pastEvents: EventData[] = [
  {
    id: 6,
    clubId: 4,
    name: 'Career Fair 2025',
    description: 'Annual career fair with top companies',
    date: 'Jul 10, 2025',
    imagePath: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 4,
    venueName: 'Main Auditorium',
    createdAt: '2025-06-01',
    category: 'Career',
    statusOfUser: 'going',
  },
  {
    id: 7,
    clubId: 5,
    name: 'Sports Day 2025',
    description: 'Annual university sports competition',
    date: 'Jun 25, 2025',
    imagePath: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    slotIds: [],
    targetFaculties: [],
    targetYears: [],
    venueId: 5,
    venueName: 'Sports Complex',
    createdAt: '2025-05-01',
    category: 'Sports',
    statusOfUser: 'going',
  },
];

// Clubs the student is subscribed to
const subscribedClubs = [
  {
    id: 1,
    name: 'Music Society',
    description: 'University music club organizing concerts and events',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
    memberCount: 234,
  },
  {
    id: 2,
    name: 'Tech Club',
    description: 'Technology enthusiasts and developers community',
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2070&auto=format&fit=crop',
    memberCount: 189,
  },
  {
    id: 3,
    name: 'Art Society',
    description: 'Creative arts and visual design community',
    avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2070&auto=format&fit=crop',
    memberCount: 156,
  },
];

const settingsOptions = [
  { id: '1', title: 'Edit Profile', icon: 'user' },
  { id: '2', title: 'Notifications', icon: 'bell' },
  { id: '3', title: 'Privacy', icon: 'lock' },
  { id: '4', title: 'Help & Support', icon: 'help-circle' },
  { id: '5', title: 'Log Out', icon: 'log-out' },
];

type TabName = 'Events' | 'Clubs' | 'Activity' | 'Settings';

type EventItemProps = {
  event: EventData;
  onPress?: () => void;
  showStatus?: boolean;
};

const EventItem = ({ event, onPress, showStatus = true }: EventItemProps) => {
  const cardColor = useThemeColor({}, 'card');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'going': return '#4CAF50';
      case 'interested': return '#FF9800';
      default: return iconColor;
    }
  };
  
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'going': return 'Going';
      case 'interested': return 'Interested';
      default: return '';
    }
  };
  
  return (
    <TouchableOpacity style={[styles.eventItem, { backgroundColor: cardColor }]} onPress={onPress}>
      <Image 
        source={{ uri: event.imagePath }}
        style={styles.eventImage}
        contentFit="cover"
      />
      <View style={styles.eventContent}>
        <ThemedText style={styles.eventTitle}>{event.name}</ThemedText>
        <View style={styles.eventMeta}>
          <Feather name="calendar" size={14} color={iconColor} />
          <ThemedText style={styles.eventMetaText}>{event.date}</ThemedText>
        </View>
        <View style={styles.eventMeta}>
          <Feather name="map-pin" size={14} color={iconColor} />
          <ThemedText style={styles.eventMetaText}>{event.venueName}</ThemedText>
        </View>
        {showStatus && event.statusOfUser && (
          <View style={styles.eventMeta}>
            <Feather name="user-check" size={14} color={getStatusColor(event.statusOfUser)} />
            <ThemedText style={[styles.eventMetaText, { color: getStatusColor(event.statusOfUser) }]}>
              {getStatusText(event.statusOfUser)}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={[styles.eventStatusContainer, { borderLeftColor: borderColor }]}>
        <Feather name="chevron-right" size={20} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

type ClubItemProps = {
  club: any;
  onPress?: () => void;
};

const ClubItem = ({ club, onPress }: ClubItemProps) => {
  const cardColor = useThemeColor({}, 'card');
  const iconColor = useThemeColor({}, 'icon');
  
  return (
    <TouchableOpacity style={[styles.clubItem, { backgroundColor: cardColor }]} onPress={onPress}>
      <Image 
        source={{ uri: club.avatar }}
        style={styles.clubAvatar}
        contentFit="cover"
      />
      <View style={styles.clubContent}>
        <ThemedText style={styles.clubName}>{club.name}</ThemedText>
        <ThemedText style={styles.clubDescription} numberOfLines={2}>{club.description}</ThemedText>
        <View style={styles.clubMeta}>
          <Feather name="users" size={14} color={iconColor} />
          <ThemedText style={styles.clubMetaText}>{club.memberCount} members</ThemedText>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={iconColor} />
    </TouchableOpacity>
  );
};

type SettingsItemProps = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
};

const SettingsItem = ({ title, icon, onPress }: SettingsItemProps) => {
  const cardColor = useThemeColor({}, 'card');
  const iconColor = useThemeColor({}, 'icon');
  const secondaryButtonColor = useThemeColor({}, 'secondaryButton');
  
  return (
    <TouchableOpacity style={[styles.settingsItem, { backgroundColor: cardColor }]} onPress={onPress}>
      <View style={[styles.settingsIconContainer, { backgroundColor: secondaryButtonColor }]}>
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <ThemedText style={styles.settingsTitle}>{title}</ThemedText>
      <Feather name="chevron-right" size={20} color={iconColor} />
    </TouchableOpacity>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabName>('Events');

  // Theme colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Events':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Going Events</ThemedText>
            {goingEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
            
            <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>Interested Events</ThemedText>
            {interestedEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
            
            <ThemedText style={[styles.sectionTitle, { marginTop: 24 }]}>Past Events</ThemedText>
            {pastEvents.map(event => (
              <EventItem key={event.id} event={event} showStatus={false} />
            ))}
          </View>
        );
      case 'Clubs':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Subscribed Clubs</ThemedText>
            {subscribedClubs.map(club => (
              <ClubItem key={club.id} club={club} />
            ))}
          </View>
        );
      case 'Activity':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
            <View style={[styles.activityItem, { backgroundColor: cardColor }]}>
              <Feather name="heart" size={20} color="#FF6B6B" />
              <ThemedText style={styles.activityText}>Liked Tech Conference 2025</ThemedText>
              <ThemedText style={styles.activityTime}>2 hours ago</ThemedText>
            </View>
            <View style={[styles.activityItem, { backgroundColor: cardColor }]}>
              <Feather name="user-plus" size={20} color="#4ECDC4" />
              <ThemedText style={styles.activityText}>Joined Music Society</ThemedText>
              <ThemedText style={styles.activityTime}>1 day ago</ThemedText>
            </View>
            <View style={[styles.activityItem, { backgroundColor: cardColor }]}>
              <Feather name="check-circle" size={20} color="#45B7D1" />
              <ThemedText style={styles.activityText}>Attended Career Fair 2025</ThemedText>
              <ThemedText style={styles.activityTime}>2 weeks ago</ThemedText>
            </View>
          </View>
        );
      case 'Settings':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Account Settings</ThemedText>
            {settingsOptions.map(option => (
              <SettingsItem 
                key={option.id} 
                title={option.title} 
                icon={option.icon as keyof typeof Feather.glyphMap} 
              />
            ))}
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Image 
            source={{ uri: userData.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />

          <ThemedText style={styles.userName}>{userData.name}</ThemedText>
          <ThemedText style={styles.userHandle}>{userData.username}</ThemedText>
          
          {/* Academic Info */}
          <View style={styles.academicInfo}>
            <ThemedText style={styles.academicText}>{userData.academicYear} • {userData.faculty}</ThemedText>
          </View>
          
          {/* Bio */}
          {/* {userData.bio && (
            <ThemedText style={styles.userBio}>{userData.bio}</ThemedText>
          )} */}
          
          {/* Interests */}
          <View style={styles.interestsContainer}>
            {userData.interests.map((interest, index) => (
              <View key={index} style={[styles.interestTag, { backgroundColor: tintColor }]}>
                <ThemedText style={[styles.interestText, { color: 'white' }]}>{interest}</ThemedText>
              </View>
            ))}
          </View>

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
          {(['Events', 'Clubs', 'Activity', 'Settings'] as TabName[]).map(tab => (
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
  // Club Item Styles
  clubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clubAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  clubContent: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clubDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
    lineHeight: 18,
  },
  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubMetaText: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
  // Activity Item Styles
  activityItem: {
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
  activityText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  activityTime: {
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
  bottomPadding: {
    height: 80,
  },
});
