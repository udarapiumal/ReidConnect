import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("feed");
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Simulating token fetch
                const token = await AsyncStorage.getItem("token");
                const decoded: any = jwtDecode(token || "");
                setUserId(decoded.sub);   // ID from token
                setEmail(decoded.email);  // Email from token
                setRole(decoded.role);    // Role from token


            } catch (err) {
                console.error("Error fetching profile data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#e74c3c" />;
        }

        switch (activeTab) {
            case "search":
                return <Text style={styles.contentText}>🔍 Search content goes here...</Text>;

            case "feed":
                return <Text style={styles.contentText}>📢 Feed content goes here...</Text>;

            case "profile":
                return (
                    <ScrollView contentContainerStyle={styles.profileContainer}>
                        <Text style={styles.profileHeader}>👤 Profile</Text>
                        <View style={styles.profileCard}>
                            <Text style={styles.profileLabel}>User ID:</Text>
                            <Text style={styles.profileValue}>{userId}</Text>

                            <Text style={styles.profileLabel}>Email:</Text>
                            <Text style={styles.profileValue}>{email}</Text>

                            <Text style={styles.profileLabel}>Role:</Text>
                            <Text style={styles.profileValue}>{role}</Text>

                                                    </View>
                    </ScrollView>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, {userId} 👋</Text>
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
    profileContainer: {
    padding: 20,
    width: '100%',
},
profileHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
},
profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
},
profileLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#34495e",
},
profileValue: {
    fontSize: 16,
    marginBottom: 10,
    color: "#7f8c8d",
},

});
