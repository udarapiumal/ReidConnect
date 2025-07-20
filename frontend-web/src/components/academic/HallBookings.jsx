import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import AcademicSidebar from './AcademicSidebar';

const HallBookings = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showContact, setShowContact] = useState(false);
    const [contactItem, setContactItem] = useState(null);

    // Mock data for bookings
    const mockBookings = [
        { 
            id: 1, 
            hall: 'Lecture Hall A', 
            date: '2025-07-21', 
            time: '10:00 - 12:00', 
            status: 'Confirmed', 
            bookedBy: 'Dr. Smith',
            course: 'Software Engineering'
        },
        { 
            id: 2, 
            hall: 'Lecture Hall B', 
            date: '2025-07-22', 
            time: '14:00 - 16:00', 
            status: 'Pending', 
            bookedBy: 'Prof. Lee',
            course: 'Database Systems'
        },
        { 
            id: 3, 
            hall: 'Conference Room C', 
            date: '2025-07-23', 
            time: '09:00 - 11:00', 
            status: 'Confirmed', 
            bookedBy: 'Dr. Johnson',
            course: 'Network Security'
        }
    ];

    // Mock data for lecture requests
    const mockRequests = [
        { 
            id: 101, 
            requester: 'Dr. Adams', 
            hall: 'Lecture Hall C', 
            date: '2025-07-24', 
            time: '09:00 - 11:00', 
            reason: 'Extra tutorial session',
            course: 'Web Development',
            requestDate: '2025-07-20'
        },
        { 
            id: 102, 
            requester: 'Prof. Williams', 
            hall: 'Laboratory 1', 
            date: '2025-07-25', 
            time: '15:00 - 17:00', 
            reason: 'Makeup practical session',
            course: 'Mobile App Development',
            requestDate: '2025-07-19'
        }
    ];

    const handleAction = (action, item) => {
        console.log(`${action} action for item:`, item);
        if (action === 'view') {
            setSelectedItem(item);
            setShowPreview(true);
        } else if (action === 'contact') {
            setContactItem(item);
            setShowContact(true);
        }
        // Add your action handling logic here
    };

    const renderBookingCard = (booking) => (
        <View key={booking.id} style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.hallName}>{booking.hall}</Text>
                <View style={[
                    styles.statusBadge, 
                    booking.status === 'Confirmed' ? styles.statusConfirmed : styles.statusPending
                ]}>
                    <Text style={styles.statusText}>{booking.status}</Text>
                </View>
            </View>
            
            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date & Time:</Text>
                    <Text style={styles.infoValue}>{booking.date} | {booking.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Booked by:</Text>
                    <Text style={styles.infoValue}>{booking.bookedBy}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Course:</Text>
                    <Text style={styles.infoValue}>{booking.course}</Text>
                </View>
            </View>
            
            <View style={styles.cardActions}>
                <View style={styles.viewBtnContainer}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.viewBtn]}
                        onPress={() => handleAction('view', booking)}
                    >
                        <i className="fas fa-eye" style={styles.viewIcon}></i>
                        <Text style={[styles.actionText, styles.viewBtnText]}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderRequestCard = (request) => (
        <View key={request.id} style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.hallName}>{request.hall}</Text>
                <View style={styles.requestBadge}>
                    <Text style={styles.statusText}>New Request</Text>
                </View>
            </View>
            
            <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Requested by:</Text>
                    <Text style={styles.infoValue}>{request.requester}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date & Time:</Text>
                    <Text style={styles.infoValue}>{request.date} | {request.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Course:</Text>
                    <Text style={styles.infoValue}>{request.course}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Reason:</Text>
                    <Text style={styles.infoValue}>{request.reason}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Request Date:</Text>
                    <Text style={styles.infoValue}>{request.requestDate}</Text>
                </View>
            </View>
            
            <View style={styles.cardActions}>
                <TouchableOpacity 
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={() => handleAction('approve', request)}
                >
                    <Text style={[styles.actionText, styles.approveBtnText]}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => handleAction('contact', request)}
                >
                    <Text style={styles.actionText}>Contact</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPreviewModal = () => {
        if (!showPreview || !selectedItem) return null;

        return (
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {selectedItem.hall || 'Hall Details'}
                        </Text>
                        <TouchableOpacity 
                            style={styles.closeBtn}
                            onPress={() => setShowPreview(false)}
                        >
                            <i className="fas fa-times" style={styles.closeIcon}></i>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.modalBody}>
                        {selectedItem.date && (
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Date & Time:</Text>
                                <Text style={styles.previewValue}>
                                    {selectedItem.date} | {selectedItem.time}
                                </Text>
                            </View>
                        )}
                        
                        {selectedItem.bookedBy && (
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Booked by:</Text>
                                <Text style={styles.previewValue}>{selectedItem.bookedBy}</Text>
                            </View>
                        )}
                        
                        {selectedItem.requester && (
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Requested by:</Text>
                                <Text style={styles.previewValue}>{selectedItem.requester}</Text>
                            </View>
                        )}
                        
                        {selectedItem.course && (
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Course:</Text>
                                <Text style={styles.previewValue}>{selectedItem.course}</Text>
                            </View>
                        )}
                        
                        {selectedItem.status && (
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Status:</Text>
                                <Text style={styles.previewValue}>{selectedItem.status}</Text>
                            </View>
                        )}
                        
                        {selectedItem.reason && (
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Reason:</Text>
                                <Text style={styles.previewValue}>{selectedItem.reason}</Text>
                            </View>
                        )}
                        
                        {selectedItem.requestDate && (
                            <View style={styles.previewRow}>
                                <Text style={styles.previewLabel}>Request Date:</Text>
                                <Text style={styles.previewValue}>{selectedItem.requestDate}</Text>
                            </View>
                        )}
                    </View>
                    
                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.modalCloseBtn}
                            onPress={() => setShowPreview(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderContactModal = () => {
        if (!showContact || !contactItem) return null;

        return (
            <View style={styles.modalOverlay}>
                <View style={styles.contactModalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Contact Requester</Text>
                        <TouchableOpacity 
                            style={styles.closeBtn}
                            onPress={() => setShowContact(false)}
                        >
                            <i className="fas fa-times" style={styles.closeIcon}></i>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.modalBody}>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Request Details:</Text>
                            <Text style={styles.contactValue}>{contactItem.hall}</Text>
                            <Text style={styles.contactValue}>
                                {contactItem.date} | {contactItem.time}
                            </Text>
                            <Text style={styles.contactValue}>Course: {contactItem.course}</Text>
                        </View>
                        
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Requester:</Text>
                            <Text style={styles.contactValue}>{contactItem.requester}</Text>
                        </View>
                        
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactLabel}>Reason:</Text>
                            <Text style={styles.contactValue}>{contactItem.reason}</Text>
                        </View>
                        
                        <View style={styles.contactActions}>
                            <TouchableOpacity style={styles.contactBtn}>
                                <i className="fas fa-envelope" style={styles.contactIcon}></i>
                                <Text style={styles.contactBtnText}>Send Email</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.contactBtn}>
                                <i className="fas fa-phone" style={styles.contactIcon}></i>
                                <Text style={styles.contactBtnText}>Call</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.contactBtn}>
                                <i className="fas fa-comment" style={styles.contactIcon}></i>
                                <Text style={styles.contactBtnText}>Message</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.modalCloseBtn}
                            onPress={() => setShowContact(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

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
                    </View>
                    <Text style={styles.adminText}>Admin</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <AcademicSidebar activeItem="Hall Bookings" />
                
                <View style={styles.mainContent}>
                    {/* Page Header */}
                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Hall Bookings</Text>
                    </View>

                    {/* Tab Navigation */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
                            onPress={() => setActiveTab('bookings')}
                        >
                            <i className="fas fa-calendar-check" style={styles.tabIcon}></i>
                            <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>
                                Manage Bookings
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
                            onPress={() => setActiveTab('requests')}
                        >
                            <i className="fas fa-plus-circle" style={styles.tabIcon}></i>
                            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
                                Lecture Requests
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search and Actions */}
                    <View style={styles.controlsContainer}>
                        <View style={styles.searchContainer}>
                            <i className="fas fa-search" style={styles.searchIcon}></i>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={activeTab === 'bookings' ? "Search bookings..." : "Search requests..."}
                                placeholderTextColor="#999"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        
                        {activeTab === 'bookings' && (
                            <TouchableOpacity style={styles.newBookingBtn}>
                                <i className="fas fa-plus" style={styles.btnIcon}></i>
                                <Text style={styles.btnText}>New Booking</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Content Area */}
                    <ScrollView style={styles.contentArea}>
                        {activeTab === 'bookings' ? (
                            <View style={styles.gridContainer}>
                                {mockBookings.map(renderBookingCard)}
                            </View>
                        ) : (
                            <View style={styles.gridContainer}>
                                {mockRequests.map(renderRequestCard)}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
            
            {/* Preview Modal */}
            {renderPreviewModal()}
            
            {/* Contact Modal */}
            {renderContactModal()}
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
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        gap: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#ef4444',
    },
    tabIcon: {
        fontSize: 16,
        color: '#999',
    },
    tabText: {
        color: '#999',
        fontSize: 16,
        fontWeight: '500',
    },
    activeTabText: {
        color: 'white',
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 6,
        paddingHorizontal: 12,
        marginRight: 16,
    },
    searchIcon: {
        fontSize: 16,
        color: '#999',
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        paddingVertical: 12,
    },
    newBookingBtn: {
        backgroundColor: '#ef4444',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        gap: 8,
    },
    btnIcon: {
        fontSize: 14,
        color: 'white',
    },
    btnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    contentArea: {
        flex: 1,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'flex-start',
    },
    cardsContainer: {
        gap: 16,
    },
    card: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
        width: 300,
        minHeight: 200,
        maxHeight: 250,
        flexBasis: 'calc(33.33% - 12px)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    hallName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    statusBadge: {
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: '#333',
    },
    statusConfirmed: {
        backgroundColor: '#333',
    },
    statusPending: {
        backgroundColor: '#333',
    },
    requestBadge: {
        backgroundColor: '#333',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#ccc',
    },
    cardContent: {
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoLabel: {
        fontSize: 13,
        color: '#999',
        fontWeight: '400',
        flex: 1,
    },
    infoValue: {
        fontSize: 13,
        color: 'white',
        flex: 2,
        textAlign: 'right',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    viewBtnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#555',
    },
    viewBtn: {
        backgroundColor: 'white',
        flex: 'none',
        gap: 4,
        minWidth: 80,
    },
    approveBtn: {
        backgroundColor: 'white',
    },
    rejectBtn: {
        backgroundColor: '#333',
    },
    actionIcon: {
        fontSize: 12,
        color: 'white',
    },
    actionText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '500',
    },
    viewBtnText: {
        color: 'black',
    },
    approveBtnText: {
        color: 'black',
    },
    viewIcon: {
        fontSize: 12,
        color: 'black',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
    },
    modalContent: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        width: 400,
        maxWidth: '90%',
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#333',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    closeBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 14,
        color: '#ccc',
    },
    modalBody: {
        padding: 20,
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    previewLabel: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
        flex: 1,
    },
    previewValue: {
        fontSize: 14,
        color: 'white',
        flex: 1,
        textAlign: 'right',
    },
    modalFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    modalCloseBtn: {
        backgroundColor: '#6b7280',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#555',
    },
    modalCloseBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    contactModalContent: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        width: 450,
        maxWidth: '90%',
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#333',
    },
    contactInfo: {
        marginBottom: 16,
    },
    contactLabel: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 14,
        color: 'white',
        marginBottom: 2,
    },
    contactActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        gap: 12,
    },
    contactBtn: {
        flex: 1,
        backgroundColor: '#3b82f6',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    contactIcon: {
        fontSize: 14,
        color: 'white',
    },
    contactBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default HallBookings;
