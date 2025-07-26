package reidConnect.backend.service;

import reidConnect.backend.dto.UserWithProfileDto;
import reidConnect.backend.entity.Student;
import reidConnect.backend.entity.User;
import reidConnect.backend.repository.StudentRepository;
import reidConnect.backend.repository.UserRepository;
import reidConnect.backend.service.EmailService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    public UserService(UserRepository userRepository, EmailService emailService,StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
    public UserWithProfileDto getUserByRegNumber(String regNumber) {
        User user = userRepository.findByRegNumberPrefix(regNumber)
                .orElseThrow(() -> new RuntimeException("User not found: " + regNumber));

        // Fetch student profile picture
        Optional<Student> student = studentRepository.findByUserId(user.getId());
        String profilePicUrl = student.map(Student::getProfilePictureUrl).orElse(null);

        return new UserWithProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                profilePicUrl
        );
    }
}