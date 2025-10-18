package reidConnect.backend.service;

import reidConnect.backend.dto.student.StudentResponseDto;
import reidConnect.backend.dto.student.StudentUpdateRequest;
import reidConnect.backend.entity.Student;
import org.springframework.web.multipart.MultipartFile;

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
    Student updateStudentDetails(Long id, StudentUpdateRequest studentUpdateRequest);
    
    // Profile picture management
    Student updateProfilePicture(Long userId, MultipartFile profilePicture);
    Student removeProfilePicture(Long userId);
}
