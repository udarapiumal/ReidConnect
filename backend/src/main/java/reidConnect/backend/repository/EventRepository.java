package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Event;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
// import reidConnect.backend.entity.Post;
import reidConnect.backend.enums.Faculties;
import reidConnect.backend.enums.EventCategory;
import reidConnect.backend.enums.Years;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findAllByClub_IdOrderByCreatedAtDesc(Long clubId);

    long countByCreatedAtAfter(LocalDateTime localDateTime);

    long countByClub_Id(Long clubId);

    long countByClub_IdAndCreatedAtAfter(Long clubId, LocalDateTime createdAt);

    List<Event> findAllByDate(LocalDate date);
    List<Event> findAllByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Event> findAllByCategory(EventCategory eventCategory);
    
    @Query("SELECT DISTINCT e FROM Event e " +
           "JOIN e.targetYears y " +
           "JOIN e.targetFaculties f " +
           "WHERE y.year = :year " +
           "AND f.faculty = :faculty " +
           "AND e.date BETWEEN :startDate AND :endDate")
    List<Event> findAllByYearAndFacultyAndDateBetween(
            @Param("year") Years year, 
            @Param("faculty") Faculties faculty, 
            @Param("startDate") LocalDate startDate, 
            @Param("endDate") LocalDate endDate);
}
