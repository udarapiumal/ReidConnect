import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { EventData } from '@/components/EventCard';

// Mock data
const userData = {
  name: 'Alex Doe',
  username: '@alexdoe',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
  stats: {
    following: 128,
    followers: 543,
    events: 21,
  },
};

const tickets: EventData[] = [
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
];

const savedEvents: EventData[] = [
  {
    id: '3',
    title: 'Food & Wine Festival',
    category: 'Food',
    date: 'Jul 22, 2025',
    location: 'Downtown Plaza',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Yoga in the Park',
    category: 'Fitness',
    date: 'Tomorrow, 8:00 AM',
    location: 'Riverside Park',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop',
  },
];

const settingsOptions = [
  { id: '1', title: 'Edit Profile', icon: 'user' },
  { id: '2', title: 'Notifications', icon: 'bell' },
  { id: '3', title: 'Privacy', icon: 'lock' },
  { id: '4', title: 'Help & Support', icon: 'help-circle' },
  { id: '5', title: 'Log Out', icon: 'log-out' },
];

type TabName = 'Tickets' | 'Saved' | 'Settings';

type TicketItemProps = {
  event: EventData;
  onPress?: () => void;
};

const TicketItem = ({ event, onPress }: TicketItemProps) => {
  const imageSource = typeof event.image === 'string' ? { uri: event.image } : event.image;
  return (
    <TouchableOpacity style={styles.ticketItem} onPress={onPress}>
      <Image 
        source={imageSource}
        style={styles.ticketImage}
        contentFit="cover"
      />
      <View style={styles.ticketContent}>
        <ThemedText style={styles.ticketTitle}>{event.title}</ThemedText>
        <View style={styles.ticketMeta}>
          <Feather name="calendar" size={14} color="#888" />
          <ThemedText style={styles.ticketMetaText}>{event.date}</ThemedText>
        </View>
        <View style={styles.ticketMeta}>
          <Feather name="map-pin" size={14} color="#888" />
          <ThemedText style={styles.ticketMetaText}>{event.location}</ThemedText>
        </View>
      </View>
      <View style={styles.ticketQrContainer}>
        <Feather name="file-text" size={24} color="#333" />
      </View>
    </TouchableOpacity>
  );
};

type SettingsItemProps = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
};

const SettingsItem = ({ title, icon, onPress }: SettingsItemProps) => {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsIconContainer}>
        <Feather name={icon} size={18} color="#333" />
      </View>
      <ThemedText style={styles.settingsTitle}>{title}</ThemedText>
      <Feather name="chevron-right" size={20} color="#888" />
    </TouchableOpacity>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabName>('Tickets');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tickets':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Active Tickets</ThemedText>
            {tickets.map(ticket => (
              <TicketItem key={ticket.id} event={ticket} />
            ))}
          </View>
        );
      case 'Saved':
        return (
          <View>
            <ThemedText style={styles.sectionTitle}>Saved Events</ThemedText>
            {savedEvents.map(event => (
              <TicketItem key={event.id} event={event} />
            ))}
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
    <SafeAreaView style={styles.container} edges={['top']}>
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

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{userData.stats.following}</ThemedText>
              <ThemedText style={styles.statLabel}>Following</ThemedText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{userData.stats.followers}</ThemedText>
              <ThemedText style={styles.statLabel}>Followers</ThemedText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{userData.stats.events}</ThemedText>
              <ThemedText style={styles.statLabel}>Events</ThemedText>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {(['Tickets', 'Saved', 'Settings'] as TabName[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
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
    backgroundColor: '#f8f8f8',
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
    color: '#888',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    color: '#888',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    borderBottomColor: '#6200ee',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  activeTabText: {
    color: '#6200ee',
    fontWeight: 'bold',
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
  ticketItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ticketImage: {
    width: 80,
    height: '100%',
    backgroundColor: '#eee',
  },
  ticketContent: {
    flex: 1,
    padding: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketMetaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  ticketQrContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#f0f0f0',
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
