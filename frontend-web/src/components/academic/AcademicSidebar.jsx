import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AcademicSidebar = ({ activeItem = 'Dashboard', onNavigate }) => {
    const navigationItems = [
        { id: 'Dashboard', icon: 'fa-solid fa-gauge', label: 'Dashboard' },
        { id: 'Academic Staff', icon: 'fa-solid fa-user-graduate', label: 'Academic Staff' },
        { id: 'Lecture Time Table', icon: 'fa-solid fa-calendar-days', label: 'Lecture Time Table' },
        { id: 'Academic Events', icon: 'fa-solid fa-calendar-check', label: 'Academic Events' },
        { id: 'Hall Bookings', icon: 'fa-solid fa-building-columns', label: 'Hall Bookings' },
        { id: 'Reports', icon: 'fa-solid fa-chart-column', label: 'Reports' },
        { id: 'Notifications', icon: 'fa-solid fa-bell', label: 'Notifications' }
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
                            <i className={`fa ${item.icon}`} style={styles.navIcon}></i>
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
        flexDirection: 'row',
        gap: 4,
        flexWrap: 'wrap',
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left',
        width: 180,
        height: 48,
        borderRadius: 8,
        gap: 12,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    navItemActive: {
        backgroundColor: '#2a2a2a',
    },
    navIcon: {
        fontSize: 16,
        width: 20,
        textAlign: 'center',
        color: 'white', // Ensure icon color is white
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
        color: 'white', // Ensure logout icon is white
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AcademicSidebar;
