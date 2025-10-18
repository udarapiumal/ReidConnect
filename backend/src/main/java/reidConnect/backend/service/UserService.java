package reidConnect.backend.service;

import reidConnect.backend.dto.student.PasswordChangeRequest;
import reidConnect.backend.dto.UserWithProfileDto;
import reidConnect.backend.entity.Student;
import reidConnect.backend.entity.User;
import reidConnect.backend.exception.InvalidPasswordException;
import reidConnect.backend.exception.UserNotFoundException;
import reidConnect.backend.exception.ValidationException;
import reidConnect.backend.repository.StudentRepository;
import reidConnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    public UserService(UserRepository userRepository, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
    public UserWithProfileDto getUserByRegNumber(String regNumber) {
        User user = userRepository.findByRegNumberPrefix(regNumber)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + regNumber));

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

    public void changePassword(String email, PasswordChangeRequest request) {
        // Input validation
        if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
            throw new ValidationException("Current password is required");
        }
        
        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            throw new ValidationException("New password is required");
        }
        
        if (request.getConfirmPassword() == null || request.getConfirmPassword().trim().isEmpty()) {
            throw new ValidationException("Password confirmation is required");
        }
        
        if (request.getNewPassword().length() < 8) {
            throw new ValidationException("New password must be at least 8 characters long");
        }
        
        // Find user by email (which is the username in this system)
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is incorrect");
        }
        
        // Check if new password and confirm password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("New password and confirm password do not match");
        }
        
        // Check if new password is different from current password
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new ValidationException("New password must be different from current password");
        }
        
        // Encode and save new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
    }
}