package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.entity.NotificationRecipient;
import reidConnect.backend.dto.notification.CreateNotificationRequest;
import reidConnect.backend.dto.notification.NotificationRecipientDto;
import reidConnect.backend.service.NotificationService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")  // Allow frontend access
public class NotificationController {
    private final NotificationService notificationService;

    // GET /api/notifications?userId=123
    @GetMapping
    public List<NotificationRecipientDto> getUserNotifications(@RequestParam String userId) {
        List<NotificationRecipient> recipients = notificationService.getUserNotifications(userId);
        return recipients.stream().map(this::toDto).collect(Collectors.toList());
    }

    // POST /api/notifications/individual?userId=123
    @PostMapping("/individual")
    public List<NotificationRecipientDto> createIndividual(@RequestParam String userId, @RequestBody CreateNotificationRequest req) {
        var notif = notificationService.createIndividual(userId, req.title, req.message, req.type);
        return notif.getRecipients().stream().map(this::toDto).collect(Collectors.toList());
    }

    // POST /api/notifications/multi
    @PostMapping("/multi")
    public List<NotificationRecipientDto> createForUsers(@RequestBody CreateNotificationRequest req) {
        var notif = notificationService.createForUsers(req.userIds, req.title, req.message, req.type);
        return notif.getRecipients().stream().map(this::toDto).collect(Collectors.toList());
    }

    // POST /api/notifications/role
    @PostMapping("/role")
    public List<NotificationRecipientDto> createForRole(@RequestBody CreateNotificationRequest req) {
        var notif = notificationService.createForRole(req.role, req.userIds, req.title, req.message, req.type);
        return notif.getRecipients().stream().map(this::toDto).collect(Collectors.toList());
    }

    // POST /api/notifications/all
    @PostMapping("/all")
    public List<NotificationRecipientDto> createForAll(@RequestBody CreateNotificationRequest req) {
        var notif = notificationService.createForAll(req.userIds, req.title, req.message, req.type);
        return notif.getRecipients().stream().map(this::toDto).collect(Collectors.toList());
    }

    // GET /api/notifications/unread-count?userId=123
    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(@RequestParam String userId) {
        long count = notificationService.getUnreadCount(userId);
        return Map.of("count", count);
    }

    // PUT /api/notifications/123/read
    @PutMapping("/{recipientId}/read")
    public void markAsRead(@PathVariable String recipientId, @RequestParam String userId) {
        notificationService.markAsRead(recipientId, userId);
    }

    private NotificationRecipientDto toDto(NotificationRecipient r) {
        NotificationRecipientDto d = new NotificationRecipientDto();
        d.id = r.getId();
        d.userId = r.getUserId();
        d.isRead = r.isRead();
        d.readAt = r.getReadAt();
        d.deliveredAt = r.getDeliveredAt();
        if (r.getNotification() != null) {
            d.notificationId = r.getNotification().getId();
            d.title = r.getNotification().getTitle();
            d.message = r.getNotification().getMessage();
            d.type = r.getNotification().getType();
            d.senderUserId = r.getNotification().getSenderUserId();
            d.createdAt = r.getNotification().getCreatedAt();
        }
        return d;
    }
}
