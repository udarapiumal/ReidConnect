import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from '../../api/axiosInstance';
import { ThemedText } from "@/components/ThemedText";
import { BASE_URL } from "@/constants/config";

interface LostItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export default function LostFoundPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get(`${BASE_URL}/lost/lost-items`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.title}>Lost & Found Items</ThemedText>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl && (
              <Image
                source={{ uri: `${BASE_URL}/uploads/${item.imageUrl}` }}
                style={styles.image}
              />
            )}
            <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.itemDesc}>{item.description}</ThemedText>
            <ThemedText style={styles.itemDate}>
              Posted on {new Date(item.createdAt).toLocaleDateString()}
            </ThemedText>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 10,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemDesc: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
});
