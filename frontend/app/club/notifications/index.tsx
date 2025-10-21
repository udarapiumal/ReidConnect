import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNotifications } from '../../api/useNotifications';
import { useClub } from '../../context/ClubContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClubNotifications() {
  const router = useRouter();
  const tint = useThemeColor({}, 'tint');
  const icon = useThemeColor({}, 'icon');
  const { clubDetails } = useClub();
  const { notifications, unreadCount, markAsRead, reload } = useNotifications(String(clubDetails?.userId));
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try { await reload(); } finally { setRefreshing(false); }
  };

  const getNotificationIcon = (title: string) => {
    const lower = (title || '').toLowerCase();
    if (lower.includes('event')) return 'calendar';
    if (lower.includes('member')) return 'users';
    if (lower.includes('payment') || lower.includes('fee')) return 'credit-card';
    if (lower.includes('announcement')) return 'megaphone';
    return 'bell';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Professional Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <View style={styles.iconButton}>
                <Feather name="arrow-left" size={22} color={icon} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <ThemedText type="title" style={styles.headerTitle}>Notifications</ThemedText>
              <ThemedText style={styles.headerSubtitle}>Stay updated with your club</ThemedText>
            </View>
            
            <TouchableOpacity 
              onPress={reload}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Feather name="refresh-cw" size={20} color={icon} />
            </TouchableOpacity>
          </View>
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <View style={styles.statsBar}>
              <View style={[styles.statsBadge, { backgroundColor: tint + '20' }]}>
                <View style={[styles.unreadIndicator, { backgroundColor: tint }]} />
                <ThemedText style={[styles.statsText, { color: tint }]}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                !item.isRead && styles.cardUnread
              ]}
              onPress={() => markAsRead(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                {/* Icon Container */}
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: !item.isRead ? tint + '15' : 'rgba(128,128,128,0.1)' }
                ]}>
                  <Feather 
                    name={getNotificationIcon(item.title)} 
                    size={20} 
                    color={!item.isRead ? tint : icon} 
                  />
                </View>

                {/* Content */}
                <View style={styles.textContent}>
                  <View style={styles.titleRow}>
                    <ThemedText 
                      style={[
                        styles.title,
                        !item.isRead && { color: tint, fontWeight: '700' }
                      ]} 
                      numberOfLines={1}
                    >
                      {item.title || 'Notification'}
                    </ThemedText>
                    {!item.isRead && (
                      <View style={[styles.unreadDot, { backgroundColor: tint }]} />
                    )}
                  </View>
                  
                  <ThemedText style={styles.message} numberOfLines={2}>
                    {item.message}
                  </ThemedText>
                  
                  <View style={styles.footer}>
                    <Feather name="clock" size={12} color={icon} style={styles.clockIcon} />
                    <ThemedText style={styles.time}>
                      {formatTime(item.createdAt)}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={tint}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Feather name="bell-off" size={48} color={icon} opacity={0.3} />
              </View>
              <ThemedText style={styles.emptyTitle}>No notifications yet</ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                You're all caught up! Check back later for updates.
              </ThemedText>
            </View>
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#151718",
  },
  container: { 
    flex: 1,
  },
  headerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#151718',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backBtn: { 
    marginRight: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: { 
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  statsBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: { 
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardUnread: { 
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderColor: 'rgba(0,122,255,0.3)',
    borderWidth: 1.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: { 
    flex: 1,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  unreadDot: { 
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  message: { 
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    opacity: 0.5,
    marginRight: 4,
  },
  time: { 
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});