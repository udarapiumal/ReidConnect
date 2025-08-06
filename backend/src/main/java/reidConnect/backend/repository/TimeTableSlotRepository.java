package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.TimeTableSlot;

public interface TimeTableSlotRepository extends JpaRepository<TimeTableSlot, Long> {
}
