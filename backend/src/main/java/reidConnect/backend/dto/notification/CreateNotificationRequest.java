package reidConnect.backend.dto.notification;

import java.util.List;

public class CreateNotificationRequest {
    public String title;
    public String message;
    public String type;
    // for MULTI -> list of userIds
    public List<String> userIds;
    // for ROLE -> role name
    public String role;
}
