package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import reidConnect.backend.dto.student.StudentResponseDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.ClubDto;
import reidConnect.backend.entity.Student;
import reidConnect.backend.entity.User;
import reidConnect.backend.entity.EventAttendance;
import reidConnect.backend.entity.Event;
import reidConnect.backend.entity.Club;
import reidConnect.backend.enums.EventAttendanceStatus;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.repository.StudentRepository;
import reidConnect.backend.repository.EventAttendanceRepository;
import reidConnect.backend.repository.EventRepository;
import reidConnect.backend.repository.SubscriptionRepository;
import reidConnect.backend.repository.ClubRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.StudentService;
import reidConnect.backend.mapper.ClubMapper;
import reidConnect.backend.mapper.EventMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final EventAttendanceRepository eventAttendanceRepository;
    private final EventRepository eventRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    @Override
    public StudentResponseDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToResponseDto(student);
    }

    @Override
    public StudentResponseDto getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user id: " + userId));
        return mapToResponseDto(student);
    }

    @Override
    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDto getCurrentStudentProfile(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        
        return mapToResponseDto(student);
    }

    private StudentResponseDto mapToResponseDto(Student student) {
        return new StudentResponseDto(
                student.getId(),
                student.getStudentName(),
                student.getAcademicYear(),
                student.getContactNumber(),
                student.getProfilePictureUrl(),
                student.getUser().getId(),
                student.getUser().getName(),
                student.getUser().getEmail(),
                student.getUser().getRole()
        );
    }

    // --- User-specific event and club methods ---

    @Override
    public List<EventResponseDto> getUpcomingEventsByAttendanceStatus(Long userId, String status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        EventAttendanceStatus attendanceStatus = EventAttendanceStatus.valueOf(status);
        LocalDate today = LocalDate.now();
        return eventAttendanceRepository.findAll().stream()
                .filter(ea -> ea.getUser().getId().equals(userId)
                        && ea.getStatus() == attendanceStatus
                        && ea.getEvent().getDate().isAfter(today.minusDays(1)))
                .map(EventAttendance::getEvent)
                .map(event -> EventMapper.mapToEventResponseDto(event))
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponseDto> getPastEventsForUser(Long userId) {
        LocalDate today = LocalDate.now();
        return eventAttendanceRepository.findAll().stream()
                .filter(ea -> ea.getUser().getId().equals(userId)
                        && ea.getEvent().getDate().isBefore(today))
                .map(EventAttendance::getEvent)
                .map(event -> EventMapper.mapToEventResponseDto(event))
                .collect(Collectors.toList());
    }

    @Override
    public long countPastEventsByAttendanceStatus(Long userId, String status) {
        EventAttendanceStatus attendanceStatus = EventAttendanceStatus.valueOf(status);
        LocalDate today = LocalDate.now();
        return eventAttendanceRepository.findAll().stream()
                .filter(ea -> ea.getUser().getId().equals(userId)
                        && ea.getStatus() == attendanceStatus
                        && ea.getEvent().getDate().isBefore(today))
                .count();
    }

    @Override
    public long countSubscribedClubs(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return subscriptionRepository.findAllByUser(user).size();
    }

    @Override
    public List<ClubDto> getSubscribedClubs(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return subscriptionRepository.findAllByUser(user).stream()
                .map(sub -> ClubMapper.mapToClubDto(sub.getClub()))
                .collect(Collectors.toList());
    }
}
