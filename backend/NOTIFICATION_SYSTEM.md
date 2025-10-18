# Notification System Guide

This document explains:
1. Frontend integration (WebSocket/STOMP + REST) to receive & manage notifications.
2. How to create/send notifications from any backend service.
3. Data model, REST API, and usage tips.

---
## 1. Concepts & Flow

| Concept | Description |
|---------|-------------|
| Notification | The canonical event (title, message, type, audience scope, etc.). |
| NotificationRecipient | A user-specific record (read status, deliveredAt, readAt). |
| Delivery Channel | WebSocket (STOMP over SockJS) to push instantly + REST to fetch history / update read status. |
| User destination | Server uses `convertAndSendToUser(userId, "/queue/notifications", payload)`; client subscribes to `/user/queue/notifications`. |

### Lifecycle
1. Backend code calls a `NotificationService.create*` method.
2. A `Notification` + `NotificationRecipient` rows are persisted.
3. Each target user immediately receives a WebSocket frame.
4. Frontend updates in real-time and/or fetches historical list via REST.
5. When user opens / views: frontend calls PUT read endpoint to mark it read.

---
## 2. Frontend Integration

### 2.1 Dependencies (Typical React / JS Frontend)
Install libraries (example with npm):
```
npm install sockjs-client stompjs
```
(If using Vite/ESM you may instead: `npm i @stomp/stompjs sockjs-client` and use the modern API.)

### 2.2 Establish WebSocket/STOMP Connection
Backend endpoint (SockJS enabled): `/ws-notifications`.
User-specific subscription destination: `/user/queue/notifications`.

#### Minimal Example (Legacy stompjs)
```javascript
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export function connectNotifications(currentUserId, onNotification) {
  const socket = new SockJS('http://<BACKEND_HOST>:<PORT>/ws-notifications');
  stompClient = Stomp.over(socket);
  // Optional: disable verbose logging
  stompClient.debug = () => {};
  
  stompClient.connect({}, frame => {
    console.log('Connected: ' + frame);
    // Subscribe to user-specific queue
    stompClient.subscribe('/user/queue/notifications', message => {
      try {
        const notif = JSON.parse(message.body);
        onNotification?.(notif);
      } catch (e) {
        console.error('Failed to parse notification', e);
      }
    });
  }, error => {
    console.error('WebSocket error', error);
    // Optionally implement exponential backoff reconnect
  });
}

export function disconnectNotifications() {
  if (stompClient) stompClient.disconnect(() => console.log('Disconnected'));
}
```

#### Modern @stomp/stompjs Example
```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function createNotificationClient(onNotification) {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://<BACKEND_HOST>:<PORT>/ws-notifications'),
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/user/queue/notifications', msg => {
        const payload = JSON.parse(msg.body);
        onNotification(payload);
      });
    },
    // (Optional) pass headers if auth (e.g., Authorization)
    // connectHeaders: { Authorization: 'Bearer <token>' }
  });
  client.activate();
  return client;
}
```

### 2.3 Handling Incoming Data
Example shape (flattened for each recipient):
```json
{
  "id": "recipientId",
  "userId": "42",
  "isRead": false,
  "readAt": null,
  "deliveredAt": null,
  "notificationId": "notif-uuid",
  "title": "New Like!",
  "message": "John liked your photo",
  "type": "LIKE",
  "senderUserId": "15",
  "createdAt": "2025-08-25T08:44:12.125" 
}
```
Store them (e.g., Redux / Zustand) keyed by `id` or sort by `createdAt` descending.

### 2.4 REST Endpoints Summary
Base: `/api/notifications`

| Method | Path                                    | Params / Body        | Purpose                                             |
|--------|-----------------------------------------|----------------------|-----------------------------------------------------|
| GET    | `/api/notifications`                    | `?userId=123`        | List notifications (most recent first).             |
| GET    | `/api/notifications/unread-count`       | `?userId=123`        | Returns `{"count": <number>}`.                      |
| PUT    | `/api/notifications/{recipientId}/read` | `?userId=123`        | Mark a single notification as read.                 |
| POST   | `/api/notifications/individual`         | `?userId=123` + body | Create one targeted to a single user.               |
| POST   | `/api/notifications/multi`              | body                 | Create for list of userIds.                         |
| POST   | `/api/notifications/role`               | body                 | Create for all users with role (optionally subset). |
| POST   | `/api/notifications/all`                | body                 | Broadcast to all users.                             |

