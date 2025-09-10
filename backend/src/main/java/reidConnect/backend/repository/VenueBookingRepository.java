package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.VenueBooking;
import reidConnect.backend.enums.BookingStatus;

public interface VenueBookingRepository extends JpaRepository<VenueBooking, Long> {
    long countByStatus(BookingStatus status);
}
