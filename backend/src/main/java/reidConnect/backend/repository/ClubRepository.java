package reidConnect.backend.repository;

import reidConnect.backend.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club, Long>

{

    Optional<Club> findByUser_Id(Long userId);

}
