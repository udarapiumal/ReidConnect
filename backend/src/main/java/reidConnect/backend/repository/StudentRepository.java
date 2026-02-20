package reidConnect.backend.repository;

import reidConnect.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.User;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long user_Id);
    Optional<Student> findByUser(User user);
}

 