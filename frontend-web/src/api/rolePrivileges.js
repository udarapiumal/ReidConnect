export const PRIVILEGES = {
  ACADEMIC_MA: [
    "TIMETABLE_EDIT",
    "TIMETABLE_VIEW",
    "BOOKING_SIGN",
    "BOOKING_REQUEST",
    "EVENT_MANAGE"
  ],
  ACADEMIC_SAR: [
    "TIMETABLE_EDIT",
    "TIMETABLE_VIEW",
    "BOOKING_SIGN",
    "BOOKING_REQUEST",
    "EVENT_MANAGE"
  ],
  ACADEMIC_DEPUTY_DIRECTOR: [
    "TIMETABLE_VIEW",
    "BOOKING_SIGN"
  ],
  UNION: [
    "EVENT_MANAGE",
    "PROFILE_MANAGE"
  ]
};

// Map privileges to both route and UI metadata
export const FEATURE_MAP = {
  TIMETABLE_VIEW: { route: "/academic/timetable", label: "Time Table", icon: "fa-solid fa-chart-bar", element: "TimeTable" },
  BOOKING_SIGN: { route: "/academic/bookings", label: "Hall Bookings", icon: "fa-solid fa-building", element: "HallBookings" },
  BOOKING_REQUEST: null, // Need to implement this feature
  EVENT_MANAGE: { route: "/academic/events", label: "Events", icon: "fa-solid fa-calendar-days", element: "EventSchedule" },
  PROFILE_MANAGE: { route: "/union/Profilemanagement", label: "Profile Management", icon: "fa-solid fa-id-badge", element: "SearchUser" }
};
