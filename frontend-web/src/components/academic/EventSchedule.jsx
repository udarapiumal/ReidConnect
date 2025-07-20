import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigate } from 'react-router-dom';
import AcademicSidebar from './AcademicSidebar';

const EventSchedule = () => {
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState("All courses");
    const [currentMonth, setCurrentMonth] = useState("July 2025");
    const [currentYear, setCurrentYear] = useState(2025);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(6); // July = 6 (0-indexed)

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Sample events data
    const events = {
        1: [{ title: "Action Pl...", type: "action" }],
        4: [
            { title: "Bi-weekl...", type: "biweekly" },
            { title: "Interim R...", type: "interim" }
        ],
        6: [{ title: "UI Challe...", type: "ui" }],
        7: [
            { title: "Assignm...", type: "assignment" },
            { title: "Uploadin...", type: "upload" }
        ],
        17: [{ title: "UI Challe...", type: "ui" }]
    };

    const navigatePrevMonth = () => {
        if (currentMonthIndex === 0) {
            setCurrentMonthIndex(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex - 1);
        }
        setCurrentMonth(`${months[currentMonthIndex === 0 ? 11 : currentMonthIndex - 1]} ${currentMonthIndex === 0 ? currentYear - 1 : currentYear}`);
    };

    const navigateNextMonth = () => {
        if (currentMonthIndex === 11) {
            setCurrentMonthIndex(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonthIndex(currentMonthIndex + 1);
        }
        setCurrentMonth(`${months[currentMonthIndex === 11 ? 0 : currentMonthIndex + 1]} ${currentMonthIndex === 11 ? currentYear + 1 : currentYear}`);
    };

    // Generate calendar days for the current month
    const generateCalendarDays = () => {
        const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
        
        const days = [];
        
        // Empty cells for days before the first day of the month
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(null);
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();
    const today = 6; // Current day highlighted in blue

    return (
        <View style={styles.container}>
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
                <AcademicSidebar activeItem="Event Schedule" />
                
                <View style={styles.mainContent}>
                    <Text style={styles.pageTitle}>Calendar</Text>
                    
                    {/* Calendar Section */}
                    <View style={styles.calendarContainer}>
                        <View style={styles.calendarHeader}>
                            <View style={styles.filterContainer}>
                                <select
                                    value={selectedFilter}
                                    onChange={e => setSelectedFilter(e.target.value)}
                                    style={styles.filterDropdown}
                                >
                                    <option value="All courses">All events</option>
                                    <option value="Upcoming events">Upcoming events</option>
                                </select>
                            </View>
                            <View style={styles.calendarNavigation}>
                                <TouchableOpacity onPress={navigatePrevMonth}>
                                    <Text style={styles.navButtonText}>◀ June</Text>
                                </TouchableOpacity>
                                <Text style={styles.currentMonth}>{currentMonth}</Text>
                                <TouchableOpacity onPress={navigateNextMonth}>
                                    <Text style={styles.navButtonText}>August ▶</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={[styles.newEventBtn, { flexDirection: 'row', alignItems: 'center' }]}>
                                <i className="fas fa-plus" style={styles.icon}></i>
                                <Text style={styles.btnText}>New event</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Calendar Grid */}
                        <View style={styles.calendarGrid}>
                            {/* Days of week header */}
                            <View style={styles.weekHeader}>
                                {daysOfWeek.map((day) => (
                                    <Text key={day} style={styles.dayHeader}>{day}</Text>
                                ))}
                            </View>

                            {/* Calendar days */}
                            <View style={styles.calendarDays}>
                                {calendarDays.map((day, index) => (
                                    <View key={index} style={styles.calendarDay}>
                                        {day && (
                                            <>
                                                <Text style={[
                                                    styles.dayNumber,
                                                    day === today && styles.todayNumber
                                                ]}>
                                                    {day}
                                                </Text>
                                                {day === today && <View style={styles.todayIndicator} />}
                                                {events[day] && (
                                                    <View style={styles.eventsContainer}>
                                                        {events[day].map((event, eventIndex) => (
                                                            <View key={eventIndex} style={styles.eventItem}>
                                                                <View style={styles.eventDot} />
                                                                <Text style={styles.eventText}>{event.title}</Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                )}
                                            </>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Calendar Footer */}
                        <View style={styles.calendarFooter}>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Import or export calendars</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        position: 'relative',
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
        color: 'white',
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
    calendarContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 24,
        minHeight: 600,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    filterContainer: {
        flex: 1,
    },
    filterDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#555',
        maxWidth: 150,
        color: 'white',
    },
    filterText: {
        color: 'white',
        fontSize: 14,
        marginRight: 8,
    },
    dropdownIcon: {
        color: 'white',
        fontSize: 12,
    },
    calendarNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        flex: 1,
        justifyContent: 'center',
    },
    navButtonText: {
        color: '#60a5fa',
        fontSize: 14,
        fontWeight: '500',
    },
    currentMonth: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    newEventBtn: {
        backgroundColor: '#ef4444',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    btnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    calendarGrid: {
        backgroundColor: 'transparent',
    },
    weekHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    dayHeader: {
        flex: 1,
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
        fontWeight: '600',
        paddingVertical: 8,
    },
    calendarDays: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: '14.28%',
        minHeight: 80,
        padding: 4,
        position: 'relative',
        borderWidth: 0.5,
        borderColor: '#333',
    },
    dayNumber: {
        color: 'white',
        fontSize: 14,
        marginBottom: 4,
    },
    todayNumber: {
        color: 'white',
        fontWeight: 'bold',
    },
    todayIndicator: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#3b82f6',
        zIndex: -1,
    },
    eventsContainer: {
        gap: 2,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    eventDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#f97316',
    },
    eventText: {
        color: '#fff',
        fontSize: 10,
        flex: 1,
    },
    calendarFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    footerLink: {
        color: '#60a5fa',
        fontSize: 14,
    },
    footerSeparator: {
        color: '#999',
        fontSize: 14,
    },
});

export default EventSchedule;
