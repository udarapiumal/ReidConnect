import React, { useState, useEffect } from 'react';
import AcademicSidebar from './AcademicSidebar';
import Header from './components/Header';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { getCurrentUserRole, getCurrentUserId } from '../../utils/auth';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ucscLogo from '../../../src/images/UCSC_FULL_LOGO.png';


const EventSchedule = () => {
  const now = new Date();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All events");
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [showEventViewModal, setShowEventViewModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState("Events");
  const [showProfile, setShowProfile] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = `${months[currentMonthIndex]} ${currentYear}`;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = now.getDate();
  const user_id = getCurrentUserId();

  // Time slots mapping
  const TIME_SLOTS = [
    { id: 1, time: '08:00', label: '8:00 AM' },
    { id: 2, time: '08:30', label: '8:30 AM' },
    { id: 3, time: '09:00', label: '9:00 AM' },
    { id: 4, time: '09:30', label: '9:30 AM' },
    { id: 5, time: '10:00', label: '10:00 AM' },
    { id: 6, time: '10:30', label: '10:30 AM' },
    { id: 7, time: '11:00', label: '11:00 AM' },
    { id: 8, time: '11:30', label: '11:30 AM' },
    { id: 9, time: '12:00', label: '12:00 PM' },
    { id: 10, time: '12:30', label: '12:30 PM' },
    { id: 11, time: '13:00', label: '1:00 PM' },
    { id: 12, time: '13:30', label: '1:30 PM' },
    { id: 13, time: '14:00', label: '2:00 PM' },
    { id: 14, time: '14:30', label: '2:30 PM' },
    { id: 15, time: '15:00', label: '3:00 PM' },
    { id: 16, time: '15:30', label: '3:30 PM' },
    { id: 17, time: '16:00', label: '4:00 PM' },
    { id: 18, time: '16:30', label: '4:30 PM' },
    { id: 19, time: '17:00', label: '5:00 PM' },
    { id: 20, time: '17:30', label: '5:30 PM' },
  ];

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
  };

  // Data fetching
  useEffect(() => {
    fetchEvents();
  }, [currentYear, currentMonthIndex]);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
    }
  };

  // Calendar navigation
  const navigatePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const navigateNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = Array(adjustedFirstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    setShowEventViewModal(true);
  };

  const handleCloseEventViewModal = () => {
    setShowEventViewModal(false);
    setSelectedDate(null);
  };

  // Utility functions for calendar display
  const getEventsForSelectedDate = (day) => {
    const targetDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === targetDate);
  };

  const getEventTypeColor = (category) => {
    const colors = {
      SPORTS: '#10b981',
      MUSIC: '#8b5cf6',
      WELLNESS: '#f59e0b',
      COMPETITION: '#ef4444',
      OTHER: '#6b7280'
    };
    return colors[category] || colors.OTHER;
  };

  const generateReport = (period) => {
    const doc = new jsPDF();
    const now = new Date();
    let filteredEvents = [];
    let reportTitle = "";
    let periodLabel = "";

    if (period === "month") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const month = lastMonth.getMonth() + 1;
      const year = lastMonth.getFullYear();

      filteredEvents = events.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });

      reportTitle = `${months[month - 1]} ${year}`;
      periodLabel = "Monthly Event Report";

    } else if (period === "year") {
      const lastYear = now.getFullYear();

      filteredEvents = events.filter(e => new Date(e.date).getFullYear() === lastYear);

      reportTitle = `Year ${lastYear}`;
      periodLabel = "Annual Event Report";
    }

    // Sort events by date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    // === COVER PAGE ===
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background accent
    doc.setFillColor(255, 255, 255); // UCSC Maroon
    doc.rect(0, 0, pageWidth, 60, 'F');

    // University Logo
    // Option 1: Use path from public folder
    const logoPath = ucscLogo;

    // Option 2: Use Base64 encoded image (most reliable)
    // Convert your logo to Base64 at: https://www.base64-image.de/
    // Then paste the data here:
    const logoBase64 = "data:image/png;base64,YOUR_BASE64_STRING_HERE";

    try {
      // Add the logo image
      // Using path (requires logo in public folder)
      doc.addImage(logoPath, "PNG", pageWidth / 2 - 15, 20, 30, 30);

      // OR using Base64 (uncomment to use):
      // doc.addImage(logoBase64, "PNG", pageWidth / 2 - 15, 20, 30, 30);
    } catch (error) {
      // Fallback to placeholder if logo doesn't load
      console.warn("Logo not found, using placeholder:", error);
      doc.setFillColor(255, 255, 255);
      doc.circle(pageWidth / 2, 35, 15, 'F');
      doc.setFontSize(12);
      doc.setTextColor(139, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("UCSC", pageWidth / 2, 37, { align: "center" });
    }

    // University Name
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("UNIVERSITY OF COLOMBO", pageWidth / 2, 75, { align: "center" });
    doc.text("SCHOOL OF COMPUTING", pageWidth / 2, 85, { align: "center" });

    // Decorative line
    doc.setDrawColor(139, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(40, 95, pageWidth - 40, 95);

    // Report Title
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("EVENT SCHEDULE REPORT", pageWidth / 2, 120, { align: "center" });

    // Period
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(periodLabel, pageWidth / 2, 135, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(139, 0, 0);
    doc.text(reportTitle, pageWidth / 2, 150, { align: "center" });

    // Category breakdown
    const categories = {};
    filteredEvents.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + 1;
    });

    let categoryY = 225;
    categoryY += 10;

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, pageWidth / 2, pageHeight - 20, { align: "center" });
    doc.text("Academic, Publications & Welfare Division", pageWidth / 2, pageHeight - 15, { align: "center" });

    if (filteredEvents.length === 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("No events found for the selected period.", pageWidth / 2, 40, { align: "center" });
      doc.save(`UCSC_Event_Report_${reportTitle.replace(/\s+/g, '_')}.pdf`);
      return;
    }

    // === NEW PAGE FOR TABLE ===
    doc.addPage();

    // Header for table page
    doc.setFillColor(139, 0, 0);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`Detailed Event Schedule - ${reportTitle}`, pageWidth / 2, 16, { align: "center" });

    // Prepare table data
    const tableData = filteredEvents.map((e, index) => [
      index + 1,
      e.name,
      e.category,
      new Date(e.date).toLocaleDateString(),
      e.venueName || e.venue || "N/A",
      e.clubName || "Unknown",
      e.targetFaculties?.join(", ") || "All Faculties",
      e.targetYears?.map(y => y.replace('_', ' ')).join(", ") || "All Years"
    ]);

    // Generate professional table
    autoTable(doc, {
      head: [["#", "Event Name", "Category", "Date", "Venue", "Organized By", "Target Faculties", "Target Years"]],
      body: tableData,
      startY: 35,
      theme: "striped",
      headStyles: {
        fillColor: [139, 0, 0],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        valign: "middle"
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        overflow: "linebreak",
        halign: "left",
        valign: "middle"
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { cellWidth: 30, fontStyle: "bold" },
        2: { cellWidth: 28 },
        3: { cellWidth: 22 },
        4: { cellWidth: 25 },
        5: { cellWidth: 28 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 }
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { top: 35, left: 10, right: 10 },
      didDrawPage: (data) => {
        // Footer on each page
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
          pageWidth - 20,
          pageHeight - 10,
          { align: "right" }
        );
      }
    });

    // Final summary at bottom
    const finalY = doc.lastAutoTable.finalY + 15;

    // Calculate category statistics
    filteredEvents.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + 1;
    });

    const categoryEntries = Object.entries(categories);
    const summaryHeight = 35 + (categoryEntries.length * 7);

    // Check if we need a new page for summary
    if (finalY + summaryHeight > pageHeight - 30) {
      doc.addPage();
    }

    const summaryY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 15 : 40;

    // Summary box
    doc.setFillColor(139, 0, 0);
    doc.roundedRect(10, summaryY, pageWidth - 20, 12, 2, 2, 'F');

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("REPORT SUMMARY", pageWidth / 2, summaryY + 8, { align: "center" });

    // Total events section
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(10, summaryY + 15, pageWidth - 20, 15, 2, 2, 'F');

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Events: `, 20, summaryY + 25);

    doc.setTextColor(139, 0, 0);
    doc.setFontSize(12);
    doc.text(`${filteredEvents.length}`, 55, summaryY + 25);

    // Category breakdown section
    if (categoryEntries.length > 0) {
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(10, summaryY + 33, pageWidth - 20, 10 + (categoryEntries.length * 7), 2, 2, 'F');

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Events by Category:", 20, summaryY + 41);

      let catY = summaryY + 49;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      categoryEntries.forEach(([cat, count]) => {
        doc.setTextColor(80, 80, 80);
        doc.text(`• ${cat}:`, 25, catY);

        doc.setTextColor(139, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(`${count}`, 70, catY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(`(${((count / filteredEvents.length) * 100).toFixed(1)}%)`, 78, catY);

        catY += 7;
      });
    }

    // Report footer signature
    const footerY = pageHeight - 25;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, footerY, pageWidth - 20, footerY);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("This is a computer-generated report ReidConnect", pageWidth / 2, footerY + 5, { align: "center" });
    doc.text(`Generated: ${now.toLocaleDateString()} | Academic, Publications & Welfare Division`, pageWidth / 2, footerY + 10, { align: "center" });

    // Save with professional filename
    doc.save(`UCSC_Event_Report_${reportTitle.replace(/\s+/g, '_')}.pdf`);
  };


  return (
    <div className="event-schedule-container">
      <Header onProfileClick={() => setShowProfile(true)} />

      <div className="event-schedule-content">
        <AcademicSidebar
          activeItem={activeNavItem}
          onNavigate={handleNavigation}
        />

        <main className="event-schedule-main">
          <h2 className="page-title">Event Calendar</h2>

          <div className="calendar-container">
            <div className="calendar-controls">
              <div className="calendar-filters">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option>All events</option>
                  <option>Upcoming events</option>
                  <option>My events</option>
                </select>
              </div>

              <div className="month-navigation">
                <button onClick={navigatePrevMonth} className="nav-button" type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <div className="current-month-display">
                  <h2>{currentMonth}</h2>
                </div>
                <button onClick={navigateNextMonth} className="nav-button" type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="calendar-main">
              <div className="weekdays-grid">
                {daysOfWeek.map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day, index) => {
                  const eventsForDay = day ? getEventsForSelectedDate(day) : [];
                  const isToday = day === today &&
                    currentMonthIndex === new Date().getMonth() &&
                    currentYear === new Date().getFullYear();

                  return (
                    <div
                      key={index}
                      className={`calendar-day ${day ? "has-day" : "empty"} ${isToday ? "today" : ""} ${eventsForDay.length > 0 ? "has-events" : ""}`}
                      onClick={() => handleDateClick(day)}
                      style={{ cursor: day ? 'pointer' : 'default' }}
                    >
                      {day && (
                        <>
                          <div className="day-header">
                            <span className="day-number">{day}</span>
                            {isToday && <span className="today-badge">Today</span>}
                          </div>

                          {eventsForDay.length > 0 && (
                            <div className="day-events">
                              {eventsForDay.slice(0, 3).map((event, idx) => (
                                <div
                                  key={idx}
                                  className="event-preview"
                                  style={{ borderLeftColor: getEventTypeColor(event.category) }}
                                >
                                  <div className="event-time">
                                    {event.slotIds?.length > 0 &&
                                      TIME_SLOTS.find(slot => slot.id === event.slotIds[0])?.label?.split(' ')[0]
                                    }
                                  </div>
                                  <div className="event-title-preview">
                                    {event.name.length > 20 ? event.name.substring(0, 20) + '...' : event.name}
                                  </div>
                                </div>
                              ))}
                              {eventsForDay.length > 3 && (
                                <div className="more-events-indicator">
                                  +{eventsForDay.length - 3} more
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="calendar-footer">
              <div className="calendar-legend">
                <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#10b981' }}></div><span>Sports</span></div>
                <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div><span>Music</span></div>
                <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div><span>Wellness</span></div>
                <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div><span>Competition</span></div>
                <div className="legend-item"><div className="legend-color" style={{ backgroundColor: '#6b7280' }}></div><span>Other</span></div>
              </div>

              <div className="report-buttons">
                <button className="report-btn month" onClick={() => generateReport('month')}>📅 Print Last Month Report</button>
                <button className="report-btn year" onClick={() => generateReport('year')}>📆 Print This Year Report</button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* View-Only Event Modal */}
      {showEventViewModal && (
        <div className="modal-overlay" onClick={handleCloseEventViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <h3>Events for {months[currentMonthIndex]} {selectedDate}, {currentYear}</h3>
              </div>
              <button className="close-button" onClick={handleCloseEventViewModal} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>

            <div className="event-view-content">
              {getEventsForSelectedDate(selectedDate).length > 0 ? (
                <div className="events-list-view">
                  {getEventsForSelectedDate(selectedDate).map((event, index) => (
                    <div key={index} className="event-card">
                      <div className="event-card-header">
                        <div className="event-card-title">
                          <div
                            className="event-type-indicator"
                            style={{ backgroundColor: getEventTypeColor(event.category) }}
                          ></div>
                          <div className="event-title-content">
                            <h4>{event.name}</h4>
                            <span className="event-category-label">{event.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="event-details">
                        <div className="event-info-grid">
                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Organized by</span>
                              <span className="info-value">{event.clubName || 'Unknown Club'}</span>
                            </div>
                          </div>

                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Venue</span>
                              <span className="info-value">{event.venueName || event.venue || 'Venue TBD'}</span>
                            </div>
                          </div>

                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" />
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Time</span>
                              <span className="info-value">
                                {event.slotIds?.map(slotId => {
                                  const slot = TIME_SLOTS.find(s => s.id === slotId);
                                  return slot?.label;
                                }).filter(Boolean).join(', ') || 'Time TBD'}
                              </span>
                            </div>
                          </div>

                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Target Audience</span>
                              <span className="info-value">
                                {event.targetFaculties?.join(', ') || 'All Faculties'} • {event.targetYears?.map(year => year.replace('_', ' ')).join(', ') || 'All Years'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {event.description && (
                          <div className="event-description">
                            <h5>Description</h5>
                            <p>{event.description}</p>
                          </div>
                        )}

                        {event.imageUrl && (
                          <div className="event-image">
                            <h5>Event Image</h5>
                            <img
                              src={`http://localhost:8080/${event.imageUrl}`}
                              alt={event.name}
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-events-message">
                  <div className="no-events-illustration">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                  </div>
                  <div className="no-events-content">
                    <h4>No Events Scheduled</h4>
                    <p>There are no events scheduled for {months[currentMonthIndex]} {selectedDate}, {currentYear}.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
    .event-schedule-container {
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    letter-spacing: -0.01em;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    color: white;
}

