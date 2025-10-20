package reidConnect.backend.repository;

import reidConnect.backend.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface ClubRepository extends JpaRepository<Club, Long>

{
    Optional<Club> findByUser_Id(Long userId);
    Optional<Club> findByUser(User user);
    // findNameById
    Club findById(long id);
    
    // Get club name by id - returns just the name
    @Query("SELECT c.club_name FROM Club c WHERE c.id = :id")
    String findClubNameById(@Param("id") Long id);
}
