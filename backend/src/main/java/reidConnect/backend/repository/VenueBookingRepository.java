package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.VenueBooking;
import reidConnect.backend.enums.BookingStatus;

import java.util.List;
import java.util.Optional;

public interface VenueBookingRepository extends JpaRepository<VenueBooking, Long> {
    Optional<VenueBooking> findByEnvelopeId(String envelopeId);
    List<VenueBooking> findByStatus(BookingStatus status);
}
