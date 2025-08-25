package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import reidConnect.backend.entity.NotificationRecipient;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, String> {
    List<NotificationRecipient> findByUserIdOrderByNotification_CreatedAtDesc(String userId);
    long countByUserIdAndIsReadFalse(String userId);
    Optional<NotificationRecipient> findByIdAndUserId(String id, String userId);
}
