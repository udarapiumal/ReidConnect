import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import AcademicSidebar from './AcademicSidebar';

const LecturerManagement = () => {
    const [activeNavItem, setActiveNavItem] = useState("Academic Staff");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        department: '',
        phone: '',
        specialization: '',
        status: 'Active'
    });

    // Sample lecturer data
    const [lecturers, setLecturers] = useState([
        {
            id: 'L001',
            name: 'Dr. John Smith',
            email: 'john.smith@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0123',
            specialization: 'Artificial Intelligence',
            status: 'Active'
        },
        {
            id: 'L002',
            name: 'Prof. Sarah Johnson',
            email: 'sarah.johnson@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0124',
            specialization: 'Data Structures',
            status: 'Active'
        },
        {
            id: 'L003',
            name: 'Dr. Michael Brown',
            email: 'michael.brown@university.edu',
            department: 'Engineering',
            phone: '+1-555-0125',
            specialization: 'Software Engineering',
            status: 'Inactive'
        }
    ]);

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
        // Add navigation logic here
    };

    const handleAddLecturer = () => {
        setShowAddForm(true);
        setEditingLecturer(null);
        setFormData({
            id: '',
            name: '',
            email: '',
            department: '',
            phone: '',
            specialization: '',
            status: 'Active'
        });
    };

    const handleEditLecturer = (lecturer) => {
        setEditingLecturer(lecturer.id);
        setFormData(lecturer);
        setShowAddForm(true);
    };

    const handleDeleteLecturer = (lecturerId) => {
        setLecturers(lecturers.filter(lecturer => lecturer.id !== lecturerId));
    };

    const handleSubmit = () => {
        if (editingLecturer) {
            // Update existing lecturer
            setLecturers(lecturers.map(lecturer => 
                lecturer.id === editingLecturer ? formData : lecturer
            ));
        } else {
            // Add new lecturer
            const newId = 'L' + String(lecturers.length + 1).padStart(3, '0');
            setLecturers([...lecturers, { ...formData, id: newId }]);
        }
        setShowAddForm(false);
        setEditingLecturer(null);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingLecturer(null);
    };

    const filteredLecturers = lecturers.filter(lecturer =>
        lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecturer.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecturer.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.appTitle}>
                        Reid<Text style={styles.academicText}>Connect Academic</Text>
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.headerIcons}>
                        <i className="fa-solid fa-bell" style={styles.icon}></i>
                        <i className="fa-solid fa-user" style={styles.icon}></i>
                        <Text style={styles.adminText}>Admin</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                {/* Sidebar */}
                <AcademicSidebar 
                    activeItem={activeNavItem} 
                    onNavigate={handleNavigation}
                />

                {/* Main Content */}
                <View style={styles.mainContent}>
                    <Text style={styles.pageTitle}>Academic Staff Management</Text>

                    {!showAddForm ? (
                        <>
                            {/* Controls Section */}
                            <View style={styles.controlsSection}>
                                <View style={styles.searchContainer}>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search lecturers by name, department, or specialization..."
                                        placeholderTextColor="#999"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                </View>
                                <TouchableOpacity 
                                    style={styles.addBtn}
                                    onPress={handleAddLecturer}
                                >
                                    <i className="fa-solid fa-plus" style={styles.btnIcon}></i>
                                    <Text style={styles.btnText}>Add New Lecturer</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Lecturers Table */}
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={[styles.tableHeaderText, styles.idColumn]}>ID</Text>
                                    <Text style={[styles.tableHeaderText, styles.nameColumn]}>Name</Text>
                                    <Text style={[styles.tableHeaderText, styles.emailColumn]}>Email</Text>
                                    <Text style={[styles.tableHeaderText, styles.departmentColumn]}>Department</Text>
                                    <Text style={[styles.tableHeaderText, styles.phoneColumn]}>Phone</Text>
                                    <Text style={[styles.tableHeaderText, styles.specializationColumn]}>Specialization</Text>
                                    <Text style={[styles.tableHeaderText, styles.statusColumn]}>Status</Text>
                                    <Text style={[styles.tableHeaderText, styles.actionsColumn]}>Actions</Text>
                                </View>

                                <ScrollView style={styles.tableBody}>
                                    {filteredLecturers.map((lecturer) => (
                                        <View key={lecturer.id} style={styles.tableRow}>
                                            <Text style={[styles.tableCellText, styles.idColumn]}>{lecturer.id}</Text>
                                            <Text style={[styles.tableCellText, styles.nameColumn]}>{lecturer.name}</Text>
                                            <Text style={[styles.tableCellText, styles.emailColumn]}>{lecturer.email}</Text>
                                            <Text style={[styles.tableCellText, styles.departmentColumn]}>{lecturer.department}</Text>
                                            <Text style={[styles.tableCellText, styles.phoneColumn]}>{lecturer.phone}</Text>
                                            <Text style={[styles.tableCellText, styles.specializationColumn]}>{lecturer.specialization}</Text>
                                            <View style={[styles.statusColumn, styles.statusContainer]}>
                                                <View style={[
                                                    styles.statusBadge,
                                                    lecturer.status === 'Active' ? styles.statusActive : styles.statusInactive
                                                ]}>
                                                    <Text style={styles.statusText}>{lecturer.status}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.actionsColumn, styles.actionsContainer]}>
                                                <TouchableOpacity 
                                                    style={styles.editBtn}
                                                    onPress={() => handleEditLecturer(lecturer)}
                                                >
                                                    <i className="fa-solid fa-edit" style={styles.actionIcon}></i>
                                                </TouchableOpacity>
                                                <TouchableOpacity 
                                                    style={styles.deleteBtn}
                                                    onPress={() => handleDeleteLecturer(lecturer.id)}
                                                >
                                                    <i className="fa-solid fa-trash" style={styles.actionIcon}></i>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </>
                    ) : (
                        /* Add/Edit Form */
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>
                                {editingLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
                            </Text>

                            <View style={styles.formGrid}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Name *</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.name}
                                        onChangeText={(text) => setFormData({...formData, name: text})}
                                        placeholder="Enter lecturer name"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Email *</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.email}
                                        onChangeText={(text) => setFormData({...formData, email: text})}
                                        placeholder="Enter email address"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Department *</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.department}
                                        onChangeText={(text) => setFormData({...formData, department: text})}
                                        placeholder="Enter department"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Phone</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.phone}
                                        onChangeText={(text) => setFormData({...formData, phone: text})}
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Specialization</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.specialization}
                                        onChangeText={(text) => setFormData({...formData, specialization: text})}
                                        placeholder="Enter specialization"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Status</Text>
                                    <View style={styles.statusSelector}>
                                        <TouchableOpacity
                                            style={[
                                                styles.statusOption,
                                                formData.status === 'Active' && styles.statusOptionSelected
                                            ]}
                                            onPress={() => setFormData({...formData, status: 'Active'})}
                                        >
                                            <Text style={[
                                                styles.statusOptionText,
                                                formData.status === 'Active' && styles.statusOptionTextSelected
                                            ]}>Active</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.statusOption,
                                                formData.status === 'Inactive' && styles.statusOptionSelected
                                            ]}
                                            onPress={() => setFormData({...formData, status: 'Inactive'})}
                                        >
                                            <Text style={[
                                                styles.statusOptionText,
                                                formData.status === 'Inactive' && styles.statusOptionTextSelected
                                            ]}>Inactive</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.formActions}>
                                <TouchableOpacity 
                                    style={styles.cancelBtn}
                                    onPress={handleCancel}
                                >
                                    <Text style={styles.cancelBtnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.submitBtn}
                                    onPress={handleSubmit}
                                >
                                    <Text style={styles.submitBtnText}>
                                        {editingLecturer ? 'Update Lecturer' : 'Add Lecturer'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        zIndex: 20,
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
    },
    mainContent: {
        flex: 1,
        padding: 32,
        backgroundColor: '#1a1a1a',
    },
    pageTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 32,
    },
    controlsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
    },
    searchContainer: {
        flex: 1,
    },
    searchInput: {
        backgroundColor: '#333',
        color: 'white',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    addBtn: {
        backgroundColor: '#ef4444',
        padding: 12,
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
    tableContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#333',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#555',
    },
    tableHeaderText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    tableBody: {
        maxHeight: 400,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        alignItems: 'center',
    },
    tableCellText: {
        color: '#ccc',
        fontSize: 14,
    },
    idColumn: {
        width: 80,
    },
    nameColumn: {
        width: 150,
    },
    emailColumn: {
        width: 200,
    },
    departmentColumn: {
        width: 120,
    },
    phoneColumn: {
        width: 120,
    },
    specializationColumn: {
        width: 150,
    },
    statusColumn: {
        width: 100,
    },
    actionsColumn: {
        width: 100,
    },
    statusContainer: {
        alignItems: 'flex-start',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statusActive: {
        backgroundColor: '#22c55e',
    },
    statusInactive: {
        backgroundColor: '#ef4444',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    editBtn: {
        backgroundColor: '#3b82f6',
        padding: 8,
        borderRadius: 6,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtn: {
        backgroundColor: '#ef4444',
        padding: 8,
        borderRadius: 6,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: {
        color: 'white',
        fontSize: 12,
    },
    formContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 32,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 32,
    },
    formGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 24,
        marginBottom: 32,
    },
    formGroup: {
        width: '45%',
        minWidth: 250,
    },
    formLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: '#333',
        color: 'white',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
    },
    statusSelector: {
        flexDirection: 'row',
        gap: 12,
    },
    statusOption: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#555',
    },
    statusOptionSelected: {
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
    },
    statusOptionText: {
        color: '#ccc',
        fontSize: 14,
    },
    statusOptionTextSelected: {
        color: 'white',
        fontWeight: '500',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
    },
    cancelBtn: {
        backgroundColor: '#555',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    cancelBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    submitBtn: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default LecturerManagement;
