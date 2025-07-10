import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClub } from "../../context/ClubContext";
const { width } = Dimensions.get('window');
const router = useRouter();
const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffMs = now - createdAt;

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    let result = '';
    if (days > 0) result += `${days} day${days !== 1 ? 's' : ''} `;
    if (hours > 0) result += `${hours} hour${hours !== 1 ? 's' : ''} `;
    if (minutes > 0 || (!days && !hours)) result += `${minutes} minute${minutes !== 1 ? 's' : ''} `;

    return result.trim() + ' ago';
};



export default function ClubDashboardTab() {
    const { user,token, clubDetails, loading } = useClub();
    const [latestPosts, setLatestPosts] = useState([]);

    const renderAnalyticsCards = () => (
        <View style={styles.analyticsContainer}>
            <View style={styles.analyticsCard}>
                <Text style={styles.analyticsLabel}>New Subscribers</Text>
                <Text style={styles.analyticsValue}>15</Text>
            </View>
            <View style={styles.analyticsCard}>
                <Text style={styles.analyticsLabel}>Events created</Text>
                <Text style={styles.analyticsValue}>3</Text>
            </View>
            <View style={styles.analyticsCard}>
                <Text style={styles.analyticsLabel}>Posts published</Text>
                <Text style={styles.analyticsValue}>15</Text>
            </View>
        </View>
    );

    const renderVideoItem = ({ thumbnail, title, duration, likes, comments }) => (
        <View style={styles.videoItem}>
            <View style={styles.videoThumbnail}>
                <View style={styles.thumbnailPlaceholder}>
                    <Image source={thumbnail} style={{ width: 72, height: 48, borderRadius: 5 }} />
                </View>
            </View>
            <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>{title}</Text>
                <Text style={styles.videoMeta}>First {duration}</Text>
                <View style={styles.videoStats}>
                    <View style={styles.icon}>
                        <Feather name="thumbs-up" size={16} color="#555" />
                        <Text style={styles.statText}>{likes}</Text>
                    </View>
                    <View style={styles.icon}>
                        <Feather name="message-circle" size={16} color="#555" />
                        <Text style={styles.statText}>{comments}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderCommentItem = ({ thumbnail, title, commenterPic, commenterName, commentTime, commentText }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <View style={styles.commentThumbnail}>
                    <Image source={thumbnail} style={{ width: 40, height: 40, borderRadius: 4 }} />
                </View>
                <View style={styles.commentContent}>
                    <Text style={styles.commentTitle} numberOfLines={1}>{title}</Text>
                    <View style={styles.commentMeta}>
                        <View style={styles.commenterAvatar}>
                            <Image source={commenterPic} style={{ width: 25, height: 25, borderRadius: 25 }} />
                        </View>
                        <Text style={styles.commenterName}>@{commenterName}</Text>
                        <Text style={styles.commentTime}>• {commentTime}</Text>
                    </View>
                    <Text style={styles.commentText}>{commentText}</Text>
                </View>
            </View>
        </View>
    );

    useFocusEffect(
        useCallback(() => {
            if (loading) return;

        console.log("clubDetails after loading:", clubDetails);
        console.log("user after loading:", user);
        console.log("token: ", token);

        if (!clubDetails?.id || !token) {
            console.warn("Missing clubDetails or user token");
            return;
        }

        console.log("Sending the API call to get latest posts");

        axios.get(`http://192.168.1.5:8080/api/posts/club/${clubDetails.id}/latest`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                setLatestPosts(res.data);
                console.log("Latest posts response:", res.data);
            })
            .catch(err => {
                console.error("Error fetching latest posts", err);
            });
    }, [loading, clubDetails, user])
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.dashboardContent}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>Reid Connect</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.createButton}>
                            <Image
                                source={require('../../../assets/images/plus.png')}
                                style={styles.bellIcon}
                            />
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
                            <Image source={require("../../../assets/clubImages/profilePictures/rota_ucsc.jpg")} style={{ width: 50, height: 50 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Club Info Header */}
                <View style={styles.clubInfo}>
                    <View style={styles.clubAvatar}>
                        <Image source={require("../../../assets/clubImages/profilePictures/rota_ucsc.jpg")} style={{ width: 56, height: 56, borderRadius: 28 }} />
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

                    {latestPosts.map((post) => (
                        <TouchableOpacity key={post.id} onPress={() => router.push(`/club/post/${post.id}`)}>
                            {renderVideoItem({
                                thumbnail: {
                                    uri: post.mediaPaths?.[0]
                                        ? post.mediaPaths[0].startsWith('uploads/')
                                        ? `http://192.168.1.5:8080/${post.mediaPaths[0]}`
                                        : `http://192.168.1.5:8080/uploads/${post.mediaPaths[0]}`
                                        : 'http://192.168.1.5:8080/uploads/placeholder.jpg',
                                },

                                title: post.description || "No description",
                                duration: formatTimeAgo(post.createdAt) || "Some time ago",
                                likes:  0,
                                comments: 0
                            })}
                        </TouchableOpacity>
                    ))}

                </View>

                {/* Latest Comments Section */}
                <View style={styles.contentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Latest comments</Text>
                    </View>

                    {renderCommentItem({
                        thumbnail: require("../../../assets/clubImages/postImages/3.jpg"),
                        commenterPic: require("../../../assets/clubImages/postImages/5.png"),
                        title: "Unveiling the Visionaries! ✨ Meet the Executive Committee of the Rotaract Club of UCSC",
                        commenterName: "Chathura354",
                        commentTime: "2 days ago",
                        commentText: "Congratulations everyone!"
                    })}

                    {renderCommentItem({
                        thumbnail: require("../../../assets/clubImages/postImages/1.jpg"),
                        commenterPic: require("../../../assets/clubImages/postImages/6.png"),
                        title: "More than a Club— a call to lead,serve and grow! 📢🙌",
                        commenterName: "ShenalRD",
                        commentTime: "4 hours ago",
                        commentText: "Can't wait "
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#151718",
    },
    dashboardContent: {
        flex: 1,
        backgroundColor: "#151718",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#151718",
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
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    videoStats: {
        flexDirection: 'row',
        marginTop: 4,
    },
    statText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#555',
    },
    createButton: {
        width: 28,
        height: 28,
        marginRight: 10,
        resizeMode: 'contain',
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
        backgroundColor: '#CF1005',
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
        width: 50,
        height: 50,
        borderRadius: 25,
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
        backgroundColor: "#151718",
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
        backgroundColor: "#1a1a1a",
        flexDirection: "row",
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#272727",
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
    commentItem: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#272727",
    },
    commentHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    commentThumbnail: {
        marginRight: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentTitle: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
    },
    commentMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    commenterAvatar: {
        width: 25,
        height: 25,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    commenterInitial: {
        color: "#ffffff",
        fontSize: 8,
        fontWeight: "bold",
    },
    commenterName: {
        color: "#aaaaaa",
        fontSize: 12,
        marginRight: 4,
    },
    commentTime: {
        color: "#aaaaaa",
        fontSize: 12,
    },
    commentText: {
        color: "#ffffff",
        fontSize: 14,
        lineHeight: 20,
    },
});
