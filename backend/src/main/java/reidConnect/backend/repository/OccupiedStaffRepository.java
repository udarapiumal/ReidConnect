package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.entity.OccupiedStaff;

import java.util.List;
import java.util.Optional;

public interface OccupiedStaffRepository extends JpaRepository<OccupiedStaff, Long> {

        boolean existsByStaff_IdAndDayAndSlot_IdAndAcademicCalendar_Id(Long staffId, String day, Long slotId,
                        Long academicCalendarId);

        List<OccupiedStaff> findByStaff_IdAndDayAndSlot_IdInAndAcademicCalendar_Id(Long staffId, String day,
                        List<Long> slotIds, Long academicCalendarId);

        @Transactional
        void deleteByTimeTableId(Long timeTableId);

        Optional<OccupiedStaff> findByStaffIdAndDayAndSlotIdAndAcademicCalendar_Id(Long staffId, String day,
                        Long slotId,
                        Long academicCalendarId);

        @Transactional
        void deleteByAcademicCalendar_Id(Long academicCalendarId);
}