### 2.5 Fetch & Mark Read Example
```javascript
async function fetchNotifications(userId) {
  const res = await fetch(`/api/notifications?userId=${userId}`);
  return res.json();
}

async function fetchUnreadCount(userId) {
  const res = await fetch(`/api/notifications/unread-count?userId=${userId}`);
  const data = await res.json();
  return data.count;
}

async function markNotificationRead(recipientId, userId) {
  await fetch(`/api/notifications/${recipientId}/read?userId=${userId}`, { method: 'PUT' });
}
```

### 2.6 Suggested UI Behavior
- Maintain a badge with unread count (poll every N seconds or update real-time). 
- When a new WebSocket message arrives, increment unread state unless currently open.
- On opening a notification item (click), call `markNotificationRead` then update local state.
- Consider optimistic update for snappy UI.

### 2.7 Authentication (If/When Added)
Currently the config allows all origins and doesn't show auth. If adding JWT:
1. Add `HandshakeInterceptor` that extracts token & sets `Principal` with userId.
2. Ensure STOMP `convertAndSendToUser` uses that same user identity.
3. Frontend: pass `Authorization` header in STOMP connect headers.

---
## 3. Backend Usage (Creating Notifications Anywhere)

### 3.1 Injecting the Service
In any Spring-managed component (service, listener, etc.):
```java
@RequiredArgsConstructor
@Service
public class LikeService {
    private final NotificationService notificationService;
    private final PostRepository postRepository; // example

    public void likePost(String postId, String likingUserId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        // ... perform like logic ...

        // Notify the owner
        notificationService.createIndividual(
            String.valueOf(post.getOwner().getId()),
            "New Like!",
            "User " + likingUserId + " liked your post",
            "LIKE"
        );
    }
}
```

### 3.2 Available Creation Methods (in `NotificationService`)
| Method | Audience Scope | Notes |
|--------|----------------|-------|
| `createIndividual(userId, title, message, type)` | INDIVIDUAL | Single user. |
| `createForUsers(userIds, title, message, type)` | MULTI | Distinct list; duplicates removed. |
| `createForRole(role, roleUserIds, title, message, type)` | ROLE | If `roleUserIds` null/empty, auto-resolves all users with that role via `userService`. |
| `createForAll(allUserIds, title, message, type)` | ALL | If `allUserIds` null/empty, resolves all users. |

Return value is the persisted `Notification` (with recipients list hydrated). Each method also triggers WebSocket delivery.

### 3.3 Example: Role-Based Notification
```java
notificationService.createForRole(
    "ADMIN",
    null, // let service resolve all admins
    "System Maintenance",
    "The platform will be read-only at 02:00 UTC",
    "SYSTEM"
);
```

### 3.4 Example: Broadcast to All Users
```java
notificationService.createForAll(
    null, // let service resolve all users
    "Feature Launch",
    "We just launched dark mode!",
    "ANNOUNCEMENT"
);
```

### 3.5 Multi-User Example
```java
notificationService.createForUsers(
    List.of("12", "15", "19"),
    "Group Update",
    "Your group event starts in 1 hour",
    "REMINDER"
);
```

### 3.6 Marking as Read Programmatically
If the backend needs to auto-mark (e.g., after user downloads report):
```java
notificationService.markAsRead(recipientId, userId);
```

### 3.7 Data Model Overview
```text
Notification (id, title, message, type, audienceScope, targetRole, createdAt, metadata)
    1..* NotificationRecipient (id, userId, isRead, readAt, deliveredAt, notification_id FK)
```
Indexes:
- (`userId`, `isRead`) for unread queries.
- (`notification_id`) for join performance.

