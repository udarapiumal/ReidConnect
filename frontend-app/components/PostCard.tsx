import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export type PostData = {
  id: string;
  club: string;
  avatar: string;
  time: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
};

type PostCardProps = {
  post: PostData;
  onPress?: () => void;
};

export function PostCard({ post, onPress }: PostCardProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: post.avatar }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.headerText}>
          <ThemedText style={styles.clubName}>{post.club}</ThemedText>
          <ThemedText style={styles.time}>{post.time}</ThemedText>
        </View>
        <TouchableOpacity>
          <Feather name="more-vertical" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.content}>{post.text}</ThemedText>

      {post.image && (
        <Image 
          source={{ uri: post.image }}
          style={styles.contentImage}
          contentFit="cover"
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="thumbs-up" size={18} color="#888" />
          <ThemedText style={styles.actionText}>{post.likes}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="message-circle" size={18} color="#888" />
          <ThemedText style={styles.actionText}>{post.comments}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={18} color="#888" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
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
    backgroundColor: '#eee',
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
    color: '#888',
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
    backgroundColor: '#eee',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
    color: '#888',
  },
});
