import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useNotificationsContext, NotificationRecipientDto } from '@/app/context/NotificationsContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function NotificationPage() {
	const router = useRouter();
	const tint = useThemeColor({}, 'tint');
	const icon = useThemeColor({}, 'icon');
	const { notifications, unreadCount, markAsRead, reload } = useNotificationsContext();
	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		try { await reload(); } finally { setRefreshing(false); }
	};

	const renderItem = ({ item }: { item: NotificationRecipientDto }) => {
		const isUnread = !item.isRead;
		return (
			<TouchableOpacity
				style={[styles.card, isUnread && styles.cardUnread]}
				activeOpacity={0.7}
				onPress={() => { if (isUnread) markAsRead(item.id); }}
			>
				<View style={styles.cardHeader}>
					<ThemedText style={[styles.title, isUnread && { color: tint }]} numberOfLines={1}>
						{item.title || 'Notification'}
					</ThemedText>
					{isUnread && <View style={[styles.unreadDot, { backgroundColor: tint }]} />}
				</View>
				<ThemedText style={styles.message} numberOfLines={3}>{item.message}</ThemedText>
				<ThemedText style={styles.time}>
					{new Date(item.createdAt).toLocaleString()}
				</ThemedText>
			</TouchableOpacity>
		);
	};

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
					<Feather name="arrow-left" size={22} color={icon} />
				</TouchableOpacity>
				<ThemedText type="title" style={styles.headerTitle}>Notifications</ThemedText>
				<View style={{ width: 40 }} />
			</View>
			<View style={styles.subHeader}> 
				<ThemedText style={styles.unreadCount}>Unread: {unreadCount}</ThemedText>
				<TouchableOpacity onPress={reload}>
					<ThemedText style={[styles.reloadText, { color: tint }]}>Reload</ThemedText>
				</TouchableOpacity>
			</View>
			<FlatList
				data={notifications}
				keyExtractor={i => i.id}
				renderItem={renderItem}
				contentContainerStyle={notifications.length === 0 && { flex: 1, justifyContent: 'center' }}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				ListEmptyComponent={<ThemedText style={styles.empty}>No notifications yet</ThemedText>}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
	backBtn: { padding: 8 },
	headerTitle: { flex: 1, textAlign: 'center' },
	subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8 },
	unreadCount: { fontWeight: '600' },
	reloadText: { fontWeight: '600' },
	card: { marginHorizontal: 16, marginVertical: 6, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)' },
	cardUnread: { borderColor: 'rgba(0,122,255,0.4)', backgroundColor: 'rgba(0,122,255,0.05)' },
	cardHeader: { flexDirection: 'row', alignItems: 'center' },
	title: { flex: 1, fontWeight: '700', fontSize: 15 },
	unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 6 },
	message: { marginTop: 6, fontSize: 13, lineHeight: 18 },
	time: { marginTop: 6, fontSize: 11, opacity: 0.6 },
	empty: { textAlign: 'center', opacity: 0.6 },
});

