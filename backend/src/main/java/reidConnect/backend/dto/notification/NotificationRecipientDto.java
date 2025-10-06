package reidConnect.backend.dto.notification;

import java.time.LocalDateTime;

public class NotificationRecipientDto {
    public String id;
    public String userId;
    public boolean isRead;
    public LocalDateTime readAt;
    public LocalDateTime deliveredAt;

    // Notification content
    public String notificationId;
    public String title;
    public String message;
    public String type;
    public String senderUserId;
    public LocalDateTime createdAt;
}
