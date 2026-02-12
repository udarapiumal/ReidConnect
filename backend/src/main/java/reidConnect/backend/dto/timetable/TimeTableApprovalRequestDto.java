package reidConnect.backend.dto.timetable;

import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.TimeTableApprovalDecision;

@Getter
@Setter
public class TimeTableApprovalRequestDto {
    private Long academicCalendarId;
    private Long reviewerId; // id of User
    private TimeTableApprovalDecision decision;
    private String message;
}