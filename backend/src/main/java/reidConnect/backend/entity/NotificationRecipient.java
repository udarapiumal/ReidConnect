package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_recipients",
       indexes = {
           @Index(name = "idx_recipient_user_read", columnList = "userId,isRead"),
           @Index(name = "idx_recipient_notification", columnList = "notification_id")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRecipient {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String userId;

    private boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime deliveredAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notification_id")
    @JsonBackReference
    private Notification notification;

    public void markRead() {
        if (!isRead) {
            isRead = true;
            readAt = LocalDateTime.now();
        }
    }
}
