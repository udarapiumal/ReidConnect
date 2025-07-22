package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCode(String code);
}
