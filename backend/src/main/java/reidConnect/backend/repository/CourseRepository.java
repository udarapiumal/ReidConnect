package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Course;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCode(String code);
    List<Course> findByDegree(Degree degree);
    List<Course> findByDegreeAndYear(Degree degree, Years year);
}
