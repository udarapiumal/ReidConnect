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
        { date: "Tue, 15 July", time: "14:00", type: "Guest Lecture", location: "Room 202 • Engineering", status: "Approved" }
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
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="app-title">ReidConnect <span className="highlight">AcademicAdmin</span></h1>
                </div>
                <div className="header-right">
                    <i className="fas fa-bell header-icon"></i>
                    <i className="fas fa-user header-icon"></i>
                    <span className="admin-text">Admin</span>
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
                                            <span className="event-time">{event.time}</span>
                                            <div className="event-info">
                                                <div>
                                                    <span className="event-type">{event.type}</span><br />
                                                    <span className="event-location">{event.location}</span>
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
                    background-color: #1a1a1a;
                    min-height: 100vh;
                    color: white;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 24px;
                    background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: 70px;
                    z-index: 1001;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                .header-left {
                    flex: 1;
                }
                .app-title {
                    font-size: 26px;
                    font-weight: 700;
                    margin: 0;
                    color: white;
                    letter-spacing: -0.5px;
                }
                .highlight {
                    color: #ef4444;
                    font-weight: 600;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    color: white;
                }
                .header-icon {
                    font-size: 18px;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    opacity: 0.8;
                }
                .header-icon:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    opacity: 1;
                }
                .admin-text {
                    font-size: 14px;
                    font-weight: 500;
                    opacity: 0.9;
                }
                .dashboard-content {
                    display: flex;
                    margin-top: 70px;
                }
                main.dashboard-main {
                    flex: 1;
                    padding: 20px;
                    background-color: #1a1a1a;
                    margin-left: 200px; /* Sidebar width */
                    min-height: calc(100vh - 70px);
                    overflow: hidden;
                    max-width: calc(100vw - 200px);
                }
                .page-title {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 24px;
                    color: #ffffff;
                    letter-spacing: -0.3px;
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 20px;
                    margin-bottom: 24px;
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
                    font-size: 18px;
                    font-weight: 600;
                    color: #ffffff;
                }
                .controls {
                    display: flex;
                    gap: 12px;
                }
                .controls span {
                    color: #9ca3af;
                    font-size: 12px;
                    font-weight: 500;
                    background-color: rgba(255, 255, 255, 0.05);
                    padding: 4px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .search-input {
                    padding: 10px 12px;
                    margin-bottom: 16px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    background-color: rgba(255, 255, 255, 0.05);
                    color: white;
                    font-size: 13px;
                    font-weight: 400;
                    transition: all 0.2s ease;
                }
                .search-input::placeholder {
                    color: #9ca3af;
                }
                .search-input:focus {
                    outline: none;
                    border-color: #ef4444;
                    background-color: rgba(255, 255, 255, 0.08);
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
                .event-time {
                    font-weight: 600;
                    font-size: 14px;
                    flex-shrink: 0;
                    color: #ffffff;
                    min-width: 40px;
                    order: 2;
                }
                .event-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                    order: 3;
                }
                .event-icon {
                    color: #ef4444;
                    font-size: 14px;
                    opacity: 0.9;
                    order: 1;
                }
                .event-type {
                    font-weight: 600;
                    font-size: 14px;
                    display: block;
                    color: #ffffff;
                    margin-bottom: 2px;
                }
                .event-location {
                    font-size: 11px;
                    color: #9ca3af;
                    font-weight: 400;
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 16px;
                    font-weight: 600;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    min-width: 70px;
                    text-align: center;
                    border: 1px solid transparent;
                    order: 4;
                }
                .status-badge.pending {
                    background: #60a5fa;
                    color: #ffffff;
                    border: 1px solid #252525;
                }
                .status-badge.approved {
                    background: #ef4444;
                    color: white;
                    border: 1px solid #ef4444;
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
                    font-weight: 600;
                    color: white;
                    font-size: 14px;
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
                    color: #9ca3af;
                    margin-bottom: 10px;
                    font-size: 11px;
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
                    padding: 10px 6px;
                    border-radius: 8px;
                    position: relative;
                    color: white;
                    text-align: center;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 12px;
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
                    margin: 0 0 6px 0;
                    font-size: 28px;
                    font-weight: 700;
                    color: #ffffff;
                    line-height: 1;
                }
                .stat-card p {
                    margin: 0;
                    color: #9ca3af;
                    font-weight: 500;
                    font-size: 12px;
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
                        padding: 16px 12px;
                        max-width: 100vw;
                    }
                    .dashboard-header {
                        padding: 0 16px;
                    }
                    .page-title {
                        font-size: 20px;
                        margin-bottom: 16px;
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
