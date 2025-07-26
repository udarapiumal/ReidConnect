package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Subscription;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.User;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findByUserAndClub(User user, Club club);
    List<Subscription> findAllByUser(User user);
    long countByClub(Club club);
    void deleteByUserAndClub(User user, Club club);
}