.event-schedule-content {
    display: flex;
    padding-top: 70px;
    flex: 1;
    min-height: calc(100vh - 70px);
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

main.event-schedule-main {
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

/* Calendar Container */
.calendar-container {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    padding: 32px;
    min-height: 700px;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
}

/* Calendar Controls */
.calendar-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    gap: 24px;
    flex-wrap: wrap;
}

.calendar-filters {
    display: flex;
    align-items: center;
    gap: 16px;
}

.filter-select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    min-width: 160px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
}

.filter-select option {
    background: #1a1a1a;
    color: white;
}

.filter-select:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
}

.filter-select:focus {
    outline: none;
    border-color: rgba(255, 69, 58, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 69, 58, 0.1);
}

.month-navigation {
    display: flex;
    align-items: center;
    gap: 16px;
    font-weight: 700;
    color: white;
}

.nav-button {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    padding: 12px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
}

.nav-button:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.nav-button:active {
    transform: translateY(0);
}

.current-month-display h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
    min-width: 200px;
    text-align: center;
}

/* Calendar Grid */
.calendar-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.weekdays-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    color: rgba(255, 255, 255, 0.6);
    font-weight: 700;
    text-align: center;
    margin-bottom: 16px;
    user-select: none;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 12px;
}

.weekday {
    padding: 12px 0;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    flex: 1;
    min-height: 500px;
}

