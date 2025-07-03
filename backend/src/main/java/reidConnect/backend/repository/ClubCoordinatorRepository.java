package reidConnect.backend.repository;

import reidConnect.backend.entity.ClubCoordinator;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClubCoordinatorRepository extends JpaRepository<ClubCoordinator, Long>

{

    Optional<ClubCoordinator> findByUser_Id(Long userId);

}
