package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reidConnect.backend.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User,Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationCode(String verificationCode);

    @Query("SELECT u FROM User u WHERE u.email LIKE CONCAT(:regNumber, '%')")
    Optional<User> findByRegNumberPrefix(@Param("regNumber") String regNumber);


}
