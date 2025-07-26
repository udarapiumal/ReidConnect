package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reidConnect.backend.enums.EventAttendanceStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEventAttendanceDto {
    private Long eventId;
    private Long userId;
    private EventAttendanceStatus status; // INTERESTED, GOING, or null if not attending
    private boolean isAttending; // true if user has marked attendance, false otherwise
}
