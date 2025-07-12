package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.PostLike;
import reidConnect.backend.entity.Post;
import reidConnect.backend.entity.User;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndUser(Post post, User user);
    void deleteByPostAndUser(Post post, User user);
    long countByPost(Post post);
}
