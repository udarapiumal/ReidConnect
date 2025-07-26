package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.FeaturedEvent;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FeaturedEventRepository extends JpaRepository<FeaturedEvent, Long> {
    List<FeaturedEvent> findByFeaturedTimeAfter(LocalDateTime after);
    Optional<FeaturedEvent> findByEvent_Id(Long eventId);
    void deleteByEvent_Id(Long eventId);
}
