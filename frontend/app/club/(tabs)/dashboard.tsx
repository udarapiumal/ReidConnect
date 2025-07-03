import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useClub } from "../../context/ClubContext";
const { width } = Dimensions.get('window');

export default function ClubDashboardTab() {
    const { user, clubDetails, loading } = useClub();

    const renderAnalyticsCards = () => (
        <View style={styles.analyticsContainer}>
            <View style={styles.analyticsCard}>
                <Text style={styles.analyticsLabel}>Views</Text>
                <Text style={styles.analyticsValue}>415 ↓</Text>
            </View>
            <View style={styles.analyticsCard}>
                <Text style={styles.analyticsLabel}>Watch time (hours)</Text>
                <Text style={styles.analyticsValue}>7.4 ↓</Text>
            </View>
        </View>
    );

    const renderVideoItem = ({ title, duration, views, likes, comments }) => (
        <View style={styles.videoItem}>
            <View style={styles.videoThumbnail}>
                <View style={styles.thumbnailPlaceholder}>
                    <Text style={styles.thumbnailText}>🎹</Text>
                </View>
            </View>
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{title}</Text>
                <Text style={styles.videoMeta}>First {duration}</Text>
                <View style={styles.videoStats}>
                    <Text style={styles.statText}>📊 {views}</Text>
                    <Text style={styles.statText}>👍 {likes}</Text>
                    <Text style={styles.statText}>💬 {comments}</Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF0033" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.dashboardContent}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoContainer}>
                        <Image source={require("../../../assets/images/ucsc-logo.png")} style={{ width: 50, height: 50 }} />
                        <Text style={styles.logoText}>Reid Connect</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.createButton}>
                        <Text style={styles.createButtonText}>+ Create</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.bellButton}>
                        <Image
                            source={require('../../../assets/images/bell-icon.png')} 
                            style={styles.bellIcon}
                        />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>9+</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.profileButton}>
                        <Image source={require("../../../assets/clubImages/profilePictures/1.jpeg")} style={{ width: 50, height: 50 }} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Club Info Header */}
            <View style={styles.clubInfo}>
                <View style={styles.clubAvatar}>
                    <Text style={styles.avatarText}>🎹</Text>
                </View>
                <View style={styles.clubDetails}>
                    <Text style={styles.clubName}>
                        {clubDetails?.clubName || 'Loading...'}
                    </Text>
                    <Text style={styles.subscriberCount}>
                        {clubDetails?.subCount || '0'}
                    </Text>
                    <Text style={styles.subscriberLabel}>Total subscribers</Text>
                </View>
            </View>

            {/* Analytics Section */}
            <View style={styles.analyticsSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Channel analytics</Text>
                    <Text style={styles.sectionSubtitle}>Last 28 days</Text>
                </View>
                {renderAnalyticsCards()}
            </View>

            {/* Latest Content */}
            <View style={styles.contentSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Latest published content</Text>
                </View>

                {renderVideoItem({
                    title: "Can you hear the music piano cover 🎹...",
                    duration: "333 days, 2 hours",
                    views: "567",
                    likes: "27",
                    comments: "2"
                })}

                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>Comments</Text>
                    <Text style={styles.commentsCount}>2</Text>
                    <Text style={styles.noComments}>No unresponded comments</Text>
                </View>

                {renderVideoItem({
                    title: "A clip of the interstellar theme played o...",
                    duration: "534 days, 15 hours",
                    views: "631",
                    likes: "50",
                    comments: "4"
                })}

                {renderVideoItem({
                    title: "Etha Ran Wiman (අහා රන් විමන්) - Pri...",
                    duration: "549 days, 3 hours",
                    views: "245",
                    likes: "18",
                    comments: "1"
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    dashboardContent: {
        flex: 1,
        backgroundColor: "#0f0f0f"
    },
     // Header Styles
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#0f0f0f",
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
    },
    headerLeft: {
        flex: 1,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    createButton: {
        backgroundColor: '#272727',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 16,
    },
    createButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    bellButton: {
        position: 'relative',
        marginRight: 16,
    },
   bellIcon: {
        width: 28,       
        height: 28,      
        resizeMode: 'contain', 
    },

    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#ff2f5f',
        borderRadius: 8,
        paddingHorizontal: 4,
        paddingVertical: 1,
        minWidth: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    profileButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
    },
    profileImage: {
        width: 50, // example size
        height: 50,
        borderRadius: 25,
    },

    headerButton: {
        padding: 8,
        marginHorizontal: 4,
    },
    headerButtonText: {
        color: "#ffffff",
        fontSize: 18,
    },
    profileButtonText: {
        color: "#ffffff",
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f0f0f",
    },
    clubInfo: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#0f0f0f",
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
    },
    clubAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#4a4a4a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        fontSize: 24,
    },
    clubDetails: {
        flex: 1,
    },
    clubName: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    subscriberCount: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
    },
    subscriberLabel: {
        color: "#aaaaaa",
        fontSize: 12,
    },
    analyticsSection: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
    },
    sectionSubtitle: {
        color: "#aaaaaa",
        fontSize: 14,
    },
    analyticsContainer: {
        flexDirection: "row",
        gap: 12,
    },
    analyticsCard: {
        flex: 1,
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#272727",
    },
    analyticsLabel: {
        color: "#aaaaaa",
        fontSize: 14,
        marginBottom: 8,
    },
    analyticsValue: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
    },
    contentSection: {
        padding: 16,
    },
    videoItem: {
        flexDirection: "row",
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
    },
    videoThumbnail: {
        marginRight: 12,
    },
    thumbnailPlaceholder: {
        width: 72,
        height: 48,
        backgroundColor: "#1a1a1a",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    thumbnailText: {
        fontSize: 20,
    },
    videoInfo: {
        flex: 1,
    },
    videoTitle: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    videoMeta: {
        color: "#aaaaaa",
        fontSize: 12,
        marginBottom: 8,
    },
    videoStats: {
        flexDirection: "row",
        gap: 16,
    },
    statText: {
        color: "#aaaaaa",
        fontSize: 12,
    },
    commentsSection: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    commentsTitle: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    commentsCount: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    noComments: {
        color: "#aaaaaa",
        fontSize: 14,
    },
});
