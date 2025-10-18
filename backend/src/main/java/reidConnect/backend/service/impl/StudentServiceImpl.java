package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import reidConnect.backend.dto.ClubDto;
import reidConnect.backend.dto.EventResponseDto;
import reidConnect.backend.dto.student.StudentResponseDto;
import reidConnect.backend.dto.student.StudentUpdateRequest;
import reidConnect.backend.entity.*;
import reidConnect.backend.enums.EventAttendanceStatus;
import reidConnect.backend.exception.FileUploadException;
import reidConnect.backend.exception.ResourceNotFoundException;
import reidConnect.backend.exception.ValidationException;
import reidConnect.backend.mapper.ClubMapper;
import reidConnect.backend.mapper.EventMapper;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.StudentService;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EventAttendanceRepository eventAttendanceRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final EventSlotRepository eventSlotRepository;

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

    @Override
    public List<EventResponseDto> getUpcomingEventsByAttendanceStatus(Long userId, String status) {
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return subscriptionRepository.findAllByUser(user).size();
    }

    @Override
    public List<ClubDto> getSubscribedClubs(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return subscriptionRepository.findAllByUser(user).stream()
                .map(subscription -> ClubMapper.mapToClubDto(subscription.getClub()))
                .collect(Collectors.toList());
    }

    @Override
    public Student updateStudentDetails(Long id, StudentUpdateRequest studentUpdateRequest) {
        // Find the student by ID
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        // Update student fields only if they are not null and not empty
        if (studentUpdateRequest.getStudentName() != null && !studentUpdateRequest.getStudentName().trim().isEmpty()) {
            student.setStudentName(studentUpdateRequest.getStudentName().trim());
        }
        
        if (studentUpdateRequest.getContactNumber() != null && !studentUpdateRequest.getContactNumber().trim().isEmpty()) {
            student.setContactNumber(studentUpdateRequest.getContactNumber().trim());
        }
        
        if (studentUpdateRequest.getProfilePictureUrl() != null && !studentUpdateRequest.getProfilePictureUrl().trim().isEmpty()) {
            student.setProfilePictureUrl(studentUpdateRequest.getProfilePictureUrl().trim());
        }
        
        if (studentUpdateRequest.getAcademicYear() != null && !studentUpdateRequest.getAcademicYear().trim().isEmpty()) {
            student.setAcademicYear(studentUpdateRequest.getAcademicYear().trim());
        }
        
        // Update the associated User's username if provided
        if (studentUpdateRequest.getUsername() != null && !studentUpdateRequest.getUsername().trim().isEmpty()) {
            User user = student.getUser();
            if (user != null) {
                user.setUsername(studentUpdateRequest.getUsername().trim());
                userRepository.save(user);
            }
        }
        
        // Save and return the updated student
        return studentRepository.save(student);
    }

    @Override
    public Student updateProfilePicture(Long userId, MultipartFile profilePicture) {
        // Get the student by user ID
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user id: " + userId));
        
        // Validate file
        if (profilePicture.isEmpty()) {
            throw new ValidationException("Profile picture file is empty");
        }
        
        String originalFilename = profilePicture.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new ValidationException("Profile picture filename is invalid");
        }
        
        // Validate file type (only allow image files)
        String fileExtension = originalFilename.toLowerCase();
        if (!fileExtension.endsWith(".jpg") && !fileExtension.endsWith(".jpeg") && 
            !fileExtension.endsWith(".png") && !fileExtension.endsWith(".gif") && 
            !fileExtension.endsWith(".webp")) {
            throw new ValidationException("Only image files (jpg, jpeg, png, gif, webp) are allowed");
        }

        try {
            // Create uploads directory if it doesn't exist
            Path uploadDir = Paths.get("src/main/resources/static/uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            // Generate unique filename
            String uniqueFileName = UUID.randomUUID() + "_profile_" + originalFilename;
            Path filePath = uploadDir.resolve(uniqueFileName);
            
            // Save the file
            Files.copy(profilePicture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update the student's profile picture URL
            student.setProfilePictureUrl("uploads/" + uniqueFileName);
            
            // Save and return the updated student
            return studentRepository.save(student);
        } catch (Exception e) {
            throw new FileUploadException("Could not save profile picture: " + e.getMessage(), e);
        }
    }

    @Override
    public Student removeProfilePicture(Long userId) {
        // Get the student by user ID
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user id: " + userId));
        
        // Set profile picture URL to null
        student.setProfilePictureUrl(null);
        
        // Save and return the updated student
        return studentRepository.save(student);
    }
}
