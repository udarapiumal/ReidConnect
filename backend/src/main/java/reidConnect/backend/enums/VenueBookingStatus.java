package reidConnect.backend.enums;

public enum VenueBookingStatus {
    PENDING,                    // Default state when request is submitted
    CLERK_APPROVED,             // After clerk approves
    CLERK_REJECTED,             // If clerk rejects
    HALL_COORDINATOR_APPROVED,
    DEPUTY_DIRECTOR_APPROVED,
    SAR_APPROVED,
    CARETAKER_ASSIGNED,
    FULLY_APPROVED              // All approvals completed
}
