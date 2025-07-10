package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.PostLike;
import reidConnect.backend.entity.Post;
import reidConnect.backend.entity.Student;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndStudent(Post post, Student student);
    void deleteByPostAndStudent(Post post, Student student);
    long countByPost(Post post);
}
