package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reidConnect.backend.entity.EventAttendance;
import reidConnect.backend.entity.Event;
import reidConnect.backend.entity.User;
import reidConnect.backend.enums.EventAttendanceStatus;

import java.util.Optional;

public interface EventAttendanceRepository extends JpaRepository<EventAttendance, Long> {
    Optional<EventAttendance> findByEventAndUser(Event event, User user);
    void deleteByEventAndUser(Event event, User user);
    long countByEventAndStatus(Event event, EventAttendanceStatus status);
    
    @Query("SELECT COUNT(ea) FROM EventAttendance ea WHERE ea.event.id = :eventId AND ea.status = :status")
    long countByEventIdAndStatus(@Param("eventId") Long eventId, @Param("status") EventAttendanceStatus status);
}
