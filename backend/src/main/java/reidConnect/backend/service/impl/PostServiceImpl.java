package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reidConnect.backend.dto.PostCreateDto;
import reidConnect.backend.dto.PostResponseDto;
import reidConnect.backend.dto.PostUpdateDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.mapper.PostMapper;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.PostService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostMediaRepository postMediaRepository;
    private final ClubRepository clubRepository;
    private final PostLikeRepository PostLikeRepository;
    private final UserRepository UserRepository;
    private final EventRepository eventRepository;


    @Override
    @Transactional
    public void createPost(PostCreateDto dto) {
        Club club = clubRepository.findById(dto.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        Event event = null;
        if (dto.getEventId() != null) {
            event = eventRepository.findById(dto.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));
        }

        Post post = PostMapper.mapToPost(dto, club, event);
        Post savedPost = postRepository.save(post);

        List<Post_Media> mediaList = PostMapper.mapToPostMediaList(dto.getMediaPaths(), savedPost);
        postMediaRepository.saveAll(mediaList);
    }


    @Override
    public List<PostResponseDto> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .map(post -> {
                    List<Post_Media> mediaList = postMediaRepository.findAllByPost_Id(post.getId());
                    return PostMapper.mapToPostResponseDto(post, mediaList);
                })
                .toList();
    }
    @Override
    @Transactional
    public void deactivatePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setActive(false); // This assumes you have a boolean `active` field in your Post entity
        postRepository.save(post);
    }
    @Override
    @Transactional
    public void activatePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setActive(true); // Assuming Post entity has `active` boolean field
        postRepository.save(post);
    }



    @Override
    public List<PostResponseDto> getPostsByClubId(Long clubId) {
        List<Post> posts = postRepository.findAllByClub_IdOrderByCreatedAtDesc(clubId);

        return posts.stream()
                .map(post -> {
                    List<Post_Media> mediaList = postMediaRepository.findAllByPost_Id(post.getId());
                    return PostMapper.mapToPostResponseDto(post, mediaList);
                })
                .toList();
    }

    @Override

    public List<PostResponseDto> getLatestThreePostsByClubId(Long clubId) {
        List<Post> posts = postRepository.findTop3ByClub_IdOrderByCreatedAtDesc(clubId);

        return posts.stream()
                .map(post -> {
                    List<Post_Media> mediaList = postMediaRepository.findAllByPost_Id(post.getId());
                    return PostMapper.mapToPostResponseDto(post, mediaList);
                })
                .toList();
    }

    @Override
    public void likePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = UserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyLiked = PostLikeRepository.findByPostAndUser(post, user).isPresent();
        if (alreadyLiked) {
            throw new RuntimeException("User has already liked this post");
        }

        PostLike like = new PostLike();
        like.setPost(post);
        like.setUser(user);
        PostLikeRepository.save(like);
    }

    @Override
    public void unlikePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = UserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostLike like = PostLikeRepository.findByPostAndUser(post, user)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        PostLikeRepository.delete(like);
    }


    @Override
    public long getLikeCount(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return PostLikeRepository.countByPost(post);
    }



    @Override
    public PostResponseDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Post_Media> mediaList = postMediaRepository.findAllByPost_Id(post.getId());

        return PostMapper.mapToPostResponseDto(post, mediaList);
    }

    @Override
    @Transactional
    public void updatePost(Long id, PostUpdateDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Event event = null;
        if (dto.getEventId() != null) {
            event = eventRepository.findById(dto.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));
        }

        // Update post-fields including event
        post.setDescription(dto.getDescription());
        post.setEvent(event); // ✅ add this line to update event reference
        postRepository.save(post);

        // Replace old media with new media
        postMediaRepository.deleteAllByPost_Id(post.getId());
        List<Post_Media> mediaList = PostMapper.mapToPostMediaList(dto.getMediaPaths(), post);
        postMediaRepository.saveAll(mediaList);
    }


    @Override
    @Transactional
    public void deletePost(Long id) {
        // First delete media
        postMediaRepository.deleteAllByPost_Id(id);

        // Then delete post
        postRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<PostResponseDto> getPostsByEventId(Long eventId) {
        List<Post> posts = postRepository.findByEventId(eventId);
        return posts.stream()
                .map(post -> {
                    List<Post_Media> mediaList = postMediaRepository.findAllByPost_Id(post.getId());
                    return PostMapper.mapToPostResponseDto(post, mediaList);
                })
                .toList();
    }

    @Override
    public long getTotalPostCountByClubId(Long clubId) {
        return postRepository.countByClub_Id(clubId);
    }

    @Override
    public long getRecentPostCountByClubId(Long clubId, int days) {
        java.time.LocalDateTime fromDate = java.time.LocalDateTime.now().minusDays(days);
        return postRepository.countByClub_IdAndCreatedAtAfter(clubId, fromDate);
    }



}

