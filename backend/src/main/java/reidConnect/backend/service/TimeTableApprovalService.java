package reidConnect.backend.service;

import reidConnect.backend.dto.timetable.TimeTableApprovalRequestDto;
import reidConnect.backend.dto.timetable.TimeTableApprovalResponseDto;

import java.util.List;

public interface TimeTableApprovalService {
    TimeTableApprovalResponseDto approveTimeTable(TimeTableApprovalRequestDto requestDto);

    List<TimeTableApprovalResponseDto> getApprovalsByAcademicCalendar(Long academicCalendarId);

    TimeTableApprovalResponseDto getLatestDecision(Long academicCalendarId, String role);

    boolean hasApprovedDecision(Long academicCalendarId);
}
