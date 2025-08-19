package reidConnect.backend.dto.timetable;

import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.Academic_Admin_Rank;
import reidConnect.backend.enums.TimeTableApprovalDecision;
import reidConnect.backend.enums.TimeTableType;

import java.time.LocalDateTime;

@Getter
@Setter
public class TimeTableApprovalResponseDto {
    private Long id;
    private TimeTableType type;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerRole;
    private TimeTableApprovalDecision decision;
    private String message;
    private LocalDateTime reviewedAt;
}
