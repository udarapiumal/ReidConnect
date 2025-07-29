package reidConnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import reidConnect.backend.dto.student.StudentResponseDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.ClubDto;
import reidConnect.backend.entity.User;
import reidConnect.backend.service.StudentService;

import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {
    
    private final StudentService studentService;

    @GetMapping("/me")
    public ResponseEntity<StudentResponseDto> getCurrentStudentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        StudentResponseDto studentProfile = studentService.getCurrentStudentProfile(currentUser.getId());
        return ResponseEntity.ok(studentProfile);
    
}

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(@PathVariable Long id) {
        StudentResponseDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<StudentResponseDto> getStudentByUserId(@PathVariable Long userId) {
        StudentResponseDto student = studentService.getStudentByUserId(userId);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/")
    public ResponseEntity<List<StudentResponseDto>> getAllStudents() {
        List<StudentResponseDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }


    // 1. Get events marked as 'going' by the current user (not past events)
    @GetMapping("/events/going/upcoming")
    public ResponseEntity<List<EventResponseDto>> getUpcomingGoingEventsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        List<EventResponseDto> events = studentService.getUpcomingEventsByAttendanceStatus(currentUser.getId(), "GOING");
        return ResponseEntity.ok(events);
    }

    // 2. Get events marked as 'interested' by the current user (not past events)
    @GetMapping("/events/interested/upcoming")
    public ResponseEntity<List<EventResponseDto>> getUpcomingInterestedEventsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        List<EventResponseDto> events = studentService.getUpcomingEventsByAttendanceStatus(currentUser.getId(), "INTERESTED");
        return ResponseEntity.ok(events);
    }

    // 3. Get past events of the current user (any status)
    @GetMapping("/events/past")
    public ResponseEntity<List<EventResponseDto>> getPastEventsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        List<EventResponseDto> events = studentService.getPastEventsForUser(currentUser.getId());
        return ResponseEntity.ok(events);
    }

    // 4. Get the number of past events marked as 'going'
    @GetMapping("/events/past/going/count")
    public ResponseEntity<Long> getPastGoingEventsCountForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        long count = studentService.countPastEventsByAttendanceStatus(currentUser.getId(), "GOING");
        return ResponseEntity.ok(count);
    }

    // 5. Get the number of clubs subscribed
    @GetMapping("/clubs/subscribed/count")
    public ResponseEntity<Long> getSubscribedClubsCountForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        long count = studentService.countSubscribedClubs(currentUser.getId());
        return ResponseEntity.ok(count);
    }

    // 6. Get subscribed club details
    @GetMapping("/clubs/subscribed")
    public ResponseEntity<List<ClubDto>> getSubscribedClubsForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        List<ClubDto> clubs = studentService.getSubscribedClubs(currentUser.getId());
        return ResponseEntity.ok(clubs);
    }   
}
    