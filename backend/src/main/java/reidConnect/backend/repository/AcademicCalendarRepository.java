package reidConnect.backend.repository;

import reidConnect.backend.entity.AcademicCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Long> {

    List<AcademicCalendar> findByAcademicYear(String academicYear);

    @Query("SELECT a FROM AcademicCalendar a WHERE :date BETWEEN a.startDate AND a.endDate")
    Optional<AcademicCalendar> findCurrentPeriod(LocalDate date);

    @Query("SELECT a FROM AcademicCalendar a WHERE a.startDate >= :start AND a.endDate <= :end")
    List<AcademicCalendar> findByDateRange(LocalDate start, LocalDate end);
}