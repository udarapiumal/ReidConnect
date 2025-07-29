package reidConnect.backend.service;

import reidConnect.backend.dto.student.StudentResponseDto;

import java.util.List;

import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.ClubDto;

public interface StudentService {
    StudentResponseDto getStudentById(Long id);
    StudentResponseDto getStudentByUserId(Long userId);
    List<StudentResponseDto> getAllStudents();
    StudentResponseDto getCurrentStudentProfile(Long userId);

    // User-specific event and club APIs
    List<EventResponseDto> getUpcomingEventsByAttendanceStatus(Long userId, String status);
    List<EventResponseDto> getPastEventsForUser(Long userId);
    long countPastEventsByAttendanceStatus(Long userId, String status);
    long countSubscribedClubs(Long userId);
    List<ClubDto> getSubscribedClubs(Long userId);
}
