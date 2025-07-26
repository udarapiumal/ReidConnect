package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    boolean existsByCode(String code);
    boolean existsByEmail(String email);
}
