import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { Feather, AntDesign } from '@expo/vector-icons';

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
  const [isLiked, setIsLiked] = useState(false);
  const cardBackgroundColor = useThemeColor({}, 'background');
  const shadowColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');
  const primaryColor = useThemeColor({}, 'tint');
  const secondaryTextColor = useThemeColor({}, 'icon');

  const imageSource = event.imagePath ? { uri: `${BASE_URL}/${event.imagePath}` } : require('@/assets/images/event1.png');

  const handleLikePress = () => {
    setIsLiked(!isLiked);
    // You can also call a function passed via props here
    // e.g., onLikePress?.();
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
      style={[styles.container, getContainerStyle()]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Image
        source={imageSource}
        style={[styles.image, getImageStyle()]}
        contentFit="cover"
      />
      {onChangePhoto && (
        <TouchableOpacity style={styles.changePhotoButton} onPress={onChangePhoto}>
          <Feather name="camera" size={18} color="white" />
        </TouchableOpacity>
      )}
      <ThemedView style={[styles.detailsContainer, { backgroundColor: 'transparent' }]}>
        <View style={styles.headerContainer}>
          {event.club && <ThemedText style={styles.club}>{event.club}</ThemedText>}
          <TouchableOpacity onPress={handleLikePress} style={styles.heartIcon}>
            <AntDesign
              name={isLiked ? 'star' : 'staro'}
              size={22}
              color={isLiked ? 'gold' : 'white'}
            />
          </TouchableOpacity>
        </View>
        <ThemedText style={[styles.category, { color: primaryColor }]}>{event.category || 'Event'}</ThemedText>
        <ThemedText style={[styles.title, getTitleStyle()]}>
          {event.name}
        </ThemedText>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={14} color={secondaryTextColor} />
            <ThemedText style={[styles.metaText, { color: secondaryTextColor }]}>{event.venueName}</ThemedText>
          </View>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={14} color={secondaryTextColor} />
            <ThemedText style={[styles.metaText, { color: secondaryTextColor }]}>{event.date}</ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 8,
  },
  largeContainer: {
    width: 280,
  },
  smallContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 100,
  },
  veryLargeContainer: {
    width: 400,
    marginHorizontal: 8,
  },
  image: {
  },
  largeImage: {
    height: 150,
    width: '100%',
  },
  smallImage: {
    width: 100,
    height: '100%',
  },
  veryLargeImage: {
    height: 250,
    width: '100%',
  },
  changePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
  },
  detailsContainer: {
    padding: 12,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  club: {
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1, // Allow club name to take available space
  },
  heartIcon: {
    padding: 6,
    color: 'white',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
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
  metaContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
});