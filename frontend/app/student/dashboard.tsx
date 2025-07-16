import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function StudentDashboard() {
    const username = "Chathura"; // Replace with actual username from props or token
    const [activeTab, setActiveTab] = useState("feed");

    const renderContent = () => {
        switch (activeTab) {
            case "search":
                return <Text style={styles.contentText}>🔍 Search content goes here...</Text>;
            case "feed":
                return <Text style={styles.contentText}>📢 Feed content goes here...</Text>;
            case "profile":
                return <Text style={styles.contentText}>👤 Profile content goes here...</Text>;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, {username} 👋</Text>
            </View>

            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => setActiveTab("search")}>
                    <Text style={[styles.navItem, activeTab === "search" && styles.activeNav]}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("feed")}>
                    <Text style={[styles.navItem, activeTab === "feed" && styles.activeNav]}>Feed</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("profile")}>
                    <Text style={[styles.navItem, activeTab === "profile" && styles.activeNav]}>Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 20,
        backgroundColor: "#2c3e50",
    },
    welcome: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#ecf0f1",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    navItem: {
        fontSize: 16,
        color: "#7f8c8d",
    },
    activeNav: {
        color: "#e74c3c",
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    contentText: {
        fontSize: 18,
        color: "#34495e",
        textAlign: "center",
    },
});
