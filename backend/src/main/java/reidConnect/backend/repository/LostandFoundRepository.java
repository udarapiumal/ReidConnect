package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.LostandFound;

public interface LostandFoundRepository extends JpaRepository<LostandFound,Long> {
}
