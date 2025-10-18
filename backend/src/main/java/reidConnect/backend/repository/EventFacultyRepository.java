package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.EventFaculty;

public interface EventFacultyRepository extends JpaRepository<EventFaculty, Long> {
    void deleteByEventId(Long eventId);
}
