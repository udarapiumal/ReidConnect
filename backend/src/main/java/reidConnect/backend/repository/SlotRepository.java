package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Slot;

import java.time.LocalTime;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {
    long countByIdIn(List<Long> slotIds);
    boolean existsByStartTimeAndEndTime(LocalTime startTime, LocalTime endTime);

}
