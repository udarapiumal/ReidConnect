import React from 'react';
import { useNavigate } from 'react-router-dom';

const AcademicSidebar = ({ activeItem = 'Dashboard', onNavigate }) => {
    const navigate = useNavigate();

    const navigationItems = [
        { id: 'Dashboard', icon: 'fa-solid fa-gauge', label: 'Dashboard', route: '/academic/dashboard' },
        { id: 'Academic Staff', icon: 'fa-solid fa-user-graduate', label: 'Academic Staff', route: '/academic/lecturers' },
        { id: 'Courses', icon: 'fa-solid fa-user-graduate', label: 'Courses', route: '/academic/courses' },
        { id: 'Event Schedule', icon: 'fa-solid fa-calendar-check', label: 'Event Schedule', route: '/academic/events' },
        { id: 'Hall Bookings', icon: 'fa-solid fa-building-columns', label: 'Hall Bookings', route: '/academic/bookings' },
        { id: 'Reports', icon: 'fa-solid fa-chart-column', label: 'Reports', route: '/academic/reports' },
    ];

    const handleNavigation = (item) => {
        if (onNavigate) {
            onNavigate(item.id);
        }
        if (item.route) {
            navigate(item.route);
        }
    };

    return (
        <div style={styles.sidebar}>
            <div style={styles.topSection}>
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleNavigation(item)}
                        style={{
                            ...styles.navItem,
                            ...(activeItem === item.id ? styles.navItemActive : {})
                        }}
                    >
                        <i className={item.icon} style={styles.navIcon}></i>
                        <span style={{
                            ...styles.navText,
                            ...(activeItem === item.id ? styles.navTextActive : {})
                        }}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            <div style={styles.bottomSection}>
                <button style={styles.logoutButton}>
                    <span style={styles.logoutText}>Logout</span>
                </button>
            </div>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '200px',
        backgroundColor: '#1e1e1e',
        padding: '20px 0',
        height: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid #333',
        position: 'fixed',
        top: '80px',
        left: 0,
        zIndex: 999,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)',
    },
    topSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        paddingTop: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
    },
    bottomSection: {
        padding: '0 16px 20px 16px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '48px',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#ffffff',
        gap: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        cursor: 'pointer',
        fontSize: '14px',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        marginBottom: '2px',
    },
    navItemActive: {
        backgroundColor: '#2a2a2a',
        borderLeft: '3px solid #3b82f6',
    },
    navIcon: {
        fontSize: '16px',
        width: '20px',
        textAlign: 'center',
    },
    navText: {
        fontWeight: '400',
    },
    navTextActive: {
        fontWeight: '500',
    },
    logoutButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc2626',
        padding: '12px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        transition: 'background-color 0.2s ease',
    },
    logoutText: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
    }
};

export default AcademicSidebar;
