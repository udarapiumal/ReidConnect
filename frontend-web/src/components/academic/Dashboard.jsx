import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import AcademicSidebar from './AcademicSidebar';
import UserProfile from './UserProfile';

export default function Dashboard() {
    const navigate = useNavigate();
    const [selectedTimeRange, setSelectedTimeRange] = useState("Next 7 days");
    const [sortBy, setSortBy] = useState("Sort by dates");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentMonth, setCurrentMonth] = useState("July 2025");
    const [activeNavItem, setActiveNavItem] = useState("Dashboard");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Animation state for stat cards
    const [lectureCount, setLectureCount] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);

    // Animation effect for counting up - runs every time component loads
    useEffect(() => {
        // Reset counts to 0 first
        setLectureCount(0);
        setBookingCount(0);
        setEventCount(0);
        
        // Small delay to ensure reset is visible, then start animation
        const startDelay = setTimeout(() => {
            // Animate lecture count to 200
            const lectureInterval = setInterval(() => {
                setLectureCount(prev => {
                    if (prev >= 200) {
                        clearInterval(lectureInterval);
                        return 200;
                    }
                    return prev + 4;
                });
            }, 50);

            // Animate booking count to 50
            const bookingInterval = setInterval(() => {
                setBookingCount(prev => {
                    if (prev >= 50) {
                        clearInterval(bookingInterval);
                        return 50;
                    }
                    return prev + 1;
                });
            }, 50);

            // Animate event count to 100
            const eventInterval = setInterval(() => {
                setEventCount(prev => {
                    if (prev >= 100) {
                        clearInterval(eventInterval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);

            // Cleanup function for intervals
            return () => {
                clearInterval(lectureInterval);
                clearInterval(bookingInterval);
                clearInterval(eventInterval);
            };
        }, 100);

        // Cleanup function for the timeout
        return () => {
            clearTimeout(startDelay);
        };
    }, []);

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
    };

    const timelineEvents = [
        { date: "Thu, 10 July", time: "10:00", type: "AI Seminar", location: "Room 101 • CS Dept", status: "Pending" },
        { date: "Tue, 15 July", time: "14:00", type: "Guest Lecture", location: "Room 202 • Engineering", status: "Approved" },
        { date: "Wed, 16 July", time: "09:30", type: "Workshop", location: "Lab 305 • IT Dept", status: "Canceled" }
    ];

    const notifications = [
        { 
            id: 1, 
            title: "New Hall Booking Request", 
            message: "Engineering Hall requested for AI Conference on July 25th", 
            time: "2 min ago", 
            type: "booking",
            unread: true 
        },
        { 
            id: 2, 
            title: "Lecturer Registration", 
            message: "Dr. Sarah Johnson has completed registration", 
            time: "15 min ago", 
            type: "registration",
            unread: true 
        },
        { 
            id: 3, 
            title: "Event Approved", 
            message: "Machine Learning Workshop has been approved", 
            time: "1 hour ago", 
            type: "approval",
            unread: false 
        },
        { 
            id: 4, 
            title: "System Update", 
            message: "Scheduled maintenance tonight at 2:00 AM", 
            time: "3 hours ago", 
            type: "system",
            unread: false 
        }
    ];

    const handleNotificationToggle = () => {
        setShowNotifications(!showNotifications);
    };

    const handleNotificationClose = () => {
        setShowNotifications(false);
    };

    const handleProfileToggle = () => {
        setShowProfile(!showProfile);
    };

    const handleProfileClose = () => {
        setShowProfile(false);
    };

    const calendarDays = [
        { day: 1, hasEvent: true }, { day: 2 }, { day: 3 }, { day: 4, hasEvent: true },
        { day: 5 }, { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 },
        { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, hasEvent: true },
        { day: 16 }, { day: 17, isToday: true }, { day: 18 }, { day: 19 }, { day: 20 }, 
        { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
        { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }
    ];

    return (
        <div className={`dashboard-container ${showNotifications ? 'blur-background' : ''} ${showProfile ? 'blur-background' : ''}`}>
            <header className="header">
                <div className="title">ReidConnect <span className="highlight">AcademicAdmin</span></div>
                <div className="admin-info">
                    <div className="notification-wrapper">
                        <i className="fa fa-bell" onClick={handleNotificationToggle} />
                        {notifications.filter(n => n.unread).length > 0 && (
                            <span className="notification-badge"></span>
                        )}
                    </div>
                    <i className="fa fa-user" onClick={handleProfileToggle} />
                    <span>Admin</span>
                </div>
            </header>

            {showNotifications && (
                <>
                    <div className="notification-overlay" onClick={handleNotificationClose}></div>
                    <div className="notification-popup">
                        <div className="notification-header">
                            <h3>Notifications</h3>
                            <button className="close-btn" onClick={handleNotificationClose}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                        <div className="notification-list">
                            {notifications.map((notification) => (
                                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                                    <div className="notification-icon">
                                        <i className={`fa ${
                                            notification.type === 'booking' ? 'fa-calendar' :
                                            notification.type === 'registration' ? 'fa-user-plus' :
                                            notification.type === 'approval' ? 'fa-check-circle' :
                                            'fa-cog'
                                        }`}></i>
                                    </div>
                                    <div className="notification-content">
                                        <h4>{notification.title}</h4>
                                        <p>{notification.message}</p>
                                        <span className="notification-time">{notification.time}</span>
                                    </div>
                                    {notification.unread && <div className="unread-dot"></div>}
                                </div>
                            ))}
                        </div>
                        <div className="notification-footer">
                            <button className="mark-all-read">Mark all as read</button>
                            <button className="view-all">View all notifications</button>
                        </div>
                    </div>
                </>
            )}

            {showProfile && (
                <UserProfile onClose={handleProfileClose} />
            )}

            <div className="dashboard-content">
                <AcademicSidebar 
                    activeItem={activeNavItem} 
                    onNavigate={handleNavigation} 
                    isDarkMode={true}
                />

                <main className="dashboard-main">
                    <h2 className="page-title">Dashboard Overview</h2>

                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <i className="fas fa-graduation-cap"></i>
                            <h3>{lectureCount}+</h3>
                            <p>Lectures</p>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-clipboard-list"></i>
                            <h3>{bookingCount}</h3>
                            <p>Bookings</p>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-calendar-alt"></i>
                            <h3>{eventCount}+</h3>
                            <p>Events</p>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <section className="timeline-section">
                            <div className="section-header">
                                <h3>Timeline</h3>
                                <div className="controls">
                                    <span>{selectedTimeRange}</span>
                                    <span>{sortBy}</span>
                                </div>
                            </div>
                            <input
                                className="search-input"
                                placeholder="Search by activity type or name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="timeline-events">
                                {timelineEvents.map((event, index) => (
                                    <div key={index} className="timeline-event">
                                        <span className="event-date">{event.date}</span>
                                        <div className="event-details">
                                            <i className="fas fa-clipboard event-icon"></i>
                                            <div className="event-info">
                                                <div className="event-main">
                                                    <div className="event-header">
                                                        <span className="event-time">{event.time}</span>
                                                        <span className="event-type">{event.type}</span>
                                                        <span className="event-location">{event.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`status-badge ${event.status.toLowerCase()}`}>
                                                {event.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="calendar-section">
                            <div className="section-header">
                                <h3>Calendar</h3>
                            </div>
                            <div className="calendar-nav">
                                <button onClick={() => setCurrentMonth("June")}>← June</button>
                                <span className="current-month">{currentMonth}</span>
                                <button onClick={() => setCurrentMonth("August")}>August →</button>
                            </div>
                            <div className="calendar-grid">
                                <div className="calendar-header">
                                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
                                </div>
                                <div className="calendar-days">
                                    {calendarDays.map((day, i) => (
                                        <div key={i} className={`calendar-day${day.hasEvent ? ' event' : ''}${day.isToday ? ' today' : ''}`}>
                                            {day.day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Embedded CSS */}
            <style>{`
                .dashboard-container {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    flex-direction: column;
                    letter-spacing: -0.01em;
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
                    color: white;
                }

                .dashboard-container.blur-background .dashboard-content {
                    filter: blur(8px);
                    pointer-events: none;
                }

                .dashboard-container.blur-background .header {
                    filter: blur(8px);
                }

                .notification-wrapper {
                    position: relative;
                    display: inline-block;
                }

                .notification-badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    border-radius: 50%;
                    width: 12px;
                    height: 12px;
                    border: 2px solid rgba(20, 20, 20, 0.95);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                .notification-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9998;
                    backdrop-filter: blur(4px);
                }

                .notification-popup {
                    position: fixed;
                    top: 80px;
                    right: 24px;
                    width: 380px;
                    max-height: 500px;
                    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    overflow: hidden;
                    backdrop-filter: blur(20px);
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .notification-header {
                    padding: 20px 20px 16px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .notification-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: -0.02em;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 16px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.1);
                }

                .notification-list {
                    max-height: 320px;
                    overflow-y: auto;
                    padding: 8px 0;
                }

                .notification-item {
                    padding: 16px 20px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .notification-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .notification-item.unread {
                    background: rgba(59, 130, 246, 0.05);
                    border-left: 3px solid #3b82f6;
                }

                .notification-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(59, 130, 246, 0.2);
                    flex-shrink: 0;
                }

                .notification-icon i {
                    color: #60a5fa;
                    font-size: 14px;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-content h4 {
                    margin: 0 0 4px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #ffffff;
                    line-height: 1.3;
                }

                .notification-content p {
                    margin: 0 0 6px 0;
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.4;
                }

                .notification-time {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 500;
                }

                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: #3b82f6;
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-top: 4px;
                }

                .notification-footer {
                    padding: 16px 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    gap: 12px;
                }

                .notification-footer button {
                    flex: 1;
                    padding: 8px 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .notification-footer button:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 70px;
                    backdrop-filter: blur(20px);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 24px;
                    z-index: 1001;
                    transition: all 0.3s ease;
                    background: rgba(20, 20, 20, 0.95);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }

                .title {
                    font-weight: 700;
                    font-size: 22px;
                    letter-spacing: -0.02em;
                    transition: color 0.3s ease;
                    color: white;
                }

                .title .highlight {
                    color: #FF453A;
                    background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .admin-info {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    transition: color 0.3s ease;
                    color: rgba(255, 255, 255, 0.8);
                }

                .admin-info i {
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 8px;
                    border-radius: 8px;
                }
                .admin-info i:hover {
                    color: #FF453A;
                    background: rgba(255, 69, 58, 0.1);
                }

                .admin-info span {
                    font-size: 15px;
                    font-weight: 500;
                }

                .dashboard-content {
                    display: flex;
                    padding-top: 70px;
                    flex: 1;
                    min-height: calc(100vh - 70px);
                }

                main.dashboard-main {
                    flex: 1;
                    padding: 40px;
                    background: transparent;
                    margin-left: 200px;
                    overflow-y: auto;
                    min-height: calc(100vh - 70px);
                }

                .page-title {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 32px;
                    letter-spacing: -0.03em;
                    transition: all 0.3s ease;
                    color: white;
                    background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 20px;
                    margin-bottom: 32px;
                    margin-top: 32px;
                    height: fit-content;
                }

                /* Timeline Section */
                .timeline-section {
                    padding: 20px;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    backdrop-filter: blur(8px);
                    max-height: 500px;
                    transition: all 0.3s ease;
                    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    transition: border-color 0.3s ease;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .section-header h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    transition: color 0.3s ease;
                    color: #ffffff;
                }
                .controls {
                    display: flex;
                    gap: 12px;
                }

                .controls span {
                    font-size: 13px;
                    font-weight: 500;
                    padding: 6px 12px;
                    border-radius: 8px;
                    letter-spacing: -0.01em;
                    transition: all 0.3s ease;
                    color: rgba(255, 255, 255, 0.6);
                    background-color: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .search-input {
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-size: 15px;
                    font-weight: 400;
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    outline: none;
                    width: 100%;
                    box-sizing: border-box;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: white;
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .search-input:focus {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(249, 115, 22, 0.3);
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
                }
                .timeline-events {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 4px;
                }

                .timeline-event {
                    margin-bottom: 16px;
                    padding: 12px;
                    border-radius: 10px;
                    transition: all 0.2s ease;
                    background-color: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .timeline-event:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                    transform: translateY(-2px);
                }

                .event-date {
                    font-weight: 600;
                    font-size: 12px;
                    margin-bottom: 8px;
                    display: block;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: color 0.3s ease;
                    color: #9ca3af;
                }

                .event-details {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .event-icon {
                    color: #ef4444;
                    font-size: 14px;
                    opacity: 0.9;
                    flex-shrink: 0;
                }

                .event-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                }

                .event-main {
                    flex: 1;
                }

                .event-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .event-time {
                    font-weight: 600;
                    font-size: 12px;
                    letter-spacing: -0.01em;
                    padding: 2px 6px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    color: #ffffff;
                    background: rgba(255, 255, 255, 0.05);
                }

                .event-type {
                    font-weight: 600;
                    font-size: 15px;
                    letter-spacing: -0.01em;
                    transition: color 0.3s ease;
                    color: #ffffff;
                }

                .event-location {
                    font-size: 12px;
                    font-weight: 400;
                    margin-left: 4px;
                    transition: color 0.3s ease;
                    color: rgba(255, 255, 255, 0.6);
                }
                .status-badge {
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-weight: 600;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    min-width: 70px;
                    text-align: center;
                    border: 1px solid transparent;
                    flex-shrink: 0;
                }

                .status-badge.pending {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
                    color: white;
                    border: 1px solid rgba(251, 191, 36, 0.4);
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }

                .status-badge.approved {
                    background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%);
                    color: white;
                    border: 1px solid rgba(52, 211, 153, 0.4);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .status-badge.canceled {
                    background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%);
                    color: white;
                    border: 1px solid rgba(248, 113, 113, 0.4);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                /* Calendar Section */
                .calendar-section {
                    padding: 20px;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    backdrop-filter: blur(8px);
                    max-height: 500px;
                    transition: all 0.3s ease;
                    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .calendar-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    padding: 8px 0;
                }

                .calendar-nav button {
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 12px;
                    padding: 6px 10px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: #ffffff;
                }

                .calendar-nav button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .current-month {
                    font-weight: 700;
                    font-size: 16px;
                    letter-spacing: -0.02em;
                    transition: color 0.3s ease;
                    color: white;
                }
                .calendar-grid {
                    display: flex;
                    flex-direction: column;
                }

                .calendar-header {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-weight: 600;
                    margin-bottom: 10px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: color 0.3s ease;
                    color: rgba(255, 255, 255, 0.6);
                }

                .calendar-days {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                }

                .calendar-day {
                    padding: 12px 6px;
                    border-radius: 8px;
                    position: relative;
                    text-align: center;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 13px;
                    letter-spacing: -0.01em;
                    background-color: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .calendar-day:hover {
                    background-color: rgba(255, 255, 255, 0.08);
                    transform: translateY(-1px);
                }

                .calendar-day.event {
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    background-color: rgba(255, 255, 255, 0.03);
                }

                .calendar-day.today {
                    background-color: #ffffff;
                    color: #000000;
                    font-weight: 600;
                    border: 1px solid #ffffff;
                }

                .event-dot {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    z-index: -1;
                    background-color: #6b7280;
                }

                .today-dot {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 32px;
                    height: 32px;
                    background-color: #ef4444;
                    border-radius: 50%;
                    z-index: -1;
                }

                .icon-btn {
                    cursor: pointer;
                    font-size: 14px;
                    padding: 6px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                    background: white;
                    border: 1px solid #e5e7eb;
                    color: #374151;
                }

                .icon-btn:hover {
                    background: #f9fafb;
                    border-color: #d1d5db;
                }
                /* Dashboard Stats */
                .dashboard-stats {
                    margin-top: 0;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 16px;
                }

                .stat-card {
                    padding: 20px 16px;
                    border-radius: 12px;
                    text-align: center;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: white;
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    border-color: rgba(239, 68, 68, 0.3);
                }

                .stat-card i {
                    font-size: 24px;
                    margin-bottom: 12px;
                    opacity: 0.9;
                    display: block;
                    transition: color 0.3s ease;
                    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stat-card h3 {
                    margin: 0 0 8px 0;
                    font-size: 32px;
                    font-weight: 800;
                    line-height: 1;
                    letter-spacing: -0.02em;
                    transition: color 0.3s ease;
                    color: #ffffff;
                }

                .stat-card p {
                    margin: 0;
                    font-weight: 500;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: color 0.3s ease;
                    color: rgba(255, 255, 255, 0.6);
                }

                /* Responsive Design */
                @media (max-width: 1200px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                    .calendar-section {
                        max-width: none;
                    }
                }
                
                @media (max-width: 768px) {
                    main.dashboard-main {
                        margin-left: 0;
                        padding: 20px 12px;
                        max-width: 100vw;
                    }
                    .header {
                        padding: 0 16px;
                    }
                    .page-title {
                        font-size: 24px;
                        margin-bottom: 24px;
                    }
                    .dashboard-grid {
                        gap: 12px;
                        grid-template-columns: 1fr;
                    }
                    .timeline-section, .calendar-section {
                        padding: 16px;
                        max-height: 400px;
                    }
                    .dashboard-stats {
                        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                        gap: 12px;
                    }
                    .stat-card {
                        padding: 16px 12px;
                    }
                    .stat-card h3 {
                        font-size: 24px;
                    }
                    .notification-popup {
                        right: 12px;
                        left: 12px;
                        width: auto;
                        top: 90px;
                    }
                    .notification-header, .notification-item, .notification-footer {
                        padding-left: 16px;
                        padding-right: 16px;
                    }
                }
            `}</style>
        </div>
    );
}
