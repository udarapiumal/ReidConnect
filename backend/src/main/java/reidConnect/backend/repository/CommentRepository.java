package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Comment;
import reidConnect.backend.entity.Post;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostAndParentIsNull(Post post);

    long countByPostId(Long postId);
// top-level comments
// New query for latest 3 comments on a post
    List<Comment> findTop3ByPostOrderByCreatedAtDesc(Post post);
}
