package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.dto.course.CourseRequestDto;
import reidConnect.backend.dto.course.CourseResponseDto;
import reidConnect.backend.entity.Course;
import reidConnect.backend.enums.Degree;
import reidConnect.backend.enums.Years;
import reidConnect.backend.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseResponseDto> createCourse(@RequestBody CourseRequestDto dto) {
        return ResponseEntity.ok(courseService.createCourse(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDto> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponseDto> updateCourse(@PathVariable Long id, @RequestBody CourseRequestDto dto) {
        return ResponseEntity.ok(courseService.updateCourse(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/byDegree")
    public ResponseEntity<List<CourseResponseDto>> getByDegree(@RequestParam Degree degree) {
        return ResponseEntity.ok(courseService.getCoursesByDegree(degree));
    }

    @GetMapping("/byYearAndDegree")
    public ResponseEntity<List<CourseResponseDto>> getByDegreeAndYear(
            @RequestParam Degree degree,
            @RequestParam Years year) {

        if (degree == null || year == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(courseService.getCoursesByDegreeAndYear(degree, year));
    }



}
