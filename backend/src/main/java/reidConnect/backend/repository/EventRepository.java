package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Event;
import reidConnect.backend.entity.Post;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findAllByClub_IdOrderByCreatedAtDesc(Long clubId);

    long countByCreatedAtAfter(LocalDateTime localDateTime);

    long countByClub_Id(Long clubId);

    long countByClub_IdAndCreatedAtAfter(Long clubId, LocalDateTime createdAt);

}
