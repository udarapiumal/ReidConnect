package reidConnect.backend.service;

import reidConnect.backend.dto.*;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.Student;
import reidConnect.backend.entity.User;
import reidConnect.backend.repository.ClubRepository;
import reidConnect.backend.repository.StudentRepository;
import reidConnect.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final StudentRepository studentRepository;
    private final ClubRepository clubRepository;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            EmailService emailService,
            StudentRepository studentRepository, ClubRepository clubRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.studentRepository = studentRepository;
        this.clubRepository = clubRepository;
    }

    public User signup(RegisterUserDto input) {
        // 1. Create and save User
        User user = new User(input.getUsername(), input.getEmail(), passwordEncoder.encode(input.getPassword()));
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationExpiration(LocalDateTime.now().plusMinutes(15));
        user.setEnabled(false);
        User savedUser = userRepository.save(user);

        // 2. Handle file upload if present
        String profilePictureUrl = null;
        if (input.getProfilePic() != null && !input.getProfilePic().isEmpty()) {
            String filename = UUID.randomUUID() + "_" + input.getProfilePic().getOriginalFilename();
            try {
                Path uploadDir = Paths.get("C:/ReidConnect/backend/src/main/resources/static/uploads");
                Files.createDirectories(uploadDir);
                Path filePath = uploadDir.resolve(filename);
                input.getProfilePic().transferTo(filePath.toFile());
                profilePictureUrl = "/uploads/" + filename;
                System.out.println("Saved profile pic to: " + profilePictureUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println("No profile picture uploaded");
        }

        // 3. Create and save Student with extra fields
        Student student = new Student();
        student.setStudentName(input.getUsername());
        student.setContactNumber(input.getContactNumber());
        student.setAcademicYear(input.getAcademicYear());
        student.setProfilePictureUrl(profilePictureUrl);
        student.setUser(savedUser);

        // Extract registered year from email (first 4 characters)
        int registeredYear = Integer.parseInt(input.getEmail().substring(0, 4));
        student.setRegisteredYear(registeredYear);

        // Extract faculty code and map to faculty name
        String email = input.getEmail().toLowerCase();
        String facultyCode = email.substring(4, email.indexOf('@')).replaceAll("\\d", ""); // removes numbers
        String facultyName = mapFacultyCode(facultyCode);
        student.setFaculty(facultyName);

        studentRepository.save(student);

        // 4. Send verification email
        sendVerificationEmail(savedUser);

        return savedUser;
    }
    private String mapFacultyCode(String code) {
        switch (code) {
            case "ms": return "Management";
            case "t":  return "Technology";
            case "ba": return "Arts";
            case "n":  return "Nursing";
            case "cs":
            case "is": return "UCSC";
            default:   return "Unknown";
        }
    }


    public User authenticate(LoginUserDto input) {
        User user = userRepository.findByEmail(input.getEmail()) // Fixed method name to findByEmail
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword() // Added password for authentication
                )
        );
        return user;
    }

    public void verifyUser(VerifyUserDto input) {
        Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getVerificationExpiration().isBefore(LocalDateTime.now())) { // Changed to getVerificationExpiration
                throw new RuntimeException("Verification code has expired");
            }
            if (user.getVerificationCode().equals(input.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationExpiration(null); // Changed to setVerificationExpiration
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendVerificationCode(String email) { // Fixed method name
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationExpiration(LocalDateTime.now().plusHours(1)); // Changed to setVerificationExpiration
            sendVerificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<p>Your verification code is: <strong>" + verificationCode + "</strong></p>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage); // Fixed parameters
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public RegisterClubDto saveClub(Club club) {
        Club saved = clubRepository.save(club);
        RegisterClubDto dto = new RegisterClubDto();
        dto.setUsername(saved.getUser().getUsername());
        dto.setEmail(saved.getUser().getEmail());
        dto.setClubName(saved.getClub_name());
        dto.setWebsite(saved.getWebsite());
        dto.setBio(saved.getBio());
        dto.setProfilePicture(saved.getProfile_picture());
        dto.setCoverPicture(saved.getCover_picture());
        return dto;
    }


}