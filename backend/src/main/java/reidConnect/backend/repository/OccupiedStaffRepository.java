package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.entity.OccupiedStaff;
import reidConnect.backend.entity.OccupiedVenue;

import java.util.List;
import java.util.Optional;

public interface OccupiedStaffRepository extends JpaRepository<OccupiedStaff, Long> {

    boolean existsByStaff_IdAndDayAndSlot_Id(Long staffId, String day, Long slotId);

    List<OccupiedStaff> findByStaff_IdAndDayAndSlot_IdIn(Long staffId, String day, List<Long> slotIds);

    @Transactional
    void deleteByTimeTableId(Long timeTableId);

    Optional<OccupiedStaff> findByStaffIdAndDayAndSlotId(Long staffId, String day, Long slotId);

}
