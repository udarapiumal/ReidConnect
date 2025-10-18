package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import reidConnect.backend.entity.VenueBooking;
import reidConnect.backend.enums.BookingStatus;

import java.util.List;

public interface VenueBookingRepository extends JpaRepository<VenueBooking, Long> {
    List<VenueBooking> findByStatus(BookingStatus status);

    // Count bookings by status
    long countByStatus(BookingStatus status);

    // Additional useful queries for dashboard
    List<VenueBooking> findByStatusOrderByDateDesc(BookingStatus status);

    // Get recent approved bookings (limit 10)
    List<VenueBooking> findTop10ByStatusOrderByDateDesc(BookingStatus status);

    // Custom query to find APPROVED bookings (since that's your fully approved status)
    @Query("SELECT vb FROM VenueBooking vb WHERE vb.status = 'APPROVED' ORDER BY vb.date DESC")
    List<VenueBooking> findApprovedBookingsOrderByDateDesc();

    // Count approved bookings
    @Query("SELECT COUNT(vb) FROM VenueBooking vb WHERE vb.status = 'APPROVED'")
    long countApprovedBookings();

}
