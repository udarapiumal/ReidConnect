import React, { useState } from "react";
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
    };

    const timelineEvents = [
        { date: "Thu, 10 July", time: "10:00", type: "AI Seminar", location: "Room 101 • CS Dept", status: "Pending" },
        { date: "Tue, 15 July", time: "14:00", type: "Guest Lecture", location: "Room 202 • Engineering", status: "Approved" }
    ];

    const calendarDays = [
        { day: 1, hasEvent: true }, { day: 2 }, { day: 3 }, { day: 4, hasEvent: true },
        { day: 5 }, { day: 6 }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 },
        { day: 11 }, { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, hasEvent: true },
        { day: 16 }, { day: 17, isToday: true }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }
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
                                            <span className="event-time">{event.time}</span>
                                            <div className="event-info">
                                                <i className="fas fa-clipboard event-icon"></i>
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
                            <h3>200+</h3>
                            <p>Lectures</p>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-clipboard-list"></i>
                            <h3>50</h3>
                            <p>Bookings</p>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-calendar-alt"></i>
                            <h3>100+</h3>
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
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background-color: #2a2a2a;
                    border-bottom: 1px solid #333;
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: 64px;
                    z-index: 1001;
                }
                .header-left {
                    flex: 1;
                }
                .app-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0;
                    color: white;
                }
                .highlight {
                    color: #ef4444;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    color: white;
                }
                .header-icon {
                    font-size: 20px;
                    cursor: pointer;
                }
                .admin-text {
                    font-size: 16px;
                }
                .dashboard-content {
                    display: flex;
                    margin-top: 64px;
                }
                main.dashboard-main {
                    flex: 1;
                    padding: 32px;
                    background-color: #1a1a1a;
                    margin-left: 200px; /* Sidebar width */
                    min-height: calc(100vh - 64px);
                    overflow-y: auto;
                }
                .page-title {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 32px;
                }
                .dashboard-grid {
                    display: flex;
                    gap: 32px;
                    flex-wrap: wrap;
                }
                /* Timeline Section */
                .timeline-section {
                    flex: 1 1 400px;
                    background-color: #2a2a2a;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #333;
                    display: flex;
                    flex-direction: column;
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .section-header h3 {
                    margin: 0;
                    font-size: 20px;
                }
                .controls span {
                    margin-left: 8px;
                    color: #ccc;
                    font-size: 14px;
                }
                .search-input {
                    padding: 8px 12px;
                    margin-bottom: 16px;
                    border-radius: 6px;
                    border: none;
                    font-size: 14px;
                }
                .timeline-events {
                    flex: 1;
                    overflow-y: auto;
                }
                .timeline-event {
                    margin-bottom: 16px;
                    color: white;
                }
                .event-date {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 4px;
                    display: block;
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
                }
                .event-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }
                .event-icon {
                    color: #ef4444;
                    font-size: 18px;
                }
                .event-type {
                    font-weight: 600;
                    font-size: 16px;
                    display: block;
                }
                .event-location {
                    font-size: 12px;
                    color: #aaa;
                }
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 12px;
                    text-transform: uppercase;
                    min-width: 80px;
                    text-align: center;
                    color: white;
                }
                .status-badge.pending {
                    background-color: #fbbf24; /* yellow */
                }
                .status-badge.approved {
                    background-color: #22c55e; /* green */
                }
                /* Calendar Section */
                .calendar-section {
                    flex: 1 1 300px;
                    background-color: #2a2a2a;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #333;
                    display: flex;
                    flex-direction: column;
                }
                .calendar-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .calendar-nav button {
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                }
                .current-month {
                    font-weight: 600;
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
                    color: #ccc;
                    margin-bottom: 8px;
                }
                .calendar-days {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 6px;
                }
                .calendar-day {
                    background-color: #1f1f1f;
                    padding: 12px 6px;
                    border-radius: 8px;
                    position: relative;
                    color: white;
                    text-align: center;
                    font-weight: 600;
                    cursor: default;
                }
                .calendar-day.event {
                    border: 2px solid #ef4444;
                }
                .calendar-day.today {
                    background-color: #ef4444;
                    color: white;
                }
                .event-dot {
                    position: absolute;
                    bottom: 6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 8px;
                    background-color: #ef4444;
                    border-radius: 50%;
                }
                .today-dot {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 6px;
                    height: 6px;
                    background-color: white;
                    border-radius: 50%;
                }
                .icon-btn {
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    font-size: 18px;
                }
                /* Dashboard Stats */
                .dashboard-stats {
                    margin-top: 32px;
                    display: flex;
                    gap: 24px;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                }
                .stat-card {
                    background-color: #2a2a2a;
                    padding: 20px;
                    border-radius: 12px;
                    flex: 1 1 120px;
                    text-align: center;
                    border: 1px solid #333;
                    color: white;
                }
                .stat-card i {
                    font-size: 24px;
                    margin-bottom: 8px;
                    color: #60a5fa;
                }
                .stat-card h3 {
                    margin: 0;
                    font-size: 28px;
                }
                .stat-card p {
                    margin: 0;
                    color: #aaa;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
