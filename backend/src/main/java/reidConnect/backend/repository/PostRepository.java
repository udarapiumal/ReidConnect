package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Post;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long>
{
    List<Post> findByClub_Id(Long clubId);
}