### 3.8 Extending Metadata
`Notification.metadata` (TEXT) can hold JSON for flexible payloads:
```java
String metadataJson = "{\"postId\":\"" + postId + "\"}";
Notification notification = Notification.builder()
    .title("New Comment")
    .message("Someone commented on your post")
    .type("COMMENT")
    .metadata(metadataJson)
    .audienceScope(NotificationAudienceScope.INDIVIDUAL)
    .build();
// Add recipients manually if constructing custom; otherwise use service helpers.
```
(If you add builder usage outside the service, remember to persist via `notificationRepository.save(notification)` and push via `convertAndSendToUser`.) Prefer using the existing service unless you need custom logic.

### 3.9 Suggested Enum for Type (Optional Improvement)
Currently `type` is a string. Consider adding an enum and validating allowed values to prevent typos (e.g., LIKE, COMMENT, FOLLOW, SYSTEM, ANNOUNCEMENT, REMINDER).

---
## 4. REST Create Payloads
All POST bodies share the shape of `CreateNotificationRequest` (fields are optional depending on endpoint):
```jsonc
{
  "userIds": ["12", "15"],  // for multi/role/all (optional)
  "role": "ADMIN",            // for /role
  "title": "New Like!",
  "message": "John liked your photo",
  "type": "LIKE"
}
```
Examples:
1. Individual: `POST /api/notifications/individual?userId=42` with body `{ "title": "Hi", "message": "Welcome", "type": "SYSTEM" }`.
2. Multi: `POST /api/notifications/multi` with body specifying `userIds`.
3. Role: `POST /api/notifications/role` with body `{ "role": "ADMIN", ... }`.
4. All: `POST /api/notifications/all` with or without `userIds` (null = resolve all).

---
## 5. Frontend Testing Checklist
- Connect: verify WebSocket handshake succeeds (network tab -> 101 Switching Protocols / SockJS XHR fallback).
- Subscribe: ensure first subscription frame returns no error.
- Trigger a backend method (e.g., call a POST create endpoint) & observe message arrival.
- Refresh page: call GET list endpoint and confirm consistency with previously received items.
- Mark read: ensure PUT changes badge count and subsequent GET shows `isRead=true`.

---
## 6. Common Pitfalls & Tips
| Issue | Cause | Fix |
|-------|-------|-----|
| Not receiving messages | Subscribing to wrong destination | Must use `/user/queue/notifications`. |
| Duplicates in UI | Adding same item twice after refresh | De-duplicate by `id` (recipientId) or `notificationId+userId`. |
| CORS / 403 on SockJS | Missing allowed origins | Adjust `.setAllowedOriginPatterns()` or add specific origins. |
| Wrong user mapping | Security principal not set | Implement authentication principal if securing. |
| Time ordering off | Local vs server time mismatch | Sort by `createdAt` descending (server time). |

---
## 7. Extending the System (Future Ideas)
- Add pagination & since-timestamp fetching.
- Add bulk mark-as-read endpoint (`PUT /api/notifications/read-all?userId=`).
- Persist `deliveredAt` when WebSocket ACK received (requires client ACK mode). 
- Add push (Web Push API) fallback for offline users.
- Add filtering by `type` or search by keywords.

---
## 8. Quick Reference
```
WebSocket Endpoint: /ws-notifications
Subscription Dest: /user/queue/notifications
REST Base:       /api/notifications
Unread Count:    GET /api/notifications/unread-count?userId=<id>
Mark Read:       PUT /api/notifications/{recipientId}/read?userId=<id>
```

---
## 9. FAQ
**Q:** Do I need to manually add `NotificationRecipient` rows?  
**A:** No, use `NotificationService` helpers; they build and persist recipients automatically.

**Q:** Can I broadcast a system message without resolving all users manually?  
**A:** Yes, pass `null` or empty list to `createForAll`.

**Q:** How do I add custom fields?  
**A:** Put them in `metadata` as JSON. Update client parser to handle them.

---
## 10. Support
Ping the backend team if you need new scopes, bulk operations, or authentication integration.

---
Happy building!
