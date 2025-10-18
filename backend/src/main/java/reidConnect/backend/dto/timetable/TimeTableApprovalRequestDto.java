package reidConnect.backend.dto.timetable;

import lombok.Getter;
import lombok.Setter;
import reidConnect.backend.enums.Academic_Admin_Rank;
import reidConnect.backend.enums.TimeTableApprovalDecision;
import reidConnect.backend.enums.TimeTableType;

@Getter
@Setter
public class TimeTableApprovalRequestDto {
    private TimeTableType type;
    private Long reviewerId;  // id of User
    private TimeTableApprovalDecision decision;
    private String message;
}