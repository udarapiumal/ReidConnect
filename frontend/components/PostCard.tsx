import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export type PostData = {
  id: string;
  club: string;
  avatar: string | number;
  time: string;
  text: string;
  image?: string | number;
  likes: number;
  comments: number;
};

type PostCardProps = {
  post: PostData;
  onPress?: () => void;
};

export function PostCard({ post, onPress }: PostCardProps) {
  const shadowColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');

  // Handle different image source types
  const getImageSource = (image: string | number | undefined) => {
    if (typeof image === 'string') {
      return { uri: image };
    } else if (typeof image === 'number') {
      return image; // This is a require() result
    }
    return undefined;
  };

  return (
    <ThemedView style={[styles.container, { shadowColor: shadowColor }]}>
      <View style={styles.header}>
        <Image
          source={getImageSource(post.avatar)}
          style={[styles.avatar, { backgroundColor: placeholderColor }]}
          contentFit="cover"
        />
        <View style={styles.headerText}>
          <ThemedText style={styles.clubName}>{post.club}</ThemedText>
          <ThemedText style={[styles.time, { color: secondaryTextColor }]}>
            {post.time}
          </ThemedText>
        </View>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color={secondaryTextColor} />
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.content}>{post.text}</ThemedText>

      {post.image && (
        <Image
          source={getImageSource(post.image)}
          style={[styles.contentImage, { backgroundColor: placeholderColor }]}
          contentFit="cover"
        />
      )}

      <View style={[styles.actions, { borderTopColor: borderColor }]}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="thumbs-up" size={18} color={secondaryTextColor} />
          <ThemedText style={[styles.actionText, { color: secondaryTextColor }]}>
            {post.likes}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather
            name="message-circle"
            size={18}
            color={secondaryTextColor}
          />
          <ThemedText style={[styles.actionText, { color: secondaryTextColor }]}>
            {post.comments}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={18} color={secondaryTextColor} />
        </TouchableOpacity>
      </View>
    </ThemedView>
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
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  clubName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 20,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
  },
});
