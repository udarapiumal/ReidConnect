package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.timetable.TimeTableApprovalRequestDto;
import reidConnect.backend.dto.timetable.TimeTableApprovalResponseDto;
import reidConnect.backend.enums.TimetableStatus;
import reidConnect.backend.service.TimeTableApprovalService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable-approvals")
@RequiredArgsConstructor
public class TimeTableApprovalController {

    private final TimeTableApprovalService approvalService;

    @PostMapping
    public ResponseEntity<TimeTableApprovalResponseDto> approve(@RequestBody TimeTableApprovalRequestDto requestDto) {
        return ResponseEntity.ok(approvalService.approveTimeTable(requestDto));
    }

    @GetMapping("/{academicCalendarId}")
    public ResponseEntity<List<TimeTableApprovalResponseDto>> getApprovalsByAcademicCalendar(
            @PathVariable Long academicCalendarId) {
        return ResponseEntity.ok(approvalService.getApprovalsByAcademicCalendar(academicCalendarId));
    }

    /**
     * Returns the current FSM status as a simple JSON object.
     * e.g. { "status": "DRAFT" }
     */
    @GetMapping("/status/{academicCalendarId}")
    public ResponseEntity<Map<String, String>> getApprovalStatus(@PathVariable Long academicCalendarId) {
        TimetableStatus status = approvalService.getCurrentStatus(academicCalendarId);
        return ResponseEntity.ok(Map.of("status", status.name()));
    }

    @GetMapping("/latest/{academicCalendarId}/{role}")
    public ResponseEntity<TimeTableApprovalResponseDto> getLatestDecision(
            @PathVariable Long academicCalendarId, @PathVariable String role) {
        return ResponseEntity.ok(approvalService.getLatestDecision(academicCalendarId, role));
    }

}
