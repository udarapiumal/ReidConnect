package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.KeyStoreEntity;

public interface KeyStoreRepository extends JpaRepository<KeyStoreEntity, Long> {
    KeyStoreEntity findByUserId(Long userId);
}
