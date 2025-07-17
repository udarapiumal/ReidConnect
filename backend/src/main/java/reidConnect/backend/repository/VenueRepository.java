package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Venue;

public interface VenueRepository extends JpaRepository<Venue, Long> {
}