.calendar-day {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    padding: 16px 12px;
    position: relative;
    font-size: 14px;
    color: white;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    min-height: 120px;
}

.calendar-day.has-day {
    cursor: pointer;
}

.calendar-day.has-day:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.calendar-day.today {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.calendar-day.has-events {
    border-left: 4px solid #FF453A;
}

.calendar-day.empty {
    background: transparent;
    border: none;
    cursor: default;
}

.day-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.day-number {
    font-weight: 700;
    font-size: 16px;
    color: white;
}

.today-badge {
    background: #3b82f6;
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 6px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.day-events {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
}

.event-preview {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 3px solid #FF453A;
    border-radius: 6px;
    padding: 8px 6px;
    font-size: 11px;
    transition: all 0.2s ease;
}

.event-preview:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(2px);
}

.event-time {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    font-size: 10px;
    margin-bottom: 2px;
}

.event-title-preview {
    font-weight: 600;
    color: white;
    line-height: 1.2;
}

.more-events-indicator {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin-top: 4px;
    font-weight: 600;
}

/* Calendar Footer */
.calendar-footer {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.calendar-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    padding: 24px;
    opacity: 0;
    animation: modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes modalFadeIn {
    to { opacity: 1; }
}

.modal-content {
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(24px);
    position: relative;
    transform: scale(0.95) translateY(20px);
    animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes modalSlideIn {
    to {
        transform: scale(1) translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40px 40px 0 40px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    margin-bottom: 32px;
}

.modal-title {
    display: flex;
    align-items: center;
    gap: 16px;
}

.modal-title h3 {
    font-size: 28px;
    font-weight: 800;
    color: white;
    margin: 0;
    letter-spacing: -0.02em;
}

.modal-title svg {
    color: #FF453A;
}

.close-button {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    font-size: 18px;
    cursor: pointer;
    padding: 12px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    transform: translateY(-1px);
}

/* Event View Modal Styles */
.event-view-content {
    padding: 0 40px 40px 40px;
}

.events-list-view {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.event-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.event-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 20px;
}

.event-card-title {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
}

.event-type-indicator {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    flex-shrink: 0;
    margin-top: 2px;
}

.event-title-content h4 {
    font-size: 20px;
    font-weight: 700;
    color: white;
    margin: 0 0 6px 0;
    line-height: 1.3;
    letter-spacing: -0.01em;
}

.event-category-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.event-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.event-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.event-info-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    padding: 12px 0;
}

.event-info-row svg {
    width: 16px;
    height: 16px;
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 2px;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.info-label {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.info-value {
    font-size: 14px;
    font-weight: 600;
    color: white;
    line-height: 1.4;
}

.event-description {
    margin-top: 8px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    border-left: 4px solid #10b981;
}

.event-description h5 {
    margin: 0 0 12px 0;
    color: #10b981;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.event-description p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    font-weight: 500;
}

.event-image {
    margin-top: 8px;
}

.event-image h5 {
    margin: 0 0 12px 0;
    color: white;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.event-image img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.no-events-message {
    text-align: center;
    padding: 60px 40px;
    color: rgba(255, 255, 255, 0.8);
}

.no-events-illustration {
    margin-bottom: 24px;
}

.no-events-illustration svg {
    color: rgba(255, 255, 255, 0.3);
}

.no-events-content h4 {
    font-size: 22px;
    font-weight: 700;
    color: white;
    margin: 0 0 16px 0;
    letter-spacing: -0.01em;
}

.no-events-content p {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 8px 0;
    line-height: 1.5;
}

/* Custom Scrollbars */
.modal-content::-webkit-scrollbar {
    width: 8px;
}

.modal-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
    background-clip: content-box;
}
    .report-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.report-btn {
  background: linear-gradient(135deg, #ff453a, #ff5e57);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 69, 58, 0.3);
}

.report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(255, 69, 58, 0.4);
  background: linear-gradient(135deg, #ff5e57, #ff786d);
}

.report-btn:active {
  transform: translateY(0);
  box-shadow: 0 3px 15px rgba(255, 69, 58, 0.2);
}

.report-btn.year {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.report-btn.year:hover {
  background: linear-gradient(135deg, #60a5fa, #93c5fd);
}


/* Responsive Design */
@media (max-width: 1200px) {
    .calendar-grid {
        grid-template-columns: repeat(7, 1fr);
    }
}

@media (max-width: 768px) {
    main.event-schedule-main {
        margin-left: 0;
        padding: 20px 12px;
        max-width: 100vw;
    }
    
    .page-title {
        font-size: 24px;
        margin-bottom: 24px;
    }
    
    .calendar-container {
        padding: 20px;
    }
    
    .calendar-controls {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }
    
    .month-navigation {
        justify-content: center;
    }
    
    .calendar-grid {
        gap: 1px;
    }
    
    .calendar-day {
        min-height: 80px;
        padding: 8px 6px;
    }
    
    .day-number {
        font-size: 14px;
    }
    
    .event-preview {
        font-size: 10px;
        padding: 6px 4px;
    }
    
    .modal-content {
        max-width: 95vw;
        margin: 20px;
    }
    
    .modal-header {
        padding: 24px 20px 0 20px;
    }
    
    .event-view-content {
        padding: 0 20px 20px 20px;
    }
    
    .event-info-grid {
        grid-template-columns: 1fr;
    }
    
    .weekdays-grid {
        font-size: 10px;
    }
}
      `}</style>

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

export default EventSchedule;