package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.AcademicCalendarDto;
import reidConnect.backend.service.AcademicCalendarService;

import java.util.List;

@RestController
@RequestMapping("/api/academic-calendar")
@RequiredArgsConstructor
public class AcademicCalendarController {

    private final AcademicCalendarService service;

    @PostMapping
    public ResponseEntity<AcademicCalendarDto> create(@RequestBody AcademicCalendarDto dto) {
        return ResponseEntity.ok(service.createPeriod(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicCalendarDto> update(@PathVariable Long id, @RequestBody AcademicCalendarDto dto) {
        return ResponseEntity.ok(service.updatePeriod(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deletePeriod(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicCalendarDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPeriod(id));
    }

    @GetMapping
    public ResponseEntity<List<AcademicCalendarDto>> getAll() {
        return ResponseEntity.ok(service.getAllPeriods());
    }

    @GetMapping("/current")
    public ResponseEntity<AcademicCalendarDto> getCurrent() {
        return ResponseEntity.ok(service.getCurrentPeriod());
    }

    @DeleteMapping("/{id}/timetable")
    public ResponseEntity<Void> deleteEntireTimetable(@PathVariable Long id) {
        service.deleteEntireTimetable(id);
        return ResponseEntity.noContent().build();
    }
}
