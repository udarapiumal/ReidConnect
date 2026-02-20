package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.PasswordResetToken;
import reidConnect.backend.entity.User;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}