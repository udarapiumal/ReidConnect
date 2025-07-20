import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import AcademicSidebar from './AcademicSidebar';

export default function Reports() {
    const [activeNavItem, setActiveNavItem] = useState("Reports");

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
    };

    // Sample documents data
    const documents = [
        {
            id: 1,
            name: "Academic Staff Performance Report Q2 2025",
            category: "Performance Reports",
            uploadDate: "2025-07-15",
            fileSize: "2.5 MB",
            status: "Published",
            downloadCount: 45,
            fileType: "PDF"
        },
        {
            id: 2,
            name: "Student Enrollment Statistics 2025",
            category: "Statistical Reports",
            uploadDate: "2025-07-10",
            fileSize: "1.8 MB",
            status: "Draft",
            downloadCount: 0,
            fileType: "Excel"
        },
        {
            id: 3,
            name: "Hall Utilization Analysis Report",
            category: "Facility Reports",
            uploadDate: "2025-07-08",
            fileSize: "3.2 MB",
            status: "Published",
            downloadCount: 23,
            fileType: "PDF"
        },
        {
            id: 4,
            name: "Event Management Summary June 2025",
            category: "Event Reports",
            uploadDate: "2025-07-01",
            fileSize: "1.1 MB",
            status: "Published",
            downloadCount: 67,
            fileType: "Word"
        },
        {
            id: 5,
            name: "Budget Allocation Report 2025-2026",
            category: "Financial Reports",
            uploadDate: "2025-06-28",
            fileSize: "4.7 MB",
            status: "Review",
            downloadCount: 12,
            fileType: "PDF"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            default: return '#6b7280';
        }
    };

    const getFileTypeIcon = (fileType) => {
        switch (fileType) {
            case 'PDF': return 'fa-file-pdf';
            case 'Excel': return 'fa-file-excel';
            case 'Word': return 'fa-file-word';
            default: return 'fa-file';
        }
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
                <AcademicSidebar activeItem={activeNavItem} onNavigate={handleNavigation} />
                
                <ScrollView style={styles.mainContent}>
                    {/* Page Header */}
                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Reports & Documents</Text>
                        <TouchableOpacity style={styles.uploadBtn}>
                            <i className="fas fa-upload" style={styles.btnIcon}></i>
                            <Text style={styles.btnText}>Upload</Text>
                        </TouchableOpacity>
                    </View>



                    {/* Statistics Cards */}
                    <View style={styles.statsSection}>
                        <View style={styles.statsCard}>
                            <i className="fas fa-file-alt" style={styles.statsIcon}></i>
                            <View style={styles.statsContent}>
                                <Text style={styles.statsNumber}>{documents.length}</Text>
                                <Text style={styles.statsLabel}>Total Documents</Text>
                            </View>
                        </View>
                        
                        <View style={styles.statsCard}>
                            <i className="fas fa-eye" style={styles.statsIcon}></i>
                            <View style={styles.statsContent}>
                                <Text style={styles.statsNumber}>{documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}</Text>
                                <Text style={styles.statsLabel}>Total Downloads</Text>
                            </View>
                        </View>
                        
                        <View style={styles.statsCard}>
                            <i className="fas fa-check-circle" style={styles.statsIcon}></i>
                            <View style={styles.statsContent}>
                                <Text style={styles.statsNumber}>{documents.filter(doc => doc.status === 'Published').length}</Text>
                                <Text style={styles.statsLabel}>Published</Text>
                            </View>
                        </View>
                        
                        <View style={styles.statsCard}>
                            <i className="fas fa-clock" style={styles.statsIcon}></i>
                            <View style={styles.statsContent}>
                                <Text style={styles.statsNumber}>{documents.filter(doc => doc.status === 'Draft' || doc.status === 'Review').length}</Text>
                                <Text style={styles.statsLabel}>Pending</Text>
                            </View>
                        </View>
                    </View>

                    {/* Documents Table */}
                    <View style={styles.documentsSection}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Document Name</Text>
                            <Text style={styles.tableHeaderText}>Upload Date</Text>
                            <Text style={styles.tableHeaderText}>Size</Text>
                            <Text style={styles.tableHeaderText}>Status</Text>
                            <Text style={styles.tableHeaderText}>Actions</Text>
                        </View>

                        {documents.map((document) => (
                            <View key={document.id} style={styles.tableRow}>
                                <View style={styles.documentInfo}>
                                    <i className={`fas ${getFileTypeIcon(document.fileType)}`} style={styles.fileIcon}></i>
                                    <View style={styles.documentDetails}>
                                        <Text style={styles.documentName}>{document.name}</Text>
                                        <Text style={styles.documentType}>{document.fileType}</Text>
                                    </View>
                                </View>
                                
                                <Text style={styles.tableCell}>{document.uploadDate}</Text>
                                <Text style={styles.tableCell}>{document.fileSize}</Text>
                                
                                <View style={styles.statusContainer}>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}>
                                        <Text style={styles.statusText}>{document.status}</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <i className="fas fa-download" style={styles.actionIcon}></i>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <i className="fas fa-trash" style={styles.actionIcon}></i>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
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
    uploadBtn: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
    statsSection: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statsCard: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    statsIcon: {
        fontSize: 24,
        color: '#60a5fa',
    },
    statsContent: {
        flex: 1,
    },
    statsNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    statsLabel: {
        fontSize: 14,
        color: '#ccc',
    },
    documentsSection: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    tableHeaderText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        textAlign: 'left',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        alignItems: 'center',
    },
    documentInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fileIcon: {
        fontSize: 20,
        color: '#fff',
        width: 24,
        textAlign: 'center',
    },
    documentDetails: {
        flex: 1,
    },
    documentName: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    documentType: {
        color: '#888',
        fontSize: 12,
    },
    tableCell: {
        color: '#ccc',
        fontSize: 14,
        flex: 1,
        textAlign: 'left',
    },
    statusContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    actionsContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-start',
    },
    actionBtn: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: {
        color: '#ccc',
        fontSize: 14,
    },
});
