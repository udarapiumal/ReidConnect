package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.timetable.TimeTableRequestDto;
import reidConnect.backend.dto.timetable.TimeTableResponseDto;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.TimetableStatus;
import reidConnect.backend.enums.Years;
import reidConnect.backend.mapper.TimeTableMapper;
import reidConnect.backend.service.TimeTableApprovalService;
import reidConnect.backend.service.TimeTableService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimeTableController {

    private final TimeTableService timeTableService;
    private final TimeTableMapper timeTableMapper;
    private final TimeTableApprovalService approvalService;

    // Statuses in which timetable editing is allowed
    private static final Set<TimetableStatus> EDITABLE_STATUSES = Set.of(
            TimetableStatus.DRAFT,
            TimetableStatus.NOT_RECOMMENDED,
            TimetableStatus.REJECTED);

    private void validateEditable(Long academicCalendarId) {
        TimetableStatus status = approvalService.getCurrentStatus(academicCalendarId);
        if (!EDITABLE_STATUSES.contains(status)) {
            throw new IllegalStateException(
                    "Timetable cannot be modified in status: " + status +
                            ". Only editable in DRAFT, NOT_RECOMMENDED, or REJECTED states.");
        }
    }

    @PostMapping
    public ResponseEntity<TimeTableResponseDto> create(@RequestBody TimeTableRequestDto dto) {
        validateEditable(dto.getAcademicCalendarId());
        return ResponseEntity.ok(timeTableService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeTableResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(timeTableService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<TimeTableResponseDto>> getAll() {
        return ResponseEntity.ok(timeTableService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeTableResponseDto> update(@PathVariable Long id, @RequestBody TimeTableRequestDto dto) {
        validateEditable(dto.getAcademicCalendarId());
        return ResponseEntity.ok(timeTableService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // For delete, we need to look up the timetable to get the calendar ID
        TimeTableResponseDto existing = timeTableService.getById(id);
        validateEditable(existing.getAcademicCalendarId());
        timeTableService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/byYearAndDegree")
    public ResponseEntity<List<TimeTableResponseDto>> getByYearAndDegree(
            @RequestParam Degree degree,
            @RequestParam Years year,
            @RequestParam Long academicCalendarId) {
        return ResponseEntity.ok(timeTableService.getByYearAndDegree(degree, year, academicCalendarId));
    }

    @GetMapping("/byDay")
    public ResponseEntity<List<TimeTableResponseDto>> getByDay(
            @RequestParam String day,
            @RequestParam Long academicCalendarId) {
        return ResponseEntity.ok(timeTableService.getByDay(day, academicCalendarId));
    }

    @GetMapping("/count/today")
    public ResponseEntity<Long> countSessionsToday(@RequestParam Long academicCalendarId) {
        return ResponseEntity.ok(timeTableService.countSessionsToday(academicCalendarId));
    }

    @GetMapping("/byYearAndDegreeApproved")
    public ResponseEntity<List<TimeTableResponseDto>> getByYearAndDegreeApproved(
            @RequestParam Degree degree,
            @RequestParam Years year,
            @RequestParam Long academicCalendarId) {
        return ResponseEntity.ok(timeTableService.getByYearAndDegreeApproved(degree, year, academicCalendarId));
    }

}
