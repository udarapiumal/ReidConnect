package reidConnect.backend.repository;

import reidConnect.backend.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User,Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationCode(String verificationCode);

    @SuppressWarnings("override")
    Optional<User> findById(Long id);
}
