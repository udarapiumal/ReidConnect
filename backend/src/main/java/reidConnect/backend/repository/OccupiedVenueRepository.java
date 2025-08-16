package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.entity.OccupiedVenue;

import java.util.List;
import java.util.Optional;

@Repository
public interface OccupiedVenueRepository extends JpaRepository<OccupiedVenue, Long> {

    boolean existsByVenue_IdAndDayAndSlot_Id(Long venueId, String day, Long slotId);

    List<OccupiedVenue> findByVenue_IdAndDayAndSlot_IdIn(Long venueId, String day, List<Long> slotIds);

    @Transactional
    void deleteByTimeTableId(Long timeTableId);

    Optional<OccupiedVenue> findByVenueIdAndDayAndSlotId(Long venueId, String day, Long slotId);

}
