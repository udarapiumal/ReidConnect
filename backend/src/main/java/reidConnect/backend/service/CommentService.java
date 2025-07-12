package reidConnect.backend.service;

import reidConnect.backend.dto.CommentRequestDto;
import reidConnect.backend.dto.CommentResponseDto;

import java.util.List;

public interface CommentService {
    void addComment(CommentRequestDto dto);
    List<CommentResponseDto> getCommentsForPost(Long postId);
    long countCommentsForPost(Long postId);

}
