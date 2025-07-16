package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Event;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.Years;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
}
