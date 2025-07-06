import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
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
  image: string;
};

type EventCardProps = {
  event: EventData;
  size?: EventSize;
  onPress?: () => void;
};

export function EventCard({ event, size = 'large', onPress }: EventCardProps) {
  const cardBackgroundColor = useThemeColor({}, 'background');
  const shadowColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');
  const primaryColor = useThemeColor({}, 'tint');
  const secondaryTextColor = useThemeColor({}, 'icon');

  return (
    <TouchableOpacity
      style={[styles.container, size === 'small' ? styles.smallContainer : styles.largeContainer]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Image 
        source={{ uri: event.image }}
        style={[styles.image, size === 'small' ? styles.smallImage : styles.largeImage]}
        contentFit="cover"
      />
      <ThemedView style={[styles.detailsContainer, { backgroundColor: 'transparent' }]}>
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
  detailsContainer: {
    padding: 12,
    flex: 1,
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
