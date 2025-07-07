import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

type EventSize = 'large' | 'small';

export type EventData = {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string | number | ImageSource | ImageSource[];
  club?: string;
};

type EventCardProps = {
  event: EventData;
  size?: EventSize;
  onPress?: () => void;
  onChangePhoto?: () => void;
};

export function EventCard({ event, size = 'large', onPress, onChangePhoto }: EventCardProps) {
  const cardBackgroundColor = useThemeColor({}, 'background');
  const shadowColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');
  const primaryColor = useThemeColor({}, 'tint');
  const secondaryTextColor = useThemeColor({}, 'icon');

  const imageSource = typeof event.image === 'string' ? { uri: event.image } : event.image;

  return (
    <TouchableOpacity
      style={[styles.container, size === 'small' ? styles.smallContainer : styles.largeContainer]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Image 
        source={imageSource}
        style={[styles.image, size === 'small' ? styles.smallImage : styles.largeImage]}
        contentFit="cover"
      />
      {onChangePhoto && (
        <TouchableOpacity style={styles.changePhotoButton} onPress={onChangePhoto}>
          <Feather name="camera" size={18} color="white" />
        </TouchableOpacity>
      )}
      <ThemedView style={[styles.detailsContainer, { backgroundColor: 'transparent' }]}>
        {event.club && <ThemedText style={styles.club}>{event.club}</ThemedText>}
        <ThemedText style={[styles.category, { color: primaryColor }]}>{event.category}</ThemedText>
        <ThemedText style={[styles.title, size === 'small' ? styles.smallTitle : styles.largeTitle]}>
          {event.title}
        </ThemedText>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={14} color={secondaryTextColor} />
            <ThemedText style={[styles.metaText, { color: secondaryTextColor }]}>{event.location}</ThemedText>
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
  club: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
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
