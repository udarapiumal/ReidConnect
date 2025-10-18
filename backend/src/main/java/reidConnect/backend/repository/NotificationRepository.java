package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import reidConnect.backend.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
}
