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
        position: 'Senior Lecturer',
        image: ''
    });

    // Sample lecturer data organized by position
    const [lecturers, setLecturers] = useState([
        // Senior Lecturers
        {
            id: 'SL001',
            name: 'Prof. Sarah Johnson',
            email: 'sarah.johnson@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0124',
            specialization: 'Data Structures & Algorithms',
            position: 'Senior Lecturer',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 'SL002',
            name: 'Prof. Michael Davis',
            email: 'michael.davis@university.edu',
            department: 'Engineering',
            phone: '+1-555-0126',
            specialization: 'Machine Learning',
            position: 'Senior Lecturer',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 'SL003',
            name: 'Prof. Emily Chen',
            email: 'emily.chen@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0127',
            specialization: 'Database Systems',
            position: 'Senior Lecturer',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        // Assistant Lecturers
        {
            id: 'AL001',
            name: 'Dr. John Smith',
            email: 'john.smith@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0123',
            specialization: 'Artificial Intelligence',
            position: 'Assistant Lecturer',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 'AL002',
            name: 'Dr. Lisa Wang',
            email: 'lisa.wang@university.edu',
            department: 'Engineering',
            phone: '+1-555-0128',
            specialization: 'Software Engineering',
            position: 'Assistant Lecturer',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 'AL003',
            name: 'Dr. Robert Brown',
            email: 'robert.brown@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0129',
            specialization: 'Computer Networks',
            position: 'Assistant Lecturer',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        // Instructors
        {
            id: 'IN001',
            name: 'Ms. Jennifer Taylor',
            email: 'jennifer.taylor@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0130',
            specialization: 'Web Development',
            position: 'Instructor',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 'IN002',
            name: 'Mr. David Wilson',
            email: 'david.wilson@university.edu',
            department: 'Engineering',
            phone: '+1-555-0131',
            specialization: 'Programming Fundamentals',
            position: 'Instructor',
            image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
        },
        {
            id: 'IN003',
            name: 'Ms. Amy Rodriguez',
            email: 'amy.rodriguez@university.edu',
            department: 'Computer Science',
            phone: '+1-555-0132',
            specialization: 'Mobile App Development',
            position: 'Instructor',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
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
            position: 'Senior Lecturer',
            image: ''
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
            // Add new lecturer with appropriate ID prefix
            let newId;
            if (formData.position === 'Senior Lecturer') {
                const seniorCount = lecturers.filter(l => l.position === 'Senior Lecturer').length;
                newId = 'SL' + String(seniorCount + 1).padStart(3, '0');
            } else if (formData.position === 'Assistant Lecturer') {
                const assistantCount = lecturers.filter(l => l.position === 'Assistant Lecturer').length;
                newId = 'AL' + String(assistantCount + 1).padStart(3, '0');
            } else {
                const instructorCount = lecturers.filter(l => l.position === 'Instructor').length;
                newId = 'IN' + String(instructorCount + 1).padStart(3, '0');
            }
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
        lecturer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecturer.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group lecturers by position
    const seniorLecturers = filteredLecturers.filter(lecturer => lecturer.position === 'Senior Lecturer');
    const assistantLecturers = filteredLecturers.filter(lecturer => lecturer.position === 'Assistant Lecturer');
    const instructors = filteredLecturers.filter(lecturer => lecturer.position === 'Instructor');

    const renderLecturerTable = (lecturerList, title, bgColor) => (
        <View style={styles.categorySection}>
            {/* Category Heading Outside Table */}
            <View style={styles.categoryHeading}>
                <View style={[styles.categoryIndicator, { backgroundColor: bgColor }]}></View>
                <Text style={styles.categoryLabel}>{title}</Text>
                <View style={styles.categoryCount}>
                    <Text style={styles.countText}>{lecturerList.length}</Text>
                </View>
            </View>
            
            {/* Table Container */}
            <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.imageColumn]}>Image</Text>
                    <Text style={[styles.tableHeaderText, styles.idColumn]}>ID</Text>
                    <Text style={[styles.tableHeaderText, styles.nameColumn]}>Name</Text>
                    <Text style={[styles.tableHeaderText, styles.emailColumn]}>Email</Text>
                    <Text style={[styles.tableHeaderText, styles.phoneColumn]}>Phone</Text>
                    <Text style={[styles.tableHeaderText, styles.specializationColumn]}>Specialization</Text>
                    <Text style={[styles.tableHeaderText, styles.actionsColumn]}>Actions</Text>
                </View>
                <ScrollView style={styles.tableBody}>
                    {lecturerList.map((lecturer) => (
                        <View key={lecturer.id} style={styles.tableRow}>
                            <View style={[styles.imageColumn, styles.imageContainer]}>
                                <img 
                                    src={lecturer.image || 'https://via.placeholder.com/40x40?text=No+Image'} 
                                    alt={lecturer.name}
                                    style={styles.lecturerImage}
                                />
                            </View>
                            <Text style={[styles.tableCellText, styles.idColumn]}>{lecturer.id}</Text>
                            <Text style={[styles.tableCellText, styles.nameColumn]}>{lecturer.name}</Text>
                            <Text style={[styles.tableCellText, styles.emailColumn]}>{lecturer.email}</Text>
                            <Text style={[styles.tableCellText, styles.phoneColumn]}>{lecturer.phone}</Text>
                            <Text style={[styles.tableCellText, styles.specializationColumn]}>{lecturer.specialization}</Text>
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
                    {lecturerList.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No {title.toLowerCase()} found</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );

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
                                    <Text style={styles.btnText}>Add New</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Lecturers Categories */}
                            <View style={styles.categoriesContainer}>
                                {renderLecturerTable(seniorLecturers, "Senior Lecturers", "#fff")}
                                {renderLecturerTable(assistantLecturers, "Assistant Lecturers", "#fff")}
                                {renderLecturerTable(instructors, "Instructors", "#fff")}
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
                                    <Text style={styles.formLabel}>Position *</Text>
                                    <View style={styles.positionSelector}>
                                        <TouchableOpacity
                                            style={[
                                                styles.positionOption,
                                                formData.position === 'Senior Lecturer' && styles.positionOptionSelected
                                            ]}
                                            onPress={() => setFormData({...formData, position: 'Senior Lecturer'})}
                                        >
                                            <Text style={[
                                                styles.positionOptionText,
                                                formData.position === 'Senior Lecturer' && styles.positionOptionTextSelected
                                            ]}>Senior Lecturer</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.positionOption,
                                                formData.position === 'Assistant Lecturer' && styles.positionOptionSelected
                                            ]}
                                            onPress={() => setFormData({...formData, position: 'Assistant Lecturer'})}
                                        >
                                            <Text style={[
                                                styles.positionOptionText,
                                                formData.position === 'Assistant Lecturer' && styles.positionOptionTextSelected
                                            ]}>Assistant Lecturer</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.positionOption,
                                                formData.position === 'Instructor' && styles.positionOptionSelected
                                            ]}
                                            onPress={() => setFormData({...formData, position: 'Instructor'})}
                                        >
                                            <Text style={[
                                                styles.positionOptionText,
                                                formData.position === 'Instructor' && styles.positionOptionTextSelected
                                            ]}>Instructor</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.formLabel}>Image URL</Text>
                                    <TextInput
                                        style={styles.formInput}
                                        value={formData.image}
                                        onChangeText={(text) => setFormData({...formData, image: text})}
                                        placeholder="Enter image URL"
                                        placeholderTextColor="#999"
                                    />
                                    {formData.image && (
                                        <View style={styles.imagePreviewContainer}>
                                            <Text style={styles.previewLabel}>Preview:</Text>
                                            <img 
                                                src={formData.image} 
                                                alt="Preview"
                                                style={styles.imagePreview}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80?text=Invalid+URL';
                                                }}
                                            />
                                        </View>
                                    )}
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
                                        {editingLecturer ? 'Update' : 'Add'}
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        height: 64,
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
    categoriesContainer: {
        gap: 32,
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    categoryIndicator: {
        width: 4,
        height: 24,
        borderRadius: 2,
    },
    categoryLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        flex: 1,
    },
    categoryCount: {
        backgroundColor: '#333',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    countText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
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
        maxHeight: 300,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
        fontStyle: 'italic',
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
    imageColumn: {
        width: 60,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lecturerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        objectFit: 'cover',
        border: '2px solid #555',
    },
    idColumn: {
        width: 100,
    },
    nameColumn: {
        width: 200,
    },
    emailColumn: {
        width: 250,
    },
    phoneColumn: {
        width: 140,
    },
    specializationColumn: {
        width: 200,
    },
    actionsColumn: {
        width: 100,
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
    positionSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    positionOption: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#555',
    },
    positionOptionSelected: {
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
    },
    positionOptionText: {
        color: '#ccc',
        fontSize: 14,
    },
    positionOptionTextSelected: {
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
    imagePreviewContainer: {
        marginTop: 12,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#555',
    },
    previewLabel: {
        color: '#ccc',
        fontSize: 12,
        marginBottom: 8,
    },
    imagePreview: {
        width: 80,
        height: 80,
        borderRadius: 40,
        objectFit: 'cover',
        border: '2px solid #555',
    },
});

export default LecturerManagement;
