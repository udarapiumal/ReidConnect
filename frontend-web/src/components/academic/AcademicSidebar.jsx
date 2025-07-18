import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AcademicSidebar = ({ activeItem = 'Dashboard', onNavigate }) => {
    const navigationItems = [
        { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'Events', icon: '📅', label: 'Events' },
        { id: 'Lectures', icon: '🎓', label: 'Lectures' },
        { id: 'Bookings', icon: '📝', label: 'Bookings' },
        { id: 'Reports', icon: '📈', label: 'Reports' },
        { id: 'Notifications', icon: '🔔', label: 'Notifications' }
    ];

    return (
        <View style={styles.sidebar}>
            {/* Top section with navigation items */}
            <View style={styles.topSection}>
                {/* Navigation Items */}
                <View style={styles.navigationList}>
                    {navigationItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.navItem,
                                activeItem === item.id && styles.navItemActive
                            ]}
                            onPress={() => onNavigate && onNavigate(item.id)}
                        >
                            <Text style={styles.navIcon}>{item.icon}</Text>
                            <Text style={[
                                styles.navText,
                                activeItem === item.id && styles.navTextActive
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Bottom section with logout button */}
            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                    <Text style={styles.logoutIcon}>↗</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        width: 200,
        backgroundColor: '#151718',
        paddingVertical: 24,
        paddingHorizontal: 16,
        height: '100vh', // Set to 100% of viewport height to match web
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRightWidth: 1,
        borderRightColor: '#333',
        position: 'relative',
        zIndex: 10,
    },
    topSection: {
        flex: 1,
    },
    bottomSection: {
        marginTop: 'auto',
        paddingTop: 50,
    },
    navigationList: {
        gap: 4,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 12,
    },
    navItemActive: {
        backgroundColor: '#2a2a2a',
    },
    navIcon: {
        fontSize: 16,
        width: 20,
        textAlign: 'center',
    },
    navText: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '400',
    },
    navTextActive: {
        color: '#ffffff',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    logoutIcon: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AcademicSidebar;
