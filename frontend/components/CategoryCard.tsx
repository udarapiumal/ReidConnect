import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from './ThemedText';

import { ColorValue } from 'react-native';

export type CategoryData = {
  id: string;
  name: string;
  icon: keyof typeof Feather.glyphMap;
  colors: [ColorValue, ColorValue, ...ColorValue[]];
};

type CategoryCardProps = {
  category: CategoryData;
  onPress?: () => void;
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={category.colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Feather name={category.icon} size={32} color="white" />
        <ThemedText style={styles.name}>{category.name}</ThemedText>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});
