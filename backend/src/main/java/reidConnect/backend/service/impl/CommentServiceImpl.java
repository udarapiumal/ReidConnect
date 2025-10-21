package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.CommentRequestDto;
import reidConnect.backend.dto.CommentResponseDto;
import reidConnect.backend.entity.*;
import reidConnect.backend.repository.*;
import reidConnect.backend.service.CommentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClubRepository clubRepository;


    @Override
    public void addComment(CommentRequestDto dto) {
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(dto.getContent());

        if (dto.getParentCommentId() != null) {
            Comment parent = commentRepository.findById(dto.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parent);
        }

        commentRepository.save(comment);
    }

    @Override
    public List<CommentResponseDto> getCommentsForPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Comment> topLevel = commentRepository.findByPostAndParentIsNull(post);
        return topLevel.stream().map(this::mapToDto).toList();
    }

    @Override
    public long countCommentsForPost(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    private CommentResponseDto mapToDto(Comment comment) {
        List<CommentResponseDto> replyDtos = comment.getReplies().stream()
                .map(this::mapToDto)
                .toList();

        User user = comment.getUser();
        String profilePic = null;

        if ("student".equalsIgnoreCase(user.getRole())) {
            profilePic = studentRepository.findByUser(user)
                    .map(Student::getProfilePictureUrl)
                    .orElse(null);
        } else if ("club".equalsIgnoreCase(user.getRole())) {
            profilePic = clubRepository.findByUser(user)
                    .map(Club::getProfile_picture)
                    .orElse(null);
        }

        return new CommentResponseDto(
                comment.getId(),
                comment.getContent(),
                user.getName(),
                comment.getCreatedAt(),
                profilePic,
                replyDtos
        );
    }

}

