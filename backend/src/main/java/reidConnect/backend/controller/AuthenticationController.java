package reidConnect.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import reidConnect.backend.dto.*;
import reidConnect.backend.entity.Club;
import reidConnect.backend.entity.KeyStoreEntity;
import reidConnect.backend.entity.User;
import reidConnect.backend.repository.KeyStoreRepository;
import reidConnect.backend.responses.LoginResponse;
import reidConnect.backend.service.AuthenticationService;
import reidConnect.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reidConnect.backend.service.PasswordResetService;
import reidConnect.backend.util.KeyUtil;

import java.security.KeyPair;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;
    private final KeyStoreRepository keyStoreRepository;
    private final PasswordResetService passwordResetService;

    @Value("${app.upload-dir:./uploads}")
    private String uploadDirPath;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService,
            KeyStoreRepository keyStoreRepository, PasswordResetService passwordResetService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
        this.keyStoreRepository = keyStoreRepository;
        this.passwordResetService = passwordResetService;
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
        long expirationTime = jwtService.getExpirationTime(); // Make sure this method exists in JwtService
        LoginResponse loginResponse = new LoginResponse(jwtToken, expirationTime, authenticatedUser.getRole());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        authenticationService.verifyUser(verifyUserDto);
        return ResponseEntity.ok("User verified successfully");
    }

    @PostMapping("/resend")
    public ResponseEntity<String> resendVerificationCode(@RequestParam String email) {
        authenticationService.resendVerificationCode(email);
        return ResponseEntity.ok("Verification code resent successfully");
    }

    @PostMapping(value = "/register-club", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RegisterClubDto> registerClub(
            @RequestPart("username") String username,
            @RequestPart("email") String email,
            @RequestPart("password") String password,
            @RequestPart("clubName") String clubName,
            @RequestPart("website") String website,
            @RequestPart("bio") String bio,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "coverPicture", required = false) MultipartFile coverPicture,
            HttpServletRequest request) {

        // Upload directory
        String uploadPath = new java.io.File(uploadDirPath).getAbsolutePath();

        // Save profile picture
        String profilePicPath = null;
        if (profilePicture != null && !profilePicture.isEmpty()) {
            String profilePicName = java.util.UUID.randomUUID() + "_" + profilePicture.getOriginalFilename();
            java.nio.file.Path profileFilePath = java.nio.file.Paths.get(uploadPath, profilePicName);
            try {
                java.nio.file.Files.createDirectories(java.nio.file.Paths.get(uploadPath));
                java.nio.file.Files.write(profileFilePath, profilePicture.getBytes());
                profilePicPath = "/uploads/" + profilePicName;
            } catch (java.io.IOException e) {
                throw new reidConnect.backend.exception.FileUploadException(
                        "Could not save profile picture: " + e.getMessage(), e);
            }
        }

        // Save cover picture
        String coverPicPath = null;
        if (coverPicture != null && !coverPicture.isEmpty()) {
            String coverPicName = java.util.UUID.randomUUID() + "_" + coverPicture.getOriginalFilename();
            java.nio.file.Path coverFilePath = java.nio.file.Paths.get(uploadPath, coverPicName);
            try {
                java.nio.file.Files.write(coverFilePath, coverPicture.getBytes());
                coverPicPath = "/uploads/" + coverPicName;
            } catch (java.io.IOException e) {
                throw new reidConnect.backend.exception.FileUploadException(
                        "Could not save cover picture: " + e.getMessage(), e);
            }
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

        // Generate keys and save to keystore
        try {
            KeyPair pair = KeyUtil.generateKeyPair();
            String pubKey = KeyUtil.publicKeyToBase64(pair.getPublic());
            String privKeyEnc = KeyUtil.encryptPrivateKey(pair.getPrivate());

            KeyStoreEntity keyStoreEntity = new KeyStoreEntity();
            keyStoreEntity.setUser(savedUser);
            keyStoreEntity.setPublicKey(pubKey);
            keyStoreEntity.setPrivateKey(privKeyEnc);

            keyStoreRepository.save(keyStoreEntity);

        } catch (Exception e) {
            throw new RuntimeException("Error generating keypair: " + e.getMessage(), e);
        }

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
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordDto dto) {
        passwordResetService.processForgotPassword(dto.getEmail());
        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<String> validateResetToken(@RequestParam String token) {
        passwordResetService.validateToken(token);
        return ResponseEntity.ok("Token is valid");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordDto dto) {
        passwordResetService.resetPassword(dto.getToken(), dto.getNewPassword());
        return ResponseEntity.ok("Password reset successfully!");
    }

}