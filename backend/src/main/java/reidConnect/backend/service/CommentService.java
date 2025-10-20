package reidConnect.backend.service;

import reidConnect.backend.dto.CommentRequestDto;
import reidConnect.backend.dto.CommentResponseDto;
import reidConnect.backend.dto.LatestCommentWithPostDto;

import java.util.List;

public interface CommentService {
    void addComment(CommentRequestDto dto);
    List<CommentResponseDto> getCommentsForPost(Long postId);
    long countCommentsForPost(Long postId);
    List<LatestCommentWithPostDto> getLatest3CommentsByClub(Long clubId);

}
