package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.EventSlot;
import reidConnect.backend.entity.EventSlotId;

import java.util.List;

public interface EventSlotRepository extends JpaRepository<EventSlot, EventSlotId> {
    List<EventSlot> findByEventId(Long eventId); // to retrieve all slots for an event
    void deleteByEventId(Long eventId);          // useful when updating slots
}
