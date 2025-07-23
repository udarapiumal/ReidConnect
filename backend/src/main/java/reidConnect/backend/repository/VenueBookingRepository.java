package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.VenueBooking;

public interface VenueBookingRepository extends JpaRepository<VenueBooking, Long> {

}
