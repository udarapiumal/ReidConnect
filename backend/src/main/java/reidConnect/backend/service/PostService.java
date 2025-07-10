package reidConnect.backend.service;

import reidConnect.backend.dto.PostCreateDto;
import reidConnect.backend.dto.PostResponseDto;
import reidConnect.backend.dto.PostUpdateDto;

import java.util.List;

public interface PostService {

    void createPost(PostCreateDto dto);

    PostResponseDto getPostById(Long id);

    void updatePost(Long id, PostUpdateDto dto);

    void deletePost(Long id);

    List<PostResponseDto> getAllPosts();

    List<PostResponseDto> getPostsByClubId(Long clubId);

    List<PostResponseDto> getLatestThreePostsByClubId(Long clubId);

    void likePost(Long postId, Long userId);

    void unlikePost(Long postId, Long userId);

    long getLikeCount(Long postId);

}
