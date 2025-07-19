package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Post;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long>
{
    List<Post> findByClub_Id(Long clubId);

    // Find all posts by club ID in descending order
    List<Post> findAllByClub_IdOrderByCreatedAtDesc(Long clubId);

    // Find the 3 most recent posts for a club
    List<Post> findTop3ByClub_IdOrderByCreatedAtDesc(Long clubId);

    List<Post> findByEventId(Long eventId);

    long countByClub_Id(Long clubId);

    long countByClub_IdAndCreatedAtAfter(Long clubId, java.time.LocalDateTime date);

}
