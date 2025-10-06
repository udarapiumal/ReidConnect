package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.EventYear;


public interface EventYearRepository extends JpaRepository<EventYear, Long> {
    void deleteByEventId(Long eventId);
}
