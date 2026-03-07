package reidConnect.backend.service;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reidConnect.backend.entity.PasswordResetToken;
import reidConnect.backend.entity.User;
import reidConnect.backend.exception.UserNotFoundException;
import reidConnect.backend.repository.PasswordResetTokenRepository;
import reidConnect.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public PasswordResetService(UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // STEP 1: Receive email → generate token → send link
    @Transactional
    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("No account found with email: " + email));

        // Delete any existing token for this user first
        tokenRepository.deleteByUser(user);

        // Generate secure random token
        String token = UUID.randomUUID().toString();

        // Persist token with 30 min expiry
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(1));
        tokenRepository.save(resetToken);

        // Send email using your existing EmailService
        sendResetEmail(user.getEmail(), token);
    }

    // STEP 2: Frontend calls this when user lands on the reset page to check token
    // is still valid
    public void validateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset link"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Reset link has expired. Please request a new one.");
        }
    }

    // STEP 3: User submits new password
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset link"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Reset link has expired. Please request a new one.");
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // One-time use — delete token after successful reset
        tokenRepository.delete(resetToken);
    }

    // Reuses your EmailService just like sendVerificationEmail() does in
    // AuthenticationService
    private void sendResetEmail(String toEmail, String token) {
        // Point to your frontend reset page — it reads the token from the URL
        // and calls POST /auth/reset-password
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        String subject = "Reset Your Password - ReidConnect";
        String htmlMessage = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>We received a request to reset your ReidConnect password.</p>
                    <p>Click the button below to set a new password. This link expires in <strong>30 minutes</strong>.</p>
                    <a href="%s"
                       style="display:inline-block; margin: 20px 0; padding: 12px 28px;
                              background-color: #4F46E5; color: white; text-decoration: none;
                              border-radius: 6px; font-size: 16px;">
                       Reset Password
                    </a>
                    <p style="color: #888; font-size: 13px;">
                        If you didn't request this, you can safely ignore this email.<br/>
                        Do not share this link with anyone.
                    </p>
                </div>
                """
                .formatted(resetLink);

        try {
            emailService.sendVerificationEmail(toEmail, subject, htmlMessage);
        } catch (MessagingException e) {
            log.error("Failed to send reset email to {}", toEmail, e);
            throw new RuntimeException("Failed to send reset email");
        }
    }
}