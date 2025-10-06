package reidConnect.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.entity.Notification;
import reidConnect.backend.entity.NotificationRecipient;
import reidConnect.backend.enums.NotificationAudienceScope;
import reidConnect.backend.repository.NotificationRecipientRepository;
import reidConnect.backend.repository.NotificationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;
    private final SimpMessagingTemplate messagingTemplate;  // For WebSocket
    private final UserService userService;

    @Transactional
    public Notification createIndividual(String userId, String title, String message, String type) {
        Notification notification = baseNotification(title, message, type, NotificationAudienceScope.INDIVIDUAL, null);
        NotificationRecipient recipient = NotificationRecipient.builder()
                .userId(userId)
                .notification(notification)
                .build();
        notification.getRecipients().add(recipient);
        Notification saved = notificationRepository.save(notification);
        sendToUser(userId, saved);
        return saved;
    }

    @Transactional
    public Notification createForUsers(List<String> userIds, String title, String message, String type) {
        Notification notification = baseNotification(title, message, type, NotificationAudienceScope.MULTI, null);
        List<NotificationRecipient> recipients = userIds.stream().distinct()
                .map(uid -> NotificationRecipient.builder().userId(uid).notification(notification).build())
                .collect(Collectors.toList());
        notification.getRecipients().addAll(recipients);
        Notification saved = notificationRepository.save(notification);
        userIds.forEach(uid -> sendToUser(uid, saved));
        return saved;
    }

    @Transactional
    public Notification createForRole(String role, List<String> roleUserIds, String title, String message, String type) {
    // If caller didn't pass roleUserIds, resolve from userService
    List<String> resolved = roleUserIds;
    if (resolved == null || resolved.isEmpty()) {
        resolved = userService.allUsers().stream()
            .filter(u -> role.equals(u.getRole()))
            .map(u -> String.valueOf(u.getId()))
            .collect(Collectors.toList());
    }
    Notification notification = baseNotification(title, message, type, NotificationAudienceScope.ROLE, role);
    List<NotificationRecipient> recipients = resolved.stream().distinct()
        .map(uid -> NotificationRecipient.builder().userId(uid).notification(notification).build())
        .collect(Collectors.toList());
    notification.getRecipients().addAll(recipients);
    Notification saved = notificationRepository.save(notification);
    resolved.forEach(uid -> sendToUser(uid, saved));
    return saved;
    }

    @Transactional
    public Notification createForAll(List<String> allUserIds, String title, String message, String type) {
    List<String> resolved = allUserIds;
    if (resolved == null || resolved.isEmpty()) {
            resolved = userService.allUsers().stream().map(u -> String.valueOf(u.getId())).collect(Collectors.toList());
    }
    Notification notification = baseNotification(title, message, type, NotificationAudienceScope.ALL, null);
    List<NotificationRecipient> recipients = resolved.stream().distinct()
        .map(uid -> NotificationRecipient.builder().userId(uid).notification(notification).build())
        .collect(Collectors.toList());
    notification.getRecipients().addAll(recipients);
    Notification saved = notificationRepository.save(notification);
    resolved.forEach(uid -> sendToUser(uid, saved));
    return saved;
    }

    private Notification baseNotification(String title, String message, String type, NotificationAudienceScope scope, String targetRole) {
        return Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .audienceScope(scope)
                .targetRole(targetRole)
                .build();
    }

    private void sendToUser(String userId, Notification notification) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications",
                notification
        );
    }

    public List<NotificationRecipient> getUserNotifications(String userId) {
        return recipientRepository.findByUserIdOrderByNotification_CreatedAtDesc(userId);
    }

    @Transactional
    public void markAsRead(String recipientId, String userId) {
        NotificationRecipient recipient = recipientRepository.findByIdAndUserId(recipientId, userId)
                .orElseThrow(() -> new RuntimeException("Notification recipient not found"));
        recipient.markRead();
        recipientRepository.save(recipient);
    }

    public long getUnreadCount(String userId) {
        return recipientRepository.countByUserIdAndIsReadFalse(userId);
    }
}
