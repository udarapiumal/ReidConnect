import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../api/axiosInstance";
import { ThemedText } from "@/components/ThemedText";
import { BASE_URL } from "@/constants/config";

interface LostItem {
  id: number;
  itemName: string;
  description: string;
  imageUrl?: string;
  location: string;
  posterName: string;
  contactNumber: string;
  dateLost: string;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff4d4d" />
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
            <ThemedText style={styles.itemTitle}>{item.itemName}</ThemedText>
            <ThemedText style={styles.itemDesc}>{item.description}</ThemedText>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>📍 Location:</ThemedText>
              <ThemedText style={styles.value}>{item.location}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>👤 Posted by:</ThemedText>
              <ThemedText style={styles.value}>{item.posterName}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>📞 Contact:</ThemedText>
              <ThemedText style={styles.value}>{item.contactNumber}</ThemedText>
            </View>

            <ThemedText style={styles.itemDate}>
              🕒 Date Lost {formatDate(item.dateLost)}
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
    backgroundColor: "#0d0d0d", // dark background
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff4d4d",
    textAlign: "center",
    marginVertical: 14,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  itemDesc: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  label: {
    fontSize: 13,
    color: "#ff4d4d",
    marginRight: 4,
  },
  value: {
    fontSize: 13,
    color: "#ddd",
  },
  itemDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    textAlign: "right",
  },
});
