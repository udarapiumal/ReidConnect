package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.entity.OccupiedVenue;

import java.util.List;
import java.util.Optional;

@Repository
public interface OccupiedVenueRepository extends JpaRepository<OccupiedVenue, Long> {

    boolean existsByVenue_IdAndDayAndSlot_IdAndAcademicCalendar_Id(Long venueId, String day, Long slotId,
            Long academicCalendarId);

    List<OccupiedVenue> findByVenue_IdAndDayAndSlot_IdInAndAcademicCalendar_Id(Long venueId, String day,
            List<Long> slotIds, Long academicCalendarId);

    @Transactional
    void deleteByTimeTableId(Long timeTableId);

    Optional<OccupiedVenue> findByVenueIdAndDayAndSlotIdAndAcademicCalendar_Id(Long venueId, String day, Long slotId,
            Long academicCalendarId);
}
