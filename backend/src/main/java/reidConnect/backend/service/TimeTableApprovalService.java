package reidConnect.backend.service;

import reidConnect.backend.dto.timetable.TimeTableApprovalRequestDto;
import reidConnect.backend.dto.timetable.TimeTableApprovalResponseDto;

import java.util.List;

public interface TimeTableApprovalService {
    TimeTableApprovalResponseDto approveTimeTable(TimeTableApprovalRequestDto requestDto);
    List<TimeTableApprovalResponseDto> getApprovalsByType(String type);
    TimeTableApprovalResponseDto getLatestDecision(String type, String role);
    boolean hasApprovedDecision();
}
