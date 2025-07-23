import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BASE_URL } from '@/constants/config';

type EventSize = 'large' | 'small' | 'very_large';

export type EventData = {
  id: number;
  clubId: number;
  name: string;
  description: string;
  date: string;
  imagePath: string;
  slotIds: number[];
  targetFaculties: string[];
  targetYears: string[];
  venueId: number | null;
  venueName: string;
  createdAt: string;
  // Additional fields for UI
  going?: number;
  interested?: number;
  statusOfUser?: 'going' | 'interested' | 'none';
  club?: string;
  category?: string;
  privacy?: string;
  host?: {
    name: string;
    logo: any;
    pastEvents: number;
    followers: string;
    description: string;
  };
};

type EventCardProps = {
  event: EventData;
  size?: EventSize;
  onPress?: () => void;
  onChangePhoto?: () => void;
};

export function EventCard({ event, size = 'large', onPress, onChangePhoto }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(event.statusOfUser === 'interested');
  const animatedValue = new Animated.Value(isLiked ? 1 : 0);
  const cardBackgroundColor = useThemeColor({}, 'background');
  const shadowColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');
  const primaryColor = useThemeColor({}, 'tint');
  const secondaryTextColor = useThemeColor({}, 'icon');

  const imageSource = event.imagePath ? { uri: `${BASE_URL}/${event.imagePath}` } : require('@/assets/images/event1.png');

  // Format date and time
  const eventDate = new Date(event.date);
  const now = new Date();
  const isToday = eventDate.toDateString() === now.toDateString();
  const isPast = eventDate < now;
  const isUpcoming = eventDate > now;
  
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Get event status
  const getEventStatus = () => {
    if (isPast) return { text: 'Past Event', color: '#999' };
    if (isToday) return { text: 'Today', color: '#FF6B35' };
    if (isUpcoming) return { text: 'Upcoming', color: primaryColor };
    return null;
  };

  const eventStatus = getEventStatus();

  const handleLikePress = () => {
    setIsLiked(!isLiked);
    
    // Animate the star
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: isLiked ? 0 : 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: isLiked ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getContainerStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallContainer;
      case 'very_large':
        return styles.veryLargeContainer;
      case 'large':
      default:
        return styles.largeContainer;
    }
  };

  const getImageStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallImage;
      case 'very_large':
        return styles.veryLargeImage;
      case 'large':
      default:
        return styles.largeImage;
    }
  };

  const getTitleStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallTitle;
      case 'very_large':
        return styles.veryLargeTitle;
      case 'large':
      default:
        return styles.largeTitle;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        getContainerStyle(),
        { 
          backgroundColor: cardBackgroundColor,
          shadowColor: shadowColor 
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={[styles.image, getImageStyle()]}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={[styles.imageGradient, size === 'small' && { display: 'none' }]}
        />
        {onChangePhoto && (
          <TouchableOpacity style={styles.changePhotoButton} onPress={onChangePhoto}>
            <Feather name="camera" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <ThemedView style={[
        styles.detailsContainer, 
        { backgroundColor: 'transparent' },
        size === 'small' && styles.smallDetailsContainer
      ]}>
        {size === 'small' ? (
          // Compact layout for small cards
          <>
            <View style={styles.smallCardHeader}>
              <View style={styles.smallCardTitleContainer}>
                <ThemedText style={[styles.title, getTitleStyle()]} numberOfLines={2}>
                  {event.name}
                </ThemedText>
                {event.club && (
                  <ThemedText style={[styles.smallClub, { color: secondaryTextColor }]} numberOfLines={1}>
                    by {event.club}
                  </ThemedText>
                )}
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: primaryColor }]}>
                <ThemedText style={styles.categoryText}>{event.category || 'Event'}</ThemedText>
              </View>
            </View>
            
            <View style={styles.smallCardMeta}>
              <View style={styles.metaItem}>
                <Feather name="calendar" size={14} color={primaryColor} />
                <ThemedText style={[styles.smallMetaText, styles.emphasizedMeta]}>{formattedDate}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={14} color={primaryColor} />
                <ThemedText style={[styles.smallMetaText, styles.emphasizedMeta]}>{formattedTime}</ThemedText>
              </View>
            </View>
            
            <View style={styles.smallCardFooter}>
              <View style={styles.metaItem}>
                <Feather name="map-pin" size={14} color={primaryColor} />
                <ThemedText style={[styles.smallMetaText, styles.emphasizedMeta]} numberOfLines={1}>
                  {event.venueName}
                </ThemedText>
              </View>
              {event.interested !== undefined && event.interested > 0 && (
                <View style={styles.countItem}>
                  <AntDesign name="star" size={12} color="#FFD700" />
                  <ThemedText style={[styles.smallCountText, { color: useThemeColor({}, 'text') }]}>
                    {event.interested}
                  </ThemedText>
                </View>
              )}
            </View>
          </>
        ) : (
          // Original full layout for large and very_large cards
          <>
            {/* Category Badge and Interest Button Row */}
            <View style={styles.topRow}>
              <View style={styles.badgesContainer}>
                <View style={[styles.categoryBadge, { backgroundColor: primaryColor }]}>
                  <ThemedText style={styles.categoryText}>{event.category || 'Event'}</ThemedText>
                </View>
                {eventStatus && (
                  <View style={[styles.statusBadge, { backgroundColor: eventStatus.color }]}>
                    <ThemedText style={styles.statusText}>{eventStatus.text}</ThemedText>
                  </View>
                )}
              </View>
              
              {/* Interest Button */}
              <TouchableOpacity 
                onPress={handleLikePress} 
                style={[
                  styles.interestButton, 
                  { 
                    backgroundColor: isLiked ? `${primaryColor}20` : useThemeColor({}, 'background'),
                    borderWidth: 1,
                    borderColor: isLiked ? primaryColor : useThemeColor({}, 'tabIconDefault')
                  }
                ]}
              >
                <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
                  <AntDesign
                    name={isLiked ? 'star' : 'staro'}
                    size={14}
                    color={isLiked ? '#FFD700' : primaryColor}
                  />
                </Animated.View>
                {isLiked && (
                  <ThemedText style={[styles.statsText, { color: primaryColor }]}>
                    Interested
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>

            {/* Event Title */}
            <ThemedText style={[styles.title, getTitleStyle()]}>
              {event.name}
            </ThemedText>

            {/* Club Name */}
            {event.club && (
              <ThemedText style={[styles.club, { color: secondaryTextColor }]}>
                by {event.club}
              </ThemedText>
            )}

            {/* Meta Information */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Feather name="calendar" size={16} color={primaryColor} />
                <ThemedText style={[styles.metaText, styles.emphasizedMeta]}>{formattedDate}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={16} color={primaryColor} />
                <ThemedText style={[styles.metaText, styles.emphasizedMeta]}>{formattedTime}</ThemedText>
              </View>
              <View style={styles.metaItem}>
                <Feather name="map-pin" size={16} color={primaryColor} />
                <ThemedText style={[styles.metaText, styles.emphasizedMeta]}>{event.venueName}</ThemedText>
              </View>
            </View>

            {/* Going and Interested Counts Row */}
            <View style={[styles.countsRow, { borderTopColor: useThemeColor({}, 'tabIconDefault') }]}>
              {event.going !== undefined && (
                <View style={styles.countItem}>
                  <Feather name="check-circle" size={14} color={primaryColor} />
                  <ThemedText style={[styles.countText, { color: useThemeColor({}, 'text') }]}>
                    {event.going} going
                  </ThemedText>
                </View>
              )}
              {event.interested !== undefined && (
                <View style={styles.countItem}>
                  <AntDesign name="star" size={14} color="#FFD700" />
                  <ThemedText style={[styles.countText, { color: useThemeColor({}, 'text') }]}>
                    {event.interested} interested
                  </ThemedText>
                </View>
              )}
              {event.going === undefined && event.interested === undefined && (
                <ThemedText style={[styles.countText, { color: secondaryTextColor }]}>
                  Be the first to show interest!
                </ThemedText>
              )}
            </View>
          </>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    margin: 8,
  },
  largeContainer: {
    width: 280,
  },
  smallContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 120,
    margin: 0,
    marginBottom: 8,
  },
  veryLargeContainer: {
    width: 400,
    marginHorizontal: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
  },
  largeImage: {
    height: 150,
    width: '100%',
  },
  smallImage: {
    width: 80,
    height: '100%',
  },
  veryLargeImage: {
    height: 250,
    width: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  changePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 24,
    zIndex: 2,
  },
  detailsContainer: {
    padding: 16,
    flex: 1,
  },
  smallDetailsContainer: {
    padding: 12,
  },
  // Small card specific styles
  smallCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  smallCardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  smallClub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    fontStyle: 'italic',
  },
  smallCardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  smallCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallMetaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  smallCountText: {
    fontSize: 10,
    fontWeight: '500',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  statsText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 6,
    lineHeight: 22,
  },
  largeTitle: {
    fontSize: 18,
  },
  smallTitle: {
    fontSize: 16,
  },
  veryLargeTitle: {
    fontSize: 24,
  },
  club: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  metaContainer: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },
  emphasizedMeta: {
    fontWeight: '600',
  },
  detailsSection: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
  },
  countsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '500',
  },
});