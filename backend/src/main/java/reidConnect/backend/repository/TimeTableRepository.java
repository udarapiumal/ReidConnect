package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reidConnect.backend.entity.TimeTable;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

import java.util.List;

public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {

    @Query("SELECT DISTINCT t FROM TimeTable t " +
            "JOIN FETCH t.course c " +
            "JOIN FETCH c.lecturers " +
            "LEFT JOIN FETCH c.lectureVenue " +
            "LEFT JOIN FETCH c.practicalVenue " +
            "LEFT JOIN FETCH c.tutorialVenue " +
            "JOIN FETCH t.slots ts " +
            "JOIN FETCH ts.slot " +
            "WHERE c.degree = :degree AND c.year = :year " +
            "AND t.academicCalendar.id = :academicCalendarId " +
            "ORDER BY t.day, t.id")
    List<TimeTable> findByYearAndDegreeAndAcademicCalendarWithDetails(
            @Param("degree") Degree degree,
            @Param("year") Years year,
            @Param("academicCalendarId") Long academicCalendarId);

    List<TimeTable> findByDayIgnoreCaseAndAcademicCalendar_Id(String day, Long academicCalendarId);

    long countByDayAndAcademicCalendar_Id(String day, Long academicCalendarId);

    List<TimeTable> findByAcademicCalendar_Id(Long academicCalendarId);
}