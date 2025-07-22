import React, { useState, useEffect, useRef } from "react";
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

    const calendarDays = [
        { day: 1, hasEvent: true }, { day: 2 }, { day: 3 }, { day: 4, hasEvent: true },
        { day: 5 }, { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 },
        { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, hasEvent: true },
        { day: 16 }, { day: 17, isToday: true }, { day: 18 }, { day: 19 }, { day: 20 }, 
        { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 },
        { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 }, { day: 31 }
    ];

    return (
        <div className="dashboard-container">
            <header className="header">
                <div className="title">ReidConnect <span className="highlight">AcademicAdmin</span></div>
                <div className="admin-info">
                    <i className="fa fa-bell" />
                    <i className="fa fa-user" />
                    <span>Admin</span>
                </div>
            </header>

            <div className="dashboard-content">
                <AcademicSidebar activeItem={activeNavItem} onNavigate={handleNavigation} />

                <main className="dashboard-main">
                    <h2 className="page-title">Dashboard Overview</h2>

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
                                <div className="controls">
                                    <span>{allCourses}</span>
                                    <span>{allStatuses}</span>
                                    <button className="icon-btn"><i className="fas fa-plus"></i></button>
                                </div>
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
                                            {day.hasEvent && <div className="event-dot"></div>}
                                            {day.isToday && <div className="today-dot"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

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
                </main>
            </div>

            {/* Embedded CSS */}
            <style>{`
                .dashboard-container {
                    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
                    min-height: 100vh;
                    color: white;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    flex-direction: column;
                    letter-spacing: -0.01em;
                }
                .header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 70px;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 24px;
                    z-index: 1001;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                .title {
                    font-weight: 700;
                    font-size: 22px;
                    color: white;
                    letter-spacing: -0.02em;
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
                    background: rgba(249, 115, 22, 0.1);
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
                    color: white;
                    letter-spacing: -0.03em;
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
                    height: fit-content;
                }
                /* Timeline Section */
                .timeline-section {
                    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(8px);
                    max-height: 500px;
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .section-header h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                    color: #ffffff;
                    letter-spacing: -0.02em;
                }
                .controls {
                    display: flex;
                    gap: 12px;
                }
                .controls span {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 13px;
                    font-weight: 500;
                    background-color: rgba(255, 255, 255, 0.03);
                    padding: 6px 12px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    letter-spacing: -0.01em;
                }
                .search-input {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 14px 18px;
                    color: white;
                    font-size: 15px;
                    font-weight: 400;
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    outline: none;
                }
                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 400;
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
                    background-color: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: all 0.2s ease;
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
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
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
                    color: #ffffff;
                    letter-spacing: -0.01em;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                .event-type {
                    font-weight: 600;
                    font-size: 15px;
                    color: #ffffff;
                    letter-spacing: -0.01em;
                }
                .event-location {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 400;
                    margin-left: 4px;
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
                    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                    color: #ffffff;
                    border: 1px solid rgba(96, 165, 250, 0.3);
                    box-shadow: 0 2px 8px rgba(96, 165, 250, 0.2);
                }
                .status-badge.approved {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
                }
                .status-badge.canceled {
                    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
                    color: white;
                    border: 1px solid rgba(107, 114, 128, 0.3);
                    box-shadow: 0 2px 8px rgba(107, 114, 128, 0.2);
                }
                /* Calendar Section */
                .calendar-section {
                    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
                    padding: 20px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(8px);
                    max-height: 500px;
                }
                .calendar-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    padding: 8px 0;
                }
                .calendar-nav button {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: #ffffff;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 12px;
                    padding: 6px 10px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }
                .calendar-nav button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                }
                .current-month {
                    font-weight: 700;
                    color: white;
                    font-size: 16px;
                    letter-spacing: -0.02em;
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
                    color: rgba(255, 255, 255, 0.6);
                    margin-bottom: 10px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .calendar-days {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                }
                .calendar-day {
                    background-color: rgba(255, 255, 255, 0.03);
                    padding: 12px 6px;
                    border-radius: 8px;
                    position: relative;
                    color: white;
                    text-align: center;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 13px;
                    letter-spacing: -0.01em;
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
                    background-color: rgba(255, 255, 255, 0.03);
                    color: white;
                    font-weight: 600;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .event-dot {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 32px;
                    height: 32px;
                    background-color: #6b7280;
                    border-radius: 50%;
                    z-index: -1;
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
                    background: white;
                    border: 1px solid #e5e7eb;
                    color: #374151;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 6px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
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
                    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
                    padding: 20px 16px;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: white;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(8px);
                }
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    border-color: rgba(239, 68, 68, 0.3);
                }
                .stat-card i {
                    font-size: 24px;
                    margin-bottom: 12px;
                    color: #60a5fa;
                    opacity: 0.9;
                    display: block;
                }
                .stat-card h3 {
                    margin: 0 0 8px 0;
                    font-size: 32px;
                    font-weight: 800;
                    color: #ffffff;
                    line-height: 1;
                    letter-spacing: -0.02em;
                }
                .stat-card p {
                    margin: 0;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 500;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
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
                }
            `}</style>
        </div>
    );
}
