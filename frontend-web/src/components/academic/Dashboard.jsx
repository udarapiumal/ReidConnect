import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import AcademicSidebar from './AcademicSidebar';
import UserProfile from './UserProfile';
import axios from '../../api/axiosInstance';
import Header from './components/Header';
import Home from '../TimeTableDay';

const TIMETABLE_COUNT_URL = 'http://localhost:8080/api/timetable/count/today';
const BOOKING_COUNT_URL = 'http://localhost:8080/api/bookings/count/pending';
const EVENT_COUNT_URL = 'http://localhost:8080/api/events/count/recent';
const CURRENT_PERIOD_URL = 'http://localhost:8080/api/academic-calendar/current';


export default function Dashboard() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentMonth, setCurrentMonth] = useState("");
    const [activeNavItem, setActiveNavItem] = useState("Dashboard");
    const [showProfile, setShowProfile] = useState(false);


    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [lectureCount, setLectureCount] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);

    const fetchCountsAndPeriod = async () => {
        try {
            // Fetch period first to get the ID
            const periodRes = await axios.get(CURRENT_PERIOD_URL);
            const currentPeriodData = periodRes.data;
            setCurrentPeriod(currentPeriodData);

            // Prepare promises for other counts
            const promises = [
                axios.get(BOOKING_COUNT_URL),
                axios.get(EVENT_COUNT_URL)
            ];

            // Only fetch timetable count if we have a valid period ID
            if (currentPeriodData && currentPeriodData.id) {
                promises.push(axios.get(`${TIMETABLE_COUNT_URL}?academicCalendarId=${currentPeriodData.id}`));
            } else {
                promises.push(Promise.resolve({ data: 0 })); // Default to 0 if no period
            }

            const [bookingRes, eventRes, timetableRes] = await Promise.all(promises);

            setBookingCount(bookingRes.data || 0);
            setEventCount(eventRes.data || 0);
            setLectureCount(timetableRes.data || 0);

        } catch (error) {
            console.error("Failed to fetch counts:", error);
        }
    };

    useEffect(() => {
        fetchCountsAndPeriod();
    }, []);

    const handleNavigation = (itemId) => {
        setActiveNavItem(itemId);
    };

    return (
        <div className={`dashboard-container`}>
            <Header onProfileClick={() => setShowProfile(true)} />

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
                            <h3>{lectureCount}</h3>
                            <p>Sessions Today</p>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-clipboard-list"></i>
                            <h3>{bookingCount}</h3>
                            <p>Pending Bookings</p>
                        </div>
                        <div className="stat-card">
                            <i className="fas fa-calendar-alt"></i>
                            <h3>{eventCount}+</h3>
                            <p>Events Last Month</p>
                        </div>
                    </div>

                    {/* Timetable Section */}
                    <div className="day-timetable-section">
                        {currentPeriod ? (
                            currentPeriod.periodType === "SEMESTER" ? (
                                <Home />
                            ) : (
                                <div className="period-message-card">
                                    <h2>{currentPeriod.title}</h2>
                                    <p>{currentPeriod.periodType.replace("_", " ")}</p>
                                </div>
                            )
                        ) : (
                            <p>Loading academic period...</p>
                        )}
                    </div>
                </main>
            </div>

            {showProfile && (
                <UserProfile onClose={() => setShowProfile(false)} />
            )}

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
                    max-width: calc(100vw - 240px);
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

                /* Dashboard Stats */
                .dashboard-stats {
                    margin-top: 0;
                    margin-bottom: 40px;
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

                /* Timetable Section */
                .day-timetable-section {
                    margin-top: 0;
                    position: relative;
                    width: 100%;
                    overflow: visible;
                }

                .period-message-card {
                    margin-top: 40px;
                    text-align: center;
                    padding: 60px 20px;
                    border-radius: 16px;
                    backdrop-filter: blur(12px);
                    background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.1);
                    animation: fadeIn 0.5s ease;
                }

                .period-message-card h2 {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 10px;
                    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .period-message-card p {
                    font-size: 18px;
                    opacity: 0.8;
                    letter-spacing: 0.5px;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }


                /* Responsive Design */
                @media (max-width: 1200px) {
                    .dashboard-stats {
                        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
                    .dashboard-stats {
                        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                        gap: 12px;
                        margin-bottom: 24px;
                    }
                    .stat-card {
                        padding: 16px 12px;
                    }
                    .stat-card h3 {
                        font-size: 24px;
                    }
                    .day-timetable-section {
                        margin-top: 0;
                    }
                }
            `}</style>
        </div>
    );
}