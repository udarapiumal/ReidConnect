package reidConnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reidConnect.backend.entity.Post_Media;

import java.util.List;

public interface PostMediaRepository extends JpaRepository<Post_Media, Long>
{
    List<Post_Media> findAllByPost_Id(Long postId);

    void deleteAllByPost_Id(Long postId);


}
