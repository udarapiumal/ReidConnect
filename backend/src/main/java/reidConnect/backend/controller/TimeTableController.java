package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.timetable.TimeTableRequestDto;
import reidConnect.backend.dto.timetable.TimeTableResponseDto;
import reidConnect.backend.entity.TimeTable;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;
import reidConnect.backend.mapper.TimeTableMapper;
import reidConnect.backend.service.TimeTableService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimeTableController {

    private final TimeTableService timeTableService;
    private final TimeTableMapper timeTableMapper;

    @PostMapping
    public ResponseEntity<TimeTableResponseDto> create(@RequestBody TimeTableRequestDto dto) {
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
        return ResponseEntity.ok(timeTableService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        timeTableService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/byYearAndDegree")
    public ResponseEntity<List<TimeTableResponseDto>> getByYearAndDegree(
            @RequestParam Degree degree,
            @RequestParam Years year) {
        return ResponseEntity.ok(timeTableService.getByYearAndDegree(degree, year));
    }

    @GetMapping("/byDay")
    public ResponseEntity<List<TimeTableResponseDto>> getByDay(@RequestParam String day) {
        return ResponseEntity.ok(timeTableService.getByDay(day));
    }

    @GetMapping("/count/today")
    public ResponseEntity<Long> countSessionsToday() {
        return ResponseEntity.ok(timeTableService.countSessionsToday());
    }


}
