import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigate } from 'react-router-dom';
import AcademicSidebar from './AcademicSidebar';

export default function Dashboard() {
    const navigate = useNavigate();
    const [selectedTimeRange, setSelectedTimeRange] = useState("Next 7 days");
    const [sortBy, setSortBy] = useState("Sort by dates");
    const [allCourses, setAllCourses] = useState("All courses");
    const [allStatuses, setAllStatuses] = useState("All statuses");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentMonth, setCurrentMonth] = useState("July 2025");
    const [activeNavItem, setActiveNavItem] = useState("Dashboard");

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
        // Navigation logic is handled in AcademicSidebar component
    };

    // Sample data
    const timelineEvents = [
        {
            date: "Thu, 10 July",
            time: "10:00",
            type: "AI Seminar",
            location: "Room 101 • CS Dept",
            status: "Pending"
        },
        {
            date: "Tue, 15 July",
            time: "14:00",
            type: "Guest Lecture",
            location: "Room 202 • Engineering",
            status: "Approved"
        }
    ];

    const lectures = [
        { course: "Data Structures", time: "10:00 AM" },
        { course: "Algorithms", time: "2:00 PM" }
    ];

    const bookings = [
        "Room 101: AI Seminar (10:00 AM)",
        "Room 202: Guest Lecture (2:00 PM)",
        "Room 303: Data Structures (11:00 AM)",
        "Room 404: Algorithms (3:00 PM)",
        "Room 505: Web Development (1:00 PM)"
    ];

    const events = [
        { event: "AI Seminar", date: "2025-07-10", status: "Pending" },
        { event: "Guest Lecture", date: "2025-07-15", status: "Approved" }
    ];

    const calendarDays = [
        { day: 1, hasEvent: true }, { day: 2 }, { day: 3 }, { day: 4, hasEvent: true }, { day: 5 }, { day: 6 }, { day: 7 },
        { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 },
        { day: 15, hasEvent: true }, { day: 16 }, { day: 17, isToday: true }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.appTitle}>
                        ReidConnect <Text style={styles.academicText}>AcademicAdmin</Text>
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.headerIcons}>
                        <i className="fas fa-bell" style={styles.icon}></i>
                        <i className="fas fa-user" style={styles.icon}></i>
                        <Text style={styles.adminText}>Admin</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <AcademicSidebar 
                    activeItem={activeNavItem}
                    onNavigate={handleNavigation}
                />

                {/* Main Content */}
                <ScrollView style={styles.mainContent}>
                    <Text style={styles.pageTitle}>Dashboard Overview</Text>
                    
                    <View style={styles.dashboardGrid}>
                        {/* Timeline Section */}
                        <View style={styles.timelineSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Timeline</Text>
                                <View style={styles.timelineControls}>
                                    <Text style={styles.controlText}>{selectedTimeRange}</Text>
                                    <Text style={styles.controlText}>{sortBy}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.searchContainer}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search by activity type or name"
                                    placeholderTextColor="#999"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>

                            <View style={styles.timelineEvents}>
                                {timelineEvents.map((event, index) => (
                                    <View key={index} style={styles.timelineEvent}>
                                        <Text style={styles.eventDate}>{event.date}</Text>
                                        <View style={styles.eventDetails}>
                                            <Text style={styles.eventTime}>{event.time}</Text>
                                            <View style={styles.eventInfo}>
                                                <i className="fas fa-clipboard" style={styles.eventIcon}></i>
                                                <View>
                                                    <Text style={styles.eventType}>{event.type}</Text>
                                                    <Text style={styles.eventLocation}>{event.location}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.statusBadge, event.status.toLowerCase() === 'pending' ? styles.statusPending : styles.statusApproved]}>
                                                <Text style={styles.statusText}>{event.status}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Calendar Section */}
                        <View style={styles.calendarSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Calendar</Text>
                                <View style={styles.calendarControls}>
                                    <Text style={styles.controlText}>{allCourses}</Text>
                                    <Text style={styles.controlText}>{allStatuses}</Text>
                                    <TouchableOpacity style={styles.iconBtn}>
                                        <i className="fas fa-plus" style={styles.btnIcon}></i>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.calendarNavigation}>
                                <TouchableOpacity onPress={() => setCurrentMonth("June")}>
                                    <Text style={styles.navButtonText}>← June</Text>
                                </TouchableOpacity>
                                <Text style={styles.currentMonth}>{currentMonth}</Text>
                                <TouchableOpacity onPress={() => setCurrentMonth("August")}>
                                    <Text style={styles.navButtonText}>August →</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.calendarGrid}>
                                <View style={styles.calendarHeader}>
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                        <Text key={index} style={styles.calendarHeaderText}>{day}</Text>
                                    ))}
                                </View>
                                <View style={styles.calendarDays}>
                                    {calendarDays.map((day, index) => (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={[
                                                styles.calendarDay,
                                                day.hasEvent && styles.calendarDayEvent
                                                // Removed today background style
                                            ]}
                                        >
                                            <Text style={[
                                                styles.calendarDayText,
                                                day.isToday && styles.calendarDayTextActive,
                                                day.hasEvent && styles.calendarDayEventText
                                            ]}>
                                                {day.day}
                                            </Text>
                                            {day.hasEvent && <View style={styles.eventCircle} />}
                                            {day.isToday && <View style={styles.todayCircle} />}
                                            {/* Replaced text indicator with circle view */}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Bottom Sections: Total Counts */}
                    <View style={styles.bottomSections}>
                        <View style={styles.countCard}>
                            <i className="fas fa-graduation-cap" style={styles.countIcon}></i>
                            <Text style={styles.countNumber}>200+</Text>
                            <Text style={styles.countLabel}>Lectures</Text>
                        </View>
                        <View style={styles.countCard}>
                            <i className="fas fa-clipboard-list" style={styles.countIcon}></i>
                            <Text style={styles.countNumber}>50</Text>
                            <Text style={styles.countLabel}>Bookings</Text>
                        </View>
                        <View style={styles.countCard}>
                            <i className="fas fa-calendar-alt" style={styles.countIcon}></i>
                            <Text style={styles.countNumber}>100+</Text>
                            <Text style={styles.countLabel}>Events</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        position: 'relative', // Ensure proper positioning
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 1001,
    },
    headerLeft: {
        flex: 1,
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    academicText: {
        color: '#ef4444',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        fontSize: 20,
        color: 'white', // Ensure header icons are white
        marginRight: 8,
    },
    adminText: {
        color: 'white',
        fontSize: 16,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 64,
    },
    mainContent: {
        flex: 1,
        padding: 32,
        backgroundColor: '#1a1a1a',
        marginLeft: 200,
        minHeight: 'calc(100vh - 64px)',
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 32,
    },
    dashboardGrid: {
        flexDirection: 'row',
        gap: 32,
        marginBottom: 32,
    },
    timelineSection: {
        flex: 1,
    },
    calendarSection: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    timelineControls: {
        flexDirection: 'row',
        gap: 8,
    },
    calendarControls: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    controlText: {
        backgroundColor: '#333',
        color: 'white',
        padding: 8,
        borderRadius: 4,
        fontSize: 14,
    },
    newEventBtn: {
        backgroundColor: '#ef4444',
        padding: 8,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    iconBtn: {
        backgroundColor: '#ef4444',
        padding: 8,
        borderRadius: 4,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtn: {
        backgroundColor: '#ef4444',
        padding: 8,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    manageBtn: {
        backgroundColor: '#ef4444',
        padding: 8,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    btnIcon: {
        color: 'white',
        fontSize: 14,
    },
    btnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#333',
        color: 'white',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 4,
        padding: 12,
        fontSize: 14,
    },
    timelineEvents: {
        gap: 16,
    },
    timelineEvent: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 16,
    },
    eventDate: {
        fontWeight: '600',
        marginBottom: 8,
        color: '#ccc',
    },
    eventDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    eventIcon: {
        fontSize: 16,
        color: 'white', // Ensure event icons are white
        marginRight: 8,
    },
    eventType: {
        fontWeight: '600',
        color: 'white',
    },
    eventLocation: {
        color: '#999',
        fontSize: 14,
    },
    eventTime: {
        color: 'white',
        marginRight: 16,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statusPending: {
        backgroundColor: '#1a1a1a',
    },
    statusApproved: {
        backgroundColor: '#1a1a1a',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    calendarNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    navButtonText: {
        color: '#60a5fa',
        fontSize: 14,
    },
    currentMonth: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    calendarGrid: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 16,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    calendarHeaderText: {
        color: '#ccc',
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },
    calendarDays: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    calendarDay: {
        width: '12%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        position: 'relative',
    },
    calendarDayEvent: {
        backgroundColor: 'transparent',
        // Remove any special background for events as we'll use the circle indicator
    },
   
    calendarDayText: {
        color: 'white',
        fontSize: 14,
        zIndex: 2, // Ensure text is above the circle
    },
    calendarDayTextActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    calendarDayEventText: {
        color: 'white',
        fontWeight: '500',
    },
    eventCircle: {
        position: 'absolute',
        width: '70%',
        height: '70%',
        borderRadius: 50,
        backgroundColor: 'white',
        opacity: 0.2,
        top: '15%',
        left: '15%',
        zIndex: 1,
    },
    todayCircle: {
        position: 'absolute',
        width: '70%',
        height: '70%',
        borderRadius: 50,
        backgroundColor: '#ef4444',
        opacity: 0.3, // Semi-transparent red circle
        top: '15%',
        left: '15%',
        zIndex: 1,
    },
    bottomSections: {
        flexDirection: 'row',
        gap: 32,
        marginTop: 32,
        justifyContent: 'space-between',
    },
    countCard: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        marginHorizontal: 8,
        minWidth: 150,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    countIcon: {
        fontSize: 32,
        color: 'white',
        marginBottom: 8,
    },
    countNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    countLabel: {
        fontSize: 16,
        color: '#ccc',
        fontWeight: '500',
    },
});