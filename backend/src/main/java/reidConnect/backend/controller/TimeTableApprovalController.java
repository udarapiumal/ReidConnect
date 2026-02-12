package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.timetable.TimeTableApprovalRequestDto;
import reidConnect.backend.dto.timetable.TimeTableApprovalResponseDto;
import reidConnect.backend.service.TimeTableApprovalService;

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/status/{academicCalendarId}")
    public ResponseEntity<?> getApprovalStatus(@PathVariable Long academicCalendarId) {
        var approvals = approvalService.getApprovalsByAcademicCalendar(academicCalendarId);

        // Aggregate latest decisions by role (SAR, HOD)
        var statusMap = approvals.stream()
                .collect(Collectors.toMap(
                        dto -> dto.getReviewerRole(), // role as key
                        dto -> dto.getDecision(), // decision as value
                        (existing, replacement) -> replacement // if multiple, take the latest
                ));

        return ResponseEntity.ok(statusMap); // returns JSON like { "SAR": "RECOMMENDED", "HOD": "APPROVED" }
    }

    @GetMapping("/latest/{academicCalendarId}/{role}")
    public ResponseEntity<TimeTableApprovalResponseDto> getLatestDecision(
            @PathVariable Long academicCalendarId, @PathVariable String role) {
        return ResponseEntity.ok(approvalService.getLatestDecision(academicCalendarId, role));
    }

}
