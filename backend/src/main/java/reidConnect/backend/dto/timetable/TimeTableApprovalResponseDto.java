package reidConnect.backend.dto.timetable;

import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.TimeTableApprovalDecision;

import java.time.LocalDateTime;

@Getter
@Setter
public class TimeTableApprovalResponseDto {
    private Long id;
    private Long academicCalendarId;
    private String academicCalendarTitle;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerRole;
    private TimeTableApprovalDecision decision;
    private String message;
    private LocalDateTime reviewedAt;
}
