package reidConnect.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import reidConnect.backend.dto.*;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.User;
import reidConnect.backend.responses.LoginResponse;
import reidConnect.backend.service.AuthenticationService;
import reidConnect.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collection;

@RestController
@RequestMapping("/auth")  // Added a base path for all endpoints
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> register(
            @RequestPart("username") String username,
            @RequestPart("email") String email,
            @RequestPart("password") String password,
            @RequestPart("contactNumber") String contactNumber,
            @RequestPart("academicYear") String academicYear,
            @RequestPart(value = "profilePic", required = false) MultipartFile profilePic,
            HttpServletRequest request) {

        // Debug all received parts
        System.out.println("=== DEBUG: Received multipart request ===");
        System.out.println("Content-Type: " + request.getContentType());
        System.out.println("Content-Length: " + request.getContentLength());

        System.out.println("Username: " + username);
        System.out.println("Email: " + email);
        System.out.println("Contact: " + contactNumber);
        System.out.println("Academic Year: " + academicYear);

        if (profilePic != null) {
            System.out.println("ProfilePic received:");
            System.out.println("  - Original filename: " + profilePic.getOriginalFilename());
            System.out.println("  - Size: " + profilePic.getSize() + " bytes");
            System.out.println("  - Content type: " + profilePic.getContentType());
            System.out.println("  - Is empty: " + profilePic.isEmpty());
        } else {
            System.out.println("ProfilePic: null");
        }

        // Check if there are any parts in the request
        try {
            Collection<Part> parts = request.getParts();
            System.out.println("Total parts in request: " + parts.size());
            for (Part part : parts) {
                System.out.println("Part: " + part.getName() + " - Size: " + part.getSize());
            }
        } catch (Exception e) {
            System.err.println("Error reading parts: " + e.getMessage());
        }

        System.out.println("=== END DEBUG ===");

        RegisterUserDto registerUserDto = new RegisterUserDto();
        registerUserDto.setUsername(username);
        registerUserDto.setEmail(email);
        registerUserDto.setPassword(password);
        registerUserDto.setContactNumber(contactNumber);
        registerUserDto.setAcademicYear(academicYear);
        registerUserDto.setProfilePic(profilePic);

        User registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateTokenFromUser(authenticatedUser);
        long expirationTime = jwtService.getExpirationTime();  // Make sure this method exists in JwtService
        LoginResponse loginResponse = new LoginResponse(jwtToken, expirationTime, authenticatedUser.getRole());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("User verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code resent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/register-club", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerClub(
            @RequestPart("username") String username,
            @RequestPart("email") String email,
            @RequestPart("password") String password,
            @RequestPart("clubName") String clubName,
            @RequestPart("website") String website,
            @RequestPart("bio") String bio,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "coverPicture", required = false) MultipartFile coverPicture,
            HttpServletRequest request) {

        try {
            // Upload directory
            String uploadPath = new java.io.File("src/main/resources/static/uploads").getAbsolutePath();

            // Save profile picture
            String profilePicPath = null;
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String profilePicName = java.util.UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
                java.nio.file.Path profileFilePath = java.nio.file.Paths.get(uploadPath, profilePicName);
                java.nio.file.Files.write(profileFilePath, profilePicture.getBytes());
                profilePicPath = "/uploads/" + profilePicName;
            }

            // Save cover picture
            String coverPicPath = null;
            if (coverPicture != null && !coverPicture.isEmpty()) {
                String coverPicName = java.util.UUID.randomUUID() + "_" + coverPicture.getOriginalFilename();
                java.nio.file.Path coverFilePath = java.nio.file.Paths.get(uploadPath, coverPicName);
                java.nio.file.Files.write(coverFilePath, coverPicture.getBytes());
                coverPicPath = "/uploads/" + coverPicName;
            }

            // Create and save User
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(password));
            user.setRole("club");
            user.setEnabled(false);
            user.setVerificationCode(null);
            user.setVerificationExpiration(null);
            User savedUser = authenticationService.saveUser(user);

            // Create and save Club
            Club club = new Club();
            club.setClub_name(clubName);
            club.setWebsite(website);
            club.setBio(bio);
            club.setProfile_picture(profilePicPath);
            club.setCover_picture(coverPicPath);
            club.setUser(savedUser);

            RegisterClubDto savedClub = authenticationService.saveClub(club);
            return ResponseEntity.ok(savedClub);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error registering club: " + e.getMessage());
        }
    }


}