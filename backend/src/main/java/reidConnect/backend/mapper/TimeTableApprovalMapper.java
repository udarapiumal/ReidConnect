package reidConnect.backend.mapper;

import reidConnect.backend.dto.timetable.TimeTableApprovalRequestDto;
import reidConnect.backend.dto.timetable.TimeTableApprovalResponseDto;
import reidConnect.backend.entity.AcademicCalendar;
import reidConnect.backend.entity.TimeTableApproval;
import reidConnect.backend.entity.User;

public class TimeTableApprovalMapper {

    public static TimeTableApproval toEntity(TimeTableApprovalRequestDto dto, User reviewer,
            AcademicCalendar academicCalendar) {
        TimeTableApproval entity = new TimeTableApproval();
        entity.setAcademicCalendar(academicCalendar);
        entity.setReviewer(reviewer);
        entity.setRole(reviewer.getRole());
        entity.setDecision(dto.getDecision());
        entity.setMessage(dto.getMessage());
        return entity;
    }

    public static TimeTableApprovalResponseDto toDto(TimeTableApproval entity) {
        TimeTableApprovalResponseDto dto = new TimeTableApprovalResponseDto();
        dto.setId(entity.getId());
        dto.setAcademicCalendarId(entity.getAcademicCalendar().getId());
        dto.setAcademicCalendarTitle(entity.getAcademicCalendar().getTitle());
        dto.setReviewerId(entity.getReviewer().getId());
        dto.setReviewerName(entity.getReviewer().getUsername());
        dto.setReviewerRole(entity.getReviewer().getRole());
        dto.setDecision(entity.getDecision());
        dto.setMessage(entity.getMessage());
        dto.setReviewedAt(entity.getReviewedAt());
        return dto;
    }
}
