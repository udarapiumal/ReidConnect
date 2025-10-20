package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reidConnect.backend.entity.Subscription;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserAndClub(User user, Club club);
    List<Subscription> findAllByUser(User user);
    long countByClub(Club club);
    void deleteByUserAndClub(User user, Club club);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.club = :club AND s.subscribedAt BETWEEN :start AND :end")
    long countSubscriptionsByClubAndDateRange(@Param("club") Club club,
                                              @Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);
}
