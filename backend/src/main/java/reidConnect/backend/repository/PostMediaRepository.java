package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Post_Media;

import java.util.Optional;

public interface PostMediaRepository extends JpaRepository<Post_Media, Long>
{
    Optional<Post_Media> findByPost_Id(Long postId);
}
