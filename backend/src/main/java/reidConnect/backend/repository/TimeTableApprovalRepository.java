package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.TimeTableApproval;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TimeTableApprovalRepository extends JpaRepository<TimeTableApproval, Long> {
    List<TimeTableApproval> findByAcademicCalendar_Id(Long academicCalendarId);

    List<TimeTableApproval> findByAcademicCalendar_IdOrderByReviewedAtDesc(Long academicCalendarId);

    @Transactional
    void deleteByAcademicCalendar_Id(Long academicCalendarId);
}
